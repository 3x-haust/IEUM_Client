import type { BusinessCard } from '@/data';
import { requestData } from './apiRequest';
import { isFeedbackDisabledBoothSlot } from './feedbackAvailability';
import {
  getLocalDesignProject,
  withLocalDesignProjects,
} from './localDesignProjects';
import {
  contactSchema,
  feedbackSchema,
  projectDetailSchema,
  projectInterestSchema,
  projectListSchema,
  visitorProfileSchema,
} from './ieumSchemas';
import type {
  IeumFeedback,
  IeumProjectDetail,
  IeumProjectInterest,
  IeumProjectMember,
  IeumProjectSummary,
  IeumVisitorProfile,
} from './ieumSchemas';

export type {
  IeumFeedback,
  IeumProjectDetail,
  IeumProjectInterest,
  IeumProjectMember,
  IeumProjectSummary,
  IeumVisitorProfile,
};

interface ProjectListCacheEntry {
  readonly expiresAt: number;
  readonly promise: Promise<IeumProjectSummary[]>;
}

const PROJECT_LIST_CACHE_TTL_MS = 30_000;
const OCR_POLL_INTERVAL_MS = 1_000;
const OCR_POLL_TIMEOUT_MS = 30_000;
const projectListCache = new Map<string, ProjectListCacheEntry>();

export async function listProjectsByCategory(
  category: string,
): Promise<IeumProjectSummary[]> {
  const now = Date.now();
  const cached = projectListCache.get(category);
  if (cached && cached.expiresAt > now) {
    return cached.promise;
  }
  const promise = requestData(
    `/projects?category=${encodeURIComponent(category)}&limit=80&includeCounts=false`,
    projectListSchema,
  )
    .then((data) => withLocalDesignProjects(category, data.items).map(applyFeedbackPolicy))
    .catch((error: unknown) => {
      projectListCache.delete(category);
      throw error;
    });
  projectListCache.set(category, {
    expiresAt: now + PROJECT_LIST_CACHE_TTL_MS,
    promise,
  });
  return promise;
}

export async function listProjectsByMember(
  memberUserId: string,
): Promise<IeumProjectSummary[]> {
  try {
    const data = await requestData(
      `/projects?memberUserId=${encodeURIComponent(memberUserId)}&limit=80&includeCounts=false`,
      projectListSchema,
    );
    return data.items.map(applyFeedbackPolicy);
  } catch (error) {
    // 구버전 서버는 memberUserId 필터를 모르고 400을 반환한다 — 상세 조회로 폴백
    if (error instanceof Error && error.message.includes('memberUserId')) {
      return listProjectsByMemberFallback(memberUserId);
    }
    throw error;
  }
}

async function listProjectsByMemberFallback(
  memberUserId: string,
): Promise<IeumProjectSummary[]> {
  const data = await requestData(
    '/projects?limit=80&includeCounts=false',
    projectListSchema,
  );
  const memberships = await mapWithConcurrency(data.items, 8, async (summary) => {
    try {
      const detail = await getProjectDetail(summary.id);
      return detail.members.some((member) => member.id === memberUserId);
    } catch {
      return false;
    }
  });
  return data.items
    .filter((_, index) => memberships[index])
    .map(applyFeedbackPolicy);
}

async function mapWithConcurrency<TInput, TOutput>(
  items: readonly TInput[],
  concurrency: number,
  task: (item: TInput) => Promise<TOutput>,
): Promise<TOutput[]> {
  const results: TOutput[] = new Array<TOutput>(items.length);
  let nextIndex = 0;
  const workers = Array.from(
    { length: Math.min(concurrency, items.length) },
    async () => {
      while (nextIndex < items.length) {
        const index = nextIndex;
        nextIndex += 1;
        results[index] = await task(items[index]);
      }
    },
  );
  await Promise.all(workers);
  return results;
}

export async function getProjectDetail(
  projectId: string,
): Promise<IeumProjectDetail> {
  const localProject = getLocalDesignProject(projectId);
  if (localProject) return applyFeedbackPolicy(localProject);
  const project = await requestData(`/projects/${projectId}`, projectDetailSchema);
  return applyFeedbackPolicy(project);
}

export async function markProjectInterest(
  projectId: string,
): Promise<IeumProjectInterest> {
  return requestData(`/projects/${projectId}/interests`, projectInterestSchema, {
    method: 'POST',
  });
}

export async function createFeedback(
  projectId: string,
  content: string,
): Promise<IeumFeedback> {
  return requestData(`/projects/${projectId}/feedback`, feedbackSchema, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

export async function createRecruiterContact(
  projectId: string,
  targetMemberUserId: string,
  card: BusinessCard | null,
  visitorProfileId?: string | null,
): Promise<void> {
  const profileId = visitorProfileId ?? (await requestData('/visitor-profiles', visitorProfileSchema, {
    method: 'POST',
    body: JSON.stringify({
      ageGroup: 'adult',
      visitorType: 'recruiter',
      ocrName: card?.name || '채용 담당자',
      ocrOrganization: card?.companyName || undefined,
      ocrPosition: card?.position || undefined,
      ocrEmail: card?.email || undefined,
      ocrPhone: card?.phone || undefined,
    }),
  })).id;

  await requestData(`/projects/${projectId}/contacts`, contactSchema, {
    method: 'POST',
    body: JSON.stringify({
      visitorProfileId: profileId,
      targetMemberUserId,
      name: card?.name || '채용 담당자',
      organization: card?.companyName || undefined,
      position: card?.position || undefined,
      email: card?.email || undefined,
      phone: card?.phone || undefined,
      memo: card?.companyAddress ? `회사 위치: ${card.companyAddress}` : undefined,
    }),
  });
}

export async function createRecruiterVisitorProfileFromBusinessCards(
  frontFile: File,
  backFile: File,
): Promise<IeumVisitorProfile> {
  const body = new FormData();
  body.set('ageGroup', 'adult');
  body.set('visitorType', 'recruiter');
  body.set('businessCardFront', frontFile);
  body.set('businessCardBack', backFile);
  const profile = await requestData('/visitor-profiles', visitorProfileSchema, {
    method: 'POST',
    body,
  });
  return waitForVisitorProfileOcr(profile);
}

export function getVisitorProfile(visitorProfileId: string): Promise<IeumVisitorProfile> {
  return requestData(`/visitor-profiles/${encodeURIComponent(visitorProfileId)}`, visitorProfileSchema);
}

async function waitForVisitorProfileOcr(profile: IeumVisitorProfile): Promise<IeumVisitorProfile> {
  const startedAt = Date.now();
  while (Date.now() - startedAt < OCR_POLL_TIMEOUT_MS) {
    const latest = await getVisitorProfile(profile.id);
    if (hasOcrResult(latest)) return latest;
    await delay(OCR_POLL_INTERVAL_MS);
  }
  return profile;
}

function hasOcrResult(profile: IeumVisitorProfile): boolean {
  return Boolean(
    profile.ocrRawText ||
      profile.ocrName ||
      profile.ocrOrganization ||
      profile.ocrPosition ||
      profile.ocrEmail ||
      profile.ocrPhone,
  );
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });
}

function applyFeedbackPolicy<TProject extends IeumProjectSummary>(
  project: TProject,
): TProject {
  if (isFeedbackDisabledBoothSlot(project.boothSlot)) {
    return { ...project, acceptsFeedback: false };
  }
  return project;
}

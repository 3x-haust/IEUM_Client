const GUIDE_DISMISSED_KEY = 'ieum.onboardingGuide.dismissed';
const INITIAL_ONBOARDING_COMPLETED_KEY = 'ieum.initialOnboarding.completed';
const INITIAL_ONBOARDING_AGE_GROUP_KEY = 'ieum.initialOnboarding.ageGroup';
const INITIAL_ONBOARDING_GENDER_KEY = 'ieum.initialOnboarding.gender';
const INITIAL_ONBOARDING_PURPOSE_KEY = 'ieum.initialOnboarding.purpose';
const MAP_TUTORIAL_DISMISSED_KEY = 'ieum.mapTutorial.dismissed';

export type VisitorAgeGroup = 'child' | 'youth' | 'adult' | 'senior';
export type VisitorGender = 'male' | 'female' | 'other';
export type VisitorPurpose = 'employment' | 'viewing';
type SubmissionKind = 'feedback' | 'contact';

function storage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch (error) {
    if (error instanceof Error) return null;
    throw error;
  }
}

function readFlag(key: string): boolean {
  const store = storage();
  if (!store) return false;
  try {
    return store.getItem(key) === '1';
  } catch (error) {
    if (error instanceof Error) return false;
    throw error;
  }
}

function writeFlag(key: string, value: boolean): void {
  const store = storage();
  if (!store) return;
  try {
    if (value) {
      store.setItem(key, '1');
      return;
    }
    store.removeItem(key);
  } catch (error) {
    if (error instanceof Error) return;
    throw error;
  }
}

function projectInterestKey(projectId: string): string {
  return `ieum.projectInterest.${projectId}`;
}

function projectSubmissionKey(kind: SubmissionKind, projectId: string): string {
  return `ieum.projectSubmission.${kind}.${projectId}`;
}

function memberContactKey(projectId: string, memberId: string): string {
  return `ieum.memberContact.${projectId}.${memberId}`;
}

export function hasDismissedOnboardingGuide(): boolean {
  return readFlag(GUIDE_DISMISSED_KEY);
}

export function markOnboardingGuideDismissed(): void {
  writeFlag(GUIDE_DISMISSED_KEY, true);
}

export function hasCompletedInitialOnboarding(): boolean {
  return readFlag(INITIAL_ONBOARDING_COMPLETED_KEY);
}

export function markInitialOnboardingCompleted(): void {
  writeFlag(INITIAL_ONBOARDING_COMPLETED_KEY, true);
}

export function saveVisitorAgeGroup(ageGroup: VisitorAgeGroup): void {
  writeStoredValue(INITIAL_ONBOARDING_AGE_GROUP_KEY, ageGroup);
}

export function loadVisitorAgeGroup(): VisitorAgeGroup | null {
  const value = readStoredValue(INITIAL_ONBOARDING_AGE_GROUP_KEY);
  if (value === 'child' || value === 'youth' || value === 'adult' || value === 'senior') return value;
  return null;
}

export function saveVisitorGender(gender: VisitorGender): void {
  writeStoredValue(INITIAL_ONBOARDING_GENDER_KEY, gender);
}

export function loadVisitorGender(): VisitorGender | null {
  const value = readStoredValue(INITIAL_ONBOARDING_GENDER_KEY);
  if (value === 'male' || value === 'female' || value === 'other') return value;
  return null;
}

export function saveVisitorPurpose(purpose: VisitorPurpose): void {
  writeStoredValue(INITIAL_ONBOARDING_PURPOSE_KEY, purpose);
}

export function loadVisitorPurpose(): VisitorPurpose | null {
  const value = readStoredValue(INITIAL_ONBOARDING_PURPOSE_KEY);
  if (value === 'employment' || value === 'viewing') return value;
  return null;
}

function writeStoredValue(key: string, value: string): void {
  const store = storage();
  if (!store) return;
  try {
    store.setItem(key, value);
  } catch (error) {
    if (error instanceof Error) return;
    throw error;
  }
}

function readStoredValue(key: string): string | null {
  const store = storage();
  if (!store) return null;
  try {
    return store.getItem(key);
  } catch (error) {
    if (error instanceof Error) return null;
    throw error;
  }
}

export function hasRecruiterPurpose(): boolean {
  return loadVisitorPurpose() === 'employment';
}

export function hasDismissedMapTutorial(): boolean {
  return readFlag(MAP_TUTORIAL_DISMISSED_KEY);
}

export function markMapTutorialDismissed(): void {
  writeFlag(MAP_TUTORIAL_DISMISSED_KEY, true);
}

export function loadProjectInterest(projectId: string): boolean {
  return readFlag(projectInterestKey(projectId));
}

export function saveProjectInterest(
  projectId: string,
  interested: boolean,
): void {
  writeFlag(projectInterestKey(projectId), interested);
}

export function hasSubmittedProjectAction(
  kind: SubmissionKind,
  projectId: string,
): boolean {
  return readFlag(projectSubmissionKey(kind, projectId));
}

export function markProjectActionSubmitted(
  kind: SubmissionKind,
  projectId: string,
): void {
  writeFlag(projectSubmissionKey(kind, projectId), true);
}

export function clearProjectActionSubmitted(
  kind: SubmissionKind,
  projectId: string,
): void {
  writeFlag(projectSubmissionKey(kind, projectId), false);
}

export function hasSubmittedMemberContact(
  projectId: string,
  memberId: string,
): boolean {
  return readFlag(memberContactKey(projectId, memberId));
}

export function markMemberContactSubmitted(
  projectId: string,
  memberId: string,
): void {
  writeFlag(memberContactKey(projectId, memberId), true);
}

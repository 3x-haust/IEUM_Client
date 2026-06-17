import type {
  IeumProjectDetail,
  IeumProjectSummary,
} from './ieumSchemas';

interface LocalDesignProjectInput {
  readonly catalogId: number;
  readonly serviceName: string;
  readonly boothSlot: string;
  readonly experienceCategory: string;
  readonly description: string;
  readonly features: string;
  readonly stacks: string;
  readonly memberName: string;
  readonly acceptsFeedback: boolean;
}

const DESIGN_STACK_COLOR = '#C797C5';
const LOCAL_PROJECT_TIMESTAMP = '2026-06-15T00:00:00.000Z';
const DESIGN_PROJECT_IMAGE_PATHS = new Map<number, string>([
  [42, '/assets/design-projects/inflow.webp'],
  [43, '/assets/design-projects/sfoc.webp'],
  [61, '/assets/design-projects/requord.webp'],
  [44, '/assets/design-projects/lazie5.webp'],
  [45, '/assets/design-projects/ddomong.webp'],
  [48, '/assets/design-projects/digit.webp'],
  [49, '/assets/design-projects/bookie.webp'],
  [50, '/assets/design-projects/stepin.webp'],
  [51, '/assets/design-projects/veritas.webp'],
  [52, '/assets/design-projects/siseon.webp'],
  [53, '/assets/design-projects/haube.webp'],
  [54, '/assets/design-projects/pongdang.webp'],
  [55, '/assets/design-projects/100k.webp'],
  [56, '/assets/design-projects/moduwa.webp'],
  [57, '/assets/design-projects/bigwing.webp'],
  [58, '/assets/design-projects/f1rst.webp'],
  [59, '/assets/design-projects/oke.webp'],
  [60, '/assets/design-projects/refab.webp'],
]);

const LOCAL_DESIGN_PROJECT_INPUTS = [
  { catalogId: 42, serviceName: 'INFLOW', boothSlot: 'A-1', experienceCategory: 'ai', description: '브랜드와 인플루언서를 연결하여 캠페인 제안부터 콘텐츠 관리, 성과 분석까지 한 번에 지원하는 인플루언서 마케팅 협업 플랫폼', features: '인플루언서 탐색, 캠페인 관리, 채팅, 콘텐츠 관리, 성과 분석을 한 흐름에서 지원합니다.', stacks: 'Figma', memberName: '김민선', acceptsFeedback: true },
  { catalogId: 43, serviceName: 'S. F. O. C.', boothSlot: 'A-2', experienceCategory: 'ai', description: '휴머노이드 로봇을 활용해 화재 현장 대응을 통합 관리하는 지능형 소방 관제 서비스', features: '위험 감지, 실시간 로봇 시점 뷰, 로봇 상태 모니터링, 작전 로그, 사후 분석, 로봇 제어와 로봇 기반 통신을 제공합니다.', stacks: 'Figma, Photoshop, Runway', memberName: '정서현', acceptsFeedback: true },
  { catalogId: 65, serviceName: '글자방', boothSlot: 'A-3', experienceCategory: 'ai', description: '', features: '', stacks: 'Figma, Illustrator', memberName: '이서현', acceptsFeedback: false },
  { catalogId: 66, serviceName: 'MONODE', boothSlot: 'A-4', experienceCategory: 'ai', description: '', features: '', stacks: 'Figma, Illustrator', memberName: '송채린', acceptsFeedback: false },
  { catalogId: 61, serviceName: 'REQUORD', boothSlot: 'A-5', experienceCategory: 'ai', description: '법의학자의 업무 효율을 높이는 지능형 워크스테이션 서비스', features: '실시간 음성 기록 및 자막화, 인텔리전트 보이스 매핑, 멀티모달 사건 타임라인, AI 기반 문서 어드바이저, 실시간 사건 현황 지도, 연관 증거 통합 조회, AI 기반 유사사례 매칭을 제공합니다.', stacks: 'Figma, Photoshop, Illustrator', memberName: '문지우', acceptsFeedback: false },
  { catalogId: 62, serviceName: 'Last check-in', boothSlot: 'B-1', experienceCategory: 'human', description: '테스트로 쉽게 찾아내는 나만의 사후세계, 장례문화 큐레이션 웹사이트', features: '성향 테스트로 개인에게 맞는 세계 장례 문화를 매칭하고, 가상 티켓 발행과 국가별 장례 문화 정보를 제공합니다.', stacks: 'Figma, Illustrator', memberName: '김예진', acceptsFeedback: false },
  { catalogId: 44, serviceName: 'Lazie5', boothSlot: 'B-2', experienceCategory: 'human', description: '캐릭터 기반 게으름 테스트를 통해 자신의 게으름 유형과 행동 패턴을 탐색하고, 유형별 해결 방안을 제시하는 콘텐츠', features: '게으름 유형 테스트와 캐릭터 도감을 통해 사용자의 유형과 캐릭터 스토리를 확인할 수 있습니다.', stacks: 'Figma, Illustrator', memberName: '유태린', acceptsFeedback: true },
  { catalogId: 45, serviceName: '또몽', boothSlot: 'B-3', experienceCategory: 'human', description: '아이들이 잠드는 순간을 여행의 시작으로 만드는 수면 유도 콘텐츠', features: '기구별 수면 영상, 티켓 기록, 캐릭터 안내를 제공합니다.', stacks: 'Figma, Illustrator, After Effects', memberName: '김나영', acceptsFeedback: false },
  { catalogId: 46, serviceName: 'bivy', boothSlot: 'B-4', experienceCategory: 'human', description: '사용자의 감정을 시각적으로 기록하고 정리하는 멘탈 케어 서비스', features: '감정 기록, 캐릭터 성장, 위로 문구, 기록 보관함을 제공합니다.', stacks: 'Figma, Illustrator, After Effects, ChatGPT', memberName: '김희향', acceptsFeedback: true },
  { catalogId: 47, serviceName: '놀다보니', boothSlot: 'B-5', experienceCategory: 'human', description: '영유아가 반려 로봇과 함께 일상 루틴을 경험하며 부모의 귀가를 자연스럽게 예측하고 대상항상성을 기르는 서비스', features: '루틴 가이드, AI 로봇 상호작용, 부모 귀가 예측, 성장 리포트, 공동 돌봄 공유를 제공합니다.', stacks: 'Figma, Illustrator', memberName: '김설애', acceptsFeedback: true },
  { catalogId: 63, serviceName: 'Seumim', boothSlot: 'C-1', experienceCategory: 'network', description: '전통 수공예를 일상의 감각으로 연결하며 무형문화재 공정과정을 향유하는 플랫폼', features: '향유 스토리 경험, 도구와 신체 확장 아카이브, 제작 공정 참여, 수공예 무형문화재 생태계 펀딩 중심의 시그니처 큐레이션 쇼룸을 제공합니다.', stacks: 'Figma, Photoshop, Illustrator', memberName: '장윤아', acceptsFeedback: false },
  { catalogId: 48, serviceName: '디깃(Dig-it!)', boothSlot: 'C-2', experienceCategory: 'network', description: '오프라인 구제시장의 한계를 극복하고, 단순한 구매를 넘어 취향에 맞는 아이템을 직접 발견하는 디깅 경험을 제공하는 플랫폼', features: '아이템 탐색, 구매, 아카이브 탐색, 상품 상태 확인을 제공합니다.', stacks: 'Figma, Photoshop', memberName: '전누리', acceptsFeedback: true },
  { catalogId: 49, serviceName: 'BOOKIE', boothSlot: 'C-3', experienceCategory: 'network', description: '독서기록을 자유롭게 작성하고 표현할 수 있는 기록 공유 서비스', features: '기록 추천, 책 감상 기록, 사용자와 책 검색, 사용자 그룹 활동을 제공합니다.', stacks: 'Figma, Illustrator, Photoshop, Fresco', memberName: '한정훈', acceptsFeedback: true },
  { catalogId: 50, serviceName: 'StepIn', boothSlot: 'C-4', experienceCategory: 'network', description: '고립 은둔 청년과 기부자를 연결하는 커뮤니티형 기부 플랫폼', features: '협동 미션, 미션 매칭, 실시간 채팅, 멘토 매칭, 기부 보상, 성장 기록, 응원 메시지, 활동 리포트, 커뮤니티와 익명 참여를 제공합니다.', stacks: 'Figma, Illustrator', memberName: '김태현', acceptsFeedback: true },
  { catalogId: 64, serviceName: '퇴근전쟁', boothSlot: 'C-5', experienceCategory: 'network', description: '비즈니스 매너 학습에 어려움을 겪는 사회초년생들을 위한 모바일 하이브리드 보드게임', features: '멀티플레이, 모바일 점수 기록, 다수결 기반 투표로 비즈니스 매너 학습 경험을 제공합니다.', stacks: 'Figma, Illustrator', memberName: '봉지민', acceptsFeedback: true },
  { catalogId: 51, serviceName: 'veritas', boothSlot: 'D-1', experienceCategory: 'personal', description: '7개의 죄악이 지닌 상징과 이야기를 니치 향수로 재해석한 시네마틱 영상 웹사이트', features: '죄악 향수 탐색, 향수 컬렉션 소개, 인터랙티브 영상 감상, 스토리 기반 상세 정보, 향수 디테일 뷰어를 제공합니다.', stacks: '3ds max, Cinema 4D, Substance Painter, Figma, Photoshop, illustrator', memberName: '임예나', acceptsFeedback: true },
  { catalogId: 52, serviceName: '시선', boothSlot: 'D-2', experienceCategory: 'personal', description: '이동 중 주변의 아름다운 장소를 앱 배너 알림과 대중교통 디지털 사이니지로 권유하는 이동 경험 확장 서비스', features: '오늘의 시선, 주변 장소, 광화문 이벤트, 주변 스토리, 맛집과 카페, 주변 게시글, 월별 이동 기록과 공유 사진을 제공합니다.', stacks: 'Figma, Illustrator, After Effects', memberName: '이수현', acceptsFeedback: true },
  { catalogId: 67, serviceName: 'DECKA', boothSlot: 'D-3', experienceCategory: 'personal', description: '', features: '', stacks: 'Figma, Illustrator', memberName: '신인서', acceptsFeedback: false },
  { catalogId: 53, serviceName: '하우브', boothSlot: 'D-4', experienceCategory: 'personal', description: '소비자 참여를 통해 제품 개발부터 마케팅까지 연결되는 화장품 공동 제작 플랫폼', features: '투표 참여, DIY 화장품 제작, 개발단 활동, 커뮤니티 소통을 제공합니다.', stacks: 'Figma', memberName: '김예인', acceptsFeedback: false },
  { catalogId: 54, serviceName: '퐁당', boothSlot: 'D-5', experienceCategory: 'personal', description: '디저트를 모티브로 한 캐릭터를 기반으로 감정을 탐색할 수 있는 감정기록 서비스', features: '캐릭터 도감, 위젯, 리포트, 테스트를 제공합니다.', stacks: 'Figma, Blender, Photoshop, illustrator', memberName: '박채윤', acceptsFeedback: true },
  { catalogId: 55, serviceName: '십만원권', boothSlot: 'E-1', experienceCategory: 'creative', description: '가상의 10만원권 발행 시나리오를 바탕으로 한 국민 참여형 화폐 디자인 거버넌스 전시', features: '리플렛, 키오스크, 영상, 모바일 투표를 통해 화폐 디자인 체험과 참여를 제공합니다.', stacks: 'Figma, Adobe illustrator, Adobe After Effects, Adobe Photoshop', memberName: '정지영', acceptsFeedback: true },
  { catalogId: 68, serviceName: '스위트룸', boothSlot: 'E-2', experienceCategory: 'creative', description: '', features: '', stacks: 'Figma, Illustrator', memberName: '박솔하', acceptsFeedback: false },
  { catalogId: 56, serviceName: '모두와 함께하는 마을', boothSlot: 'E-3', experienceCategory: 'creative', description: '포켓몬의 매력적인 세계를 홍보하는 프로모션 비디오', features: 'IP의 다양한 정보와 매력을 울림 있게 전달하는 홍보 콘텐츠입니다.', stacks: 'Figma, Photoshop, Illustrator, after effects', memberName: '이민욱', acceptsFeedback: true },
  { catalogId: 57, serviceName: 'Big Wing', boothSlot: 'E-4', experienceCategory: 'creative', description: '빅밴드를 위한 재즈 공연장 브랜딩 및 프로모션 영상', features: '빅윙 리스닝 스테이션과 공연장 로비용 3D 모션그래픽 프로모션 영상을 제공합니다.', stacks: 'Figma, 3D MAX, Substance Painter, After Effect, Photoshop', memberName: '이다은', acceptsFeedback: true },
  { catalogId: 69, serviceName: '인생을 나답게 반스', boothSlot: 'E-5', experienceCategory: 'creative', description: '', features: '', stacks: 'Figma, Illustrator', memberName: '조예찬', acceptsFeedback: false },
  { catalogId: 70, serviceName: 'DESINTO', boothSlot: 'E-6', experienceCategory: 'creative', description: '', features: '', stacks: 'Figma, Illustrator', memberName: '주다인', acceptsFeedback: false },
  { catalogId: 58, serviceName: 'F1rst', boothSlot: 'F-1', experienceCategory: 'journey', description: 'F1 팬들을 위한 직관 보조 및 팬 허브 앱', features: '피트인 모드와 트랙 모드로 F1 정보, 팬 소통, 경기장 현황을 제공합니다.', stacks: 'Figma, Photoshop, illustrator, After Effects', memberName: '정수민', acceptsFeedback: false },
  { catalogId: 71, serviceName: '두리번', boothSlot: 'F-2', experienceCategory: 'journey', description: '', features: '', stacks: 'Figma, Illustrator', memberName: '이민지', acceptsFeedback: false },
  { catalogId: 59, serviceName: '오케', boothSlot: 'F-3', experienceCategory: 'journey', description: '실시간 재고 매칭과 안심 물류 보증으로 예약의 불확실성을 해결하는 케이크 특화 통합 플랫폼 서비스', features: '케이크 예약, 주변 케이크 탐색, 예약 실패 시 대안 연결을 제공합니다.', stacks: 'Figma, lllustrator, Photoshop', memberName: '이승주', acceptsFeedback: false },
  { catalogId: 72, serviceName: 'COURTIN', boothSlot: 'F-4', experienceCategory: 'journey', description: '', features: '', stacks: 'Figma, Illustrator', memberName: '박미주', acceptsFeedback: false },
  { catalogId: 73, serviceName: 'WORLD IN TIME', boothSlot: 'F-5', experienceCategory: 'journey', description: '', features: '', stacks: 'Figma, Illustrator', memberName: '송지아', acceptsFeedback: false },
  { catalogId: 60, serviceName: 'Refab', boothSlot: 'F-6', experienceCategory: 'journey', description: '간편한 섬유 폐기물 처리와 브랜드·기업으로의 섬유 투자를 연결하는 업사이클링 자원 순환 서비스', features: '펀딩 섬유 수거, 간편 펀딩 매칭, 정기 구독형 섬유 수거를 제공합니다.', stacks: 'Figma, Photoshop, Illustrator, Gemini', memberName: '박시은', acceptsFeedback: true },
] satisfies readonly LocalDesignProjectInput[];

const LOCAL_DESIGN_PROJECTS = LOCAL_DESIGN_PROJECT_INPUTS.map(toProject);

export function getLocalDesignProject(projectId: string): IeumProjectDetail | null {
  return LOCAL_DESIGN_PROJECTS.find((project) => project.id === projectId) ?? null;
}

export function findLocalDesignProjectByBooth(
  boothSlot: string | null | undefined,
  serviceName: string,
): IeumProjectSummary | null {
  const normalizedBoothSlot = normalizeLocalBoothSlot(boothSlot);
  const normalizedServiceName = normalizeLocalServiceName(serviceName);
  const project = LOCAL_DESIGN_PROJECTS.find(
    (item) => normalizeLocalBoothSlot(item.boothSlot) === normalizedBoothSlot,
  ) ?? LOCAL_DESIGN_PROJECTS.find(
    (item) => normalizeLocalServiceName(item.serviceName) === normalizedServiceName,
  );
  return project ? toSummary(project) : null;
}

export function withLocalDesignProjects(
  category: string,
  projects: readonly IeumProjectSummary[],
): IeumProjectSummary[] {
  const boothSlots = new Set(projects.map((project) => project.boothSlot));
  const localProjects = LOCAL_DESIGN_PROJECTS
    .filter((project) => project.experienceCategory === category)
    .filter((project) => !boothSlots.has(project.boothSlot))
    .map(toSummary);
  return [...projects, ...localProjects];
}

function toProject(input: LocalDesignProjectInput): IeumProjectDetail {
  const id = `local-design-${input.catalogId}`;
  const stacks = parseStacks(input.stacks);
  return {
    id,
    serviceName: input.serviceName,
    teamName: input.serviceName,
    description: input.description,
    thumbnailUrl: null,
    thumbnailPath: DESIGN_PROJECT_IMAGE_PATHS.get(input.catalogId) ?? null,
    experienceCategory: input.experienceCategory,
    boothSlot: input.boothSlot,
    developmentStacks: [],
    designStacks: stacks,
    stackGroups: stacks.length
      ? [{ category: 'Design', color: DESIGN_STACK_COLOR, items: stacks }]
      : [],
    featureDescriptions: input.features
      ? [{ title: '기능소개', description: input.features }]
      : [],
    acceptsFeedback: input.acceptsFeedback,
    isPublished: true,
    feedbackCount: 0,
    contactCount: 0,
    createdAt: LOCAL_PROJECT_TIMESTAMP,
    updatedAt: LOCAL_PROJECT_TIMESTAMP,
    members: [{
      id: `${id}-member`,
      name: input.memberName,
      displayOrder: 1,
      roles: ['design'],
    }],
  };
}

function parseStacks(stacks: string): string[] {
  return stacks
    .split(',')
    .map((stack) => stack.trim())
    .filter((stack) => stack.length > 0);
}

function normalizeLocalBoothSlot(value: string | null | undefined): string | null {
  if (!value) return null;
  const normalized = value.trim().toUpperCase();
  return /^[A-G]-?[1-9]$/.test(normalized) ? normalized : null;
}

function normalizeLocalServiceName(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

function toSummary(project: IeumProjectDetail): IeumProjectSummary {
  return {
    id: project.id,
    serviceName: project.serviceName,
    teamName: project.teamName,
    description: project.description,
    thumbnailUrl: project.thumbnailUrl,
    thumbnailPath: project.thumbnailPath,
    experienceCategory: project.experienceCategory,
    boothSlot: project.boothSlot,
    developmentStacks: project.developmentStacks,
    designStacks: project.designStacks,
    stackGroups: project.stackGroups,
    featureDescriptions: project.featureDescriptions,
    acceptsFeedback: project.acceptsFeedback,
    isPublished: project.isPublished,
    feedbackCount: project.feedbackCount,
    contactCount: project.contactCount,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

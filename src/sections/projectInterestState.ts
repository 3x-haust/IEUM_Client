export interface ProjectInterestState {
  readonly projectId: string;
  readonly interested: boolean;
  readonly saving: boolean;
}

export interface ProjectInterestToggleResult {
  readonly state: ProjectInterestState;
  readonly shouldPersistInterest: boolean;
  readonly shouldRequestInterest: boolean;
}

export interface ProjectInterestSaveSettlement {
  readonly activeRequestId: number;
  readonly fallbackInterested: boolean;
  readonly projectId: string;
  readonly requestId: number;
  readonly state: ProjectInterestState;
}

export function toggleProjectInterest(
  projectId: string,
  state: ProjectInterestState,
): ProjectInterestToggleResult {
  const current =
    state.projectId === projectId
      ? state
      : { projectId, interested: false, saving: false };

  if (current.interested) {
    return {
      state: { projectId, interested: false, saving: false },
      shouldPersistInterest: false,
      shouldRequestInterest: false,
    };
  }

  return {
    state: { projectId, interested: true, saving: true },
    shouldPersistInterest: true,
    shouldRequestInterest: true,
  };
}

export function settleProjectInterestSave({
  activeRequestId,
  fallbackInterested,
  projectId,
  requestId,
  state,
}: ProjectInterestSaveSettlement): ProjectInterestState {
  if (requestId !== activeRequestId) return state;
  if (state.projectId !== projectId) return state;
  if (!state.interested) return state;
  return { projectId, interested: fallbackInterested, saving: false };
}

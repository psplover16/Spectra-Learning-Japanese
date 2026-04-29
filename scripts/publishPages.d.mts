export interface PublishResult {
  target: 'production' | 'staging';
  targetPath: string;
  removedRootEntries: string[];
  removedTargetEntries: string[];
  copiedEntries: string[];
}

export interface SyncPublishedSiteInput {
  worktreeRoot: string;
  distPath: string;
  target: string;
}

export function formatPublishSummary(result: PublishResult): string;

export function formatNoPublishChangesMessage(target: string): string;

export function syncPublishedSite(input: SyncPublishedSiteInput): Promise<PublishResult>;

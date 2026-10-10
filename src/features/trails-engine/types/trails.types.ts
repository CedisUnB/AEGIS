export interface TrailCatalogEntry {
  id: number;
  theme: string;
  totalNodes: number;
  completedNodes: number;
  isStarted: boolean;
}

export interface TrailCardDTO extends TrailCatalogEntry {
  description: string;
}

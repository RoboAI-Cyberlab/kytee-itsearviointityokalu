export interface Practice {
  id: string;
  title: string;
  level?: number;
  additional_info?: string;
}

export interface Objective {
  id: string;
  title: string;
  description: string;
  cross_references?: string[];
  practices: Practice[];
}

export interface Domain {
  id: string;
  title: string;
  short: string;
  description: string;
  objectives: Objective[];
}

export type Model = Domain[];

export interface ModelCapabilities {
  objectiveMappingBadge: boolean;
  traficomBadge: boolean;
  compactAnswerLayout: boolean;
  practiceMeta: boolean;
}

export type SelectedModel = {
  id: string;
  name: string;
  version: string;
  author: string;
  practices: number;
  capabilities: ModelCapabilities;
};

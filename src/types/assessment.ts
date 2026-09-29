interface PracticeState {
  answer: 0 | 1 | 2 | 3 | 4;
  note: string;
  flagged: boolean;
}

export interface FormValues {
  [domainId: string]: {
    [practiceId: string]: PracticeState;
  };
}

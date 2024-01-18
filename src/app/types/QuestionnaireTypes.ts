export type QuestionType =
  | 'Text'
  | 'TextArea'
  | 'MultiSelect'
  | 'SingleSelect'
  | 'Date'
  | '';

export interface Answer {
  ExtAnswerID: string;
  AnswerText: string;
}

export interface Condition {
  ExtQuestionID?: string;
  AnswerValue?: string;
}

export interface Question {
  ExtQuestionID: string;
  QuestionText: string;
  QuestionType: QuestionType;
  Required: boolean;
  Min: string;
  Max: string;
  Limit: number;
  Format: string;
  Answers: Answer[];
  additionalFields?: any;
  Condition?: {
    ExtQuestionID: string;
    AnswerValue: string;
  };
}

export interface SimplifiedQuestion {
  i?: string;
  t?: string;
  qt?: string;
  r?: boolean;
  mi?: string;
  ma?: string;
  l?: number;
  f?: string;
  d?: SimplifiedAnswer[];
  c?: SimplifiedCondition;
}

export interface SimplifiedCondition {
  qid: string; // Question ID for the condition
  av: string; // Answer Value for the condition
}
export interface SimplifiedAnswer {
  aid?: string;
  at?: string;
}

export interface CombinedState {
  questions: Question[];
  modalData: ModalData;
}

export interface ModalData {
  accountName: string;
  jobIdentification: string;
  jobDetail?: string; // Field for additional details based on job identification
  // ... other fields
}

export interface SimplifiedModalData {
  an: string;
  rt: string;
  sa: string;
  ct: string;
  at?: string;
  cs: string[];
}

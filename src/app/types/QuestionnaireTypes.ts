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
  requestType: string;
  sameAffiliate: string;
  campaignType: string;
  atsType?: string;
  campaigns: string[];
}

export interface SimplifiedModalData {
  an: string;
  rt: string;
  sa: string;
  ct: string;
  at?: string;
  cs: string[];
}

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
  additionalFields?: any; // You can specify the type for additionalFields here
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

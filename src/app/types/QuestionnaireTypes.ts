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

// Define the structure of your modal data

// Combined state including both questions and modal data
export interface CombinedState {
  questions: Question[];
  modalData: ModalData;
}

export interface ModalData {
  accountName: string;
  requestType: string; // "New Launch" or "Existing Campaign"
  sameAffiliate: string; // "Yes" or "No"
  campaignType: string; // "PandoLogic + Easy Apply" or "A supported ATS"
  atsType?: string; // Optional, based on campaignType selection
  campaigns: string[]; // Array of campaign names or identifiers
}

export interface SimplifiedModalData {
  an: string; // Shortened from accountName
  rt: string; // Shortened from requestType
  sa: string; // Shortened from sameAffiliate
  ct: string; // Shortened from campaignType
  at?: string; // Shortened from atsType
  cs: string[]; // Shortened from campaigns
}

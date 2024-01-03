import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';
import {
  Question,
  QuestionType,
  SimplifiedQuestion,
  ModalData,
} from '@/types/QuestionnaireTypes';

interface SimplifiedModalData {
  an: string; // Account Name
  rt: string; // Request Type
  sa: string; // Same Affiliate
  ct: string; // Campaign Type
  at?: string; // ATS Type
  cs: string[]; // Campaigns
}

interface CombinedState {
  questions: Question[];
  modalData: ModalData;
}

const requestTypeMapping: { [key: string]: string } = {
  'Existing Campaign': 'ec',
  'New Launch': 'nl',
};

const campaignTypeMapping: { [key: string]: string } = {
  'PandoLogic + Easy Apply': 'pea',
  'A supported ATS': 'ats',
};

const reverseRequestTypeMapping: { [key: string]: string } = {
  ec: 'Existing Campaign',
  nl: 'New Launch',
};

const reverseCampaignTypeMapping: { [key: string]: string } = {
  pea: 'PandoLogic + Easy Apply',
  ats: 'A supported ATS',
};

const simplifyModalData = (modalData: ModalData): SimplifiedModalData => {
  return {
    an: modalData.accountName,
    rt: requestTypeMapping[modalData.requestType],
    sa: modalData.sameAffiliate,
    ct: campaignTypeMapping[modalData.campaignType],
    at: modalData.atsType,
    cs: modalData.campaigns,
  };
};

const expandModalData = (
  simplifiedModalData: SimplifiedModalData
): ModalData => {
  return {
    accountName: simplifiedModalData.an,
    requestType: reverseRequestTypeMapping[simplifiedModalData.rt],
    sameAffiliate: simplifiedModalData.sa,
    campaignType: reverseCampaignTypeMapping[simplifiedModalData.ct],
    atsType: simplifiedModalData.at,
    campaigns: simplifiedModalData.cs,
  };
};

const simplifyState = (state: Question[]): SimplifiedQuestion[] => {
  return state.map(
    ({
      ExtQuestionID,
      QuestionText,
      QuestionType,
      Required,
      Min,
      Max,
      Limit,
      Format,
      Answers,
    }) => ({
      i: ExtQuestionID,
      t: QuestionText,
      qt: QuestionType,
      r: Required,
      mi: Min,
      ma: Max,
      l: Limit,
      f: Format,
      d: Answers.map((a) => ({ aid: a.ExtAnswerID, at: a.AnswerText })),
    })
  );
};

export const expandState = (
  simplifiedState: SimplifiedQuestion[]
): Question[] => {
  return simplifiedState.map(({ i, t, qt, r, mi, ma, l, f, d }) => ({
    ExtQuestionID: i || '',
    QuestionText: t || '',
    QuestionType: qt as QuestionType,
    Required: r === true,
    Min: mi || '',
    Max: ma || '',
    Limit: l || 0,
    Format: f || '',
    Answers: d
      ? d.map((a) => ({ ExtAnswerID: a.aid || '', AnswerText: a.at || '' }))
      : [],
  }));
};

export const serializeStateToQueryString = (
  combinedState: CombinedState
): string => {
  const simplifiedState = {
    questions: simplifyState(combinedState.questions),
    modalData: simplifyModalData(combinedState.modalData),
  };
  return compressToEncodedURIComponent(JSON.stringify(simplifiedState));
};

export const parseQueryString = (): CombinedState | null => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const data = urlParams.get('data');
    if (data) {
      const decompressed = decompressFromEncodedURIComponent(data);
      if (decompressed) {
        const parsedData = JSON.parse(decompressed);
        return {
          questions: expandState(parsedData.questions),
          modalData: expandModalData(parsedData.modalData),
        };
      }
    }
  }
  return null;
};

export const generateShareableUrl = (combinedState: CombinedState): string => {
  if (typeof window !== 'undefined') {
    const queryString = serializeStateToQueryString(combinedState);
    return `${window.location.origin}${window.location.pathname}?data=${queryString}`;
  }
  return '';
};

export const copyToClipboard = async (url: string) => {
  if (typeof window !== 'undefined') {
    try {
      await navigator.clipboard.writeText(url);
      alert('URL copied to clipboard');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }
};

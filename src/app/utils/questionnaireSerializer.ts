import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';
import {
  Question,
  QuestionType,
  SimplifiedQuestion,
  ModalData,
  SimplifiedModalData,
} from '@/types/QuestionnaireTypes';

interface CombinedState {
  questions: Question[];
  modalData: ModalData; // Define this type based on your modal data structure
}

const expandModalData = (
  simplifiedModalData: SimplifiedModalData
): ModalData => {
  return {
    accountName: simplifiedModalData.an,
    requestType: simplifiedModalData.rt,
    sameAffiliate: simplifiedModalData.sa,
    campaignType: simplifiedModalData.ct,
    atsType: simplifiedModalData.at,
    campaigns: simplifiedModalData.cs,
  };
};

// Serialize the state to a compressed query string
export const serializeStateToQueryString = (
  combinedState: CombinedState
): string => {
  const simplifiedState = {
    questions: simplifyState(combinedState.questions),
    modalData: simplifyModalData(combinedState.modalData),
  };
  return compressToEncodedURIComponent(JSON.stringify(simplifiedState));
};

// Deserialize the query string into state
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

// Simplify the state for serialization
const simplifyState = (state: Question[]): SimplifiedQuestion[] => {
  return state
    .map(
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
        i: ExtQuestionID || undefined,
        t: QuestionText || undefined,
        qt: QuestionType || undefined,
        r: Required || undefined,
        mi: Min || undefined,
        ma: Max || undefined,
        l: Limit || undefined,
        f: Format || undefined,
        d: Answers
          ? Answers.map((a) => ({
              aid: a.ExtAnswerID || undefined,
              at: a.AnswerText || undefined,
            }))
          : undefined,
      })
    )
    .filter((q) => Object.keys(q).length > 0);
};

const simplifyModalData = (modalData: ModalData): SimplifiedModalData => {
  return {
    an: modalData.accountName,
    rt: modalData.requestType,
    sa: modalData.sameAffiliate,
    ct: modalData.campaignType,
    at: modalData.atsType || undefined,
    cs: modalData.campaigns,
  };
};

// Expand the simplified state into the original state
export const expandState = (
  simplifiedState: SimplifiedQuestion[]
): Question[] => {
  return simplifiedState.map(({ i, t, qt, r, mi, ma, l, f, d }) => ({
    ExtQuestionID: i || '',
    QuestionText: t || '',
    QuestionType: qt as QuestionType, // Type assertion here
    Required: r === true, // Convert to boolean
    Min: mi || '',
    Max: ma || '',
    Limit: l || 0,
    Format: f || '',
    Answers: d
      ? d.map((a) => ({ ExtAnswerID: a.aid || '', AnswerText: a.at || '' }))
      : [],
  }));
};

// Generate a shareable URL with the serialized state
export const generateShareableUrl = (combinedState: CombinedState): string => {
  if (typeof window !== 'undefined') {
    const queryString = serializeStateToQueryString(combinedState);
    return `${window.location.origin}${window.location.pathname}?data=${queryString}`;
  }
  return '';
};

// Copy the shareable URL to the clipboard
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
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string'; // Assuming you're using lz-string for compression

import {
  Question,
  QuestionType,
  SimplifiedQuestion,
} from '@/types/QuestionnaireTypes'; // Update the import path accordingly

// Serialize the state to a compressed query string
export const serializeStateToQueryString = (state: Question[]): string => {
  const simplifiedState = simplifyState(state);
  const stringState = JSON.stringify(simplifiedState);
  return compressToEncodedURIComponent(stringState);
};

// Deserialize the query string into state
export const parseQueryString = (): Question[] | null => {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const data = urlParams.get('data');
    if (data) {
      const decompressed = decompressFromEncodedURIComponent(data);
      return decompressed ? expandState(JSON.parse(decompressed)) : null;
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
        qid: ExtQuestionID || undefined,
        qt: QuestionText || undefined,
        qtype: QuestionType || undefined,
        req: Required || undefined,
        min: Min || undefined,
        max: Max || undefined,
        lim: Limit || undefined,
        fmt: Format || undefined,
        ans: Answers
          ? Answers.map((a) => ({
              aid: a.ExtAnswerID || undefined,
              at: a.AnswerText || undefined,
            }))
          : undefined,
      })
    )
    .filter((q) => Object.keys(q).length > 0);
};

// Expand the simplified state into the original state
const expandState = (simplifiedState: SimplifiedQuestion[]): Question[] => {
  return simplifiedState.map(
    ({ qid, qt, qtype, req, min, max, lim, fmt, ans }) => ({
      ExtQuestionID: qid || '',
      QuestionText: qt || '',
      QuestionType: qtype as QuestionType, // Type assertion
      Required: req || false,
      Min: min || '',
      Max: max || '',
      Limit: lim || 0,
      Format: fmt || '',
      Answers: ans
        ? ans.map((a) => ({
            ExtAnswerID: a.aid || '',
            AnswerText: a.at || '',
          }))
        : [],
    })
  );
};

// Generate a shareable URL with the serialized state
export const generateShareableUrl = (questions: Question[]): string => {
  if (typeof window !== 'undefined') {
    const queryString = serializeStateToQueryString(questions);
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

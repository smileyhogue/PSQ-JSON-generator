import { toast, ToastContainer } from 'react-toastify';
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';
import {
  Question,
  QuestionType,
  SimplifiedQuestion,
  ModalData,
  Condition,
} from '@/types/QuestionnaireTypes';
import JSZip from 'jszip';
import { useQuestionnaire } from '@/components/hooks/useQuestionnaire';

interface SimplifiedModalData {
  an: string;
  ji: string;
  jd?: string;
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
  // Assuming you have mappings for the new fields like Job Identification
  const jobIdentificationMapping = {
    Hashtag: 'ht',
    'List of Job IDs': 'ljid',
    'Job Titles': 'jt',
    'Job Category': 'jc',
    'Something Else': 'se',
    'All Jobs': 'aj',
  };

  return {
    an: modalData.accountName,
    ji: modalData.jobIdentification, // New field for Job Identification
    jd: modalData.jobDetail, // Assuming jobDetail is a string that can be directly used
  };
};

const expandModalData = (
  simplifiedModalData: SimplifiedModalData
): ModalData => {
  return {
    accountName: simplifiedModalData.an,
    jobIdentification: simplifiedModalData.ji,
    jobDetail: simplifiedModalData.jd,
  };
};

const simplifyState = (state: Question[]): SimplifiedQuestion[] => {
  return state.map(
    ({
      ExtQuestionID,
      QuestionText,
      QuestionType,
      Required,
      Order,
      Min,
      Max,
      Limit,
      Format,
      Answers,
      Condition,
    }) => ({
      i: ExtQuestionID,
      t: QuestionText,
      qt: QuestionType,
      r: Required,
      o: Order,
      mi: Min,
      ma: Max,
      l: Limit,
      f: Format,
      d: Answers.map((a) => ({
        aid: a.ExtAnswerID,
        at: a.AnswerText,
        o: a.Order,
      })),
      c: Condition
        ? { qid: Condition.ExtQuestionID, av: Condition.AnswerValue }
        : undefined,
    })
  );
};

export const expandState = (
  simplifiedState: SimplifiedQuestion[]
): Question[] => {
  return simplifiedState.map(({ i, t, qt, r, o, mi, ma, l, f, d, c }) => ({
    ExtQuestionID: i || '',
    QuestionText: t || '',
    QuestionType: qt as QuestionType,
    Required: r === true,
    Order: o || 0,
    Min: mi || '',
    Max: ma || '',
    Limit: l || 0,
    Format: f || '',
    Answers: d
      ? d.map((a) => ({
          ExtAnswerID: a.aid || '',
          AnswerText: a.at || '',
          Order: a.o || 0,
        }))
      : [],
    Condition: c ? { ExtQuestionID: c.qid, AnswerValue: c.av } : undefined,
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
    const savedQuestions = localStorage.getItem('questions');
    const savedModalData = localStorage.getItem('modalData');
    if (data) {
      const decompressed = decompressFromEncodedURIComponent(data);
      if (decompressed) {
        const parsedData = JSON.parse(decompressed);
        return {
          questions: expandState(parsedData.questions),
          modalData: expandModalData(parsedData.modalData),
        };
      }
    } else {
      if (savedQuestions && savedModalData) {
        return {
          questions: JSON.parse(savedQuestions),
          modalData: JSON.parse(savedModalData),
        };
      }
    }
  }
  return null;
};

export const generateShareableUrl = (combinedState: CombinedState): string => {
  if (typeof window !== 'undefined') {
    const queryString = serializeStateToQueryString(combinedState);
    const url = `${window.location.origin}?data=${queryString}`;
    createZipFile(combinedState.modalData, combinedState.questions, url);
  }
  return '';
};

export const copyToClipboard = async (url: string) => {
  if (typeof window !== 'undefined') {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Data Downloaded, please attach to your case.'),
        {
          position: 'top-center',
        };
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }
};

const generateModalDataCSV = (modalData: ModalData, shareableUrl: string) => {
  // Create a CSV content for modal data
  // Include the shareable URL as a new column in the CSV
  const csvContent = `Account Name,Job ID Method,Details,Shareable URL\n${modalData.accountName},${modalData.jobIdentification},${modalData.jobDetail},${shareableUrl}`;

  return csvContent;
};

// Function to create a zip file with CSV and JSON files
const createZipFile = (
  modalData: ModalData,
  questions: Question[],
  shareableUrl: string
) => {
  const zip = new JSZip();

  // Generate CSV file for modal data
  const modalDataCSV = generateModalDataCSV(modalData, shareableUrl);
  zip.file('request.csv', modalDataCSV);

  // Generate JSON file for questions
  var questionsJSON = JSON.stringify(questions, null, 2);
  questionsJSON = questionsJSON.replaceAll("'", "\\'");
  zip.file('questions.json', questionsJSON);

  // Create the zip file
  zip.generateAsync({ type: 'blob' }).then((content) => {
    const url = window.URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${modalData.accountName}_data.zip`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  });
};

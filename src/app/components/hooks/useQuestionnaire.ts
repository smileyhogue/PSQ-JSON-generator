import { useState } from 'react';

// Import the Question and Answer types
import { Question, Answer, ModalData } from '@/types/QuestionnaireTypes'; // Update the path accordingly

export function useQuestionnaire() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [jsonOutput, setJsonOutput] = useState('');
  const [value, setValue] = useState('0');
  const [answerValue, setAnswerValue] = useState('0');
  const [showModal, setShowModal] = useState(false);
  const [isDataFromURL, setIsDataFromURL] = useState(false);
  const [showViewModal, setShowViewModal] = useState(isDataFromURL);
  const [modalData, setModalData] = useState<ModalData>({
    accountName: '',
    requestType: '',
    sameAffiliate: '',
    campaignType: '',
    atsType: '',
    campaigns: [],
  });
  const [showJsonModal, setShowJsonModal] = useState(false);

  const toggleShowJsonModal = () => {
    setShowJsonModal(!showJsonModal);
  };

  const addQuestion = () => {
    const newQuestionID = (questions.length + 1).toString();
    setQuestions([
      ...questions,
      {
        ExtQuestionID: newQuestionID,
        QuestionText: '',
        QuestionType: 'Text',
        Required: false,
        Min: '',
        Max: '',
        Limit: 0,
        Format: '',
        Answers: [],
      },
    ]);
    setValue(questions.length.toString());
  };

  const handleQuestionChange = (
    index: number,
    field: keyof Question,
    value: any
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    if (field == 'Format') {
      updatedQuestions[index].Min = '';
      updatedQuestions[index].Max = '';
      updatedQuestions[index].Limit = 0;
    }
    if (field == 'QuestionType') {
      updatedQuestions[index].Min = '';
      updatedQuestions[index].Max = '';
      updatedQuestions[index].Limit = 0;
      updatedQuestions[index].Format = '';
      updatedQuestions[index].Answers = [];
    }
    setQuestions(updatedQuestions);
  };

  const handleAnswerChange = (
    questionIndex: number,
    answerIndex: number,
    field: keyof Answer,
    value: any
  ) => {
    const updatedQuestions = [...questions];
    const answers = updatedQuestions[questionIndex].Answers;
    answers[answerIndex] = { ...answers[answerIndex], [field]: value };
    updatedQuestions[questionIndex].Answers = answers;
    setQuestions(updatedQuestions);
  };

  const addAnswer = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].Answers.push({
      ExtAnswerID: '',
      AnswerText: '',
    });
    setQuestions(updatedQuestions);
    setAnswerValue(
      (updatedQuestions[questionIndex].Answers.length - 1).toString()
    );
  };

  const deleteQuestion = (index: number) => {
    const updatedQuestions = questions.filter(
      (_, questionIndex) => questionIndex !== index
    );
    setQuestions(updatedQuestions);
  };

  const deleteAnswer = (questionIndex: number, answerIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].Answers = updatedQuestions[
      questionIndex
    ].Answers.filter((_, ansIndex) => ansIndex !== answerIndex);
    setQuestions(updatedQuestions);
  };

  return {
    questions,
    jsonOutput,
    value,
    answerValue,
    addQuestion,
    handleQuestionChange,
    handleAnswerChange,
    addAnswer,
    deleteQuestion,
    deleteAnswer,
    setAnswerValue,
    setValue,
    setJsonOutput,
    setQuestions,
    showModal,
    setShowModal,
    modalData,
    setModalData,
    isDataFromURL,
    setIsDataFromURL,
    showViewModal,
    setShowViewModal,
    showJsonModal,
    setShowJsonModal,
    toggleShowJsonModal,
  };
}

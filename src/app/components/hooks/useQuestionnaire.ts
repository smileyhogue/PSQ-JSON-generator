import { useState } from 'react';
import { toast } from 'react-toastify';
import { Question, Answer, ModalData } from '@/types/QuestionnaireTypes';

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
    jobIdentification: '',
    jobDetail: '',
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
        Order: questions.length + 1,
        Required: true,
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
    if (field == 'Order') {
      // update the index of the question being moved and update the order of the rest of the questions
      const newIndex = parseInt(value);
      updatedQuestions[index].Order = newIndex;
      updatedQuestions[newIndex - 1].Order = index + 1;
      for (let i = 0; i < updatedQuestions.length; i++) {
        if (i !== index && i !== newIndex - 1) {
          updatedQuestions[i].Order = i + 1;
        }
      }
      updatedQuestions.sort((a, b) => a.Order - b.Order);
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
      ExtAnswerID: (
        updatedQuestions[questionIndex].Answers.length + 1
      ).toString(),
      AnswerText: '',
      Order: updatedQuestions[questionIndex].Answers.length + 1,
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
    for (let i = 0; i < updatedQuestions.length; i++) {
      updatedQuestions[i].Order = i + 1;
      updatedQuestions[i].ExtQuestionID = (i + 1).toString();
    }
  };

  const deleteAnswer = (questionIndex: number, answerIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].Answers = updatedQuestions[
      questionIndex
    ].Answers.filter((_, ansIndex) => ansIndex !== answerIndex);
    setQuestions(updatedQuestions);
  };

  const validateQuestions = () => {
    const errors: string[] = [];

    questions.forEach((question, index) => {
      if (!question.QuestionText.trim()) {
        errors.push(`Question ${index + 1} Text is required`);
      }
      if (!question.ExtQuestionID.trim()) {
        errors.push(`Question ${index + 1} ID is required`);
      }
      if (question.QuestionType === 'MultiSelect') {
        if (question.Answers.length < 2) {
          errors.push(`Question ${index + 1} must have at least two answers`);
        }
      }
      if (question.QuestionType === 'MultiSelect') {
        if (question.Answers.length >= 2) {
          question.Answers.forEach((answer, ansIndex) => {
            if (!answer.AnswerText.trim()) {
              errors.push(
                `Question ${index + 1} Answer ${ansIndex + 1} is required`
              );
            }
            if (!answer.ExtAnswerID.trim()) {
              errors.push(
                `Question ${index + 1} Answer ${ansIndex + 1} ID is required`
              );
            }
          });
        }
      }
      if (!question.ExtQuestionID.trim()) {
        errors.push(`Question ${index + 1} ID is required`);
      }

      // Add other validation checks as needed
    });
    return errors;
  };

  const handleViewJsonModal = () => {
    const errors = validateQuestions();
    if (errors.length === 0) {
      toggleShowJsonModal();
    } else {
      toast.error('Please fill in all required fields:\n' + errors.join('\n'), {
        position: 'top-center',
      });
    }
  };

  const handleShareUrlModal = () => {
    const errors = validateQuestions();
    if (errors.length === 0) {
      setShowModal(true);
    } else {
      toast.error('Please fill in all required fields:\n' + errors.join('\n'), {
        position: 'top-center',
      });
    }
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
    validateQuestions,
    handleViewJsonModal,
    handleShareUrlModal,
  };
}

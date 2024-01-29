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
  const [isDataFromLocal, setIsDataFromLocal] = useState(false);
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

    if (field === 'Order') {
      const newIndex = parseInt(value) - 1;
      const oldIndex = updatedQuestions.findIndex((q) => q.Order === index + 1);

      if (
        newIndex >= 0 &&
        newIndex < updatedQuestions.length &&
        oldIndex >= 0
      ) {
        const questionToMove = updatedQuestions[oldIndex];
        updatedQuestions.splice(oldIndex, 1); // Remove the question from its old position
        updatedQuestions.splice(newIndex, 0, questionToMove); // Insert it at the new position
      }

      // Update the Order field for all questions
      updatedQuestions.forEach((q, i) => {
        q.Order = i + 1;
      });
      setValue(newIndex.toString());
    } else if (field === 'Format' || field === 'QuestionType') {
      (updatedQuestions[index] as any)[field] = value; // Use type assertion
      updatedQuestions[index].Min = '';
      updatedQuestions[index].Max = '';
      updatedQuestions[index].Limit = 0;
      updatedQuestions[index].Format = '';
      updatedQuestions[index].Answers = [];
    } else {
      (updatedQuestions[index] as any)[field] = value; // Use type assertion
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

  const handleSave = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('questions', JSON.stringify(questions));
      localStorage.setItem('modalData', JSON.stringify(modalData));
    }
  };

  const handleClear = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('questions');
      localStorage.removeItem('modalData');
    }
    // refresh the page
    window.location.reload();
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
    handleSave,
    handleClear,
    isDataFromLocal,
    setIsDataFromLocal,
  };
}

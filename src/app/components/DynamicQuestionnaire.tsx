'use client';
import React, { useEffect } from 'react';
import { useQuestionnaire } from '@/components/hooks/useQuestionnaire';
import {
  generateShareableUrl,
  copyToClipboard,
  parseQueryString,
} from '../utils/questionnaireSerializer';
import { QuestionType, ModalData } from '@/types/QuestionnaireTypes'; // Update the import path accordingly
import styles from '../styles/DynamicQuestionnaire.module.css';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ShareModal from '@/components/modals/ShareModal';
import ViewModalInfo from '@/components/modals/ViewModalInfo';

const DynamicQuestionnaire: React.FC = () => {
  const {
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
    setModalData,
    modalData,
    isDataFromURL,
    setIsDataFromURL,
    showViewModal,
    setShowViewModal,
  } = useQuestionnaire();

  const formatOptions = ['integer', 'text'];

  useEffect(() => {
    const urlData = parseQueryString();
    if (urlData) {
      setQuestions(urlData.questions);
      setModalData(urlData.modalData); // Ensure modalData includes atsType
      setShowViewModal(true);
      setIsDataFromURL(true);
    }
  }, [setQuestions, setModalData, setShowModal, setIsDataFromURL]);

  useEffect(() => {
    const initialState = parseQueryString();
    if (initialState) {
      setQuestions(initialState.questions);
      setModalData(initialState.modalData); // Set the modal data state
    }
  }, [setQuestions, setModalData]);

  useEffect(() => {
    const jsonQuestions = questions.map(
      ({ additionalFields, Answers, Format, ...question }) => {
        // Set Format to null if it's 'text'
        const adjustedFormat = Format === 'text' ? '' : Format;

        // Include Answers for certain question types
        const adjustedQuestion =
          question.QuestionType !== 'MultiSelect' &&
          question.QuestionType !== 'SingleSelect'
            ? { ...question, Format: adjustedFormat }
            : { ...question, Format: adjustedFormat, Answers };

        return adjustedQuestion;
      }
    );

    setJsonOutput(JSON.stringify(jsonQuestions, null, 2));
  }, [questions, setJsonOutput]);

  const getAdditionalFields = (
    type: QuestionType,
    index: number
  ): JSX.Element | null => {
    const currentQuestion = questions[index];

    const formatDropdown = (
      <select
        className={styles.additionalInput}
        value={currentQuestion.Format}
        onChange={(e) => handleQuestionChange(index, 'Format', e.target.value)}
      >
        <option value="">Select Format</option>
        {formatOptions.map((format, idx) => (
          <option key={idx} value={format}>
            {format}
          </option>
        ))}
      </select>
    );

    switch (type) {
      case 'Text':
      case 'TextArea':
        return (
          <>
            {formatDropdown}
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                id={`required-${type}-${index}`}
                className={styles.checkbox}
                checked={questions[index].Required}
                onChange={(e) =>
                  handleQuestionChange(index, 'Required', e.target.checked)
                }
              />
              <label
                htmlFor={`required-${type}-${index}`}
                className={styles.checkboxLabel}
              >
                Required
              </label>
            </div>

            {currentQuestion.Format === 'integer' && (
              <>
                <Input
                  type="number"
                  placeholder="Min Value"
                  value={currentQuestion.Min}
                  onChange={(e) =>
                    handleQuestionChange(index, 'Min', e.target.value)
                  }
                  className={styles.questionInput}
                />
                <Input
                  type="number"
                  placeholder="Max Value"
                  value={currentQuestion.Max}
                  onChange={(e) =>
                    handleQuestionChange(index, 'Max', e.target.value)
                  }
                  className={styles.questionInput}
                />
              </>
            )}
            {currentQuestion.Format === 'text' && (
              <Input
                type="number"
                placeholder="Character Limit"
                value={currentQuestion.Limit}
                onChange={(e) =>
                  handleQuestionChange(index, 'Limit', parseInt(e.target.value))
                }
                className={styles.questionInput}
              />
            )}
          </>
        );
      case 'MultiSelect':
      case 'SingleSelect':
        return (
          <>
            <input
              type="checkbox"
              id={`required-${type}-${index}`}
              className={styles.checkbox}
              checked={questions[index].Required}
              onChange={(e) =>
                handleQuestionChange(index, 'Required', e.target.checked)
              }
            />
            <label
              htmlFor={`required-${type}-${index}`}
              className={styles.checkboxLabel}
            >
              Required
            </label>

            <Accordion
              type="single"
              value={answerValue}
              onValueChange={setAnswerValue}
            >
              {questions[index].Answers.map((answer, answerIndex) => (
                <AccordionItem key={answerIndex} value={answerIndex.toString()}>
                  <AccordionTrigger>
                    {answer.AnswerText || `Answer ${answerIndex + 1}`}
                    <Button
                      onClick={() => deleteAnswer(index, answerIndex)}
                      className={styles.deleteButton}
                    >
                      Delete Answer
                    </Button>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div>
                      <Input
                        type="text"
                        placeholder="Answer ID"
                        value={answer.ExtAnswerID}
                        onChange={(e) =>
                          handleAnswerChange(
                            index,
                            answerIndex,
                            'ExtAnswerID',
                            e.target.value
                          )
                        }
                        className={styles.questionInput}
                      />
                      <Input
                        type="text"
                        placeholder="Answer Text"
                        value={answer.AnswerText}
                        onChange={(e) =>
                          handleAnswerChange(
                            index,
                            answerIndex,
                            'AnswerText',
                            e.target.value
                          )
                        }
                        className={styles.questionInput}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Button
              variant="outline"
              onClick={() => addAnswer(index)}
              //className={styles.smallButton}
            >
              Add Answer
            </Button>
          </>
        );
      case 'Date':
        return (
          // TODO: fix dates and required boxes to use the value from the json
          <>
            <input
              type="date"
              placeholder="Min Date"
              className={styles.additionalInput}
              value={questions[index].Min}
              onChange={(e) =>
                handleQuestionChange(index, 'Min', e.target.value)
              }
            />
            <input
              type="date"
              placeholder="Max Date"
              className={styles.additionalInput}
              value={questions[index].Max}
              onChange={(e) =>
                handleQuestionChange(index, 'Max', e.target.value)
              }
            />
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                id={`required-${type}-${index}`}
                className={styles.checkbox}
                checked={questions[index].Required}
                onChange={(e) =>
                  handleQuestionChange(index, 'Required', e.target.checked)
                }
              />
              <label
                htmlFor={`required-${type}-${index}`}
                className={styles.checkboxLabel}
              >
                Required
              </label>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const handleModalSubmit = (modalData: ModalData) => {
    const combinedData = {
      questions,
      modalData,
    };
    const shareableUrl = generateShareableUrl(combinedData);
    copyToClipboard(shareableUrl);
    setShowModal(false); // Close the modal
  };
  console.log('questions', questions);
  return (
    <div>
      <Accordion type="single" value={value} onValueChange={setValue}>
        {questions.map((question, index) => (
          <AccordionItem key={index} value={index.toString()}>
            <AccordionTrigger>
              {question.QuestionText || `Question ${index + 1}`}
              <Button
                onClick={() => deleteQuestion(index)}
                variant="destructive"
              >
                Delete
              </Button>
            </AccordionTrigger>
            <AccordionContent>
              <div className={styles.questionContainer}>
                <Input
                  type="text"
                  value={question.ExtQuestionID}
                  onChange={(e) =>
                    handleQuestionChange(index, 'ExtQuestionID', e.target.value)
                  }
                  className={styles.questionInput}
                />
                <Input
                  type="text"
                  value={question.QuestionText}
                  placeholder="Question Text"
                  onChange={(e) =>
                    handleQuestionChange(index, 'QuestionText', e.target.value)
                  }
                  className={styles.questionInput}
                />
                <Select
                  value={question.QuestionType}
                  onValueChange={(newValue) =>
                    handleQuestionChange(index, 'QuestionType', newValue)
                  }
                >
                  <SelectTrigger className={styles.questionSelect}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Types</SelectLabel>
                      <SelectItem value="Text">Text</SelectItem>
                      <SelectItem value="TextArea">TextArea</SelectItem>
                      <SelectItem value="MultiSelect">MultiSelect</SelectItem>
                      <SelectItem value="SingleSelect">SingleSelect</SelectItem>
                      <SelectItem value="Date">Date</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div className={styles.additionalFields}>
                  {getAdditionalFields(question.QuestionType, index)}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Button variant="outline" onClick={addQuestion}>
        Add Question
      </Button>
      <div>
        <h3>Generated JSON:</h3>
        <Textarea value={jsonOutput} readOnly className={styles.jsonOutput} />
      </div>
      <Button onClick={() => setShowModal(true)}>Copy Shareable URL</Button>
      {isDataFromURL && (
        <Button onClick={() => setShowViewModal(true)}>View Modal Info</Button>
      )}
      <ViewModalInfo
        showModal={showViewModal}
        onClose={() => setShowViewModal(false)}
        modalData={modalData}
      />
      <ShareModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onCopyURL={handleModalSubmit}
        initialData={modalData}
      />
    </div>
  );
};

export default DynamicQuestionnaire;

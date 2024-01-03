'use client';
import React, { useEffect } from 'react';
// modals
import ShareModal from '@/components/modals/ShareModal';
import ViewModalInfo from '@/components/modals/ViewModalInfo';
import JsonViewModal from '@/components/modals/ViewJSONModal';
// ShadCN components
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Button } from '@/components/ui/button';
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
// hooks
import { useQuestionnaire } from '@/components/hooks/useQuestionnaire';
// utils
import {
  generateShareableUrl,
  copyToClipboard,
  parseQueryString,
} from '../utils/questionnaireSerializer';
// types
import { QuestionType, ModalData } from '@/types/QuestionnaireTypes';
// styles
import styles from '../styles/DynamicQuestionnaire.module.css';

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
    showJsonModal,
    toggleShowJsonModal,
    handleShareUrlModal,
    handleViewJsonModal,
  } = useQuestionnaire();
  const formatOptions = ['integer', 'text'];

  useEffect(() => {
    const urlData = parseQueryString();
    if (urlData) {
      setQuestions(urlData.questions);
      setModalData(urlData.modalData);
      setShowViewModal(true);
      setIsDataFromURL(true);
    }
  }, [
    setQuestions,
    setModalData,
    setShowModal,
    setIsDataFromURL,
    setShowViewModal,
  ]);

  useEffect(() => {
    const initialState = parseQueryString();
    if (initialState) {
      setQuestions(initialState.questions);
      setModalData(initialState.modalData);
    }
  }, [setQuestions, setModalData]);

  useEffect(() => {
    const jsonQuestions = questions.map(
      ({ additionalFields, Answers, Format, ...question }) => {
        const adjustedFormat = Format === 'text' ? '' : Format;

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

    const isUnlimited = currentQuestion.Limit === 0;

    const handleLimitChange = (e: any) => {
      // If the checkbox is checked, set the limit to 0, otherwise use the number input's value
      const limitValue = e.target.checked ? 0 : parseInt(e.target.value);
      handleQuestionChange(index, 'Limit', limitValue);
    };

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
              <>
                <div className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    id={`unlimited-${index}`}
                    className={styles.checkbox}
                    checked={isUnlimited}
                    onChange={(e) => handleLimitChange(e)}
                  />
                  <label
                    htmlFor={`unlimited-${index}`}
                    className={styles.checkboxLabel}
                  >
                    Unlimited characters
                  </label>
                </div>

                {!isUnlimited && (
                  <Input
                    type="number"
                    placeholder="Character Limit"
                    value={currentQuestion.Limit}
                    onChange={(e) => handleLimitChange(e)}
                    className={styles.questionInput}
                  />
                )}
              </>
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
                      variant="destructive"
                      onClick={() => deleteAnswer(index, answerIndex)}
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
              className={styles.questionButton}
              onClick={() => addAnswer(index)}
              //className={styles.smallButton}
            >
              Add Answer
            </Button>
          </>
        );
      case 'Date':
        return (
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
    setShowModal(false);
  };
  return (
    <div>
      <div className={styles.questionsContainer}>
        <Accordion type="single" value={value} onValueChange={setValue}>
          {questions.map((question, index) => (
            <AccordionItem key={index} value={index.toString()}>
              <AccordionTrigger>
                <span className={styles.questionText}>
                  {question.QuestionText || `Question ${index + 1}`}
                </span>
                <Button
                  onClick={() => deleteQuestion(index)}
                  variant="destructive"
                  className={styles.deleteButton}
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
                      handleQuestionChange(
                        index,
                        'ExtQuestionID',
                        e.target.value
                      )
                    }
                    className={styles.questionInput}
                  />
                  <Input
                    type="text"
                    value={question.QuestionText}
                    placeholder="Question Text"
                    onChange={(e) =>
                      handleQuestionChange(
                        index,
                        'QuestionText',
                        e.target.value
                      )
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
                        <SelectItem value="SingleSelect">
                          SingleSelect
                        </SelectItem>
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
        <Button
          variant="outline"
          onClick={addQuestion}
          className={styles.questionButton}
        >
          Add Question
        </Button>
      </div>

      <div className={styles.bottomButtonContainer}>
        <Button onClick={handleViewJsonModal} className={styles.modalButton}>
          View JSON
        </Button>
        <Button onClick={handleShareUrlModal} className={styles.modalButton}>
          Copy Shareable URL
        </Button>
        {isDataFromURL && (
          <Button
            onClick={() => setShowViewModal(true)}
            className={styles.modalButton}
          >
            View Modal Info
          </Button>
        )}
      </div>
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
      <JsonViewModal
        show={showJsonModal}
        onClose={toggleShowJsonModal}
        jsonData={jsonOutput}
      />
    </div>
  );
};

export default DynamicQuestionnaire;

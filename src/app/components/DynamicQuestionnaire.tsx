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
import {
  QuestionType,
  ModalData,
  Condition,
  Question,
} from '@/types/QuestionnaireTypes';
// styles
import styles from '../styles/DynamicQuestionnaire.module.css';
import TooltipComponent from './ToolTip';

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
    addQuestion();
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
    // Start new conditional feature
    const handleConditionalChange = (index: number, checked: boolean) => {
      const updatedQuestions = [...questions];
      if (checked) {
        // Initialize the Condition object if checked
        updatedQuestions[index].Condition = {
          ExtQuestionID: '',
          AnswerValue: '',
        };
      } else {
        // Remove the Condition object if unchecked
        delete updatedQuestions[index].Condition;
      }
      setQuestions(updatedQuestions);
    };

    const handleConditionDetailsChange = (
      index: number,
      field: keyof Condition,
      value: string
    ) => {
      const updatedQuestions = [...questions];
      if (!updatedQuestions[index].Condition) {
        updatedQuestions[index].Condition = {
          ExtQuestionID: '',
          AnswerValue: '',
        };
      }

      updatedQuestions[index].Condition![field] = value;

      setQuestions(updatedQuestions);
    };

    const hasConditionalQuestions = (index: number): boolean => {
      return questions
        .slice(0, index)
        .some(
          (q) =>
            q.QuestionType === 'MultiSelect' ||
            q.QuestionType === 'SingleSelect'
        );
    };

    const renderConditionalUI = (index: number): JSX.Element | null => {
      // Filter questions to only include those before the current index
      const previousQuestions = questions
        .slice(0, index)
        .filter(
          (q) =>
            q.QuestionType === 'MultiSelect' ||
            q.QuestionType === 'SingleSelect'
        );

      // Check if there are any eligible previous questions for conditional logic
      if (previousQuestions.length === 0) {
        return null;
      }

      // Extract current question's Condition for easier access
      const currentCondition: Condition = questions[index].Condition || {};

      return (
        <div className={styles.conditionalContainer}>
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              id={`conditional-${index}`}
              className={styles.checkbox}
              checked={!!questions[index].Condition}
              onChange={(e) => handleConditionalChange(index, e.target.checked)}
            />
            <label
              htmlFor={`conditional-${index}`}
              className={styles.checkboxLabel}
            >
              Conditional
            </label>
          </div>

          {questions[index].Condition && (
            <>
              <select
                className={styles.select}
                value={currentCondition.ExtQuestionID || ''}
                onChange={(e) =>
                  handleConditionDetailsChange(
                    index,
                    'ExtQuestionID',
                    e.target.value
                  )
                }
              >
                <option value="">Select Previous Question</option>
                {previousQuestions.map((q, idx) => (
                  <option key={idx} value={q.ExtQuestionID}>
                    {q.QuestionText || `Question ${idx + 1}`}
                  </option>
                ))}
              </select>

              {currentCondition.ExtQuestionID && (
                <select
                  className={styles.select}
                  value={currentCondition.AnswerValue || ''}
                  onChange={(e) =>
                    handleConditionDetailsChange(
                      index,
                      'AnswerValue',
                      e.target.value
                    )
                  }
                >
                  <option value="">Select Answer</option>
                  {renderAnswerOptions(currentCondition.ExtQuestionID)}
                </select>
              )}
            </>
          )}
        </div>
      );
    };

    const renderAnswerOptions = (questionID: string): JSX.Element[] => {
      // Ensure that TypeScript recognizes the correct type for 'question'
      const question = questions.find(
        (q) => q.ExtQuestionID === questionID
      ) as Question;
      return (
        question?.Answers?.map((answer, idx) => (
          <option key={idx} value={answer.ExtAnswerID}>
            {answer.AnswerText}
          </option>
        )) || []
      );
    };

    // end new conditional feature
    switch (type) {
      case 'Text':
      case 'TextArea':
        return (
          <>
            {formatDropdown}
            <div className={styles.checkboxContainer}>
              <div className={styles.tooltipInputContainer}>
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
                <TooltipComponent content="Is the user required to answer this question?" />
              </div>
            </div>

            {currentQuestion.Format === 'integer' && (
              <>
                <div className={styles.tooltipInputContainer}>
                  <Input
                    type="number"
                    placeholder="Min Value"
                    value={currentQuestion.Min}
                    onChange={(e) =>
                      handleQuestionChange(index, 'Min', e.target.value)
                    }
                    className={styles.questionInput}
                  />
                  <TooltipComponent content="Minimum value allowed for the answer" />
                </div>
                <div className={styles.tooltipInputContainer}>
                  <Input
                    type="number"
                    placeholder="Max Value"
                    value={currentQuestion.Max}
                    onChange={(e) =>
                      handleQuestionChange(index, 'Max', e.target.value)
                    }
                    className={styles.questionInput}
                  />
                  <TooltipComponent content="Maximum value allowed for the answer" />
                </div>
              </>
            )}
            {currentQuestion.Format === 'text' && (
              <>
                <div className={styles.tooltipInputContainer}>
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
                  <TooltipComponent content="Should the applicant be able to type an unlimited number of characters?" />
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
            {renderConditionalUI(index)}
          </>
        );
      case 'MultiSelect':
      case 'SingleSelect':
        return (
          <>
            <div className={styles.tooltipInputContainer}>
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
              <TooltipComponent content="Is the user required to answer this question?" />
            </div>

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
                  <div className={styles.tooltipInputContainer}>
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
                    <TooltipComponent
                      content="Question ID. This is used for the system to identify
                            unique questions and to identify condition
                            questions. This value must be unique."
                    />
                  </div>
                  <div className={styles.tooltipInputContainer}>
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
                    <TooltipComponent content="This will be the question that is displayed to the user." />
                  </div>
                  <div className={styles.tooltipInputContainer}>
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
                          <SelectItem value="MultiSelect">
                            MultiSelect
                          </SelectItem>
                          <SelectItem value="SingleSelect">
                            SingleSelect
                          </SelectItem>
                          <SelectItem value="Date">Date</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <TooltipComponent content="Type of answer allowed for the user" />
                  </div>
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
          Generate Request
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

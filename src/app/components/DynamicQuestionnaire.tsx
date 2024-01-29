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
import TooltipComponent from './ToolTip';
// Toast notifications
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    handleSave,
    handleClear,
  } = useQuestionnaire();
  const formatOptions = ['integer', 'text'];

  // Parse URL for initial data if it exists
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
      <div className={styles.tooltipInputContainer}>
        <label>Format</label>
        <select
          className={styles.additionalInput}
          value={currentQuestion.Format}
          onChange={(e) =>
            handleQuestionChange(index, 'Format', e.target.value)
          }
        >
          <option value="">Select Format</option>
          {formatOptions.map((format, idx) => (
            <option key={idx} value={format}>
              {format}
            </option>
          ))}
        </select>
        <TooltipComponent
          data-cy="questionId"
          content="Format of the answer. This is used to validate the answer."
        />
      </div>
    );

    const isUnlimited = currentQuestion.Limit === 0;

    const handleLimitChange = (e: any) => {
      const limitValue = e.target.checked ? 0 : parseInt(e.target.value);
      handleQuestionChange(index, 'Limit', limitValue);
    };
    const handleConditionalChange = (index: number, checked: boolean) => {
      const updatedQuestions = [...questions];
      if (checked) {
        updatedQuestions[index].Condition = {
          ExtQuestionID: '',
          AnswerValue: '',
        };
      } else {
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
      const previousQuestions = questions
        .slice(0, index)
        .filter(
          (q) =>
            q.QuestionType === 'MultiSelect' ||
            q.QuestionType === 'SingleSelect'
        );

      if (previousQuestions.length === 0) {
        return null;
      }

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
                data-cy="previousQuestionSelect"
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
                  data-cy="answerSelect"
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

    switch (type) {
      case 'Text':
      case 'TextArea':
        return (
          <>
            {formatDropdown}
            <div className={styles.checkboxContainer}>
              <div className={styles.tooltipInputContainer}>
                <input
                  data-cy="requiredCheckBox"
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
                  <TooltipComponent
                    data-cy="minText"
                    content="Minimum value allowed for the answer"
                  />
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
                  <TooltipComponent
                    data-cy="maxText"
                    content="Maximum value allowed for the answer"
                  />
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
                  <TooltipComponent
                    data-cy="unlimitedCheck"
                    content="Should the applicant be able to type an unlimited number of characters?"
                  />
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
                      data-cy="deleteAnswerButton"
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
                        data-cy={'answerTextBox' + answerIndex}
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
              data-cy="addAnswerButton"
              variant="outline"
              className={styles.questionButton}
              onClick={() => addAnswer(index)}
              //className={styles.smallButton}
            >
              Add Answer
            </Button>
            {renderConditionalUI(index)}
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
            {renderConditionalUI(index)}
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
                <span
                  data-cy={'accordionHead' + index.toString()}
                  className={styles.questionText}
                >
                  {question.QuestionText || `Question ${index + 1}`}
                </span>
                {questions.length > 1 && (
                  <Button
                    data-cy="deleteQuestionButton"
                    onClick={() => deleteQuestion(index)}
                    variant="destructive"
                    className={styles.deleteButton}
                  >
                    Delete
                  </Button>
                )}
              </AccordionTrigger>
              <AccordionContent>
                <div className={styles.questionContainer}>
                  <div className={styles.tooltipInputContainer}>
                    <label>Order</label>
                    <Select
                      value={question.Order.toString()}
                      onValueChange={(newValue) =>
                        handleQuestionChange(index, 'Order', newValue)
                      }
                    >
                      <SelectTrigger
                        data-cy="orderSelect"
                        id="questionOrder"
                        className={styles.questionSelect}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Order</SelectLabel>
                          {questions.map((q, idx) => (
                            <SelectItem
                              key={idx}
                              value={(idx + 1).toString()}
                              data-cy={'orderSelect' + idx.toString()}
                            >
                              {idx + 1}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <TooltipComponent
                      data-cy="orderSelecttt"
                      content="Change this to the order you want the question to appear in the questionnaire."
                    />
                  </div>
                  <div className={styles.tooltipInputContainer}>
                    <label>Question ID</label>
                    <Input
                      // make uneditable
                      readOnly
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
                      data-cy="questionId"
                      content="Question ID. This is used for the system to identify
                            unique questions and to identify condition
                            questions. This value must be unique."
                    />
                  </div>
                  <div className={styles.tooltipInputContainer}>
                    <label>Question Text</label>
                    <Input
                      data-cy="questionTextBox"
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
                    <TooltipComponent
                      data-cy="questionText"
                      content="This will be the question that is displayed to the user."
                    />
                  </div>
                  <div className={styles.tooltipInputContainer}>
                    <label>Question Type</label>
                    <Select
                      value={question.QuestionType}
                      onValueChange={(newValue) =>
                        handleQuestionChange(index, 'QuestionType', newValue)
                      }
                    >
                      <SelectTrigger
                        id="questionType"
                        className={styles.questionSelect}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Types</SelectLabel>
                          <SelectItem id="qtText" value="Text">
                            Text
                          </SelectItem>
                          <SelectItem id="qtTArea" value="TextArea">
                            TextArea
                          </SelectItem>
                          <SelectItem id="qtMSelect" value="MultiSelect">
                            MultiSelect
                          </SelectItem>
                          <SelectItem id="qtSSelect" value="SingleSelect">
                            SingleSelect
                          </SelectItem>
                          <SelectItem id="qtDate" value="Date">
                            Date
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <TooltipComponent
                      data-cy="questionType"
                      content="Type of answer allowed for the user"
                    />
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
          data-cy="addQuestionButton"
          variant="outline"
          onClick={addQuestion}
          className={styles.questionButton}
        >
          Add Question
        </Button>
      </div>

      <div className={styles.bottomButtonContainer}>
        <Button
          data-cy="viewJsonButton"
          onClick={handleViewJsonModal}
          className={styles.modalButton}
        >
          View JSON
        </Button>
        <Button
          data-cy="genRequestButton"
          onClick={handleShareUrlModal}
          className={styles.modalButton}
        >
          Generate Request
        </Button>
        <Button
          data-cy="saveButton"
          onClick={handleSave}
          className={styles.modalButton}
        >
          Save
        </Button>
        {isDataFromURL && (
          <>
            <Button
              onClick={() => setShowViewModal(true)}
              className={styles.modalButton}
            >
              View Request Info
            </Button>
            <Button onClick={handleClear} className={styles.modalButton}>
              Clear Storage
            </Button>
          </>
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
      <ToastContainer />
    </div>
  );
};

export default DynamicQuestionnaire;

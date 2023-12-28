'use client';
import React, { useState, useEffect } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

type QuestionType =
  | 'Text'
  | 'TextArea'
  | 'MultiSelect'
  | 'SingleSelect'
  | 'Date'
  | '';

interface Answer {
  ExtAnswerID: string;
  AnswerText: string;
}

interface Question {
  ExtQuestionID: string;
  QuestionText: string;
  QuestionType: QuestionType;
  Required: boolean;
  Min: string;
  Max: string;
  Limit: number;
  Format: string;
  Answers: Answer[];
  additionalFields?: any; // add this line, replace 'any' with the type of 'additionalFields'
}

const DynamicQuestionnaire: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [jsonOutput, setJsonOutput] = useState('');
  const formatOptions = ['integer', 'text'];

  // testing ---------------
  const serializeStateToQueryString = (state: any) => {
    const serializedState = JSON.stringify(state);
    return encodeURIComponent(serializedState);
  };

  // Usage example
  const queryString = serializeStateToQueryString(questions);
  const shareableUrl = `${window.location.origin}${window.location.pathname}?data=${queryString}`;

  const parseQueryString = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const data = urlParams.get('data');
    return data ? JSON.parse(decodeURIComponent(data)) : null;
  };

  // Usage example
  useEffect(() => {
    const initialState = parseQueryString();
    if (initialState) {
      setQuestions(initialState);
    }
  }, []);

  const generateShareableUrl = () => {
    const serializedState = encodeURIComponent(JSON.stringify(questions));
    return `${window.location.origin}${window.location.pathname}?data=${serializedState}`;
  };

  const copyToClipboard = async () => {
    const url = generateShareableUrl();
    try {
      await navigator.clipboard.writeText(url);
      alert('URL copied to clipboard'); // Or any other indication you prefer
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
  //testing ------------------

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
  }, [questions]);

  const [value, setValue] = React.useState('0');
  const [answerValue, setAnswerValue] = React.useState('0');

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

    // Update additional fields if the question type changes
    if (field === 'QuestionType') {
      updatedQuestions[index].additionalFields = getAdditionalFields(
        value as QuestionType,
        index
      );
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
        <option value="">Select Format (if supported by ATS)</option>
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
          <>
            <input
              type="date"
              placeholder="Min Date"
              className={styles.additionalInput}
              onChange={(e) =>
                handleQuestionChange(index, 'Min', e.target.value)
              }
            />
            <input
              type="date"
              placeholder="Max Date"
              className={styles.additionalInput}
              onChange={(e) =>
                handleQuestionChange(index, 'Max', e.target.value)
              }
            />
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                id={`required-${type}-${index}`}
                className={styles.checkbox}
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
      <Button onClick={copyToClipboard}>Copy Shareable URL</Button>
    </div>
  );
};

export default DynamicQuestionnaire;

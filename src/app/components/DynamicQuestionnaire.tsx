'use client';
import React, { useState, useEffect } from 'react';
import styles from '../styles/DynamicQuestionnaire.module.css';

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
  const formatOptions = ['integer', 'text', 'date', 'email', 'url'];

  useEffect(() => {
    const jsonQuestions = questions.map(
      ({ additionalFields, ...question }) => question
    );
    setJsonOutput(JSON.stringify(jsonQuestions, null, 2));
  }, [questions]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        ExtQuestionID: '',
        QuestionText: '',
        QuestionType: '',
        Required: false,
        Min: '',
        Max: '',
        Limit: 0,
        Format: '',
        Answers: [],
      },
    ]);
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
  };

  const getAdditionalFields = (
    type: QuestionType,
    index: number
  ): JSX.Element | null => {
    const formatDropdown = (
      <select
        className={styles.additionalInput}
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
            {formatDropdown}
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
            {questions[index].Answers.map((answer, answerIndex) => (
              <div key={answerIndex}>
                <input
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
                <input
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
            ))}
            <button
              onClick={() => addAnswer(index)}
              className={styles.smallButton}
            >
              Add Answer
            </button>
          </>
        );
      case 'Date':
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
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      {questions.map((question, index) => (
        <div key={index} className={styles.questionContainer}>
          <input
            type="text"
            placeholder="Question ID"
            value={question.ExtQuestionID}
            onChange={(e) =>
              handleQuestionChange(index, 'ExtQuestionID', e.target.value)
            }
            className={styles.questionInput}
          />
          <input
            type="text"
            placeholder="Question Text"
            value={question.QuestionText}
            onChange={(e) =>
              handleQuestionChange(index, 'QuestionText', e.target.value)
            }
            className={styles.questionInput}
          />
          <select
            className={styles.questionSelect}
            value={question.QuestionType}
            onChange={(e) =>
              handleQuestionChange(
                index,
                'QuestionType',
                e.target.value as QuestionType
              )
            }
          >
            <option value="">Select Type</option>
            <option value="Text">Text</option>
            <option value="TextArea">TextArea</option>
            <option value="MultiSelect">MultiSelect</option>
            <option value="SingleSelect">SingleSelect</option>
            <option value="Date">Date</option>
          </select>
          <div className={styles.additionalFields}>
            {getAdditionalFields(question.QuestionType, index)}
          </div>
        </div>
      ))}
      <button className={styles.addButton} onClick={addQuestion}>
        Add Question
      </button>
      <div>
        <h3>Generated JSON:</h3>
        <textarea value={jsonOutput} readOnly className={styles.jsonOutput} />
      </div>
    </div>
  );
};

export default DynamicQuestionnaire;

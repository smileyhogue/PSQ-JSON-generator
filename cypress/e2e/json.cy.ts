describe('confirm json is generated correctly', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000');
    cy.wait(500);
    cy.get('[data-cy="questionTextBox"]').type('Text');
    cy.wait(200);
    cy.get('#required-Text-0').check();
    cy.get(':nth-child(1) > .inline-flex').click();
    cy.wait(200);
    cy.get('[data-cy="questionTextBox"]').type('Text Area');
    cy.get('#questionType').click();
    cy.get('#qtTArea').click();
    cy.get('.hover\\:bg-accent').click();
    cy.wait(200);
    cy.get('[data-cy="questionTextBox"]').type('Multi Select');
    cy.get('#questionType').click();
    cy.get('#qtMSelect').click();
    cy.get('[data-cy="addAnswerButton"]').click();
    cy.wait(200);
    cy.get('[data-cy="answerTextBox0"]').type('a1');
    cy.wait(200);
    cy.get('[data-cy="addAnswerButton"]').click();
    cy.get('[data-cy="answerTextBox1"]').type('a2');
    cy.get(
      '.DynamicQuestionnaire_bottomButtonContainer__q40ec > :nth-child(1)'
    ).click();

    cy.get('.JsonViewModal_jsonOutput__nAOwR').should(
      'have.value',
      '[\n  {\n    "ExtQuestionID": "1",\n    "QuestionText": "Text",\n    "QuestionType": "Text",\n    "Order": 1,\n    "Required": true,\n    "Min": "",\n    "Max": "",\n    "Limit": 0,\n    "Format": ""\n  },\n  {\n    "ExtQuestionID": "2",\n    "QuestionText": "Text Area",\n    "QuestionType": "TextArea",\n    "Order": 2,\n    "Required": true,\n    "Min": "",\n    "Max": "",\n    "Limit": 0,\n    "Format": ""\n  },\n  {\n    "ExtQuestionID": "3",\n    "QuestionText": "Multi Select",\n    "QuestionType": "MultiSelect",\n    "Order": 3,\n    "Required": true,\n    "Min": "",\n    "Max": "",\n    "Limit": 0,\n    "Format": "",\n    "Answers": [\n      {\n        "ExtAnswerID": "1",\n        "AnswerText": "a1",\n        "Order": 1\n      },\n      {\n        "ExtAnswerID": "2",\n        "AnswerText": "a2",\n        "Order": 2\n      }\n    ]\n  }\n]'
    );
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('confirm order works properly', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000');
    cy.wait(500);
    cy.get('[data-cy="questionTextBox"]').type('1');
    cy.wait(200);
    cy.get('.hover\\:bg-accent').click();
    cy.wait(200);
    cy.get('[data-cy="questionTextBox"]').type('2');
    cy.wait(200);
    cy.get('.hover\\:bg-accent').click();
    cy.wait(200);
    cy.get('[data-cy="questionTextBox"]').type('3');
    cy.wait(200);
    cy.get('.hover\\:bg-accent').click();
    cy.wait(200);
    cy.get('[data-cy="questionTextBox"]').type('4');
    cy.wait(200);
    cy.get('.hover\\:bg-accent').click();
    cy.wait(200);
    cy.get('[data-cy="questionTextBox"]').type('5');
    cy.wait(200);
    cy.get('[data-cy="orderSelect"]').click();
    cy.get('[data-cy="orderSelect1"]').click();
    cy.wait(200);
    cy.get(
      '.DynamicQuestionnaire_bottomButtonContainer__q40ec > :nth-child(1)'
    ).click();
    cy.get('.JsonViewModal_jsonOutput__nAOwR').should(
      'have.value',
      '[\n  {\n    "ExtQuestionID": "1",\n    "QuestionText": "1",\n    "QuestionType": "Text",\n    "Order": 1,\n    "Required": true,\n    "Min": "",\n    "Max": "",\n    "Limit": 0,\n    "Format": ""\n  },\n  {\n    "ExtQuestionID": "5",\n    "QuestionText": "5",\n    "QuestionType": "Text",\n    "Order": 2,\n    "Required": true,\n    "Min": "",\n    "Max": "",\n    "Limit": 0,\n    "Format": ""\n  },\n  {\n    "ExtQuestionID": "2",\n    "QuestionText": "2",\n    "QuestionType": "Text",\n    "Order": 3,\n    "Required": true,\n    "Min": "",\n    "Max": "",\n    "Limit": 0,\n    "Format": ""\n  },\n  {\n    "ExtQuestionID": "3",\n    "QuestionText": "3",\n    "QuestionType": "Text",\n    "Order": 4,\n    "Required": true,\n    "Min": "",\n    "Max": "",\n    "Limit": 0,\n    "Format": ""\n  },\n  {\n    "ExtQuestionID": "4",\n    "QuestionText": "4",\n    "QuestionType": "Text",\n    "Order": 5,\n    "Required": true,\n    "Min": "",\n    "Max": "",\n    "Limit": 0,\n    "Format": ""\n  }\n]'
    );
  });
});

describe('Confirm conditional questions work and are added correctly', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/');
    cy.wait(500);
    cy.get('[data-cy="questionTextBox"]').type('test');
    cy.get('#questionType').click();
    cy.get('#qtSSelect').click();
    cy.get('[data-cy="addAnswerButton"]').click();
    cy.get('[data-cy="answerTextBox"]').type('Yes');
    cy.get('[data-cy="addAnswerButton"]').click();
    cy.wait(200);
    cy.get('[data-cy="answerTextBox"]').type('No');
    cy.get('[data-cy="addQuestionButton"]').click();
    cy.wait(200);
    cy.get('[data-cy="questionTextBox"]').type('test1');
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#conditional-1').check();
    cy.get(':nth-child(3) > select').select('1');
    cy.get(':nth-child(4) > :nth-child(3) > :nth-child(3)').select('1');
    /* ==== End Cypress Studio ==== */
    cy.get('[data-cy="viewJsonButton"]').click();
    /* ==== Generated with Cypress Studio ==== */

    cy.get('.JsonViewModal_jsonOutput__nAOwR').should(
      'have.value',
      '[\n  {\n    "ExtQuestionID": "1",\n    "QuestionText": "test",\n    "QuestionType": "SingleSelect",\n    "Order": 1,\n    "Required": true,\n    "Min": "",\n    "Max": "",\n    "Limit": 0,\n    "Format": "",\n    "Answers": [\n      {\n        "ExtAnswerID": "1",\n        "AnswerText": "Yes",\n        "Order": 1\n      },\n      {\n        "ExtAnswerID": "2",\n        "AnswerText": "No",\n        "Order": 2\n      }\n    ]\n  },\n  {\n    "ExtQuestionID": "2",\n    "QuestionText": "test1",\n    "QuestionType": "Text",\n    "Order": 2,\n    "Required": true,\n    "Min": "",\n    "Max": "",\n    "Limit": 0,\n    "Condition": {\n      "ExtQuestionID": "1",\n      "AnswerValue": "1"\n    },\n    "Format": ""\n  }\n]'
    );

    /* ==== End Cypress Studio ==== */
  });
});

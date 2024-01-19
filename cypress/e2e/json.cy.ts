describe('confirm json is generated correctly', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000');
    cy.wait(500);
    /* ==== Generated with Cypress Studio ==== */
    cy.get(':nth-child(2) > .flex').type('Text');
    cy.wait(200);
    cy.get('#required-Text-0').check();
    cy.get(':nth-child(1) > .inline-flex').click();
    cy.wait(200);
    cy.get(
      '.DynamicQuestionnaire_questionContainer__0b7gY > :nth-child(2) > .flex'
    ).type('Text Area');
    /* ==== End Cypress Studio ==== */
    cy.get('#questionType').click();
    cy.get('#qtTArea').click();
    /* ==== Generated with Cypress Studio ==== */
    cy.get('.hover\\:bg-accent').click();
    cy.wait(200);
    cy.get(
      '.DynamicQuestionnaire_questionContainer__0b7gY > :nth-child(2) > .flex'
    ).type('Multi Select');
    /* ==== End Cypress Studio ==== */
    cy.get('#questionType').click();
    cy.get('#qtMSelect').click();
    /* ==== Generated with Cypress Studio ==== */
    cy.get(':nth-child(4) > .inline-flex').click();
    cy.wait(200);
    cy.get('[placeholder="Answer Text"]').type('a1');
    cy.get(':nth-child(4) > .hover\\:bg-accent').click();
    cy.get(
      '#radix-\\:r23\\: > .pb-4 > div > [placeholder="Answer Text"]'
    ).click();
    cy.get('[placeholder="Answer Text"]').clear();
    cy.get('[placeholder="Answer Text"]').type('a2');
    cy.get(
      '.DynamicQuestionnaire_bottomButtonContainer__q40ec > :nth-child(1)'
    ).click();
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */

    cy.get('.JsonViewModal_jsonOutput__nAOwR').should(
      'have.value',
      '[\n  {\n    "ExtQuestionID": "1",\n    "QuestionText": "Text",\n    "QuestionType": "Text",\n    "Required": true,\n    "Min": "",\n    "Max": "",\n    "Limit": 0,\n    "Format": ""\n  },\n  {\n    "ExtQuestionID": "2",\n    "QuestionText": "Text Area",\n    "QuestionType": "TextArea",\n    "Required": false,\n    "Min": "",\n    "Max": "",\n    "Limit": 0,\n    "Format": ""\n  },\n  {\n    "ExtQuestionID": "3",\n    "QuestionText": "Multi Select",\n    "QuestionType": "MultiSelect",\n    "Required": false,\n    "Min": "",\n    "Max": "",\n    "Limit": 0,\n    "Format": "",\n    "Answers": [\n      {\n        "ExtAnswerID": "1",\n        "AnswerText": "a1"\n      },\n      {\n        "ExtAnswerID": "2",\n        "AnswerText": "a2"\n      }\n    ]\n  }\n]'
    );

    /* ==== End Cypress Studio ==== */
  });
});

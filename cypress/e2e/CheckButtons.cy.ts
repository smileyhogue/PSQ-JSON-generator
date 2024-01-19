describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/');
    /* ==== Generated with Cypress Studio ==== */
    cy.wait(500);
    cy.get('#radix-\\:r0\\: > span').should('have.text', 'Question 1');
    cy.get(':nth-child(2) > .flex').type('test');
    cy.wait(200);
    cy.get('#radix-\\:r0\\: > span').should('have.text', 'test');
    cy.wait(200);
    cy.get(':nth-child(1) > .inline-flex').click();
    cy.wait(200);
    cy.get(
      '.DynamicQuestionnaire_questionContainer__0b7gY > :nth-child(2) > .flex'
    ).type('test2');
    cy.wait(200);
    cy.get('#radix-\\:rd\\: > span').should('have.text', 'test2');
    cy.get('#radix-\\:rd\\: > .inline-flex').should('be.visible');
    cy.get('.hover\\:bg-accent').should('be.visible');
    cy.get(
      '.DynamicQuestionnaire_bottomButtonContainer__q40ec > :nth-child(1)'
    ).click();

    cy.get('.JsonViewModal_jsonOutput__nAOwR').should(
      'have.value',
      '[\n  {\n    "ExtQuestionID": "1",\n    "QuestionText": "test",\n    "QuestionType": "Text",\n    "Required": false,\n    "Min": "",\n    "Max": "",\n    "Limit": 0,\n    "Format": ""\n  },\n  {\n    "ExtQuestionID": "2",\n    "QuestionText": "test2",\n    "QuestionType": "Text",\n    "Required": false,\n    "Min": "",\n    "Max": "",\n    "Limit": 0,\n    "Format": ""\n  }\n]'
    );

    cy.get('.JsonViewModal_modal__JRlbi > .inline-flex').should('be.visible');
    cy.get('.JsonViewModal_closeButton__zuBVH').click();
    /* ==== End Cypress Studio ==== */
  });
});
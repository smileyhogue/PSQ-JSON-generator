describe('test fail toast', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/');
    /* ==== Generated with Cypress Studio ==== */
    cy.get(
      '.DynamicQuestionnaire_bottomButtonContainer__q40ec > :nth-child(1)'
    ).click();
    cy.get('.Toastify__toast-body > :nth-child(2)').should('be.visible');
    /* ==== End Cypress Studio ==== */
  });

  /* ==== Test Created with Cypress Studio ==== */
  it('test download success toast', function () {
    /* ==== Generated with Cypress Studio ==== */
    cy.visit('http://localhost:3000');
    cy.get('[data-cy="questionTextBox"]').type('test');
    cy.wait(100);
    cy.get(
      '.DynamicQuestionnaire_bottomButtonContainer__q40ec > :nth-child(2)'
    ).click();
    cy.get('#accountName').type('test');
    cy.get('#jobIdentification').select('All Jobs');
    cy.get('.ShareModal_submitButton__XKHAJ').click();
    cy.wait(100);
    cy.get('.Toastify__toast-body > :nth-child(2)').should('be.visible');
    /* ==== End Cypress Studio ==== */
  });
});

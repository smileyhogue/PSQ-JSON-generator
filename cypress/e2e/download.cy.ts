import path from 'path';

describe('confirm file gets downloaded and is the right size', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/');
    /* ==== Generated with Cypress Studio ==== */
    cy.get('[data-cy="questionTextBox"]').type('test');
    cy.get('[data-cy="genRequestButton"]').click();
    cy.get('#accountName').type('test');
    cy.get('#jobIdentification').select('All Jobs');
    cy.get('.ShareModal_submitButton__XKHAJ').click();
    /* ==== End Cypress Studio ==== */
    const downloadsFolder = Cypress.config('downloadsFolder');
    const downloadedFilename = path.join(downloadsFolder, 'test_data.zip');

    cy.readFile(downloadedFilename, 'binary', { timeout: 15000 }).should(
      (buffer: string | any[]) => expect(buffer.length).to.be.equal(679)
    );
  });
});

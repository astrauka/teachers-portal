describe('Public pages', () => {
  it('shows privacy policy', () => {
    cy.visit('privacy-policy').contains('h2', 'ASMENS DUOMENŲ TVARKYMO');
  });

  it('shows terms and conditions', () => {
    cy.visit('terms-and-conditions').contains('span', 'Kas yra slapukai?');
  });

  it('shows error screen', () => {
    cy.visit('error').contains('span', 'Report the problem');
  });
});

describe('Public pages', () => {
  it('shows privacy policy', () => {
    cy.visit('privacy-policy').contains('h2', 'ASMENS DUOMENŲ TVARKYMO');
  });

  it('shows terms and conditions', () => {
    cy.visit('site-terms-and-conditions').contains('h1', 'Site terms and conditions');
  });

  it('shows error screen', () => {
    cy.visit('error').contains('span', 'Report the problem');
  });
});

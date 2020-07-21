const TIMEOUT = 20000;

describe('Login', () => {
  it('Logs in via Google', () => {
    cy.visitSite('/')
      .contains('Please login', { timeout: TIMEOUT })
      .should('be.visible');
  });
});

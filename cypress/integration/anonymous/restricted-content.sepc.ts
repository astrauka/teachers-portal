describe.only('Restricted content', () => {
  it('shows login modal', () => {
    cy.visit('').contains('h1', 'Log In');
    cy.get('a').should('not.have.attr', 'href', '/blog');
  });
});

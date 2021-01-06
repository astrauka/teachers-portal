describe.only('Restricted content', () => {
  it('shows login modal', () => {
    cy.visit('').contains('span', 'Please login');
    cy.get('a').should('not.have.attr', 'href', '/blog');
  });

  context('page with crashing code', () => {
    const path = '/crashing-code';

    it('shows login page', () => {
      cy.visit(path).contains('span', 'Please login');
    });
  });
});

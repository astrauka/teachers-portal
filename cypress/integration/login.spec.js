var TIMEOUT = 20000;
describe('Login', function () {
    it('Logs in via Google', function () {
        cy.visitSite('/')
            .contains('Please login', { timeout: TIMEOUT })
            .should('be.visible');
    });
});

// load type definitions that come with Cypress module
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    visitSite(path: string, options?: Partial<VisitOptions>): Chainable<Window>;
  }
}

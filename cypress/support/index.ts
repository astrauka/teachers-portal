/// <reference types="cypress" />
// https://on.cypress.io/configuration

import { invokeTestApi, login } from './commands';
import 'cypress-file-upload';

declare global {
  namespace Cypress {
    interface Chainable {
      invokeTestApi: typeof invokeTestApi;
      login: typeof login;
    }
  }
}

Cypress.Commands.add('invokeTestApi', invokeTestApi);
Cypress.Commands.add('login', login);

Cypress.Cookies.defaults({ preserve: 'smSession' });

Cypress.on('uncaught:exception', (error: Error) => {
  console.error(error);
  return false;
});

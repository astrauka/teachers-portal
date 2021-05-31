// https://on.cypress.io/custom-commands

import { memoize } from 'lodash';

import { TEST_TEACHER_EMAIL } from '../../typescript/backend/universal/entities/test-teacher';

export const timeout = 20000;
const delay = 100;

export function getPassword(): string {
  return Cypress.env('PASSWORD');
}

export function invokeTestApi({
  path,
  body = {},
  method = 'POST',
}: {
  path: string;
  body?: Object;
  method?: string;
}) {
  cy.request({
    method,
    url: `/_functions-dev/${path}`,
    body,
    headers: { 'x-authorization': getPassword() },
  });
}

const loginWithEmail = memoize(() => {
  cy.visit('');
  cy.get('[data-testid=switchToEmailLink]').click();
  cy.get('[data-testid=emailAuth]').within(() => {
    cy.get('input[type=email]').type(TEST_TEACHER_EMAIL, {
      parseSpecialCharSequences: true,
      delay,
    });
    cy.get('input[id=input_input_passwordInput_SM_ROOT_COMP1]').type(getPassword(), {
      parseSpecialCharSequences: true,
      delay,
    });
    cy.get('[data-testid=submit]').click();
  });
});

export function login() {
  loginWithEmail();
}

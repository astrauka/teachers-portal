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

export function login() {
  cy.visit('');
  cy.getCookie('svSession').then((cookie) => {
    const svSession = cookie.value;
    cy.request({
      method: 'POST',
      url: '/_api/wix-sm-webapp/v1/auth/login',
      headers: { svSession },
      body: {
        email: TEST_TEACHER_EMAIL,
        password: getPassword(),
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      cy.setCookie('smSession', response.body.session.token);
    });
  });
}

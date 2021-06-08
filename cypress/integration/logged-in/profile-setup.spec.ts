import { TEST_TEACHER_INITIAL_FORM_DATA } from '../../../typescript/backend/universal/entities/test-teacher';
import { timeout } from '../../support/commands';

describe('Profile setup', () => {
  it.skip('invites a new teacher', () => {
    cy.invokeTestApi({ path: 'teachers_invite' });
  });

  it('redirects to initial form', () => {
    cy.invokeTestApi({ path: 'teachers_cleanFields' });
    cy.login();
    cy.visit('');
    cy.url({ timeout }).should('include', 'initial-form');
  });

  it('fills first step form', () => {
    cy.visit('initial-form');
    cy.contains('span', 'Let other teachers discover you in the portal', {
      timeout,
    }).click();
    cy.contains('span', "The 'phoneNumber' field length must be greater");
    cy.contains('span', 'Submit').parent().parent().should('have.attr', 'aria-disabled', 'true');
    const { phoneNumber, city } = TEST_TEACHER_INITIAL_FORM_DATA;
    cy.get('input[name="phone-number *"]').type(phoneNumber, { delay: 1 });
    cy.contains('option', 'Select your country').parent().select('Lithuania').trigger('change');
    cy.get('input[name="city-*"]').type(city, { delay: 1 });
    cy.contains('option', 'Select your language').parent().select('Lithuanian').trigger('change');
    cy.get('input[type=file').attachFile('images/profile-icon.jpg');
    cy.contains('span', 'Submit', { timeout })
      .parent()
      .parent()
      .should('have.attr', 'aria-disabled', 'false');
    cy.contains('span', 'Submit').click();
    cy.url({ timeout }).should('include', 'dashboard');
  });

  it('fills second step form', () => {});
});

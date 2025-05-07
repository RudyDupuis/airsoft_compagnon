const existingUser = {
  email: 'john.doe@example.com',
  password: 'Password123!',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1990-01-01',
  pseudo: 'Johnny',
  reputation: 4.5
}

const invalidUser = {
  firstName: 'John25!',
  lastName: 'Doe25!',
  pseudo: 'John25@',
  email: 'invalid@email',
  password: 'bad',
  dateOfBirth: '2020-01-01'
}

const newUser = {
  firstName: 'Johnny',
  lastName: 'Doeboy',
  dateOfBirth: '2000-01-01',
  pseudo: 'Johnny25'
}

const newPassword = 'Password1234!'
const badNewPassword = 'bad'

const errorMessages = {
  firstName:
    'First name must contain between 2 and 50 characters and can only include letters, spaces, hyphens and apostrophes.',
  lastName:
    'Last name must contain between 2 and 50 characters and can only include letters, spaces, hyphens and apostrophes.',
  pseudo:
    'Username must contain between 3 and 20 characters and can only include letters, numbers, hyphens (-) and underscores (_).',
  dateOfBirth: 'You must be at least 18 years old to register.',
  email: 'Please enter a valid email address.',
  emailAlreadyUsed: 'This email is already in use',
  password:
    "Password must contain at least 8 characters, include a lowercase letter, an uppercase letter, a number and a special character (among '$ ! % * ? &').",
  passwordsDoNotMatch: 'Passwords do not match.',
  invalidOldPassword: 'Old password is incorrect.',
  rulesNotRespected: 'All rules must be followed.'
}

describe('As a user, I want to handle my account', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.getBySel('form').should('exist')

    cy.getBySel('text-input-email').should('exist').type(existingUser.email)
    cy.getBySel('text-input-password').should('exist').type(existingUser.password)

    cy.getBySel('form-submit-button').click()

    cy.url().should('eq', `${Cypress.config().baseUrl}/dashboard`)
    cy.getBySel('header-me-link').click()
    cy.url().should('eq', `${Cypress.config().baseUrl}/me`)
  })

  it('should be able to see my account', () => {
    cy.getBySel('me-pseudo').contains(existingUser.pseudo)
    cy.getBySel('me-reputation').contains(`${existingUser.reputation} / 5`)
  })

  it('should be able to update my account', () => {
    cy.intercept('PUT', '/api/auth/me').as('editMeRequest')

    cy.getBySel('me-edit-account').click()

    cy.getBySel('form').should('exist')
    cy.getBySel('text-input-first-name').invoke('val').should('eq', existingUser.firstName)
    cy.getBySel('text-input-first-name').clear().type(newUser.firstName)
    cy.getBySel('text-input-last-name').invoke('val').should('eq', existingUser.lastName)
    cy.getBySel('text-input-last-name').clear().type(newUser.lastName)
    cy.getBySel('text-input-pseudo').invoke('val').should('eq', existingUser.pseudo)
    cy.getBySel('text-input-pseudo').clear().type(newUser.pseudo)
    cy.getBySel('text-input-date-of-birth').invoke('val').should('eq', existingUser.dateOfBirth)
    cy.getBySel('text-input-date-of-birth').clear().type(newUser.dateOfBirth)
    cy.getBySel('text-input-email').invoke('val').should('eq', existingUser.email)
    cy.getBySel('form-submit-button').click()

    cy.wait('@editMeRequest')

    cy.getBySel('me-edit-account').click()

    cy.getBySel('text-input-first-name').invoke('val').should('eq', newUser.firstName)
    cy.getBySel('text-input-last-name').invoke('val').should('eq', newUser.lastName)
    cy.getBySel('text-input-pseudo').invoke('val').should('eq', newUser.pseudo)
    cy.getBySel('text-input-date-of-birth').invoke('val').should('eq', newUser.dateOfBirth)
    cy.getBySel('text-input-email').invoke('val').should('eq', existingUser.email)
  })

  it('should show errors when edit account fiels are wrong', () => {
    cy.intercept('PUT', '/api/auth/me').as('editMeRequest')

    cy.getBySel('me-edit-account').click()

    cy.getBySel('form').should('exist')
    cy.getBySel('text-input-first-name').clear().type(invalidUser.firstName)
    cy.getBySel('text-input-last-name').clear().type(invalidUser.lastName)
    cy.getBySel('text-input-pseudo').clear().type(invalidUser.pseudo)
    cy.getBySel('text-input-date-of-birth').clear().type(invalidUser.dateOfBirth)
    cy.getBySel('text-input-email').clear().type(invalidUser.email)

    cy.getBySel('form-submit-button').click()

    cy.wait('@editMeRequest')

    cy.getBySel('text-input-first-name-error').should('contain', errorMessages.firstName)
    cy.getBySel('text-input-last-name-error').should('contain', errorMessages.lastName)
    cy.getBySel('text-input-pseudo-error').should('contain', errorMessages.pseudo)
    cy.getBySel('text-input-date-of-birth-error').should('contain', errorMessages.dateOfBirth)
    cy.getBySel('text-input-email-error').should('contain', errorMessages.email)

    cy.getBySel('form-error').should('contain', errorMessages.rulesNotRespected)
  })

  it('should be able to log out', () => {
    cy.getBySel('me-logout').click()

    cy.url().should('eq', `${Cypress.config().baseUrl}/`)
  })

  it('Should show errors when edit password fiels are wrong', () => {
    cy.intercept('PUT', '/api/auth/me/password').as('editPasswordMeRequest')

    cy.getBySel('me-edit-password').click()

    cy.getBySel('form').should('exist')
    cy.getBySel('text-input-old-password').type(existingUser.password)
    cy.getBySel('text-input-new-password').type(badNewPassword)
    cy.getBySel('text-input-confirm-new-password').type(existingUser.password)
    cy.getBySel('form-submit-button').click()

    cy.getBySel('form-error').should('contain', errorMessages.passwordsDoNotMatch)

    cy.getBySel('text-input-confirm-new-password').clear().type(badNewPassword)
    cy.getBySel('form-submit-button').click()

    cy.wait('@editPasswordMeRequest')

    cy.getBySel('text-input-new-password').should('contain', errorMessages.password)
    cy.getBySel('text-input-confirm-new-password').should('contain', errorMessages.password)
    cy.getBySel('form-error').should('contain', errorMessages.rulesNotRespected)
  })

  it('Should show error when old password is wrong', () => {
    cy.intercept('PUT', '/api/auth/me/password').as('editPasswordMeRequest')

    cy.getBySel('me-edit-password').click()

    cy.getBySel('form').should('exist')
    cy.getBySel('text-input-old-password').type(newPassword)
    cy.getBySel('text-input-new-password').type(newPassword)
    cy.getBySel('text-input-confirm-new-password').type(newPassword)
    cy.getBySel('form-submit-button').click()

    cy.wait('@editPasswordMeRequest')

    cy.getBySel('form-error').should('contain', errorMessages.invalidOldPassword)
  })

  it('should be able to update my password', () => {
    cy.intercept('PUT', '/api/auth/me/password').as('editPasswordMeRequest')

    cy.getBySel('me-edit-password').click()

    cy.getBySel('form').should('exist')
    cy.getBySel('text-input-old-password').type(existingUser.password)
    cy.getBySel('text-input-new-password').type(newPassword)
    cy.getBySel('text-input-confirm-new-password').type(newPassword)
    cy.getBySel('form-submit-button').click()

    cy.wait('@editPasswordMeRequest')

    cy.getBySel('me-logout').click()

    cy.getBySel('header-login-link').click()

    cy.getBySel('form').should('exist')

    cy.getBySel('text-input-email').should('exist').type(existingUser.email)
    cy.getBySel('text-input-password').should('exist').type(newPassword)
    cy.getBySel('form-submit-button').click()

    cy.url().should('eq', `${Cypress.config().baseUrl}/dashboard`)
  })
})

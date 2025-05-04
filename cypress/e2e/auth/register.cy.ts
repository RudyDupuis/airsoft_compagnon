const newUser = {
  firstName: 'John',
  lastName: 'Doe',
  pseudo: 'John25',
  email: 'john.doe25@example.com',
  password: 'Password123!',
  dateOfBirth: '2000-01-01'
}

const mailAlreadyUsed = 'john.doe@example.com'

const invalidUser: typeof newUser = {
  firstName: 'John25!',
  lastName: 'Doe25!',
  pseudo: 'John25@',
  email: 'invalid@email',
  password: 'bad',
  dateOfBirth: '2020-01-01'
}

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
  rulesNotRespected: 'All rules must be followed.'
}

function fillForm(formData: typeof newUser & { confirmPassword?: string }) {
  cy.getBySel('form').should('be.visible')

  cy.getBySel('text-input-first-name').should('be.visible').type(formData.firstName)
  cy.getBySel('text-input-last-name').should('be.visible').type(formData.lastName)
  cy.getBySel('text-input-pseudo').should('be.visible').type(formData.pseudo)
  cy.getBySel('text-input-date-of-birth').should('be.visible').type(formData.dateOfBirth)
  cy.getBySel('text-input-email').should('be.visible').type(formData.email)
  cy.getBySel('text-input-password').should('be.visible').type(formData.password)
  cy.getBySel('text-input-confirm-password')
    .should('be.visible')
    .type(formData.confirmPassword || formData.password)
}

describe('As a user, I want to register', () => {
  beforeEach(() => {
    cy.visit('/register')
    cy.intercept('POST', '/api/auth/register').as('registerRequest')
  })

  it('should navigate to login page when clicking login link', () => {
    cy.getBySel('login-link').click()
    cy.url().should('eq', `${Cypress.config().baseUrl}/login`)
  })

  it('should show error when passwords do not match', () => {
    fillForm({ ...newUser, confirmPassword: 'differentpassword' })

    cy.getBySel('form-submit-button').click()
    cy.getBySel('form-error').should('contain', errorMessages.passwordsDoNotMatch)
  })

  it('should show error when first name is invalid', () => {
    fillForm({
      ...newUser,
      firstName: invalidUser.firstName
    })

    cy.getBySel('text-input-first-name-error').should('contain', errorMessages.firstName)

    cy.getBySel('form-submit-button').click()
    cy.wait('@registerRequest')
    cy.getBySel('form-error').should('contain', errorMessages.rulesNotRespected)
  })

  it('should show error when last name is invalid', () => {
    fillForm({
      ...newUser,
      lastName: invalidUser.lastName
    })

    cy.getBySel('text-input-last-name-error').should('contain', errorMessages.lastName)

    cy.getBySel('form-submit-button').click()
    cy.wait('@registerRequest')
    cy.getBySel('form-error').should('contain', errorMessages.rulesNotRespected)
  })

  it('should show error when pseudo is invalid', () => {
    fillForm({
      ...newUser,
      pseudo: invalidUser.pseudo
    })

    cy.getBySel('text-input-pseudo-error').should('contain', errorMessages.pseudo)

    cy.getBySel('form-submit-button').click()
    cy.wait('@registerRequest')
    cy.getBySel('form-error').should('contain', errorMessages.rulesNotRespected)
  })

  it('should show error when user is not legal age', () => {
    fillForm({
      ...newUser,
      dateOfBirth: invalidUser.dateOfBirth
    })

    cy.getBySel('text-input-date-of-birth-error').should('contain', errorMessages.dateOfBirth)

    cy.getBySel('form-submit-button').click()
    cy.wait('@registerRequest')
    cy.getBySel('form-error').should('contain', errorMessages.rulesNotRespected)
  })

  it('should show error when email is invalid', () => {
    fillForm({
      ...newUser,
      email: invalidUser.email
    })

    cy.getBySel('text-input-email-error').should('contain', errorMessages.email)

    cy.getBySel('form-submit-button').click()
    cy.wait('@registerRequest')
    cy.getBySel('form-error').should('contain', errorMessages.rulesNotRespected)
  })

  it('should show error when password is invalid', () => {
    fillForm({
      ...newUser,
      password: invalidUser.password
    })

    cy.getBySel('text-input-password-error').should('contain', errorMessages.password)

    cy.getBySel('form-submit-button').click()
    cy.wait('@registerRequest')
    cy.getBySel('form-error').should('contain', errorMessages.rulesNotRespected)
  })

  it('should register successfully and redirect to dashboard', () => {
    fillForm(newUser)

    cy.getBySel('text-input-first-name-error').should('not.exist')
    cy.getBySel('text-input-last-name-error').should('not.exist')
    cy.getBySel('text-input-pseudo-error').should('not.exist')
    cy.getBySel('text-input-date-of-birth-error').should('not.exist')
    cy.getBySel('text-input-email-error').should('not.exist')
    cy.getBySel('text-input-password-error').should('not.exist')
    cy.getBySel('text-input-confirm-password-error').should('not.exist')

    cy.getBySel('form-submit-button').click()
    cy.wait('@registerRequest')
    cy.url().should('eq', `${Cypress.config().baseUrl}/dashboard`)
    cy.getBySel('header-user-pseudo').should('contain', newUser.pseudo)
  })

  it('should show error when email is already used', () => {
    fillForm({ ...newUser, email: mailAlreadyUsed })

    cy.getBySel('form-submit-button').click()
    cy.wait('@registerRequest')
    cy.getBySel('form-error').should('contain', errorMessages.emailAlreadyUsed)
  })
})

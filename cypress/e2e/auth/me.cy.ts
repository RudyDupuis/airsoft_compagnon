const existingUser = {
  email: 'john.doe@example.com',
  password: 'Password123!',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1990-01-01',
  pseudo: 'Johnny',
  reputation: 4.5
}

const newUser = {
  firstName: 'Johnny',
  lastName: 'Doeboy',
  dateOfBirth: '2000-01-01',
  pseudo: 'Johnny25'
}

const newPassword = 'password1234!'

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
    cy.getBySel('text-input-first-name')
      .contains(existingUser.firstName)
      .clear()
      .type(newUser.firstName)
    cy.getBySel('text-input-last-name')
      .contains(existingUser.lastName)
      .clear()
      .type(newUser.lastName)
    cy.getBySel('text-input-pseudo').contains(existingUser.pseudo).clear().type(newUser.pseudo)
    cy.getBySel('text-input-date-of-birth')
      .contains(existingUser.dateOfBirth)
      .clear()
      .type(newUser.dateOfBirth)
    cy.getBySel('text-input-email').contains(existingUser.email)
    cy.getBySel('form-submit-button').click()

    cy.wait('@editMeRequest')

    cy.getBySel('me-edit-account').click()

    cy.getBySel('text-input-first-name').contains(newUser.firstName)
    cy.getBySel('text-input-last-name').contains(newUser.lastName)
    cy.getBySel('text-input-pseudo').contains(newUser.pseudo)
    cy.getBySel('text-input-date-of-birth').contains(newUser.dateOfBirth)
    cy.getBySel('text-input-email').contains(existingUser.email)
  })

  it('should be able to log out', () => {
    cy.getBySel('me-logout').click()

    cy.url().should('eq', `${Cypress.config().baseUrl}/dashboard`) //TODO: Redirect to home page
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

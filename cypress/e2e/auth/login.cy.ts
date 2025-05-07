const userAlreadyCreated = {
  email: 'john.doe@example.com',
  password: 'Password123!',
  dateOfBirth: new Date('1990-01-01'),
  firstName: 'John',
  lastName: 'Doe',
  pseudo: 'Johnny'
}

const invalidCredentials = {
  email: 'bad@email.com',
  password: 'badpassword'
}

const errorMessages = {
  invalidCredentials: 'Invalid email or password.'
}

describe('As a user, I want to login', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.intercept('POST', '/api/auth/login').as('loginRequest')
  })

  it('should navigate to register page when clicking register link', () => {
    cy.getBySel('register-link').click()
    cy.url().should('eq', `${Cypress.config().baseUrl}/register`)
  })

  it('should login successfully and redirect to dashboard', () => {
    cy.getBySel('form').should('be.visible')

    cy.getBySel('text-input-email').should('be.visible').type(userAlreadyCreated.email)
    cy.getBySel('text-input-password').should('be.visible').type(userAlreadyCreated.password)

    cy.getBySel('form-submit-button').click()

    cy.wait('@loginRequest')

    cy.url().should('eq', `${Cypress.config().baseUrl}/dashboard`)
    cy.getBySel('header-user-pseudo').should('contain', userAlreadyCreated.pseudo)
  })

  it('should show error when credentials are invalid', () => {
    cy.getBySel('text-input-email').should('be.visible').type(invalidCredentials.email)
    cy.getBySel('text-input-password').should('be.visible').type(invalidCredentials.password)

    cy.getBySel('form-submit-button').click()

    cy.wait('@loginRequest')

    cy.getBySel('form-error').should('contain', errorMessages.invalidCredentials)
  })
})

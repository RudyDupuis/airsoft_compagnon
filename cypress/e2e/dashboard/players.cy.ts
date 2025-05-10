const user = {
  email: 'alice.smith@example.com',
  password: 'Password123!'
}

const userCard = {
  pseudo: 'Alice85',
  reputation: 'Not rated',
  id: 'ID: 3',
  memberSince: 'Member since 01/01/2025',
  gamesPlayed: '20 games played'
}

const userCardAdmin = {
  email: 'Email: john.doe@example.com',
  dateOfBirth: 'Date of birth: 01/01/1990',
  firstName: 'First name: John',
  lastName: 'Last name: Doe'
}

const admin = {
  email: 'rudy.dupuis@airsoft-compagnon.com',
  password: 'Password123!'
}

describe('As a user, I want to find players', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.getBySel('form').should('exist')

    cy.getBySel('text-input-email').should('exist').type(user.email)
    cy.getBySel('text-input-password').should('exist').type(user.password)

    cy.getBySel('form-submit-button').click()

    cy.url().should('eq', `${Cypress.config().baseUrl}/dashboard/games`)
    cy.getBySel('players-tab').click()
    cy.url().should('eq', `${Cypress.config().baseUrl}/dashboard/players`)
  })

  it('should be able to see all players', () => {
    cy.getBySel('player-list-item-1').should('exist')
    cy.getBySel('player-list-item-2').should('exist')
    cy.getBySel('player-list-item-3').should('exist')
    cy.getBySel('player-list-item-4').should('exist')
    cy.getBySel('player-list-item-5').should('exist')
  })

  it('should be able to search for a player', () => {
    cy.getBySel('player-search-input').should('exist').type('Alice')
    cy.getBySel('player-list-item-1').should('not.exist')
    cy.getBySel('player-list-item-2').should('not.exist')
    cy.getBySel('player-list-item-3').should('exist')
    cy.getBySel('player-list-item-4').should('not.exist')
    cy.getBySel('player-list-item-5').should('not.exist')
  })

  it('should be able to see player details', () => {
    cy.getBySel('player-list-item-1').click()
    cy.getBySel('user-card-pseudo').contains(userCard.pseudo)
    cy.getBySel('user-card-reputation').contains(userCard.reputation)
    cy.getBySel('user-card-id').contains(userCard.id)
    cy.getBySel('user-card-member-since').contains(userCard.memberSince)
    cy.getBySel('user-card-games-played').contains(userCard.gamesPlayed)
  })
})
describe('As an admin, I want to handle players', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.getBySel('form').should('exist')

    cy.getBySel('text-input-email').should('exist').type(admin.email)
    cy.getBySel('text-input-password').should('exist').type(admin.password)

    cy.getBySel('form-submit-button').click()

    cy.url().should('eq', `${Cypress.config().baseUrl}/dashboard/games`)
    cy.getBySel('players-tab').click()
    cy.url().should('eq', `${Cypress.config().baseUrl}/dashboard/players`)
  })

  it('should be able to see player critical details', () => {
    cy.getBySel('player-list-item-1').click()
    cy.getBySel('admin-user-email').contains(userCardAdmin.email)
    cy.getBySel('admin-user-date-of-birth').contains(userCardAdmin.dateOfBirth)
    cy.getBySel('admin-user-first-name').contains(userCardAdmin.firstName)
    cy.getBySel('admin-user-last-name').contains(userCardAdmin.lastName)

    cy.getBySel('admin-user-is-admin-xmark').should('exist')
    cy.getBySel('admin-user-is-verified-check').should('exist')
    cy.getBySel('admin-user-is-banned-xmark').should('exist')
  })

  it('should be able to verify player', () => {
    cy.getBySel('player-list-item-1').click()
    cy.getBySel('admin-user-is-verified-check').should('exist')
    cy.getBySel('admin-user-verify-button').click()
    cy.getBySel('admin-user-is-unverified-check').should('exist')
    cy.getBySel('admin-user-verify-button').click()
    cy.getBySel('admin-user-is-verified-check').should('exist')
  })

  it('should be able to ban player', () => {
    cy.getBySel('player-list-item-1').click()
    cy.getBySel('admin-user-is-banned-xmark').should('exist')
    cy.getBySel('admin-user-ban-button').click()
    cy.getBySel('admin-user-is-unbanned-check').should('exist')
    cy.getBySel('admin-user-ban-button').click()
    cy.getBySel('admin-user-is-banned-xmark').should('exist')
  })
})

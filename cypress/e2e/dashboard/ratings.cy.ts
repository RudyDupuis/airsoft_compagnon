const user = {
  email: 'alice.smith@example.com',
  password: 'Password123!'
}

const rating = {
  id: 11,
  gameTitle: 'Retour aux sources',
  toUserPseudo: 'Johnny',
  toUserReputation: '4.0'
}

describe('As a user, I want to rate other players after end game', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.getBySel('form').should('exist')

    cy.getBySel('text-input-email').should('exist').type(user.email)
    cy.getBySel('text-input-password').should('exist').type(user.password)

    cy.getBySel('form-submit-button').click()

    cy.url().should('eq', `${Cypress.config().baseUrl}/`)
  })

  it('should process finished games and allow rating', () => {
    cy.request({
      method: 'POST',
      url: '/api/cron/process-finished-games?key=f62c6b3ad917483a979ece313fab0339'
    }).then((response) => {
      expect(response.body).to.contain(
        '🏅 Processed games with IDs: [8]; Created ratings with IDs: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]'
      )
    })
  })

  it('should see notification for rating', () => {
    cy.intercept('GET', '/api/notifications').as('notificationRequest')
    cy.wait('@notificationRequest')

    cy.getBySel('header-notification-button').should('exist')
    cy.getBySel('header-notification-count').should('contain', '1')
    cy.getBySel('header-notification-button').click()
    cy.getBySel('header-notification-modal').should('exist')
    cy.getBySel('header-notification-modal-message-1').should(
      'contain',
      "La partie 'Retour aux sources' est terminée."
    )
    cy.getBySel('header-notification-modal-link-1').click()
    cy.url().should('eq', `${Cypress.config().baseUrl}/rate-participants`)
  })

  it('should rate players', () => {
    cy.intercept('PUT', `/api/ratings/${rating.id}`).as('rateRequest')

    cy.visit('/rate-participants')
    cy.getBySel('rating-form-card-11').should('exist')
    cy.getBySel('rating-form-card-12').should('exist')
    cy.getBySel('rating-form-card-13').should('exist')

    cy.getBySel('rating-form-card-title-11').should('contain', rating.gameTitle)
    cy.getBySel('user-list-pseudo-rating-form-card-11').should('contain', rating.toUserPseudo)
    cy.getBySel('user-list-reputation-rating-form-card-11').should(
      'contain',
      `${rating.toUserReputation} / 5`
    )
    cy.getBySel('radio-button-0-rating-form-card-11').click()
    cy.getBySel('rating-form-card-11-submit-button').click()

    cy.wait('@rateRequest')

    cy.getBySel('rating-form-card-11').should('not.exist')
    cy.getBySel('header-logo').click()
    cy.getBySel('players-tab').click()
    cy.getBySel('user-list-reputation-player-1').should('contain', `2.0 / 5`)
  })

  it('should rate all players', () => {
    cy.visit('/rate-participants')
    cy.getBySel('rating-form-card-12-submit-button').click()
    cy.getBySel('rating-form-card-13-submit-button').click()
    cy.getBySel('no-ratings').should('exist')
  })

  it('should not see notification if there are no more players to rate', () => {
    cy.intercept('GET', '/api/notifications').as('notificationRequest')
    cy.wait('@notificationRequest')

    cy.getBySel('header-notification-count').should('contain', '0')
  })
})

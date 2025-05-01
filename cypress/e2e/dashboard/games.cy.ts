const verifiedUser = {
  email: 'john.doe@example.com',
  password: 'password123!'
}

const UnverifiedUser = {
  email: 'jane.doe@example.com',
  password: 'password123!'
}

const gameAlreadyAdded = {
  name: 'Opération Forêt Noire',
  description:
    "Partie tactique en forêt avec objectifs multiples. Venez avec votre équipement complet et prêt pour 6h d'action.",
  startDateTime: new Date('2025-05-10T09:00:00').toLocaleString(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }),
  endDateTime: new Date('2025-05-10T15:00:00').toLocaleString(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }),
  gameType: 'OP',
  address: 'Route Forestière, 67000 Strasbourg, France',
  allowedConsumables:
    'BBs biodégradables uniquement. Grenades fumigènes autorisées. Pas de grenades à fragmentation.',
  price: 25.5,
  privacyType: 'Public',
  maxPlayers: 40
}

describe('As a unverified user, I want to handle games', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.getBySel('form').should('be.visible')

    cy.getBySel('text-input-email').should('be.visible').type(UnverifiedUser.email)
    cy.getBySel('text-input-password').should('be.visible').type(UnverifiedUser.password)

    cy.getBySel('form-submit-button').click()

    cy.wait('@loginRequest')

    cy.url().should('eq', `${Cypress.config().baseUrl}/dashboard`)
  })

  it('should not see the button to add a game', () => {
    cy.getBySel('open-add-panel').should('not.exist')
  })

  it('should find a game', () => {
    cy.getBySel('marker-map-1').should('exist')
    cy.getBySel('marker-map-2').should('exist')
    cy.getBySel('marker-map-3').should('exist')
    cy.getBySel('marker-map-4').should('exist')
    cy.getBySel('marker-map-5').should('exist')
    cy.getBySel('marker-map-6').should('exist')
    cy.getBySel('marker-map-7').should('exist')
    cy.getBySel('marker-map-8').should('exist')
    cy.getBySel('marker-map-1').click()
    cy.getBySel('game-infos-panel').should('exist')
    cy.getBySel('game-infos-panel-name').should('contain', gameAlreadyAdded.name)
    cy.getBySel('game-infos-panel-type').should(
      'contain',
      `${gameAlreadyAdded.gameType} - ${gameAlreadyAdded.privacyType}`
    )
    cy.getBySel('game-infos-panel-price').should('contain', gameAlreadyAdded.price)
    cy.getBySel('game-infos-panel-dates').should('contain', gameAlreadyAdded.startDateTime)
    cy.getBySel('game-infos-panel-dates').should('contain', gameAlreadyAdded.endDateTime)
    cy.getBySel('game-infos-panel-max-players').should(
      'contain',
      `0 / ${gameAlreadyAdded.maxPlayers}`
    )
    cy.getBySel('game-infos-panel-address').should('contain', gameAlreadyAdded.address)
    cy.getBySel('game-infos-panel-has-amenities').should('exist')
    cy.getBySel('game-infos-panel-has-parking').should('exist')
    cy.getBySel('game-infos-panel-has-equipement-rental').should('exist')
    cy.getBySel('game-infos-panel-description').should('contain', gameAlreadyAdded.description)
    cy.getBySel('game-infos-panel-allowed-consumables').should(
      'contain',
      gameAlreadyAdded.allowedConsumables
    )
  })
})

describe('As a verified user, I want to handle games', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.getBySel('form').should('be.visible')

    cy.getBySel('text-input-email').should('be.visible').type(verifiedUser.email)
    cy.getBySel('text-input-password').should('be.visible').type(verifiedUser.password)

    cy.getBySel('form-submit-button').click()

    cy.wait('@loginRequest')

    cy.url().should('eq', `${Cypress.config().baseUrl}/dashboard`)
  })

  it('should see the button to add a game', () => {
    cy.getBySel('open-add-panel').should('exist')
  })
})

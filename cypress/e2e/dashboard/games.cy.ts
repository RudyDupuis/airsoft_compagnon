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

const game = {
  name: 'Embuscade Nocturne',
  description:
    "Partie nocturne avec scénario d'infiltration. Équipement infrarouge recommandé. Objectifs spéciaux annoncés sur place.",
  startDateTime: new Date('2025-06-15T21:00:00').toLocaleString(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }),
  endDateTime: new Date('2025-06-16T03:00:00').toLocaleString(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }),
  gameType: 'MilSim',
  address: 'Terrain Echo, 33610 Cestas, France',
  allowedConsumables:
    'BBs biodégradables obligatoires. Bâtons lumineux autorisés. Grenades sonores limitées à 2 par joueur.',
  price: 35.0,
  validationType: 'Manual',
  hasAmenities: true,
  hasParking: false,
  hasEquipementRental: true,
  privacyType: 'Private',
  maxPlayers: 30
}

describe('As a unverified user, I want to handle games', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.getBySel('form').should('exist')

    cy.getBySel('text-input-email').should('exist').type(UnverifiedUser.email)
    cy.getBySel('text-input-password').should('exist').type(UnverifiedUser.password)

    cy.getBySel('form-submit-button').click()

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
    cy.getBySel('marker-map-1').click()
    cy.getBySel('game-infos-panel').should('exist')
    cy.getBySel('game-infos-panel-name').should('contain', gameAlreadyAdded.name)
    cy.getBySel('game-infos-panel-types').should('contain', gameAlreadyAdded.gameType)
    cy.getBySel('game-infos-panel-types').should('contain', gameAlreadyAdded.privacyType)
    cy.getBySel('game-infos-panel-price').should('contain', gameAlreadyAdded.price)
    cy.getBySel('game-infos-panel-dates').should('contain', gameAlreadyAdded.startDateTime)
    cy.getBySel('game-infos-panel-dates').should('contain', gameAlreadyAdded.endDateTime)
    cy.getBySel('game-infos-panel-max-players').should('contain', gameAlreadyAdded.maxPlayers)
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

function fillGameForm(formData: typeof game) {
  cy.getBySel('form').should('exist')

  cy.getBySel('text-input-game-name').should('exist').type(formData.name)
  cy.getBySel('text-input-game-description').should('exist').type(formData.description)
  cy.getBySel('text-input-game-start-date').should('exist').type(formData.startDateTime)
  cy.getBySel('text-input-game-end-date').should('exist').type(formData.endDateTime)
  cy.getBySel('select-input-game-type').should('exist').click()
  cy.getBySel(`select-input-game-type-${formData.gameType}`).click()
  cy.getBySel('text-input-game-address').should('exist').type(formData.address)
  cy.getBySel('text-input-game-allowed-consumables')
    .should('exist')
    .type(formData.allowedConsumables)
  cy.getBySel('text-input-game-price').should('exist').type(formData.price.toString())
  cy.getBySel('select-input-game-validation-type').should('exist').click()
  cy.getBySel(`select-input-game-validation-type-${formData.validationType}`).click()
  if (formData.hasAmenities) {
    cy.getBySel('checkbox-game-has-amenities').click()
  }
  if (formData.hasParking) {
    cy.getBySel('checkbox-game-has-parking').click()
  }
  if (formData.hasEquipementRental) {
    cy.getBySel('checkbox-game-has-equipement-rental').click()
  }
  cy.getBySel('select-input-game-privacy-type').should('exist').click()
  cy.getBySel(`select-input-game-privacy-type-${formData.privacyType}`).click()
  cy.getBySel('text-input-game-max-players').should('exist').type(formData.maxPlayers.toString())
}

describe('As a verified user, I want to handle games', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.getBySel('form').should('exist')

    cy.getBySel('text-input-email').should('exist').type(verifiedUser.email)
    cy.getBySel('text-input-password').should('exist').type(verifiedUser.password)

    cy.getBySel('form-submit-button').click()

    cy.url().should('eq', `${Cypress.config().baseUrl}/dashboard`)

    cy.intercept('POST', '/api/games/create').as('createGameRequest')
  })

  it('should see the button to add a game', () => {
    cy.getBySel('open-add-panel').should('exist')
  })

  it('should add a game', () => {
    cy.getBySel('open-add-panel').click()
    fillGameForm(game)

    cy.getBySel('form-submit-button').click()
    cy.wait('@createGameRequest')

    cy.getBySel('marker-map-8').should('exist').click()
    cy.getBySel('game-infos-panel').should('exist')
    cy.getBySel('game-infos-panel-name').should('contain', game.name)
    cy.getBySel('game-infos-panel-types').should('contain', game.gameType)
    cy.getBySel('game-infos-panel-types').should('contain', game.privacyType)
    cy.getBySel('game-infos-panel-price').should('contain', game.price)
    cy.getBySel('game-infos-panel-dates').should('contain', game.startDateTime)
    cy.getBySel('game-infos-panel-dates').should('contain', game.endDateTime)
    cy.getBySel('game-infos-panel-max-players').should('contain', game.maxPlayers)
    cy.getBySel('game-infos-panel-address').should('contain', game.address)
    cy.getBySel('game-infos-panel-has-amenities').should('exist')
    cy.getBySel('game-infos-panel-has-parking').should('not.exist')
    cy.getBySel('game-infos-panel-has-equipement-rental').should('exist')
    cy.getBySel('game-infos-panel-description').should('contain', game.description)
    cy.getBySel('game-infos-panel-allowed-consumables').should('contain', game.allowedConsumables)
  })
})

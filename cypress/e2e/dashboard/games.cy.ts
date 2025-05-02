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
  startDateTime: new Date('2060-06-15T21:00:00').toLocaleString(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }),
  startDateTimeToType: '2060-06-15T21:00:00',
  endDateTime: new Date('2060-06-16T03:00:00').toLocaleString(undefined, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }),
  endDateTimeToType: '2060-06-16T03:00:00',
  gameType: 'OP',
  gameTypeToSelect: 'op',
  address: 'Terrain Echo, 33610 Cestas, France',
  allowedConsumables:
    'BBs biodégradables obligatoires. Bâtons lumineux autorisés. Grenades sonores limitées à 2 par joueur.',
  price: 35.0,
  validationType: 'Manual',
  validationTypeToSelect: 'manual',
  hasAmenities: true,
  hasParking: false,
  hasequipmentRental: true,
  privacyType: 'Private',
  privacyTypeToSelect: 'private',
  maxPlayers: 30
}

const errorMessages = {
  invalidName:
    'The name must be between 2 and 50 characters long and can only include letters, spaces, hyphens, and apostrophes.',
  invalidDateTime: 'The game cannot be scheduled in the past.',
  startDateAfterEndDate: 'The start date must be before the end date.',
  rulesNotRespected: 'All rules must be respected.'
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
    cy.getBySel('game-infos-panel-has-equipment-rental').should('exist')
    cy.getBySel('game-infos-panel-description').should('contain', gameAlreadyAdded.description)
    cy.getBySel('game-infos-panel-allowed-consumables').should(
      'contain',
      gameAlreadyAdded.allowedConsumables
    )
  })
})

function fillGameForm(formData: typeof game) {
  cy.getBySel('form').should('exist')

  cy.getBySel('text-input-game-name').clear().type(formData.name)
  cy.getBySel('text-input-game-description').clear().type(formData.description)
  cy.getBySel('text-input-game-start-date').clear().type(formData.startDateTimeToType)
  cy.getBySel('text-input-game-end-date').clear().type(formData.endDateTimeToType)
  cy.getBySel('select-input-game-type').select(formData.gameTypeToSelect)
  cy.getBySel('text-input-game-address').clear().type(formData.address)
  cy.getBySel('text-input-game-allowed-consumables').clear().type(formData.allowedConsumables)
  cy.getBySel('text-input-game-price').clear().type(formData.price.toString())
  cy.getBySel('select-input-game-validation-type').select(formData.validationTypeToSelect)
  if (formData.hasAmenities) {
    cy.getBySel('checkbox-game-has-amenities').click()
  }
  if (formData.hasParking) {
    cy.getBySel('checkbox-game-has-parking').click()
  }
  if (formData.hasequipmentRental) {
    cy.getBySel('checkbox-game-has-equipment-rental').click()
  }
  cy.getBySel('select-input-game-privacy-type').select(formData.privacyTypeToSelect)
  cy.getBySel('text-input-game-max-players').clear().type(formData.maxPlayers.toString())
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

  it('should show errors when fiels are wrong', () => {
    cy.getBySel('open-add-panel').click()
    fillGameForm({
      ...game,
      name: 'a',
      startDateTimeToType: '2000-06-15T21:00:00',
      endDateTimeToType: '2000-06-16T03:00:00'
    })

    cy.getBySel('text-input-game-name-error').should('contain', errorMessages.invalidName)
    cy.getBySel('text-input-game-start-date-error').should('contain', errorMessages.invalidDateTime)
    cy.getBySel('text-input-game-end-date-error').should('contain', errorMessages.invalidDateTime)

    cy.getBySel('form-submit-button').click()
    cy.wait('@createGameRequest')
    cy.getBySel('form-error').should('contain', errorMessages.rulesNotRespected)
  })

  it('should show error when start date is after end date', () => {
    cy.getBySel('open-add-panel').click()
    fillGameForm({
      ...game,
      startDateTimeToType: '2060-06-15T21:00:00',
      endDateTimeToType: '2059-06-16T03:00:00'
    })

    cy.getBySel('form-submit-button').click()
    cy.getBySel('form-error').should('contain', errorMessages.startDateAfterEndDate)
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
    cy.getBySel('game-infos-panel-has-equipment-rental').should('exist')
    cy.getBySel('game-infos-panel-description').should('contain', game.description)
    cy.getBySel('game-infos-panel-allowed-consumables').should('contain', game.allowedConsumables)
  })

  it('should update a game', () => {
    cy.intercept('PUT', '/api/games/8').as('updateGameRequest')
    cy.getBySel('marker-map-8').click()
    cy.getBySel('game-infos-panel').should('exist')
    cy.getBySel('game-infos-panel-edit-button').click()

    fillGameForm(game)

    cy.getBySel('form-submit-button').click()
    cy.wait('@updateGameRequest')

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
    cy.getBySel('game-infos-panel-has-equipment-rental').should('exist')
    cy.getBySel('game-infos-panel-description').should('contain', game.description)
    cy.getBySel('game-infos-panel-allowed-consumables').should('contain', game.allowedConsumables)
  })

  it('should not be able to update if he is not the owner', () => {
    cy.getBySel('marker-map-4').click()
    cy.getBySel('game-infos-panel').should('exist')
    cy.getBySel('game-infos-panel-edit-button').should('not.exist')
  })

  it('should delete a game', () => {
    cy.intercept('DELETE', '/api/games/8').as('deleteGameRequest')
    cy.getBySel('marker-map-8').click()
    cy.getBySel('game-infos-panel').should('exist')
    cy.getBySel('game-infos-panel-edit-button').click()

    cy.getBySel('game-form-delete-confirm-modal-button').click()
    cy.getBySel('game-form-delete-confirm-modal').should('exist')

    cy.getBySel('game-form-delete-button').click()

    cy.wait('@deleteGameRequest')

    cy.getBySel('marker-map-8').should('not.exist')
  })
})

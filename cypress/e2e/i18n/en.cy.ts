const texts = {
  heroBannerSubtitle: 'Find games,\nMeet players,\nBuild your reputation!',
  heroBannerCta: 'Find a game'
}

describe('As a user, I can browse the application in English', () => {
  beforeEach(() => {
    cy.visit('/')
  })
  it('should see the homepage in English', () => {
    cy.getBySel('hero-banner-subtitle').should('contain', texts.heroBannerSubtitle)
    cy.getBySel('hero-banner-cta').should('contain', texts.heroBannerCta)
  })
})

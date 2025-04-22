const texts = {
  heroBannerSubtitle: 'Trouver des parties,\nRencontrez des joueurs,\nBâtissez votre réputation !',
  heroBannerCta: 'Trouver une partie'
}

describe('As a user, I can browse the application in French', () => {
  beforeEach(() => {
    cy.visit('/fr')
  })
  it('should see the homepage in French', () => {
    cy.getBySel('hero-banner-subtitle').should('contain', texts.heroBannerSubtitle)
    cy.getBySel('hero-banner-cta').should('contain', texts.heroBannerCta)
  })
})

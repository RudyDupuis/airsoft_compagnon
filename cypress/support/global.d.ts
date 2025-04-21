declare namespace Cypress {
  interface Chainable {
    getBySel(
      dataTestAttribute: string,
      args?: Cypress.Chainable.GetOptions
    ): Chainable<JQuery<HTMLElement>>
  }
}

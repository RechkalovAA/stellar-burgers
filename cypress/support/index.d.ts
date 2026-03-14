/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      getBySel(selector: string, ...args: unknown[]): Chainable<JQuery<HTMLElement>>;
      setAuthTokens(): Chainable<void>;
      clearAuthTokens(): Chainable<void>;
      mockConstructorApi(): Chainable<void>;
      addIngredient(ingredientName: string): Chainable<void>;
      openIngredientDetails(ingredientName: string): Chainable<void>;
    }
  }
}

export {};

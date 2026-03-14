const emptyOrdersResponse = {
  success: true,
  orders: [],
  total: 0,
  totalToday: 0
};

Cypress.Commands.add('getBySel', (selector, ...args) =>
  cy.get(`[data-cy="${selector}"]`, ...args)
);

Cypress.Commands.add('setAuthTokens', () => {
  cy.setCookie('accessToken', 'Bearer test-access-token');
  cy.window().then((window) => {
    window.localStorage.setItem('refreshToken', 'test-refresh-token');
  });
});

Cypress.Commands.add('clearAuthTokens', () => {
  cy.clearCookie('accessToken');
  cy.window().then((window) => {
    window.localStorage.removeItem('refreshToken');
  });
});

Cypress.Commands.add('mockConstructorApi', () => {
  cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as(
    'getIngredients'
  );
  cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as('getUser');
  cy.intercept('POST', '**/api/orders', { fixture: 'order-create.json' }).as(
    'createOrder'
  );
  cy.intercept('GET', '**/api/orders', emptyOrdersResponse).as('getOrders');
  cy.intercept('GET', '**/api/orders/all', emptyOrdersResponse).as('getFeed');
});

Cypress.Commands.add('addIngredient', (ingredientName) => {
  cy.contains('[data-cy="ingredient-card"]', ingredientName)
    .contains('Добавить')
    .click();
});

Cypress.Commands.add('openIngredientDetails', (ingredientName) => {
  cy.contains('[data-cy="ingredient-card"]', ingredientName)
    .find('[data-cy="ingredient-link"]')
    .click();
});

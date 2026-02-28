/// <reference types="cypress" />

const SELECTORS = {
  ingredientCard: 'li',
  addButtonText: 'Добавить',
  modalCloseButton: '#modals button[type="button"]',
  modalRoot: '#modals'
} as const;

const INGREDIENTS = {
  bun: 'Флюоресцентная булка R2-D3',
  main: 'Биокотлета из марсианской Магнолии'
} as const;

const TEXT = {
  ingredientDetailsTitle: 'Детали ингредиента',
  orderButton: 'Оформить заказ',
  orderNumber: '12345',
  chooseBuns: 'Выберите булки',
  chooseMain: 'Выберите начинку'
} as const;

const addIngredientToConstructor = (ingredientName: string) => {
  cy.contains(ingredientName)
    .parents(SELECTORS.ingredientCard)
    .contains(SELECTORS.addButtonText)
    .click();
};

describe('Страница конструктора', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', '**/api/auth/user', { fixture: 'user.json' }).as(
      'getUser'
    );
    cy.intercept('POST', '**/api/orders', { fixture: 'order-create.json' }).as(
      'createOrder'
    );
    cy.intercept('GET', '**/api/orders', {
      success: true,
      orders: [],
      total: 0,
      totalToday: 0
    }).as('getOrders');
    cy.intercept('GET', '**/api/orders/all', {
      success: true,
      orders: [],
      total: 0,
      totalToday: 0
    }).as('getFeed');

    cy.setCookie('accessToken', 'Bearer test-access-token');
    cy.window().then((window) => {
      window.localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    cy.window().then((window) => {
      window.localStorage.removeItem('refreshToken');
    });
  });

  it('добавляет ингредиенты в конструктор', () => {
    addIngredientToConstructor(INGREDIENTS.bun);
    addIngredientToConstructor(INGREDIENTS.main);

    cy.contains(`${INGREDIENTS.bun} (верх)`).should('exist');
    cy.contains(`${INGREDIENTS.bun} (низ)`).should('exist');
    cy.contains(INGREDIENTS.main).should('exist');
  });

  it('открывает и закрывает модалку ингредиента (крестик и оверлей)', () => {
    cy.contains(INGREDIENTS.bun).click();

    cy.contains(TEXT.ingredientDetailsTitle).should('exist');
    cy.contains(INGREDIENTS.bun).should('exist');
    cy.contains('643').should('exist');

    cy.get(SELECTORS.modalCloseButton).first().click();
    cy.contains(TEXT.ingredientDetailsTitle).should('not.exist');

    cy.contains(INGREDIENTS.bun).click();
    cy.contains(TEXT.ingredientDetailsTitle).should('exist');
    cy.get(SELECTORS.modalRoot).children().last().click({ force: true });
    cy.contains(TEXT.ingredientDetailsTitle).should('not.exist');
  });

  it('создает заказ, показывает номер и очищает конструктор', () => {
    addIngredientToConstructor(INGREDIENTS.bun);
    addIngredientToConstructor(INGREDIENTS.main);

    cy.contains(TEXT.orderButton).click();

    cy.wait('@createOrder');
    cy.contains(TEXT.orderNumber).should('exist');

    cy.get(SELECTORS.modalCloseButton).first().click();
    cy.contains(TEXT.orderNumber).should('not.exist');

    cy.contains(TEXT.chooseBuns).should('exist');
    cy.contains(TEXT.chooseMain).should('exist');
  });
});

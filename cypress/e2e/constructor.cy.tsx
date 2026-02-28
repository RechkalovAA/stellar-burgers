/// <reference types="cypress" />

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

describe('Страница конструктора', () => {
  beforeEach(() => {
    cy.mockConstructorApi();
    cy.setAuthTokens();

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearAuthTokens();
  });

  it('добавляет ингредиенты в конструктор', () => {
    cy.addIngredient(INGREDIENTS.bun);
    cy.addIngredient(INGREDIENTS.main);

    cy.contains(`${INGREDIENTS.bun} (верх)`).should('exist');
    cy.contains(`${INGREDIENTS.bun} (низ)`).should('exist');
    cy.contains(INGREDIENTS.main).should('exist');
  });

  it('открывает и закрывает модалку ингредиента (крестик и оверлей)', () => {
    cy.openIngredientDetails(INGREDIENTS.bun);

    cy.contains(TEXT.ingredientDetailsTitle).should('exist');
    cy.contains(INGREDIENTS.bun).should('exist');
    cy.contains('643').should('exist');

    cy.getBySel('modal-close').first().click();
    cy.contains(TEXT.ingredientDetailsTitle).should('not.exist');

    cy.openIngredientDetails(INGREDIENTS.bun);
    cy.contains(TEXT.ingredientDetailsTitle).should('exist');
    cy.getBySel('modal-overlay').click({ force: true });
    cy.contains(TEXT.ingredientDetailsTitle).should('not.exist');
  });

  it('создает заказ, показывает номер и очищает конструктор', () => {
    cy.addIngredient(INGREDIENTS.bun);
    cy.addIngredient(INGREDIENTS.main);

    cy.getBySel('order-submit').contains(TEXT.orderButton).click();

    cy.wait('@createOrder');
    cy.contains(TEXT.orderNumber).should('exist');

    cy.getBySel('modal-close').first().click();
    cy.contains(TEXT.orderNumber).should('not.exist');

    cy.contains(TEXT.chooseBuns).should('exist');
    cy.contains(TEXT.chooseMain).should('exist');
  });
});

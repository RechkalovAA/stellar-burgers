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

  it('добавляет ингредиенты в конструктор', () => {
    cy.contains('Флюоресцентная булка R2-D3')
      .parents('li')
      .contains('Добавить')
      .click();
    cy.contains('Биокотлета из марсианской Магнолии')
      .parents('li')
      .contains('Добавить')
      .click();

    cy.contains('Флюоресцентная булка R2-D3 (верх)').should('exist');
    cy.contains('Флюоресцентная булка R2-D3 (низ)').should('exist');
    cy.contains('Биокотлета из марсианской Магнолии').should('exist');
  });

  it('открывает и закрывает модалку ингредиента (крестик и оверлей)', () => {
    cy.contains('Флюоресцентная булка R2-D3').click();

    cy.contains('Детали ингредиента').should('exist');
    cy.contains('Флюоресцентная булка R2-D3').should('exist');
    cy.contains('643').should('exist');

    cy.get('#modals button[type="button"]').first().click();
    cy.contains('Детали ингредиента').should('not.exist');

    cy.contains('Флюоресцентная булка R2-D3').click();
    cy.contains('Детали ингредиента').should('exist');
    cy.get('#modals').children().last().click({ force: true });
    cy.contains('Детали ингредиента').should('not.exist');
  });

  it('создает заказ, показывает номер и очищает конструктор', () => {
    cy.contains('Флюоресцентная булка R2-D3')
      .parents('li')
      .contains('Добавить')
      .click();
    cy.contains('Биокотлета из марсианской Магнолии')
      .parents('li')
      .contains('Добавить')
      .click();

    cy.contains('Оформить заказ').click();

    cy.wait('@createOrder');
    cy.contains('12345').should('exist');

    cy.get('#modals button[type="button"]').first().click();
    cy.contains('12345').should('not.exist');

    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
  });
});

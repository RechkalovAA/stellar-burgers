import { AnyAction } from '@reduxjs/toolkit';
import { rootReducer } from './rootReducer';

describe('rootReducer', () => {
  it('возвращает корректное начальное состояние для UNKNOWN_ACTION', () => {
    const state = rootReducer(undefined, {
      type: 'UNKNOWN_ACTION'
    } as AnyAction);

    expect(state).toEqual({
      ingredients: {
        items: [],
        loading: false,
        error: null
      },
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      order: {
        orderRequest: false,
        orderModalData: null,
        currentOrder: null,
        loading: false,
        error: null
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        loading: false,
        error: null
      },
      orders: {
        orders: [],
        loading: false,
        error: null
      },
      user: {
        user: null,
        isAuthChecked: false,
        loading: false,
        error: null,
        loginError: null,
        registerError: null,
        updateUserError: null,
        forgotPasswordError: null,
        resetPasswordError: null
      }
    });
  });
});

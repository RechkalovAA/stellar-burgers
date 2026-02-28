import { getIngredients, ingredientsSlice } from './ingredientsSlice';
import { TIngredient } from '../../utils/types';

const ingredient: TIngredient = {
  _id: 'ingredient-1',
  name: 'Тестовый ингредиент',
  type: 'main',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 10,
  price: 150,
  image: 'img.png',
  image_large: 'img-large.png',
  image_mobile: 'img-mobile.png'
};

describe('ingredientsSlice async reducers', () => {
  it('обрабатывает pending: loading=true', () => {
    const state = ingredientsSlice.reducer(
      undefined,
      getIngredients.pending('request-id', undefined)
    );

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('обрабатывает fulfilled: записывает данные и loading=false', () => {
    const pendingState = ingredientsSlice.reducer(
      undefined,
      getIngredients.pending('request-id', undefined)
    );
    const state = ingredientsSlice.reducer(
      pendingState,
      getIngredients.fulfilled([ingredient], 'request-id', undefined)
    );

    expect(state.loading).toBe(false);
    expect(state.items).toEqual([ingredient]);
  });

  it('обрабатывает rejected: записывает ошибку и loading=false', () => {
    const pendingState = ingredientsSlice.reducer(
      undefined,
      getIngredients.pending('request-id', undefined)
    );
    const state = ingredientsSlice.reducer(
      pendingState,
      getIngredients.rejected(null, 'request-id', undefined, 'Текст ошибки')
    );

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Текст ошибки');
  });
});

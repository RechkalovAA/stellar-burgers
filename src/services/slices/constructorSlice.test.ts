import {
  addIngredient,
  constructorSlice,
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient
} from './constructorSlice';
import { TIngredient } from '../../utils/types';

const bun: TIngredient = {
  _id: 'bun-id',
  name: 'Булка',
  type: 'bun',
  proteins: 1,
  fat: 1,
  carbohydrates: 1,
  calories: 1,
  price: 100,
  image: 'bun.png',
  image_large: 'bun-large.png',
  image_mobile: 'bun-mobile.png'
};

const mainOne: TIngredient = {
  _id: 'main-1',
  name: 'Начинка 1',
  type: 'main',
  proteins: 2,
  fat: 2,
  carbohydrates: 2,
  calories: 2,
  price: 200,
  image: 'main-1.png',
  image_large: 'main-1-large.png',
  image_mobile: 'main-1-mobile.png'
};

const mainTwo: TIngredient = {
  _id: 'main-2',
  name: 'Начинка 2',
  type: 'main',
  proteins: 3,
  fat: 3,
  carbohydrates: 3,
  calories: 3,
  price: 300,
  image: 'main-2.png',
  image_large: 'main-2-large.png',
  image_mobile: 'main-2-mobile.png'
};

describe('constructorSlice reducer', () => {
  it('обрабатывает добавление ингредиента', () => {
    const withBun = constructorSlice.reducer(undefined, addIngredient(bun));
    const withMain = constructorSlice.reducer(withBun, addIngredient(mainOne));

    expect(withMain.bun?._id).toBe('bun-id');
    expect(withMain.ingredients).toHaveLength(1);
    expect(withMain.ingredients[0]._id).toBe('main-1');
    expect(withMain.ingredients[0].id).toEqual(expect.any(String));
  });

  it('обрабатывает удаление ингредиента', () => {
    const stateWithIngredient = constructorSlice.reducer(
      undefined,
      addIngredient(mainOne)
    );
    const ingredientId = stateWithIngredient.ingredients[0].id;

    const nextState = constructorSlice.reducer(
      stateWithIngredient,
      removeIngredient(ingredientId)
    );

    expect(nextState.ingredients).toHaveLength(0);
  });

  it('обрабатывает изменение порядка ингредиентов в начинке', () => {
    let state = constructorSlice.reducer(undefined, addIngredient(mainOne));
    state = constructorSlice.reducer(state, addIngredient(mainTwo));

    state = constructorSlice.reducer(state, moveIngredientUp(1));
    expect(state.ingredients.map((item) => item._id)).toEqual([
      'main-2',
      'main-1'
    ]);

    state = constructorSlice.reducer(state, moveIngredientDown(0));
    expect(state.ingredients.map((item) => item._id)).toEqual([
      'main-1',
      'main-2'
    ]);
  });
});

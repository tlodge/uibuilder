// @flow

import { createStructuredSelector } from 'reselect';
import { State } from 'models/canvas';

// Action Types

// Define types in the form of 'npm-module-or-myapp/feature-name/ACTION_TYPE_NAME'
const MOUSE_MOVE  = 'uibuilder/canvas/MOUSE_MOVE';

// This will be used in our root reducer and selectors

export const NAME = 'canvas';

// Define the initial state for `shapes` module

const initialState: State = {
  x: 0,
  y: 0,
};

export default function reducer(state: State = initialState, action: any = {}): State {
  switch (action.type) {
    case MOUSE_MOVE: {
      return {
        ...state,
        x: action.x,
        y: action.y
      };
    }

    default:
      return state;
  }
}

// Action Creators

function mouseMove(x: number, y:number) {
  return {
    type: MOUSE_MOVE,
    x,
    y,
  };
}

// Selectors

const canvas = (state) => state[NAME];

export const selector = createStructuredSelector({
  canvas
});

export const actionCreators = {
  mouseMove
};
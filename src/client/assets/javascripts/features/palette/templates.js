// @flow

import { createStructuredSelector } from 'reselect';
import { State } from 'models/templates';

// Action Types

// Define types in the form of 'npm-module-or-myapp/feature-name/ACTION_TYPE_NAME'
const SELECT_TEMPLATE  = 'uibuilder/palette/SELECT_TEMPLATE';

// This will be used in our root reducer and selectors

export const NAME = 'templates';

// Define the initial state for `shapes` module

const initialState: State = {

  templates: [0, 1, 2, 3],

  templatesById: [
    {
      id: 0,
      type: 'circle'
    },
    {
      id: 1,
      type: 'rect'
    },
    {
      id: 2,
      type: 'line'
    },
    {
      id: 3,
      type: 'text'
    }
  ],

  selected: -1,

};

export default function reducer(state: State = initialState, action: any = {}): State {
  switch (action.type) {
    case SELECT_TEMPLATE: {
      return {
        ...state,
        selected: action.id,
      };
    }

    default:
      return state;
  }
}

// Action Creators

function selectTemplate(id: number) {
  return {
    type: SELECT_TEMPLATE,
    id,
  };
}

// Selectors

const templates = (state) => state[NAME];

export const selector = createStructuredSelector({
  templates
});

export const actionCreators = {
  selectTemplate
};
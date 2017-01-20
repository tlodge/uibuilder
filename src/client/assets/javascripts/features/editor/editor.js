// @flow

import { createStructuredSelector } from 'reselect';
import { State } from 'models/editor';

// Action Types

// Define types in the form of 'npm-module-or-myapp/feature-name/ACTION_TYPE_NAME'
const SCREEN_RESIZE  = 'uibuilder/editor/SCREEN_RESIZE';
const SET_VIEW  = 'uibuilder/editor/SET_VIEW';
// This will be used in our root reducer and selectors

export const NAME = 'editor';

// Define the initial state for `shapes` module

const initialState: State = {
    w : window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    h : window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
    ow: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    oh: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
    view: "editor",
};

export default function reducer(state: State = initialState, action: any = {}): State {
  switch (action.type) {
    case SCREEN_RESIZE: {
      return {
        ...state,
        w: action.w,
        h: action.h,
      };
    }

    case SET_VIEW:
      return Object.assign({}, state, {view:action.view})
      
    default:
      return state;
  }
}

// Action Creators

function screenResize(w: number, h:number) {
  return {
    type: SCREEN_RESIZE,
    w,
    h,
  };
}

function setView(view:string){
  return{
    type: SET_VIEW,
    view,
  }
}

// Selectors

const editor = (state) => state[NAME];

export const selector = createStructuredSelector({
  editor
});

export const actionCreators = {
  screenResize,
  setView,
};
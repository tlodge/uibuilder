// @flow

import { createStructuredSelector } from 'reselect';
import { State } from 'models/canvas';
import {createShape} from '../../utils/';
// Action Types

// Define types in the form of 'npm-module-or-myapp/feature-name/ACTION_TYPE_NAME'
const MOUSE_MOVE  = 'uibuilder/canvas/MOUSE_MOVE';
const SHAPE_DROPPED  = 'uibuilder/canvas/SHAPE_DROPPED';
const SHAPE_SELECTED  = 'uibuilder/canvas/SHAPE_SELECTED';
const UPDATE_ATTRIBUTE  = 'uibuilder/canvas/UPDATE_ATTRIBUTE';
// This will be used in our root reducer and selectors

export const NAME = 'canvas';

// Define the initial state for `shapes` module

const initialState: State = {
  shapes: [],
  selected:null,
  x: 0,
  y: 0,
};

const shape=(state, action)=>{
  if (state.id != action.id){
    return state;
  }

  switch(action.type){

    case UPDATE_ATTRIBUTE:
      return Object.assign({}, state, {[action.attribute]:action.value}); 
   
    default:
      return state;
  }
}

export default function reducer(state: State = initialState, action: any = {}): State {
  switch (action.type) {
    
    case MOUSE_MOVE: 
      return {
        ...state,
        x: action.x,
        y: action.y
      };
    
    case SHAPE_DROPPED: 
      return Object.assign({}, state,  {shapes: [...state.shapes, createShape(action.shape, action.x, action.y)]});
    
    case SHAPE_SELECTED: 
      return Object.assign({}, state,  {selected: action.id});

    case UPDATE_ATTRIBUTE: 
      return Object.assign({}, state, {shapes : state.shapes.map(s=>shape(s, action))})

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

function shapeDropped(shape:string, x:number, y:number) {
  return {
    type: SHAPE_DROPPED,
    shape,
    x,
    y,
  };
}

function shapeSelected(id:string) {
  return {
    type: SHAPE_SELECTED,
    id,
  };
}

function updateAttribute(id:string, attribute:string, value) {
  return {
    type: UPDATE_ATTRIBUTE,
    id,
    attribute,
    value,
  };
}

// Selectors

const canvas = (state) => state[NAME];

export const selector = createStructuredSelector({
  canvas
});

export const actionCreators = {
  mouseMove,
  shapeDropped,
  shapeSelected,
  updateAttribute,
};
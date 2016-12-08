import { createStructuredSelector } from 'reselect';
import { State } from 'models/sources';

// Action Types

// Define types in the form of 'npm-module-or-myapp/feature-name/ACTION_TYPE_NAME'
const REGISTER_SOURCE  = 'uibuilder/sources/REGISTER_SOURCE';
const SELECT_SOURCE  = 'uibuilder/sources/SELECT_SOURCE';

// This will be used in our root reducer and selectors
export const NAME = 'sources';

// Define the initial state for `shapes` module

const initialState: State = {
  sources: [],
  selected: null,
}


export default function reducer(state: State = initialState, action: any = {}): State {
  
  switch (action.type) {
    
    case REGISTER_SOURCE:
      if (state.sources.map(s=>s.id).indexOf(action.id) == -1){
        return Object.assign({}, state, {sources: [...state.sources, action.source]})
      }
      return state;
    
    case SELECT_SOURCE:
      return Object.assign({}, state, {selected: action.id})

    default:
      return state;
  }
}

function registerSource(source){
  return {
    type: REGISTER_SOURCE,
    source,
  };
}

function selectSource(id){
  return {
    type: SELECT_SOURCE,
    id,
  };
}


export const actionCreators = {
  registerSource,
  selectSource,
};
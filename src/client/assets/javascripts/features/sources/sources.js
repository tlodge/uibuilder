import { createStructuredSelector } from 'reselect';
import { State } from 'models/sources';

// Action Types

// Define types in the form of 'npm-module-or-myapp/feature-name/ACTION_TYPE_NAME'
const SOURCE_ADDED  = 'uibuilder/palette/SOURCE_ADDED';

// This will be used in our root reducer and selectors

export const NAME = 'sources';

// Define the initial state for `shapes` module

const initialState: State = {

}


export default function reducer(state: State = initialState, action: any = {}): State {
  switch (action.type) {
   
    case SOURCE_ADDED: 
      return Object.assign({}, state,  {sources: [...state.sources, action.source]});
    
    default:
      return state;
  }
}
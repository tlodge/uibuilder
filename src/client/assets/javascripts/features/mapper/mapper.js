import { createStructuredSelector } from 'reselect';
import { State } from 'models/mapper';

// Action Types

// Define types in the form of 'npm-module-or-myapp/feature-name/ACTION_TYPE_NAME'
const TOGGLE_MAPPER  = 'uibuilder/palette/TOGGLE_MAPPER';

// This will be used in our root reducer and selectors

export const NAME = 'mapper';

// Define the initial state for `shapes` module

const initialState: State = {
	open:true,
	sources: [],
}

export default function reducer(state: State = initialState, action: any = {}): State {
	switch (action.type){
		case TOGGLE_MAPPER:
			return state;
		case REGISTER_SOURCE:
			return state;
		default:	
			return state;
	}
}

// Action Creators
function toggleMapper() {
  return {
    type: TOGGLE_MAPPER,
  };
}

function registerSource(source){
  return {
    type: REGISTER_SOURCE,
    source,
  };
}

// Selectors
const mapper = (state) => state[NAME];

export const selector = createStructuredSelector({
  mapper
});

export const actionCreators = {
  toggleMapper,
  registerSource
};
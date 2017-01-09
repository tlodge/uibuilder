// @flow

import { createStructuredSelector } from 'reselect';
import { State } from 'models/templates';
import {get} from '../../utils/net'
// Action Types

// Define types in the form of 'npm-module-or-myapp/feature-name/ACTION_TYPE_NAME'
const SELECT_TEMPLATE  = 'uibuilder/palette/SELECT_TEMPLATE';
const FETCHING_TEMPLATES = 'uibuilder/palette/FETCHING_TEMPLATES';
const LOAD_TEMPLATE = 'uibuilder/palette/LOAD_TEMPLATE';

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

const _parseTemplate = function(template){
  const parser = new DOMParser();
  const doc = parser.parseFromString(template, "image/svg+xml");
  console.log("parsed doc!!");

  const root = doc.childNodes;

  for (var item of root) {
    console.log(item.nodeName);
    console.log(item);
    console.log(item.childNodes);
  }
}

export default function reducer(state: State = initialState, action: any = {}): State {
  switch (action.type) {
    

    case SELECT_TEMPLATE: {
      return {
        ...state,
        selected: action.id,
      };
    }

    case LOAD_TEMPLATE:{
      const template = _parseTemplate(action.template);
      return state;
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

function fetchingTemplates(){
  return {
      type: FETCHING_TEMPLATES,
  }
}

function loadTemplate(template){
  return {
    type: LOAD_TEMPLATE,
    template
  }
}

function loadSVGTemplates(){

  return (dispatch,getState)=>{
  
    dispatch(fetchingTemplates());

    get('/images/test.svg').then((body)=>{
        console.log("greet!!! got");
        console.log(body.text);
       dispatch(loadTemplate(body.text));
    }).catch((err)=>{
      console.log("Seen a network error!!");
      throw err;
    });
  }
}

// Selectors

const templates = (state) => state[NAME];

export const selector = createStructuredSelector({
  templates
});

export const actionCreators = {
  selectTemplate,
  loadSVGTemplates,
};
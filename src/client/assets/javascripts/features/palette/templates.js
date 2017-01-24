// @flow

import { createStructuredSelector } from 'reselect';
import { State } from 'models/templates';
import {get} from 'utils/net'
import {generateId, calculateBounds, convertToJson} from 'utils'

// Action Types

// Define types in the form of 'npm-module-or-myapp/feature-name/ACTION_TYPE_NAME'
const SELECT_TEMPLATE  = 'uibuilder/palette/SELECT_TEMPLATE';
const FETCHING_TEMPLATES = 'uibuilder/palette/FETCHING_TEMPLATES';
const LOAD_TEMPLATE = 'uibuilder/palette/LOAD_TEMPLATE';
const LOAD_TEMPLATES = 'uibuilder/palette/LOAD_TEMPLATES';
// This will be used in our root reducer and selectors
export const NAME = 'templates';

// Define the initial state for `shapes` module

const initialState: State = {

  templates: [0, 1, 2, 3, 4, 5],

  templatesById: [
    {
      id: 0,
      type: 'circle',
      name: 'circle'
    },
    {
      id: 1,
      type: 'ellipse',
      name: 'ellipse'
    },
    {
      id: 2,
      type: 'rect',
      name: 'rect'
    },
    {
      id: 3,
      type: 'line',
      name: 'line'
    },
    {
      id: 4,
      type: 'text',
      name: 'text'
    },
    {
      id: 5,
      type: 'path',
      name: 'path'
    }
  ],

  selected: -1,

};



const _parseTemplate = function(template){
  const parser = new DOMParser();
  const doc = parser.parseFromString(template, "image/svg+xml");
  const root = doc.childNodes;

  let svg;

  for (var item of root) {
    if (item.nodeName === "svg" && item.childNodes.length > 0){
      svg = item;
      break;
    }
  }

  const items = convertToJson(svg.childNodes);
  return items;
}

export default function reducer(state: State = initialState, action: any = {}): State {
  switch (action.type) {
    

    case SELECT_TEMPLATE: {
      return {
        ...state,
        selected: action.id,
      };
    }

    case LOAD_TEMPLATES:{
        
        const ids = [];
        const newTemplatesByIds = action.templates.map((template, i)=>{
           
            ids.push(state.templates.length + i);
            return {
                id: state.templates.length + i,
                type: "group",
                name: template.image,
                children: _parseTemplate(template.body),
            }
        });


        
        return Object.assign({}, state, {
          templates: [...state.templates, ...ids],
          templatesById: [...state.templatesById, ...newTemplatesByIds],
        })  
    }

    case LOAD_TEMPLATE:{
      
      const template = _parseTemplate(action.template);
      return Object.assign({}, state, {
          templates: [...state.templates, state.templates.length],
          templatesById: [...state.templatesById, {
            id: state.templates.length,
            type: "group",
            children: template,
          }]

      })
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

function loadTemplates(templates){
  return {
    type: LOAD_TEMPLATES,
    templates
  }
}

function loadSVGTemplates(){

  return (dispatch,getState)=>{
  
    dispatch(fetchingTemplates());

    get('/images/').then((res)=>{
      dispatch(loadTemplates(res.body));
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
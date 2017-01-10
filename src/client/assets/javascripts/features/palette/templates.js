// @flow

import { createStructuredSelector } from 'reselect';
import { State } from 'models/templates';
import {get} from '../../utils/net'
import {generateId} from '../../utils'

// Action Types

// Define types in the form of 'npm-module-or-myapp/feature-name/ACTION_TYPE_NAME'
const SELECT_TEMPLATE  = 'uibuilder/palette/SELECT_TEMPLATE';
const FETCHING_TEMPLATES = 'uibuilder/palette/FETCHING_TEMPLATES';
const LOAD_TEMPLATE = 'uibuilder/palette/LOAD_TEMPLATE';

// This will be used in our root reducer and selectors
export const NAME = 'templates';

// Define the initial state for `shapes` module

const initialState: State = {

  templates: [0, 1, 2, 3, 4],

  templatesById: [
    {
      id: 0,
      type: 'circle'
    },
    {
      id: 1,
      type: 'ellipse'
    },
    {
      id: 2,
      type: 'rect'
    },
    {
      id: 3,
      type: 'line'
    },
    {
      id: 4,
      type: 'text'
    }
  ],

  selected: -1,

};


const convertToJson = function(nodeList){
    
    const items = {};
   

    for (var item of nodeList){
      const id = generateId();
      
      switch(item.nodeName){
      
        case "g":
          items[id] = {

            id,
            type: "group",
            style:{
              fill: item.style.fill,
              stroke: item.style.stroke,
              'stroke-width': item.style.strokeWidth.trim() === "" ? 0: item.style.strokeWidth,
              opacity: 1,
            },
            children: convertToJson(item.childNodes), 
          }

          break;

        case "ellipse":
          
          items[id] = {
            id,
            type: "ellipse", 
            cx: item.cx.baseVal.value,
            cy: item.cy.baseVal.value,
            rx: item.rx.baseVal.value,
            ry: item.ry.baseVal.value,
            style:{
                fill: item.style.fill,
                stroke: item.style.stroke.trim() === "" ? "none" :  item.style.stroke,
                'stroke-width': item.style.strokeWidth.trim() === "" ? 0: item.style.strokeWidth,
                opacity: 1,
            }
          };

          break;
        
        case "circle":
      
          items[id] = {
            id,
            type: "circle", 
            cx: item.cx.baseVal.value,
            cy: item.cy.baseVal.value,
            r: item.r.baseVal.value,
            style:{
                fill: item.style.fill,
                stroke: item.style.stroke.trim() === "" ? "none" :  item.style.stroke,
                'stroke-width': item.style.strokeWidth.trim() === "" ? 0: item.style.strokeWidth,
                opacity: 1,
            }
          };
          break;
        
        case "rect":
          
          items[id] = {
            id,
            type: "rect", 
            x: item.x.baseVal.value,
            y: item.y.baseVal.value,
            width: item.width.baseVal.value,
            height: item.height.baseVal.value,
            style:{
                fill: item.style.fill,
                stroke: item.style.stroke.trim() === "" ? "none" :  item.style.stroke,
                'stroke-width': item.style.strokeWidth.trim() === "" ? 0: item.style.strokeWidth,
                opacity: 1,
            }
          };

          break;
        
        case "line":
         
          items[id] = {
            id,
            type: "line", 
            x1: item.x1.baseVal.value,
            y1: item.y1.baseVal.value,
            x2: item.x2.baseVal.value,
            y2: item.y2.baseVal.value,
            style:{
                fill: item.style.fill,
                stroke: item.style.stroke.trim() === "" ? "none" :  item.style.stroke,
                'stroke-width': item.style.strokeWidth.trim() === "" ? 0: item.style.strokeWidth,
                opacity: 1,
            }
          };
          break;

        case "text":
          
          items[id]= {
            id,
            type: "text", 
            x: item.c.baseVal.value,
            y: item.c.baseVal.value,
            text: item.text.baseVal.value,
            style:{
                fill: item.style.fill,
                stroke: item.style.stroke.trim() === "" ? "none" :  item.style.stroke,
                'stroke-width': item.style.strokeWidth.trim() === "" ? 0: item.style.strokeWidth,
                opacity: 1,
            }
          };
          break;

      }
    }

    return items;
}

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

function loadSVGTemplates(){

  return (dispatch,getState)=>{
  
    dispatch(fetchingTemplates());

    get('/images/test.svg').then((body)=>{
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
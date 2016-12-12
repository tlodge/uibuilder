// @flow

import { createStructuredSelector } from 'reselect';
import { State } from 'models/canvas';
import {createTemplate, generateId} from '../../utils/';
// Action Types


const MOUSE_MOVE  = 'uibuilder/canvas/MOUSE_MOVE';
const TEMPLATE_DROPPED  = 'uibuilder/canvas/TEMPLATE_DROPPED';
const TEMPLATE_SELECTED  = 'uibuilder/canvas/TEMPLATE_SELECTED ';
const NODE_ENTER  = 'uibuilder/canvas/NODE_ENTER';
const UPDATE_NODE_ATTRIBUTE  = 'uibuilder/canvas/UPDATE_NODE_ATTRIBUTE';

// This will be used in our root reducer and selectors

export const NAME = 'canvas';

// Define the initial state for `shapes` module

const initialState: State = {
  templates: [],     //templates
  nodes: {},     //these are the 
  selected:null,
  x: 0,
  y: 0,
};

const node=(state, action)=>{
  if (state.id != action.id){
    return state;
  }

  switch(action.type){

    case UPDATE_NODE_ATTRIBUTE:
      return Object.assign({}, state, {[action.attribute]:action.value}); 
   
    default:
      return state;
  }
}

const cloneShape =(shapes, action)=>{
  for (var template in templates){
     if (template.id === action.id){
        return Object.assign({}, template);
     }
  }
} 

/* {


}*/
//key
//id
//attribute
//value

/*nodes = {
  templateId:{
                key : {
                  node
                },
                key: {
                  node
                }
  }  
}*/

const createNode = (templates, templateId)=>{
   console.log("CREATING A NEW NODE!!");

   const template = templates.reduce((acc,t)=>{
      return  (t.id === templateId) ? t : acc;
   },{});

   const id = generateId();
   return Object.assign({}, template, {id, label:`${template.type}:${id}`});
}

const updateNodes = (templates, nodes, action)=>{
 
  const parent = nodes[action.templateId] || {};
  console.log("action key is");
  console.log(action.key);

  const node = parent[action.key] || createNode(templates, action.templateId);
  
  const newNode = Object.assign({}, node, {[action.attribute] : action.value});
  
  return Object.assign({}, nodes, {[action.templateId] : Object.assign({}, parent, {[action.key] : newNode})});
}

export default function reducer(state: State = initialState, action: any = {}): State {
  switch (action.type) {
    
    case MOUSE_MOVE: 
      return {
        ...state,
        x: action.x,
        y: action.y
      };
    
    case TEMPLATE_DROPPED: 
      return Object.assign({}, state,  {templates: [...state.templates, createTemplate(action.template, action.x, action.y)]});
    
    case TEMPLATE_SELECTED: 
      return Object.assign({}, state,  {selected: action.id});

    case NODE_ENTER:
      //return Object.assign({}, state,  {shapes: [...state.shapes, cloneShape(state.shapes, action.id)]});
      return state;

    case UPDATE_NODE_ATTRIBUTE: 
      //console.log("AM IN HERE");
      //llokup the action.key, and create new node from template if doesn't already exist!
      return Object.assign({}, state, {nodes:updateNodes(state.templates, state.nodes, action)})

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

function templateDropped(template:string, x:number, y:number) {
  return {
    type: TEMPLATE_DROPPED,
    template,
    x,
    y,
  };
}

function templateSelected(id:string) {
  return {
    type: TEMPLATE_SELECTED,
    id,
  };
}

function nodeEnter(id:string){
   return {
    type: NODE_ENTER,
    id,
  };
}

function updateNodeAttribute(templateId:string, key:string, attribute:string, value) {
  
  return {
    type: UPDATE_NODE_ATTRIBUTE,
    templateId,
    key,
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
  templateDropped,
  templateSelected,
  nodeEnter,
  updateNodeAttribute,
};
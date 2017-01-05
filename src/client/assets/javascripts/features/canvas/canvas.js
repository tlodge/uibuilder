// @flow

import { createStructuredSelector } from 'reselect';
import { State } from 'models/canvas';
import {createTemplate, generateId} from '../../utils/';
import _ from 'lodash';

// Action Types


const MOUSE_MOVE              = 'uibuilder/canvas/MOUSE_MOVE';
const TEMPLATE_DROPPED        = 'uibuilder/canvas/TEMPLATE_DROPPED';
const TEMPLATE_SELECTED       = 'uibuilder/canvas/TEMPLATE_SELECTED ';
const NODE_ENTER              = 'uibuilder/canvas/NODE_ENTER';
const UPDATE_NODE_ATTRIBUTE   = 'uibuilder/canvas/UPDATE_NODE_ATTRIBUTE';
const UPDATE_NODE_STYLE       = 'uibuilder/canvas/UPDATE_NODE_STYLE';
const SET_VIEW                = 'uibuilder/canvas/SET_VIEW';

// This will be used in our root reducer and selectors


export const NAME = 'canvas';

// Define the initial state for `shapes` module

const initialState: State = {
  view: "editor", //editor or live
  templates: [],     //templates
  nodes: {},     //these are the 
  selected:null,
  x: 0,
  y: 0,
};

const createNode = (templates, templateId)=>{
  
   const template = templates.reduce((acc,t)=>{
      return  (t.id === templateId) ? t : acc;
   },{});

   const id = generateId();
   return Object.assign({}, template, {id, label:`${template.type}:${id}`});
}

const updateAttributes = (templates, nodes, action)=>{
 
  const parent = nodes[action.templateId] || {};

  const node = parent[action.enterKey] || createNode(templates, action.templateId);
  
  const newNode = Object.assign({}, node, {[action.property] : action.value});
  
  return Object.assign({}, nodes, {[action.templateId] : Object.assign({}, parent, {[action.enterKey] : newNode})});
}

const updateStyles = (templates, nodes, action)=>{
 
  const parent = nodes[action.templateId] || {};

  const node = parent[action.enterKey] || createNode(templates, action.templateId);
  
  const newNode = Object.assign({}, node, {style: Object.assign({}, node.style, {[action.property] : action.value})});
  
  return Object.assign({}, nodes, {[action.templateId] : Object.assign({}, parent, {[action.enterKey] : newNode})});
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
      return Object.assign({}, state,  {selected: action.template});

    case NODE_ENTER:
      //return Object.assign({}, state,  {shapes: [...state.shapes, cloneShape(state.shapes, action.id)]});
      return state;

    case UPDATE_NODE_ATTRIBUTE: 
      //console.log("AM IN HERE");
      //llokup the action.enterKey, and create new node from template if doesn't already exist!
      return Object.assign({}, state, {nodes:updateAttributes(state.templates, state.nodes, action)})

    case UPDATE_NODE_STYLE: 
      //console.log("AM IN HERE");
      //llokup the action.enterKey, and create new node from template if doesn't already exist!
      return Object.assign({}, state, {nodes:updateStyles(state.templates, state.nodes, action)})

    case SET_VIEW:
      return Object.assign({}, state, {view:action.view})

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

function templateSelected(template) {
  return {
    type: TEMPLATE_SELECTED,
    template,
  };
}

function nodeEnter(id:string){
   return {
    type: NODE_ENTER,
    id,
  };
}

function updateNodeAttribute(templateId:string, enterKey:string, property:string, value) {

  return {
    type: UPDATE_NODE_ATTRIBUTE,
    templateId,
    enterKey,
    property,
    value,
  };
}

function updateNodeStyle(templateId:string, enterKey:string, property:string, value){
   return {
    type: UPDATE_NODE_STYLE,
    templateId,
    enterKey,
    property: _.camelCase(property),
    value,
  };

}

function setView(view:string){
  return{
    type: SET_VIEW,
    view,
  }
}

// Selectors

const canvas = (state) => state[NAME];

export const selector = createStructuredSelector({
  canvas
});

export const actionCreators = {
  mouseMove,
  setView,
  templateDropped,
  templateSelected,
  nodeEnter,
  updateNodeAttribute,
  updateNodeStyle,
};
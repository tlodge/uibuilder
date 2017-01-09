// @flow

import { createStructuredSelector } from 'reselect';
import { State } from 'models/canvas';
import {createTemplate, typeForProperty, generateId, componentsFromTransform, scalePreservingOrigin, originForNode} from '../../utils/';
import _ from 'lodash';

// Action Types


const MOUSE_MOVE                 = 'uibuilder/canvas/MOUSE_MOVE';
const TEMPLATE_DROPPED           = 'uibuilder/canvas/TEMPLATE_DROPPED';
const TEMPLATE_SELECTED          = 'uibuilder/canvas/TEMPLATE_SELECTED ';
const NODE_ENTER                 = 'uibuilder/canvas/NODE_ENTER';
const UPDATE_NODE_ATTRIBUTE      = 'uibuilder/canvas/UPDATE_NODE_ATTRIBUTE';
const UPDATE_NODE_STYLE          = 'uibuilder/canvas/UPDATE_NODE_STYLE';
const UPDATE_NODE_TRANSFORM      = 'uibuilder/canvas/UPDATE_NODE_TRANSFORM';
const UPDATE_TEMPLATE_ATTRIBUTE  = 'uibuilder/canvas/UPDATE_TEMPLATE_ATTRIBUTE';
const UPDATE_TEMPLATE_STYLE      = 'uibuilder/canvas/UPDATE_TEMPLATE_STYLE';
const SET_VIEW                   = 'uibuilder/canvas/SET_VIEW';

// This will be used in our root reducer and selectors

let sfcount = 1;
let degcount = 0;

export const NAME = 'canvas';

const enterKey = "name";

// Define the initial state for `shapes` module

const initialState: State = {
  view: "editor", //editor or live
  templates: {},     //templates
  nodes: {},     //these are the 
  selected:null,
  x: 0,
  y: 0,
};

const createNode = (templates, templateId)=>{
  
   const template = templates[templateId];

   /*.reduce((acc,t)=>{
      return  (t.id === templateId) ? t : acc;
   },{});*/

   const id = generateId();
   return Object.assign({}, template, {id, label:`${template.type}:${id}`});
}

const _updateNodeAttributes = (templates, nodes, action)=>{
 
  const parent = nodes[action.templateId] || {};

  const node = parent[action.enterKey] || createNode(templates, action.templateId);
  
  const newNode = Object.assign({}, node, {[action.property] : action.value});
  
  return Object.assign({}, nodes, {[action.templateId] : Object.assign({}, parent, {[action.enterKey] : newNode})});
}

const _updateNodeStyles = (templates, nodes, action)=>{
 
  const parent = nodes[action.templateId] || {};

  const node = parent[action.enterKey] || createNode(templates, action.templateId);
  
  const newNode = Object.assign({}, node, {style: Object.assign({}, node.style, {[action.property] : action.value})});
  
  return Object.assign({}, nodes, {[action.templateId] : Object.assign({}, parent, {[action.enterKey] : newNode})});
}

const _updateNodeTransforms = (templates, nodes, action)=>{
 
  const {scale} = componentsFromTransform(action.transform);
  
  sfcount = sfcount + 0.1;
  degcount = degcount + 10;
  const sf = sfcount;//sfcount;//scale && scale.length > 0 ? Number(scale[0]) : 1;
 
  //console.log("scale factore is ");
  //console.log(Number(scale[0]));

  const parent = nodes[action.templateId] || {};

  const node = parent[action.enterKey] || createNode(templates, action.templateId);
  
  console.log("node is");
  console.log(node);

  //const transform = `translate(${-node.cx/sf}, ${-node.cy/sf}) scale(${sf}) `;
  const {x,y}     =  originForNode(node);
  const transform = `${scalePreservingOrigin(x, y, sf)} rotate(${degcount}, ${x}, ${y})`; 

  

  const newNode = Object.assign({}, node, {transform : transform});
  
  return Object.assign({}, nodes, {[action.templateId] : Object.assign({}, parent, {[action.enterKey] : newNode})});
}



//TODO - WOULD BE MUCH BETTER IF TEMPLATES WERE AN OBJECT RATHER THAN ARRAY!

const _updateTemplateStyle = (templates, action)=>{
  
  const template = Object.assign({},templates[action.templateId]);
  template.style = Object.assign({}, template.style, {[action.property]:action.value});
  return Object.assign({}, templates, {[template.id]: template});
}

const _updateTemplateAttribute = (templates, action)=>{

  const template = Object.assign({},templates[action.templateId], {[action.property]:action.value});
  return Object.assign({}, templates, {[template.id]: template});
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
      const template = createTemplate(action.template, action.x, action.y);
      return Object.assign({}, state, {templates: Object.assign({}, state.templates,  {[template.id]:template})});
    
    case TEMPLATE_SELECTED: 
      return Object.assign({}, state,  {selected: action.template});

    case NODE_ENTER:
      //return Object.assign({}, state,  {shapes: [...state.shapes, cloneShape(state.shapes, action.id)]});
      return state;

    case UPDATE_NODE_ATTRIBUTE: 
      //console.log("AM IN HERE");
      //llokup the action.enterKey, and create new node from template if doesn't already exist!
      return Object.assign({}, state, {nodes:_updateNodeAttributes(state.templates, state.nodes, action)})

    case UPDATE_NODE_STYLE: 
      //console.log("AM IN HERE");
      //llokup the action.enterKey, and create new node from template if doesn't already exist!
      return Object.assign({}, state, {nodes:_updateNodeStyles(state.templates, state.nodes, action)})

    case UPDATE_NODE_TRANSFORM:
       return Object.assign({}, state, {nodes: _updateNodeTransforms(state.templates, state.nodes, action)})


    case UPDATE_TEMPLATE_STYLE: 
      return Object.assign({}, state, {templates:_updateTemplateStyle(state.templates,action)});

    case UPDATE_TEMPLATE_ATTRIBUTE:
      return Object.assign({}, state, {templates:_updateTemplateAttribute(state.templates,action)});

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


function updateTemplateAttribute(templateId:string, property:string, value){
 return {
    type: UPDATE_TEMPLATE_ATTRIBUTE,
    templateId,
    property,
    value,
  };
}

function updateTemplateStyle(templateId:string, property:string, value){
  return {
    type: UPDATE_TEMPLATE_STYLE,
    templateId,
    property:property ,
    value,
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
    property: property,
    value,
  };
}

function updateNodeTransform(templateId:string, enterKey:string, transform:string){
    return {
    type: UPDATE_NODE_TRANSFORM,
    templateId,
    enterKey,
    transform,
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
  updateNodeTransform,
  updateTemplateAttribute,
  updateTemplateStyle,
};
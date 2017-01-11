// @flow

import { createStructuredSelector } from 'reselect';
import { State } from 'models/canvas';
import {createTemplate, createGroupTemplate, typeForProperty, generateId, componentsFromTransform, scalePreservingOrigin, originForNode, templateForPath} from '../../utils/';
import _ from 'lodash';

// Action Types


const MOUSE_MOVE                 = 'uibuilder/canvas/MOUSE_MOVE';
const TEMPLATE_DROPPED           = 'uibuilder/canvas/TEMPLATE_DROPPED';
const GROUP_TEMPLATE_DROPPED     = 'uibuilder/canvas/GROUP_TEMPLATE_DROPPED';
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



/*
example template

{
    id: xyz,
    type: "group",
    children : {
        xyza: {
            id: "xyza",
            type: "group",
            children: {
                xyzab: {
                  id: xyzab,
                  type: "circle",
                  cx: 32,
                  ...
                },
                xyzac:{
                  id: xyzac,
                  type: "rect",
                  x: 12,
                  y: 12,
                  ...
                }
            }
        },
        xyzb : {
          id: "xyzb",
          type: "circle",
          cx: 67,
          ...
        }
    }
}
*/


//create a deep copy of a template
//we might want to assign ndoeiDs too so we can differentiate between different instances - although this should
//be possible through templateId->enterKey
//this needs to be a deep copy!
const createNode = (template)=>{
    if (template.type !== "group"){
        return Object.assign({}, template, {label:`${template.type}:${template.id}`, style: Object.assign({}, template.style)});
    }
    return Object.assign({}, template, {children: Object.keys(template.children).reduce((acc,key)=>{
        acc[key] = createNode(template.children[key]);
        return acc;
    },{})});
            //createNode(template.children[key]))});
} 

/*

nodes == {

   templateId1 : {
      enterKey1: {
            id: templateId1,
            type: "circle",
            cx: 2
            .
            .
            .
      },     
      enterKey2:{
            id: nodeId2,
            type: "circle",
            cx: 3
            .
            .
            .
      }
   },

   templateId2: {
        enterKey1: {
            id: templateId2,
            type: "group",
            children: {

                id2a: {
                  id: id2a,
                  type: "group",
                  children: {
                      id2a1:{
  

                      },
                      id2a2:{
  

                      }  
                  }
                },

                id2b: {
                  id: id2b, 
                  type: "circle",
                  cx: 32,
                  ...
                },  
            }
        }
   },

   ...

}
*/

const _updateStyle = (node, path, property, value)=>{
    
    if (path.length == 0){
        return Object.assign({}, node, {style : Object.assign({}, node.style, {[property]:value})});
    }

    const [id, ...rest] = path;

    return Object.assign({}, node, { children : Object.assign(node.children, {}, {[id]: _updateStyle(node.children[id], rest, property, value)})});
}

const _updateAttribute = (node, path, property, value)=>{
    
    if (path.length == 0){
        return Object.assign({}, node, {[property]:value});
    }

    const [id, ...rest] = path;

    return Object.assign({}, node, { children : Object.assign(node.children, {}, {[id]: _updateAttribute(node.children[id], rest, property, value)})});
}

const _updateTransform = (node, path, transform)=>{
 
    if (path.length == 0){
       return Object.assign({}, node, {transform});
    }

    const [id, ...rest] = path;

    return Object.assign({}, node, { children : Object.assign(node.children, {}, {[id]: _updateTransform(node.children[id], rest, transform)})});
}

//TODO:  HOW DO WE DEAL WITH ID?
const _updateNodeAttributes = (templates, nodes, action)=>{
 
  const [id, ...rest] = action.path;
  const parent = nodes[id] || {};
  const template = parent[action.enterKey] || templates[id];

  //create a deep copy to prevent mutation
  const node = createNode(template);

  //now update the node with the new value;
  const updated = _updateAttribute(node, rest, action.property, action.value); 
  return Object.assign({}, nodes, {[id] : Object.assign({}, parent, {[action.enterKey] : updated})});
}


const _updateNodeStyles = (templates, nodes, action)=>{
 
  const [id, ...rest] = action.path;
  const parent = nodes[id] || {};
  const template = parent[action.enterKey] || templates[id];

  //create a deep copy to prevent mutation
  const node = createNode(template);
  
  const updated = _updateStyle(node, rest, action.property, action.value); 
  
  //const newNode = Object.assign({}, node, {style: Object.assign({}, node.style, {[action.property] : action.value})});
  
  return Object.assign({}, nodes, {[id] : Object.assign({}, parent, {[action.enterKey] : updated})});
}

const _updateNodeTransforms = (templates, nodes, action)=>{

  
  const {scale} = componentsFromTransform(action.transform);
  


  sfcount = sfcount + 0.1;
  degcount = degcount + 10;
  const sf = sfcount;

  const [id, ...rest] = action.path;
  const parent = nodes[id] || {};
  const template = parent[action.enterKey] || templates[id];

  //create a deep copy to prevent mutation
  const node    = createNode(template);
  const {x,y}   =  originForNode(node);
  const transform = `${scalePreservingOrigin(x, y, sf)} rotate(${degcount}, ${x}, ${y})`; 
  const updated = _updateTransform(node, rest, transform); 

  return Object.assign({}, nodes, {[id] : Object.assign({}, parent, {[action.enterKey] : updated})});
}


const _updateTemplateStyle = (templates, action)=>{
  const path = action.path;

  if (path.length == 0){
    return templates;
  }

  const [id, ...rest] = action.path;

  if (path.length == 1){
    const template = Object.assign({},templates[id]);
    template.style = Object.assign({}, template.style, {[action.property]:action.value});
    return Object.assign({}, templates, {[template.id]: template});
  }
  
  return Object.assign({}, templates, {
                                          [id] :  Object.assign({}, templates[id], {
                                              children: _updateTemplateStyle(templates[id].children, {
                                                path: rest,
                                                property: action.property,
                                                value: action.value,
                                              })
                                          })});

  // _updateTemplateStyle(templates.children[id], )});
}

const _updateTemplateAttribute = (templates, action)=>{

  const path = action.path;


  if (path.length == 0){
    return templates;
  }

  const [id, ...rest] = action.path;

  if (path.length == 1){
    const template = Object.assign({},templates[id], {[action.property]:action.value});
    return Object.assign({}, templates, {[template.id]: template});
  }

  return Object.assign({}, templates, {
                                          [id] :  Object.assign({}, templates[id], {
                                              children: _updateTemplateAttribute(templates[id].children, {
                                                path: rest,
                                                property: action.property,
                                                value: action.value,
                                              })
                                        })});
 
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
    
    case GROUP_TEMPLATE_DROPPED:
      const grouptemplate = createGroupTemplate(action.children, action.x, action.y);
      return Object.assign({}, state, {templates: Object.assign({}, state.templates,  {[grouptemplate.id]:grouptemplate})});
    
    case TEMPLATE_SELECTED: 
      return Object.assign({}, state,  {selected: action.path});

    case NODE_ENTER:
      //return Object.assign({}, state,  {shapes: [...state.shapes, cloneShape(state.shapes, action.id)]});
      return state;

    case UPDATE_NODE_ATTRIBUTE: 
      //llokup the action.enterKey, and create new node from template if doesn't already exist!
     return Object.assign({}, state, {nodes:_updateNodeAttributes(state.templates, state.nodes, action)})

    case UPDATE_NODE_STYLE: 
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

function groupTemplateDropped(children, x:number, y:number){
  return {
    type: GROUP_TEMPLATE_DROPPED,
    children,
    x,
    y,
  };
}

function templateSelected(path) {
  return {
    type: TEMPLATE_SELECTED,
    path,
  };
}

function nodeEnter(id:string){
   return {
    type: NODE_ENTER,
    id,
  };
}


function updateTemplateAttribute(path:Array, property:string, value){
 return {
    type: UPDATE_TEMPLATE_ATTRIBUTE,
    path,
    property,
    value,
  };
}

function updateTemplateStyle(path:Array, property:string, value){
  return {
    type: UPDATE_TEMPLATE_STYLE,
    path,
    property:property ,
    value,
  };
}

function updateNodeAttribute(path:Array, enterKey:string, property:string, value) {
 
  return {
    type: UPDATE_NODE_ATTRIBUTE,
    path,
    enterKey,
    property,
    value,
  };
}

function updateNodeStyle(path:Array, enterKey:string, property:string, value){
   return {
    type: UPDATE_NODE_STYLE,
    path,
    enterKey,
    property: property,
    value,
  };
}

function updateNodeTransform(path:Array, enterKey:string, transform:string){
    return {
    type: UPDATE_NODE_TRANSFORM,
    path,
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
  groupTemplateDropped,
  templateSelected,
  nodeEnter,
  updateNodeAttribute,
  updateNodeStyle,
  updateNodeTransform,
  updateTemplateAttribute,
  updateTemplateStyle,
};
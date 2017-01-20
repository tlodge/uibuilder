// @flow

import { createStructuredSelector } from 'reselect';
import { State } from 'models/canvas';
import {createTemplate, createGroupTemplate, typeForProperty, generateId, componentsFromTransform, scalePreservingOrigin, originForNode, templateForPath} from '../../../../utils/';
import _ from 'lodash';

// Action Types


const MOUSE_MOVE                 = 'uibuilder/canvas/MOUSE_MOVE';
const MOUSE_UP                   = 'uibuilder/canvas/MOUSE_UP';
const MOUSE_DOWN                 = 'uibuilder/canvas/MOUSE_DOWN';
const TEMPLATE_DROPPED           = 'uibuilder/canvas/TEMPLATE_DROPPED';
const GROUP_TEMPLATE_DROPPED     = 'uibuilder/canvas/GROUP_TEMPLATE_DROPPED';
const TEMPLATE_SELECTED          = 'uibuilder/canvas/TEMPLATE_SELECTED';
const TEMPLATE_PARENT_SELECTED   = 'uibuilder/canvas/TEMPLATE_PARENT_SELECTED';
const UPDATE_NODE_ATTRIBUTE      = 'uibuilder/canvas/UPDATE_NODE_ATTRIBUTE';
const UPDATE_NODE_STYLE          = 'uibuilder/canvas/UPDATE_NODE_STYLE';
const UPDATE_NODE_TRANSFORM      = 'uibuilder/canvas/UPDATE_NODE_TRANSFORM';
const UPDATE_TEMPLATE_ATTRIBUTE  = 'uibuilder/canvas/UPDATE_TEMPLATE_ATTRIBUTE';
const UPDATE_TEMPLATE_STYLE      = 'uibuilder/canvas/UPDATE_TEMPLATE_STYLE';
const INIT_NODES                 = 'uibuilder/canvas/INIT_NODES';

// This will be used in our root reducer and selectors

let sfcount = 1;
let degcount = 0;

export const NAME = 'canvas';

const enterKey = "name";

// Define the initial state for `shapes` module

const initialState: State = {
  templates: {},     //templates
  selected:null,
  x: 0,
  y: 0,
  dragging: false,
  dx: 0, //drag x pos
  dy: 0, //drag y pos
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
//nodeIDs are assigned so that they can be used as keys when rendering.  We only generate new ones if they don't exist so that
//react can determine if a change  is to a current object or is a new one being added to the DOM

const createNode = (template)=>{
    const nodeId = template.nodeId || generateId();

    if (template.type !== "group"){
        return Object.assign({}, template, {nodeId, label:`${template.type}:${template.id}`, style: Object.assign({}, template.style)});
    }
    return Object.assign({}, template, {nodeId, children: Object.keys(template.children).reduce((acc,key)=>{
        acc[key] = createNode(template.children[key]);
        return acc;
    },{})});
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

const _selectParent = (state, action)=>{
    if (state.selected === null || state.selected.path.length <= 1){
      return null;
    }
    const idx = state.selected.path.length-1;
    const parent = [...state.selected.path.slice(0, idx), ...state.selected.path.slice(idx+1)];
    return {path:parent, type:"group"};
}

const _moveTemplate = (template, x, y)=>{

  switch (template.type){
      case "group":
      case "rect":
        return Object.assign({}, template, {x,y});
      
      case "ellipse":
      case "circle":
        return Object.assign({}, template, {cx:x,cy:y});

  }
  
  return template;
}

const _modifyTemplate = (state, action)=>{

    if (state.dragging && state.selected){
        const [id,...rest] = state.selected.path;
        return Object.assign({}, state.templates, {[id] : _moveTemplate(state.templates[id], action.x-state.dx, action.y-state.dy)});       
    }
    return state.templates;

}


const _templatecoords = (template)=>{

  switch(template.type){
    
    case "rect":
    case "group":
        return {x:template.x, y:template.y};

    case "circle":
    case "ellipse":
        return {x:template.cx, y:template.cy};

    default: 
        return {x:0,y:0};
  }
}


export default function reducer(state: State = initialState, action: any = {}): State {
  switch (action.type) {
    
    case MOUSE_MOVE: 
      
      return {
        ...state,
        x: action.x,
        y: action.y,
        templates: _modifyTemplate(state, action),
      }

    case MOUSE_DOWN:


      const {path} = action.path;
      const [id,...rest] = path;
      const _tmpl = state.templates[id];
      const {x,y} = _templatecoords(_tmpl);

      return Object.assign({}, state,  {
                                            selected: action.path,
                                            dragging: true,
                                            dx: state.x-x,
                                            dy: state.y-y,
                                        });
      return state;

    case MOUSE_UP:
       return Object.assign({}, state,  {
                                            selected: null,
                                            dragging: false
                                        });
    
    case TEMPLATE_DROPPED:
      const template = createTemplate(action.template, action.x, action.y);
      template.enterKey = null;//"id";

      //originally created a new node here but reasoned mych more efficient to clone templates when switch to live screen

      return Object.assign({}, state, {
                                          templates: Object.assign({}, state.templates,  {[template.id]:template}),
                                          
                                       });
    
    case GROUP_TEMPLATE_DROPPED:
      const grouptemplate = createGroupTemplate(action.children, action.x, action.y);
      grouptemplate.enterKey = null;

      return Object.assign({}, state, {
                                          templates: Object.assign({}, state.templates,  {[grouptemplate.id]:grouptemplate}),
                                
                                        });
    
    case TEMPLATE_SELECTED: 
      return Object.assign({}, state,  {selected: action.path});

    case TEMPLATE_PARENT_SELECTED: 
      return Object.assign({}, state,  {selected: _selectParent(state,action)});

   
    case UPDATE_TEMPLATE_STYLE: 
      return Object.assign({}, state, {templates:_updateTemplateStyle(state.templates,action)});

    case UPDATE_TEMPLATE_ATTRIBUTE:
      return Object.assign({}, state, {templates:_updateTemplateAttribute(state.templates,action)});


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

function onMouseDown(path, type){
  return {
    type: MOUSE_DOWN,
    path,
  };
}

function onMouseUp(){
  return {
    type: MOUSE_UP
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

function templateParentSelected(path) {
  return {
    type: TEMPLATE_PARENT_SELECTED,
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



// Selectors

const canvas = (state) => state[NAME];

export const selector = createStructuredSelector({
  canvas
});

export const actionCreators = {
  mouseMove,
  onMouseUp,
  onMouseDown,
  templateDropped,
  groupTemplateDropped,
  templateSelected,
  templateParentSelected,
  updateTemplateAttribute,
  updateTemplateStyle,
};
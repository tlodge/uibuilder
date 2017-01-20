// @flow

import { createStructuredSelector } from 'reselect';
import { State } from 'models/canvas';
import {createTemplate, createGroupTemplate, typeForProperty, generateId, componentsFromTransform, scalePreservingOrigin, originForNode, templateForPath} from '../../../../utils/';
import _ from 'lodash';

// Action Types


const UPDATE_NODE_ATTRIBUTE      = 'uibuilder/live/UPDATE_NODE_ATTRIBUTE';
const UPDATE_NODE_STYLE          = 'uibuilder/live/UPDATE_NODE_STYLE';
const UPDATE_NODE_TRANSFORM      = 'uibuilder/live/UPDATE_NODE_TRANSFORM';
const INIT_NODES                 = 'uibuilder/live/INIT_NODES';

export const NAME = 'live';

const initialState: State = {
  nodes: {},     
};

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

const _updateNodeAttributes = (templates, nodes, action)=>{
 

  const [id, ...rest] = action.path;
  const parent    = nodes[id]  || {};
  const key  = action.enterKey  || "root";
  const template  = parent[key] || templates[id];

  //create a deep copy to prevent mutation
  const node = createNode(template);

  //now update the node with the new value;
  const updated = _updateAttribute(node, rest, action.property, action.value); 
  return Object.assign({}, nodes, {[id] : Object.assign({}, parent, {[key] : updated})});
}

const _createNewNode = (nodes,template)=>{
  const node = createNode(template);
  const key  = "root";
  return Object.assign({}, nodes, {[template.id] : Object.assign({[key]:node})});
}

const _updateNodeStyles = (templates, nodes, action)=>{
  const key = action.enterKey || "root";
  const [id, ...rest] = action.path;
  const parent = nodes[id] || {};
  const template = parent[key] || templates[id];

  //create a deep copy to prevent mutation
  const node = createNode(template);
  
  const updated = _updateStyle(node, rest, action.property, action.value); 
  
  //const newNode = Object.assign({}, node, {style: Object.assign({}, node.style, {[action.property] : action.value})});
  
  return Object.assign({}, nodes, {[id] : Object.assign({}, parent, {[key] : updated})});
}

const _cloneStaticTemplates = (templates)=>{
  
    return Object.keys(templates).filter((key)=>{
       return templates[key].enterKey === null;
    }).reduce((acc, key)=>{
        acc[key] = {root: createNode(templates[key])}
        return acc;
    },{});
}

const _combine = (newtransform="", oldtransform="")=>{
  
    const {scale, rotate, translate} = Object.assign({}, componentsFromTransform(oldtransform), componentsFromTransform(newtransform));
    const transforms = [];

    if (scale)
      transforms.push(`scale(${scale})`);

    if (translate)
      transforms.push(`translate(${translate})`);

    if (rotate)
      transforms.push(`rotate(${rotate})`);

    return transforms.join();
}

const _createTransform = (node, type, transform)=>{

   const {x,y}   =  originForNode(node);

   switch(type){
      
      case "scale":

          const {scale} = componentsFromTransform(transform);
          return _combine(scalePreservingOrigin(x, y, scale || 1), node.transform || "");

      case "translate":
          const {translate} = componentsFromTransform(transform);
          return _combine(`translate(${translate})`,  node.transform || "");

      case "rotate":
          const {rotate} = componentsFromTransform(transform);
          return _combine(`rotate(${rotate},${x},${y})`, node.transform || "")

      default:

   }
}


const _updateNodeTransforms = (templates, nodes, action)=>{
  
  const key = action.enterKey || "root";

  const [id, ...rest] = action.path;
  const parent = nodes[id] || {};
  const template = parent[key] || templates[id];

  //create a deep copy to prevent mutation
  const node    = createNode(template);
 
  const transform = _createTransform(node, action.property, action.transform);

  //const transform = `${scalePreservingOrigin(x, y, sf)} rotate(${degcount}, ${x}, ${y})`; 


  const updated = _updateTransform(node, rest, transform); 

  return Object.assign({}, nodes, {[id] : Object.assign({}, parent, {[key] : updated})});
}


export default function reducer(state: State = initialState, action: any = {}): State {
  
  switch (action.type) {
    
    case UPDATE_NODE_ATTRIBUTE: 
      //llokup the action.enterKey, and create new node from template if doesn't already exist!
     return Object.assign({}, state, {nodes:_updateNodeAttributes(action.templates, state.nodes, action)})

    case UPDATE_NODE_STYLE: 
      //llokup the action.enterKey, and create new node from template if doesn't already exist!
      return Object.assign({}, state, {nodes:_updateNodeStyles(action.templates, state.nodes, action)})

    case UPDATE_NODE_TRANSFORM:
       return Object.assign({}, state, {nodes: _updateNodeTransforms(action.templates, state.nodes, action)})

    case INIT_NODES:
      
      return Object.assign({}, state, {nodes: _cloneStaticTemplates(action.templates)})

    default:
      return state;
  }
}


function updateNodeAttribute(path:Array, property:string, value, enterKey:string) {
 
  return (dispatch, getState)=>{
    dispatch({
        type: UPDATE_NODE_ATTRIBUTE,
        path,
        property,
        value,
        enterKey,
        templates: getState().canvas.templates,
    });
  };
}

function updateNodeStyle(path:Array, property:string, value, enterKey:string){
  return (dispatch, getState)=>{
    dispatch({
      type: UPDATE_NODE_STYLE,
      path,
      property,
      value,
      enterKey,
      templates: getState().canvas.templates,
    });
  }
}

function updateNodeTransform(path:Array, property:string, transform:string, enterKey:string){

   return (dispatch, getState)=>{
     dispatch({
        type: UPDATE_NODE_TRANSFORM,
        path,
        property,
        transform,
        enterKey,
        templates: getState().canvas.templates,
    });
  }
}

function initNodes(){
  return (dispatch, getState)=>{
    dispatch({
      type: INIT_NODES,
      templates: getState().canvas.templates,
    })
  }
}

// Selectors

const live = (state) => state[NAME];

export const selector = createStructuredSelector({
  live
});

export const actionCreators = {
  initNodes,
  updateNodeAttribute,
  updateNodeStyle,
  updateNodeTransform,
};
// @flow

import { createStructuredSelector } from 'reselect';
import { State } from 'models/canvas';
import {createTemplate, createGroupTemplate, typeForProperty, generateId, componentsFromTransform, scalePreservingOrigin, originForNode, templateForPath} from 'utils';

// Action Types
const CLONE_NODE                 = 'uibuilder/live/CLONE_NODE';
const UPDATE_NODE_ATTRIBUTE      = 'uibuilder/live/UPDATE_NODE_ATTRIBUTE';
const UPDATE_NODE_STYLE          = 'uibuilder/live/UPDATE_NODE_STYLE';
const UPDATE_NODE_TRANSFORM      = 'uibuilder/live/UPDATE_NODE_TRANSFORM';
const INIT_NODES                 = 'uibuilder/live/INIT_NODES';
const REMOVE_NODE                = 'uibuilder/live/REMOVE_NODE';
const CLEAR_STATE                = 'uibuilder/live/CLEAR_STATE';

export const NAME = 'live';

const initialState: State = {
  nodes: [],
  nodesByKey: {},
  nodesById: {},     
};


//nce we have all child ids we can then create a lookuo table to map old ids to new, then return all new.
const _getAllChildIds = (template, blueprints)=>{
    return [].concat.apply([], template.children.map((child)=>{
        if (blueprints[child].children){
          return [child, ..._getAllChildIds(blueprints[child], blueprints)]
        }
        return child; 
    }));
}



const _createNode = (template, blueprints, ts, index)=>{

    const id = generateId();

    if (template.type !== "group"){
        return {
                  node:  Object.assign({}, template, {id, ts, index, label:`${template.type}:${template.id}`, style: Object.assign({}, template.style)}),
                  children: {},
                  lookup:{},
              }
    }

    const childIds = _getAllChildIds(template, blueprints);
    
    const lookup = childIds.reduce((acc, key)=>{
        acc[key] = generateId();
        return acc;
    },{});

    const children = childIds.reduce((acc, id)=>{
        const newId = lookup[id];
        acc[newId] = Object.assign({}, blueprints[id], {id:newId, ts, index});
        if(acc[newId].children){
            acc[newId].children = acc[newId].children.map((id)=>lookup[id]);
        } 
        return acc;
    },{})

    return  {
        node:  Object.assign({}, template, {
                                                id, 
                                                ts,
                                                index,
                                                children: template.children.map(k=>lookup[k]),
                                                label:`${template.type}:${template.id}`, 
                                                style: Object.assign({}, template.style)
                                            }),
        children,
        lookup,
    }
} 


//needs to return a 
//{
//  nodes: []
//  nodesById: {}
//  nodesbyKey: {}
//}

const _cloneStaticTemplates = (templates, blueprints)=>{

    return templates.filter((key)=>{
       return !blueprints[key].enterFn;
    }).reduce((acc, key)=>{
        const {node, children, lookup} = _createNode(blueprints[key], blueprints, Date.now(), 0);
        
      

        acc.nodes.push(node.id);
        
        acc.nodesById = {...acc.nodesById, ...{[node.id]:node}, ...children};
        
        const nbk = Object.keys(lookup).reduce((acc,key)=>{
                      acc[key] = {root:lookup[key]}
                      return acc;
                    },{});

        acc.nodesByKey = {...acc.nodesByKey, [key]:{root:node.id}, ...nbk};
                           

        return acc;
    },{nodes:[], nodesByKey: {}, nodesById:{}});
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



/*
    //more effient to hold the mapping of nodesByKey in separate object as this then 
    //means that changes to state of a node cloned from a template won't trigger a state change
    //of ALL nodes that were cloned by that template.
    
    nodes = [n1,n2,n3,n4,n5], ///used by liveeditor to render

    //should this not just be an internal thing - not exposed as state? 

    nodesByKey = {  //used to update attributes or clone new node based on data key

        templateId1: {
          data1: n1,
          data2: n2,
        },

        templateId2:  {
          root: n3,
        }
    }

    nodesById = { //full list of nodes being rendered.
      n1:{..},
      n2:{..},
      n3:{..},
      n4:{..},
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

const _updateNodeAttributes = (state, action)=>{
 
  if (!state.nodesById)
    return state;

  
  const templateId = action.path[action.path.length-1];
  const subkey     = action.enterKey ? action.enterKey : "root";
  const nodeId     = state.nodesByKey[templateId] ? state.nodesByKey[templateId][subkey] : null;



  //should always have a nodeId, as clone node was dispatched first
  if (nodeId){
     const n = Object.assign({}, state.nodesById[nodeId], {[action.property]:action.value});
     return Object.assign({}, state, {nodesById: Object.assign({}, state.nodesById, {[nodeId] : n})});
  }

  return state;
}


const _updateNodeStyles = (state, action)=>{
  
  if (!state.nodesById)
    return state;

  //const [templateId, ...rest] = action.path;
  const templateId = action.path[action.path.length-1];
  const subkey     = action.enterKey ? action.enterKey : "root";
  const nodeId     = state.nodesByKey[templateId] ? state.nodesByKey[templateId][subkey] : null;

  //if we already have an entry for this node and its subkey, then just update it
  if (nodeId){
     const node = state.nodesById[nodeId];
     const style = node.style || {};
     const n = Object.assign({}, state.nodesById[nodeId], {
                                                              style: Object.assign({}, style, {[action.property]:action.value})
                                                           });

     return Object.assign({}, state, {nodesById: Object.assign({}, state.nodesById, {[nodeId] : n})});
  }

  return state;
}

const _updateNodeTransforms = (state, action)=>{
  if (!state.nodesById)
    return state;

  //const [templateId, ...rest] = action.path;
  const templateId = action.path[action.path.length-1];
  const subkey     = action.enterKey ? action.enterKey : "root";
  const nodeId     = state.nodesByKey[templateId] ? state.nodesByKey[templateId][subkey] : null;

  
  //if we already have an entry for this node and its subkey, then just update it
  if (nodeId){
     const transform = _createTransform(state.nodesById[nodeId], action.property, action.transform);
     const n = Object.assign({}, state.nodesById[nodeId], {transform});
     return Object.assign({}, state, {nodesById: Object.assign({}, state.nodesById, {[nodeId] : n})});
  }
  return state;
}

const _cloneNode = (state, action)=>{
    //const [templateId, ...rest] = action.path;
  
    const templateId = action.path[action.path.length-1];
    const subkey     = action.enterKey ? action.enterKey : "root";
    const {node, children, lookup} = _createNode(action.blueprints[templateId], action.blueprints, action.ts, action.index);
    

    const k = Object.assign({}, state.nodesByKey[templateId] || {}, {[subkey]:node.id});

    const nbk = Object.keys(lookup).reduce((acc,key)=>{
                      acc[key] = Object.assign({}, state.nodesByKey[key]||{}, {[subkey]:lookup[key]});
                      return acc;
                },{});


    return Object.assign({}, state, {
                                          nodes: [...state.nodes, node.id],
                                          nodesById:  {...state.nodesById, ...{[node.id]:node}, ...children},
                                          nodesByKey: {...state.nodesByKey, ...{[templateId]: k}, ...nbk},
                                      });

}



const _removeNodes = (state, action)=>{

    const node  = state.nodesById[action.nodeId];
    const templateId = action.path[action.path.length-1];
    
    const nodesByKey = Object.assign({}, state.nodesByKey, {[templateId] : Object.keys(state.nodesByKey[templateId]).reduce((acc,key)=>{
      if (key != action.enterKey){
        acc[key] = state.nodesByKey[templateId][key]
      }
      return acc;
    },{})});

    if (node.children){
        const toremove    = [node.id, ..._getAllChildIds(node, state.nodesById)];

        const nodes  = state.nodes.filter((nodeId)=>{
            return toremove.indexOf(nodeId) === -1;
        });

        const nodesById  = Object.keys(state.nodesById).reduce((acc,key)=>{
            if (toremove.indexOf(key) === -1){
              acc[key] = state.nodesById[key];
            }
            return acc;
        },{}); 
        
        return Object.assign({}, state, {nodes,nodesByKey,nodesById});
    }
    else{
        const index = state.nodes.indexOf(action.nodeId);
        const nodes = [...state.nodes.slice(0,index), ...state.nodes.slice(index+1)];
        const nodesById  = Object.assign({}, state.nodesById);
        delete nodesById[node.id];
      
        return Object.assign({}, state, {nodes,nodesByKey,nodesById});
    }    
}

export default function reducer(state: State = initialState, action: any = {}): State {
  
  switch (action.type) {
    
    case CLONE_NODE:
      return Object.assign({}, state, _cloneNode(state, action));

    case REMOVE_NODE:
      return Object.assign([], state, _removeNodes(state, action));
     
    case UPDATE_NODE_ATTRIBUTE:   
      return Object.assign({}, state, _updateNodeAttributes(state, action));

    case UPDATE_NODE_STYLE: 
      return Object.assign({}, state, _updateNodeStyles(state, action));

    case UPDATE_NODE_TRANSFORM:
      return Object.assign({}, state, _updateNodeTransforms(state, action));

    case INIT_NODES:
      return Object.assign({}, state, {..._cloneStaticTemplates(action.templates, action.blueprints)});

    case CLEAR_STATE:
      return Object.assign({}, state, initialState);

    default:
      return state;
  }
}


const _shouldClone = (path, enterKey, nodesByKey)=>{
  const [templateId, ...rest] = path;
  const subkey     = enterKey ? enterKey : "root";
  if (nodesByKey[templateId]){
    if (nodesByKey[templateId][subkey]){
      return false;
    }
  }
  return true;
}

function updateNodeAttribute(path:Array, property:string, value, enterKey:string, ts:number, index:number) {
 
  return (dispatch, getState)=>{
    
    //clone this node if we need to
    
    if (_shouldClone(path, enterKey, getState().live.nodesByKey)){
     
      dispatch({
          type: CLONE_NODE,
          enterKey,
          path,
          ts,
          index,
          blueprints: getState().canvas.templatesById,
      });
    }

    //update the node
    dispatch({
        type: UPDATE_NODE_ATTRIBUTE,
        path,
        property,
        value,
        enterKey,
    });
  };
}

function cloneNode(path:Array, enterKey, index){
  return (dispatch, getState)=>{

    if (_shouldClone(path, enterKey, getState().live.nodesByKey)){
      dispatch({
          type: CLONE_NODE,
          enterKey,
          path,
          ts: Date.now(),
          index,
          blueprints: getState().canvas.templatesById,
      });
    }
  }
}

function updateNodeStyle(path:Array, property:string, value, enterKey:string, ts:number, index:number){
  return (dispatch, getState)=>{

    if (_shouldClone(path, enterKey, getState().live.nodesByKey)){
      dispatch({
          type: CLONE_NODE,
          enterKey,
          path,
          ts,
          index,
          blueprints: getState().canvas.templatesById,
      });
    }

    dispatch({
      type: UPDATE_NODE_STYLE,
      path,
      property,
      value,
      enterKey,
    });
  }
}

function updateNodeTransform(path:Array, property:string, transform:string, enterKey:string, ts:number, index:number){

   return (dispatch, getState)=>{
  
  if (_shouldClone(path, enterKey, getState().live.nodesByKey)){
      
      //console.log("YES - cloning!");

      dispatch({
          type: CLONE_NODE,
          enterKey,
          path,
          ts,
          index,
          blueprints: getState().canvas.templatesById,
      });
    }

    dispatch({
        type: UPDATE_NODE_TRANSFORM,
        path,
        property,
        transform,
        enterKey,
    });
  }
}

function initNodes(){
  return (dispatch, getState)=>{
   
    dispatch({
      type: INIT_NODES,
      templates: getState().canvas.templates,
      blueprints: getState().canvas.templatesById,
    })
  }
}

function removeNode(nodeId, path, enterKey){
 
   return {
      type: REMOVE_NODE,
      enterKey,
      nodeId,
      path,
   }
}

function clearState(){
   return {
      type: CLEAR_STATE,
   }
}
// Selectors

const live = (state) => state[NAME];

export const selector = createStructuredSelector({
  live,
  node : (state, ownProps)=>{
    return state[NAME].nodesById[ownProps.id]
  },
});

export const actionCreators = {
  initNodes,
  updateNodeAttribute,
  updateNodeStyle,
  updateNodeTransform,
  removeNode,
  cloneNode,
  clearState,
};
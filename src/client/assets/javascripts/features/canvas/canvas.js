// @flow

import { createStructuredSelector } from 'reselect';
import { State } from 'models/canvas';
import {createTemplate, createGroupTemplate, typeForProperty, generateId, componentsFromTransform, scalePreservingOrigin, originForNode, templateForPath, pathBounds} from 'utils';
import _ from 'lodash';

const commands = ['M','m','L','l', 'H', 'h', 'V', 'v', 'C', 'c','S', 's', 'Q', 'q', 'T', 't', 'A', 'a', 'Z', 'z'];

// Action Types

const EXPAND                     = 'uibuilder/canvas/EXPAND';
const ROTATE                     = 'uibuilder/canvas/ROTATE';
const MOUSE_MOVE                 = 'uibuilder/canvas/MOUSE_MOVE';
const MOUSE_UP                   = 'uibuilder/canvas/MOUSE_UP';
const MOUSE_DOWN                 = 'uibuilder/canvas/MOUSE_DOWN';
const TEMPLATE_DROPPED           = 'uibuilder/canvas/TEMPLATE_DROPPED';
const GROUP_TEMPLATE_DROPPED     = 'uibuilder/canvas/GROUP_TEMPLATE_DROPPED';
const TEMPLATE_SELECTED          = 'uibuilder/canvas/TEMPLATE_SELECTED';
const TEMPLATE_PARENT_SELECTED   = 'uibuilder/canvas/TEMPLATE_PARENT_SELECTED';
const UPDATE_TEMPLATE_ATTRIBUTE  = 'uibuilder/canvas/UPDATE_TEMPLATE_ATTRIBUTE';
const UPDATE_TEMPLATE_STYLE      = 'uibuilder/canvas/UPDATE_TEMPLATE_STYLE';
const DELETE                     = 'uibuilder/canvas/DELETE';

// This will be used in our root reducer and selectors
export const NAME = 'canvas';



// Define the initial state for `shapes` module

const initialState: State = {
  templates: {},     //templates
  selected:null,
  x: 0,
  y: 0,
  dragging: false,
  expanding: false,
  rotating: false,
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
      case "text":
        return Object.assign({}, template, {x,y});
      
      case "ellipse":
      case "circle":
        return Object.assign({}, template, {cx:x,cy:y});

  }
  
  return template;
}

export function _scalePath(sf, path){
  
  let lasttoken = "";

  return path.split(/\s+/).map((token)=>{
    if (commands.indexOf(token.trim()) == -1){
           
      let [x, y] = token.split(",");
      x = parseFloat(x) * sf;
      y = parseFloat(y) * sf;
      return `${x},${y}`
    }
    lasttoken = token;
    return token;
  }).join(" ");

}

export function _expandPath(x,y, template){

  //calculate the new width of the path
  
  const b = pathBounds(template);
  const nw = x-b.x;
  const sf = nw/b.width; 
  return _scalePath(sf,template.path);
}


const _scaleTemplate = (template, sf)=>{
    switch (template.type){
      
      case "circle":
        return Object.assign({}, template, {
                                              r:template.r*sf,
                                              cx: template.cx*sf,
                                              cy: template.cy*sf,
                                            });

      case "ellipse":
        return Object.assign({}, template, {
                                              rx:template.rx*sf, 
                                              ry:template.ry*sf,  
                                              cx: template.cx*sf,
                                              cy: template.cy*sf,
                                          });

      case "rect":
        return Object.assign({}, template, {
                                                x: template.x*sf,
                                                y: template.y*sf,
                                                width:template.width*sf, 
                                                height:template.height*sf
                                            });

      case "path":
        return Object.assign({}, template, {d: _scalePath(sf,template.d)});

      case "group":
        return Object.assign({}, template, {
                                                width: template.width * sf,
                                                height: template.height * sf,
                                                children: Object.keys(template.children).reduce((acc,key)=>{
                                                      acc[key] = _scaleTemplate(template.children[key],sf)
                                                      return acc;
                                                },{})
                                            })
    }
}


const _rotateTemplate = (template, x, y)=>{
    switch (template.type){
        
        case "rect":
          
            const dx = x - template.x; 
            const r = 40 + template.height/2;

            console.log("dx is " + dx);
            console.log("r is " + r);
            console.log(dx/r);

            const theta = Math.asin(dx/r);
            console.log("theta is  " + theta);

            const angle = theta * (180/Math.PI)
            console.log("amgle is " + angle);
            return Object.assign({}, template, {
                transform: `rotate(${angle}, ${template.x + template.width/2}, ${template.y + template.height/2})`
            });

        default:
            return template;
    }
}

const _expandTemplate = (template, x, y)=>{
  
    switch (template.type){

      case "circle":
        const dx = x - template.cx;
        const dy = y - template.cy;
        const r  = Math.sqrt((dx*dx) + (dy*dy)); 
        return Object.assign({}, template, {r});

      case "ellipse":
        const rx = Math.abs(x - template.cx);
        const ry = Math.abs(y - template.cy); 
        return Object.assign({}, template, {rx, ry});
      
      case "rect":

        const right   = Math.abs(x - template.x) >  Math.abs(x- (template.x + template.width));
        const bottom  = Math.abs(y - template.y) > Math.abs(y - (template.y + template.height));

        if (right && bottom){
            return Object.assign({}, template, {width:x-template.x,height:y-template.y})
        }
        if (right && !bottom){
            return Object.assign({}, template, {
                                                  width:x-template.x, 
                                                  y:y,
                                                  height: template.height + template.y-y
                                                });
        }
        if (!right && bottom){
             return Object.assign({}, template, {
                                                    x: x,
                                                    width: template.width + template.x-x,
                                                    height:y-template.y})
        }

        if (!right && !bottom){
          return Object.assign({}, template, {
                                                  x: x,
                                                  y: y,
                                                  width: template.width + template.x-x,
                                                  height: template.height + template.y-y
                                              });
          
        }

      case "path":

        return Object.assign({}, template, {
                                                d: _expandPath(x,y,template)

                                            });

      //recursively alter size of all!

      case "group":
         const nw = x-template.x;
         const nh = y-template.y;
         const sf = Math.max(nw/template.width, nh/template.height);
         if (sf > 0){
            const attrs = {
              width: sf * template.width,
              height: sf * template.height,
            }
         
            return Object.assign({}, template, {
                                                ...attrs,
                                                children: Object.keys(template.children).reduce((acc,key)=>{
                                                      acc[key] = _scaleTemplate(template.children[key],sf);
                                                      return acc;
                                                },{})
                                            })
        }

        return template;

      default:
        return template;
    }
}

const _deleteTemplate = (state)=>{

    if (state.selected && state.selected.path){

        const [id, ...rest] = state.selected.path;
      
        return  Object.keys(state.templates).reduce((acc,key)=>{
            if (key !== id){
              acc[key] = state.templates[key];
            }
            return acc;
        },{});     
    }

    return state.templates;
}

const _modifyTemplate = (state, action)=>{

    if (state.selected){
        const [id,...rest] = state.selected.path;
        const _tmpl = state.templates[id];

        if (state.dragging){
          return Object.assign({}, state.templates, {[id] : _moveTemplate(_tmpl, action.x-state.dx, action.y-state.dy)});       
        }

        if (state.expanding){
          return Object.assign({}, state.templates, {[id] : _expandTemplate(_tmpl, action.x, action.y)});
        }

        if (state.rotating){
          return Object.assign({}, state.templates, {[id] : _rotateTemplate(_tmpl, action.x, action.y)});
        }
    }

    return state.templates;

}


const _templatecoords = (template)=>{

  switch(template.type){
    
    case "rect":
    case "group":
    case "text":
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
                                            dragging: !state.expanding,
                                            dx: state.x-x,
                                            dy: state.y-y,
                                        });
      return state;

    case MOUSE_UP:
       return Object.assign({}, state,  {
                                            selected: state.expanding? state.selected: null,
                                            dragging: false,
                                            expanding: false,
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

    case EXPAND:
      return Object.assign({}, state, {expanding:true, dragging:false, rotating:false});

    case ROTATE:
      return Object.assign({}, state, {expanding:false, dragging:false, rotating:true});

    case DELETE:
      return Object.assign({}, state, {templates: _deleteTemplate(state), selected: null});

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

function onExpand(templateId){
  return {
    type: EXPAND,
    templateId,
  }
}

function onRotate(){
  return {
    type: ROTATE,
  }
}

function deletePressed(){

  return {
    type: DELETE,
  }
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
  onExpand,
  onRotate,
  deletePressed,
  templateDropped,
  groupTemplateDropped,
  templateSelected,
  templateParentSelected,
  updateTemplateAttribute,
  updateTemplateStyle,
};
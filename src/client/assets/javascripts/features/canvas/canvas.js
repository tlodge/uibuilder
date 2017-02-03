// @flow

import { createStructuredSelector } from 'reselect';
import { State } from 'models/canvas';
import {createTemplate, createGroupTemplate, typeForProperty, generateId, componentsFromTransform, scalePreservingOrigin, originForNode, templateForPath, pathBounds} from 'utils';

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

let _x =0, _y=0;

// Define the initial state for `shapes` module

const initialState: State = {
  templates: [],
  templatesById: {},     //templates
  selected:null,
  //x: 0,
  //y: 0,
  dragging: false,
  expanding: false,
  rotating: false,
  dx: 0, //drag x pos
  dy: 0, //drag y pos
};



/*
example templates : ["xyza"],

example templatesforID
{
  xyza: {
      id: xyz,
      type: "group",
      children : ["xyzab", "xyzb"],
  },

  xyzab: {
      id: "xyzab",
      type: "circle",
      cx: 69,
      ...
  },

  xyzb: {
      id: "xyzb",
      type: "circle",
      cx: 67,
      ...
  },

}*/


const _updateTemplateStyle = (state, action)=>{
  const path = action.path;

  if (path.length == 0){
    return templates;
  }

  const [id, ...rest] = action.path;

  if (path.length == 1){
    const template = Object.assign({},state.templatesById[id]);
    template.style = Object.assign({}, template.style, {[action.property]:action.value});
    return Object.assign({}, state.templatesById, {[template.id]: template});
  }
  
  return Object.assign({}, state.templatesById, {
                                          [id] :  Object.assign({}, state.templatesById[id], {
                                                children: _updateTemplateStyle(state.templatesById[id].children, {
                                                path: rest,
                                                property: action.property,
                                                value: action.value,
                                              })
                                          })});

  // _updateTemplateStyle(templates.children[id], )});
}


const _updateTemplateAttribute = (state, action)=>{

  const path = action.path;


  if (path.length == 0){
    return state.templatesById;
  }

  const [id, ...rest] = action.path;

  if (path.length == 1){
    const template = Object.assign({},state.templatesById[id], {[action.property]:action.value});
    return Object.assign({}, state.templatesById, {[template.id]: template});
  }

  return Object.assign({}, state.templatesById, {
                                          [id] :  Object.assign({}, state.templatesById[id], {
                                              children: _updateTemplateAttribute(state.templatesById[id].children, {
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
   let angle=0;
 
  if (template.transform){
      const {rotate} = componentsFromTransform(template.transform);
      if (rotate && rotate.length > 0){
        angle = 180 - rotate[0];
      }
  }
  
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
  return _scalePath(sf,template.d);
}


const _scaleTemplate = (templates, id, sf)=>{
    
    const template = templates[id];

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
                                               
                                            })
    }
}


const _theta =(cx,cy,x,y)=>{
  const a = cy - y ;
  const b = x  - cx;
  const theta = Math.atan(b/a);

  return y <= cy ? theta * (180/Math.PI) : 180 + (theta * (180/Math.PI));
} 


const _rotateTemplate = (template, x, y)=>{
    let cx,cy, angle;
    
    switch (template.type){
        
        case "group":
            cy = template.y + template.height/2;
            cx = template.x + template.width/2;
            angle = _theta(cx,cy,x,y)
            return Object.assign({}, template, {
                transform: `rotate(${angle}, ${template.width/2}, ${template.height/2})`
            });
            break;
        

        case "rect":
            cy = template.y + template.height/2;
            cx = template.x + template.width/2;
            angle = _theta(cx,cy,x,y)
             return Object.assign({}, template, {
                transform: `rotate(${angle}, ${template.width/2}, ${template.height/2})`
            });
            break;

        case "ellipse":
        case "circle":
            cx = 0;//template.cx;
            cy = 0;//template.cy;
            angle = _theta(template.cx,template.cy,x,y);
            return Object.assign({}, template, {
                transform: `rotate(${angle}, ${0}, ${0})`
            });
            break;

        default:
            angle = 0;
            cx = 0;
            cy = 0;
    }

     return Object.assign({}, template, {
                transform: `rotate(${angle}, ${cx}, ${cy})`
            });
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

      case "group":
         const nw = x-template.x;
         const nh = y-template.y;
         const sf = Math.max(nw/template.width, nh/template.height);
         
         if (sf > 0){
            const attrs = {
              width: sf * template.width,
              height: sf * template.height,
            }
            return Object.assign({}, template, {...attrs})
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

const _expandChildren = (templates, children, sf)=>{
  
  return (children || []).reduce((acc,id)=>{
      acc = {
          ...acc, 
          ...{[id]:_scaleTemplate(templates, id, sf)}, 
          ..._expandChildren(templates, templates[id].children || [],  sf)
      }
      return acc;
  },{})
}

const _expandTemplates = (state, action)=>{
    
    const [id,...rest] = state.selected.path;

    const _tmpl = state.templatesById[id];

    const  _t = _expandTemplate(_tmpl, action.x, action.y);

    if (_tmpl.type != "group"){
      return Object.assign({}, state.templatesById, {[_t.id]:_t})
    } 
    else{
      const nw = action.x-_tmpl.x;
      const nh = action.y-_tmpl.y;
      const sf = Math.max(nw/_tmpl.width, nh/_tmpl.height);
      return Object.assign({}, state.templatesById, {[_t.id]:_t, ..._expandChildren(state.templatesById, _tmpl.children, sf)});
    } 
} 

const _modifyTemplate = (state, action)=>{

    if (state.selected){
        const [id,...rest] = state.selected.path;
        const _tmpl = state.templatesById[id];

        if (state.expanding){
          return Object.assign({}, state.templatesById, _expandTemplates(state, action));
        }

        if (state.dragging){
          return Object.assign({}, state.templatesById, {[id] : _moveTemplate(_tmpl, action.x-state.dx, action.y-state.dy)});       
        }

         if (state.rotating){
          return Object.assign({}, state.templatesById, {[id] : _rotateTemplate(_tmpl, action.x, action.y)});
        }
    }

    return state.templatesById;

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
      
      _x = action.x;
      _y = action.y;

      if (!state.selected)
        return state;

      return {
        ...state,
        templatesById: _modifyTemplate(state, action),
      }

    case MOUSE_DOWN:


      const {path} = action.path;
      const [id,...rest] = path;
      const _tmpl = state.templatesById[id];
      const {x,y} = _templatecoords(_tmpl);

      return Object.assign({}, state,  {
                                            selected: action.path,
                                            dragging: !state.expanding && !state.rotating,
                                            dx: _x-x,
                                            dy: _y-y,
                                        });
      return state;

    case MOUSE_UP:
       return Object.assign({}, state,  {
                                            selected: state.expanding || state.rotating ? state.selected: null,
                                            dragging: false,
                                            expanding: false,
                                            rotating: false,
                                        });
    
    case TEMPLATE_DROPPED:
      const template = createTemplate(action.template, action.x, action.y);
      template.enterKey = "id";

      return Object.assign({}, state, {
                                          templates: [...state.templates, template.id],
                                          templatesById: {...state.templatesById, ...{[template.id]:template}},
                                          selected: {path:[template.id], type:template.type},
                                       });
    
    case GROUP_TEMPLATE_DROPPED:
      const {root, templates} = createGroupTemplate(action.children, action.x, action.y);
      root.enterKey = "id";
      return Object.assign({}, state, {
                                          templates: [...state.templates, root.id],
                                          templatesById: {...state.templatesById, ...{[root.id]:root, ...templates}},//{[grouptemplate.id]:grouptemplate}),
                                          selected: {path:[root.id], type:'group'},
                                        });
    
    case TEMPLATE_SELECTED: 
      return Object.assign({}, state,  {selected: action.path});

    case TEMPLATE_PARENT_SELECTED: 
      return Object.assign({}, state,  {selected: _selectParent(state,action)});

   
    case UPDATE_TEMPLATE_STYLE: 
      return Object.assign({}, state, {templatesById:_updateTemplateStyle(state,action)});

    case UPDATE_TEMPLATE_ATTRIBUTE:
      return Object.assign({}, state, {templatesById:_updateTemplateAttribute(state,action)});

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
  canvas,
  
  template : (state, ownProps)=>{
    return state[NAME].templatesById[ownProps.id]
  },
  
  selected : (state)=>{
    return state[NAME].selected ? state[NAME].selected.path : [];
  },
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
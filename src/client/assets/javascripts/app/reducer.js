import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import templates, {NAME as templateName} from 'features/palette';
import editor, {NAME as editorName} from 'features/editor';
import canvas, {NAME as canvasName} from 'features/canvas';

export default combineReducers({
  routing,
  [editorName]: editor,
  [canvasName]: canvas,
  [templateName]: templates,
});

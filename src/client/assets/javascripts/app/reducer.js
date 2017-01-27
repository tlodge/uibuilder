import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import templates, {NAME as templateName} from 'features/palette';
import editor, {NAME as editorName} from 'features/editor';
import canvas, {NAME as canvasName} from 'features/canvas';
import live, {NAME as liveName} from 'features/live';
import mapper, {NAME as mapperName} from 'features/mapper';
import sources, {NAME as sourceName} from 'features/sources';

export default combineReducers({
  routing,
  [editorName]: editor,
  [canvasName]: canvas,
  [liveName]: live,
  [templateName]: templates,
  [mapperName]: mapper,
  [sourceName]: sources,
});

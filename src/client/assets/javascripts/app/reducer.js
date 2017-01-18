import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import templates, {NAME as templateName} from 'features/palette';
import editor, {NAME as editorName} from 'features/editor';
import canvas, {NAME as canvasName} from 'features/canvas';
import mapper, {NAME as mapperName} from 'features/mapper';
import sources, {NAME as sourceName} from 'features/sources';
import friends, {NAME as friendsName} from 'features/friends';
export default combineReducers({
  routing,
  [friendsName]: friends,
  [editorName]: editor,
  [canvasName]: canvas,
  [templateName]: templates,
  [mapperName]: mapper,
  [sourceName]: sources,
});

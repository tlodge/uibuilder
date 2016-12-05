import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { Flex, Box } from 'reflexbox'
import { DragSource } from 'react-dnd';


function connect(connect, monitor){
    
    return{
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }
};

const ItemTypes = {
  BOX: 'box'
};

const boxSource = {

  beginDrag(props) {
    return {
      name: props.type
    };
  },

  endDrag(props, monitor) {
    console.log("drag ended!!!");
    console.log(props);
    //const {nt, def, reducer} = props;
    //const {x,y} = monitor.getClientOffset();
    //props.handleDrop(reducer, nt, def, x, y);
  }
};


class TemplateItem extends Component {
  static propTypes = {
    selectTemplate: PropTypes.func.isRequired,
    id: PropTypes.number.isRequired,
    selected: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
  };

  render() {
    const { isDragging, connectDragSource } = this.props;

    const draggable = connectDragSource(  <button className="btn btn-default btnAction" onClick={() => this.props.selectTemplate(this.props.id)}>
            <i className={classnames('fa', { 'fa-star': this.props.selected}, { 'fa-star-o': !this.props.selected})} />
          </button>);
    
    return (
      <Box col={12} p={2} style={{textAlign:'center'}}>
        <div className="templateInfo">
          <div><span>{this.props.type}</span></div>
        </div>
        <div className="templateActions">
           {draggable}
        </div>
      </Box>
    );
  }
}

export default DragSource(ItemTypes.BOX, boxSource, connect)(TemplateItem);
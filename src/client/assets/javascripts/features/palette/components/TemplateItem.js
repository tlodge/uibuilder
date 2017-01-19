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
  TEMPLATE: 'template'
};

const templateSource = {

  beginDrag(props) {
    return {
      template: props.type,
      children: props.children,
    };
  },

};


class TemplateItem extends Component {
  static propTypes = {
    selectTemplate: PropTypes.func.isRequired,
    id: PropTypes.number.isRequired,
    selected: PropTypes.bool.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
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
          <div><span>{this.props.name}</span></div>
        </div>
        <div className="templateActions">
           {draggable}
        </div>
      </Box>
    );
  }
}

export default DragSource(ItemTypes.TEMPLATE, templateSource, connect)(TemplateItem);
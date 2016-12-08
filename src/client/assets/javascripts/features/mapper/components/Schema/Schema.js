import React, { Component, PropTypes } from 'react';
import { Flex,Box } from 'reflexbox';

export default class Schema extends Component {

	  static propTypes = {
    		schema: PropTypes.object.isRequired,
    		onSelect: PropTypes.func.isRequired
  	  };

  	  render(){

  	  	const items = Object.keys(this.props.schema).map((key,i)=>{
  	  		return <Box key={i} onClick={this.props.onSelect.bind(null,key)}>{key}</Box>
  	  	});


  	  	return <Flex flexColumn={true}>{items}</Flex>
  	  }
}
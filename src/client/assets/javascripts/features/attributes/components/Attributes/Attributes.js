import React, { Component, PropTypes } from 'react';
import { Flex,Box } from 'reflexbox';

export default class Attributes extends Component {

	    static propTypes = {
    		template: PropTypes.object.isRequired,
  	  };

  	  render(){
  	  	return <Flex flexColumn={true}>{template.type}</Flex>
      }
    
}
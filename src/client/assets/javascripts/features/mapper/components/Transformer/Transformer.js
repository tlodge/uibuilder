import React, { PureComponent } from 'react';
import Dialog from 'react-md/lib/Dialogs';
import Button from 'react-md/lib/Buttons/Button';
import TextField from 'react-md/lib/TextFields';

import {schemaLookup} from '../../../../utils';

export default class Transformer extends PureComponent {
  
  constructor(props) {
    super(props);
    console.log("rendering transformer and props are");
    console.log(props);

    this.state = {buffer:props.transformer || null}
  }
  
  closeDialog = () => {
    this.props.closeDialog();
  };

  saveDialog = () => {
    this.props.saveDialog(this.state.buffer);
  };

  renderTransformer(key){

    return <TextField
              id="function"
              placeholder={`return ${key}`}
              block
              rows={4}
              value={this.state.buffer || `return ${key}`} 
              onChange={(e)=>{
                            
                                this.setState({buffer:e})
                            }
                        }
            />
  }

 
  render() {
    const { selectedMapping } = this.props;

  
    const {from,to} = selectedMapping || {from:null,to:null};
    let ftype = null;
    let ttype = null;


    if (from){ 
        ftype = from.type;
    }

    if (to){
      const schema = {...schemaLookup(to.type).attributes, ...schemaLookup(to.type).style}; 
      const property = schema[to.property];
      ttype = property ? property.type : null;
    }

    return (
      <div>
        <Dialog
          id="transformer"
          visible={this.props.selectedMapping != null}
          title="Transformer"
          onHide={this.closeDialog}
          aria-labelledby="transformerDescription"
          modal
          actions={[{
            onClick: this.saveDialog,
            primary: true,
            label: 'done',
          }, {
            onClick: this.closeDialog,
            primary: true,
            label: 'cancel',
          }]}
        >
          <div>
            <strong>{from.key}:{ftype}->{ttype}</strong>
            {this.renderTransformer(from.key)}   
          </div>
        </Dialog>
      </div>
    );
  }
}
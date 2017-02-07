import React, { PureComponent } from 'react';


export default class Death extends PureComponent {
  
  
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <ul>
          <li>
              <strong> never </strong>
          </li>
          <li>
            <strong> when data is x </strong>
          </li>
          <li>
            <strong> when teher are more than x </strong>
          </li>
          <li>
            <strong> after x new data events </strong>
          </li>
        </ul>
      </div>
    );
  }

}
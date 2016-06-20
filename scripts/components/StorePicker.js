import React from 'react';
import { History } from 'react-router';
import reactMixin from 'react-mixin';

import h from '../helpers';

class StorePicker extends React.Component {

  goToStore(e) {
    e.preventDefault();

    // get data from input
    var storeId = this.refs.storeId.value;

    // transition from StorePicker to App
    this.history.pushState(null, '/store/' + storeId);
  }

  render() {
    return (
      <form className="store-selector" onSubmit={ this.goToStore }>
        <h2>Please Enter a Store</h2>
        <input
          type="text"
          ref="storeId"
          defaultValue={ h.getFunName() }/>
        <input type="submit"/>
      </form>
    )
  }
}

reactMixin.onClass(StorePicker, History);

export default StorePicker;

import React from 'react';

import autobind from 'autobind-decorator';

import AddFishForm from './AddFishForm';

@autobind
class Inventory extends React.Component {

  constructor() {
    super();
    this.state = {
      uid: ''
    }
  }

  _renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
          <button className="github">Log in with GitHub</button>
      </nav>
    )
  }

  _renderInventory(key) {
    var linkState = this.props.linkState;
    return (
      <div className="fish-edit" key={ key }>
        <input type="text" valueLink={linkState('fishes.' + key +     '.name')}/>
        <input type="text" valueLink={linkState('fishes.' + key +     '.price')}/>
        <select valueLink={ linkState('fishes.' + key + '.status')}>
          <option value="unavailable">Sold Out!</option>
          <option value="available">Fresh!</option>
        </select>

        <textarea valueLink={ linkState('fishes.' + key + '.desc')}></textarea>
        <input type="text" valueLink={linkState('fishes.' + key +     '.image')}/>
        <button onClick={ this.props._removeFish.bind(null, key) }>Remove Fish</button>

      </div>
    )
  }

  render() {
    // first check if they aren't logged in
    if (!this.state.uid) {
      return (
        <div>
          { this._renderLogin() }
        </div>
      )
    }
    return (
      <div>
        <h2>INVENTORY</h2>
        { Object.keys(this.props.fishes).map(this._renderInventory) }
        <AddFishForm { ...this.props }/>
        <button onClick={ this.props._loadSamples }>Load Sample Fishes</button>
      </div>
    )
  }
}

Inventory.propTypes = {
  fishes: React.PropTypes.object.isRequired,
  _loadSamples: React.PropTypes.func.isRequired,
  _addFish: React.PropTypes.func.isRequired,
  _removeFish: React.PropTypes.func.isRequired,
  linkState: React.PropTypes.func.isRequired
}

export default Inventory;

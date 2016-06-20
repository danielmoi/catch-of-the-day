import React from 'react';

import autobind from 'autobind-decorator';

import AddFishForm from './AddFishForm';

import Firebase from 'firebase';
const ref = new Firebase('https://catch-4000.firebaseio.com/');

@autobind
class Inventory extends React.Component {

  constructor() {
    super();
    this.state = {
      uid: ''
    }
  }

  _authenticate(provider) {
    ref.authWithOAuthPopup(provider, this._authHandler);
  }

  _authHandler(err, authData) {
    if (err) {
      console.err(err);
      return;
    }

    const storeRef = ref.child(this.props.params.storeId);

    storeRef.on('value', (snapshot) => {
      var data = snapshot.val() || {};

      // claim it as our own if no owner already
      if (!data.owner) {
        storeRef.set({
          owner: authData.uid
        })
      }

      // update state
      this.setState({
        uid: authData.uid,
        owner: data.owner || authData.uid
      })
    })
  }

  _renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
          <button
            className="github"
            onClick={ this._authenticate.bind(this, 'github') }>
            Log in with GitHub
          </button>
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

    let logoutButton = <button>Log out!</button>

    // first check if they aren't logged in
    if (!this.state.uid) {
      return (
        <div>
          { this._renderLogin() }
        </div>
      )
    }

    // check if they aren't the owner of current store
    if (!this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry, you aren't the owner of this store</p>
          { logoutButton }
        </div>
      )
    }

    return (
      <div>
        <h2>INVENTORY</h2>
        { logoutButton }
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

import React from 'react';
import Catalyst from 'react-catalyst';
import Rebase from 're-base';
var base = Rebase.createClass('https://catch-4000.firebaseio.com');

import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';


var App = React.createClass({
  mixins: [ Catalyst.LinkedStateMixin ],

  getInitialState: function() {
    return {
      fishes: {},
      order: {}
    }
  },
  componentDidMount: function() {
    base.syncState(this.props.params.storeId + '/fishes', {
      context: this,
      state: 'fishes'
    });
    var localStorageRef = localStorage.getItem('order-' + this.props.params.storedId);

    if (localStorageRef) {
      // update our component state to reflect what is in localStorage
      this.setstate({
        order: JSON.parse(localStorageRef)
      })
    }
  },
  componentWillUpdate: function(nextProps, nextState) {
    localStorage.setItem('order-' + this.props.params.storeId, JSON.stringify(nextState.order));
  },
  _addFish: function(fish) {
    // create unique key for fish
    var timeStamp = new Date().getTime();

    // update state object
    this.state.fishes['fish-' + timeStamp] = fish;

    // set state
    this.setState({ fishes: this.state.fishes });

  },
  _removeFish: function(key) {
    if (confirm("Are you sure you want to remove this fish?")) {
      this.state.fishes[key] = null;
      this.setState({
        fishes: this.state.fishes
      })
    }

  },
  _addToOrder: function(key) {
    this.state.order[key] = this.state.order[key] + 1 || 1;
    this.setState({ order: this.state.order });
  },
  _removeFromOrder: function(key) {
    delete this.state.order[key];
    this.setState({
      order: this.state.order
    });
  },
  _loadSamples: function() {
    this.setState({
      fishes: require('../sample-fishes')
    });
  },
  _renderFish: function(key) {
    return (
      <Fish
        key={ key }
        index={ key }
        details={ this.state.fishes[key] }
        _addToOrder={ this._addToOrder }/>

    )
  },
  render: function() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market"/>
          <ul className="list-of-fishes">
            { Object.keys(this.state.fishes).map(this._renderFish) }
          </ul>
        </div>
        <Order
          fishes={ this.state.fishes }
          order={ this.state.order }
          _removeFromOrder={ this._removeFromOrder }/>

        <Inventory
          _addFish={ this._addFish }
          _loadSamples={ this._loadSamples }
          fishes={ this.state.fishes }
          linkState={ this.linkState }
          _removeFish={ this._removeFish } />
      </div>
    )
  }
});

export default App;

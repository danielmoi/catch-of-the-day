import React from 'react';
import Catalyst from 'react-catalyst';
import Rebase from 're-base';
var base = Rebase.createClass('https://catch-4000.firebaseio.com');

import reactMixin from 'react-mixin';
import autobind from 'autobind-decorator';

import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import Fish from './Fish';

@autobind
class App extends React.Component {

  constructor() {
    super();

    this.state = {
      fishes: {},
      order: {}
    }
  }

  componentDidMount() {
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
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem('order-' + this.props.params.storeId, JSON.stringify(nextState.order));
  }

  _addFish(fish) {
    // create unique key for fish
    var timeStamp = new Date().getTime();

    // update state object
    this.state.fishes['fish-' + timeStamp] = fish;

    // set state
    this.setState({ fishes: this.state.fishes });

  }

  _removeFish(key) {
    if (confirm("Are you sure you want to remove this fish?")) {
      this.state.fishes[key] = null;
      this.setState({
        fishes: this.state.fishes
      })
    }

  }

  _addToOrder(key) {
    this.state.order[key] = this.state.order[key] + 1 || 1;
    this.setState({ order: this.state.order });
  }

  _removeFromOrder(key) {
    delete this.state.order[key];
    this.setState({
      order: this.state.order
    });
  }

  _loadSamples() {
    this.setState({
      fishes: require('../sample-fishes')
    });
  }

  _renderFish(key) {
    return (
      <Fish
        key={ key }
        index={ key }
        details={ this.state.fishes[key] }
        _addToOrder={ this._addToOrder }/>

    )
  }

  render() {
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
          linkState={ this.linkState.bind(this) }
          _removeFish={ this._removeFish }
          {...this.props }/>
      </div>
    )
  }
}

reactMixin.onClass(App, Catalyst.LinkedStateMixin)

export default App;

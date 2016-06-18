var React = require('react');
var ReactDOM = require('react-dom');

var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;

var History = ReactRouter.History;

var createBrowserHistory = require('history/lib/createBrowserHistory');

var h = require('./helpers.js');

var Rebase = require('re-base');
var base = Rebase.createClass('https://catch-4000.firebaseio.com');

var Catalyst = require('react-catalyst');


// App
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
  _loadSamples: function() {
    this.setState({
      fishes: require('./sample-fishes')
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
          order={ this.state.order }/>

        <Inventory
          _addFish={ this._addFish }
          _loadSamples={ this._loadSamples }
          fishes={ this.state.fishes }
          linkState={ this.linkState }
          _removeFish={ this._removeFish }/>
      </div>
    )
  }
});

// Fish
var Fish = React.createClass({
  _onButtonClick: function() {
    console.log('Adding', this.props.index);
    this.props._addToOrder(this.props.index);
  },
  render: function() {
    var details = this.props.details;
    var isAvailable = details.status === 'available' ? true : false;
    var buttonText = isAvailable ? 'Add To Order' : 'Sold Out!';
    return (
      <li className="menu-fish">
        <img src={ details.image } alt={ details.name }/>
        <h3 className="fish-name">
          { details.name }
          <span className="price">{ h.formatPrice(details.price) }</span>
        </h3>
        <p> { details.desc }</p>
        <button
          disabled={ !isAvailable }
          onClick={ this._onButtonClick }>{ buttonText }
        </button>
      </li>
    )
  }
});


// Add Fish Form
var AddFishForm = React.createClass({
  _createFish: function(e) {
    e.preventDefault();

    // Take data from form and create an object
    var fish = {
      name: this.refs.name.value,
      price: this.refs.price.value,
      status: this.refs.status.value,
      desc: this.refs.desc.value,
      image: this.refs.image.value
    };

    // Add fish to App State
    this.props._addFish(fish);

    // reset form
    this.refs.fishForm.reset();
  },
  render: function() {
    return (
      <form className="fish-edit" ref="fishForm" onSubmit={ this._createFish }>
        <input type="text" ref="name" placeholder="Fish Name"/>
        <input type="text" ref="price" placeholder="Fish Price"/>
        <select ref="status">
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold out!</option>
        </select>
        <textarea type="text" ref="desc" placeholder="Desc"></textarea>
        <input type="text" ref="image" placeholder="URL to image"/>
        <button type="submit">Add Item</button>
      </form>
    )
  }
})

// Header
var Header = React.createClass({
  render: function() {
    return (
      <header className="top">
        <h1>Catch
          <span className="ofThe">
            <span className="of">of</span>
            <span className="the">the</span>
          </span>
          Day</h1>
        <h3 className="tagline">
          <span>{ this.props.tagline }</span>
        </h3>
      </header>
    )
  }
});

// Order
var Order = React.createClass({
  renderOrder: function(key) {
    var fish = this.props.fishes[key];
    var count = this.props.order[key];

    if (!fish) {
      return (
        <li key={ key }>Sorry, fish no longer available!</li>
      )
    }

    return (

      <li key={ key }>
        { count } lbs – { fish.name }
        <span className="price">{ h.formatPrice(count * fish.price) }</span>
      </li>
    )
  },
  render: function() {
    var orderIDs = Object.keys(this.props.order);
    var total = orderIDs.reduce((total, next) => {
      var fish = this.props.fishes[next];
      var count = this.props.order[next];
      var isAvailable = fish && fish.status === 'available';

      if (fish && isAvailable) {
        return total + (count * parseInt(fish.price) || 0);
      }

      return total;
    }, 0);
    return (
      <div className="order-wrap">
        <h2 className="order-title">Your Order</h2>
        <ul className="order">
          { orderIDs.map(this.renderOrder) }
          <li className="total">
            <strong>Total: </strong>{h.formatPrice(total)}</li>
        </ul>
      </div>
    )
  }
});

// Inventory
var Inventory = React.createClass({
  _renderInventory: function(key) {
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
  },
  render: function() {
    return (
      <div>
        <h2>INVENTORY</h2>
        { Object.keys(this.props.fishes).map(this._renderInventory) }
        <AddFishForm { ...this.props }/>
        <button onClick={ this.props._loadSamples }>Load Sample Fishes</button>
      </div>
    )
  }
});

// StorePicker
// This will let us create a <StorePicker /> element
var StorePicker = React.createClass({
  mixins: [ History ],
  goToStore: function(e) {
    e.preventDefault();

    // get data from input
    var storeId = this.refs.storeId.value;

    // transition from StorePicker to App
    this.history.pushState(null, '/store/' + storeId);
  },
  render: function() {
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
});

// 404
var NotFound = React.createClass({
  render: function() {
    return (
      <h1>Not Found!</h1>
    )
  }
})

var routes = (
  <Router history={ createBrowserHistory() }>
    <Route path='/' component={ StorePicker } />
    <Route path='/store/:storeId' component={ App } />
    <Route path='*' component={ NotFound } />
  </Router>
)

ReactDOM.render(routes, document.getElementById('main'));

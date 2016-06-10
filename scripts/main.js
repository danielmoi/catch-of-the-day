var React = require('react');
var ReactDOM = require('react-dom')

// StorePicker
// This will let us create a <StorePicker /> element

var StorePicker = React.createClass({
  render: function() {
    return (
      <form className="store-selector">
        <h2>Please Enter a Store</h2>
        <input type="text" ref="storeId"/>
        <input type="submit"/>
      </form>
    )
  }
});

ReactDOM.render(<StorePicker/>, document.getElementById('main'));

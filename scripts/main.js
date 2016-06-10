var React = require('react');
var ReactDOM = require('react-dom')

// StorePicker
// This will let us create a <StorePicker /> element

var StorePicker = React.createClass({
  render: function() {
    return (
      <p>STORE PICKER</p>
    )
  }
});

ReactDOM.render(<StorePicker/>, document.getElementById('main'));

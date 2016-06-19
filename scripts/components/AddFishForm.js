import React from 'react';

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
});

export default AddFishForm;

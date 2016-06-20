import React from 'react';

import autobind from 'autobind-decorator';

import h from '../helpers';

@autobind
class Fish extends React.Component {

  _onButtonClick() {
    this.props._addToOrder(this.props.index);
  }

  render() {
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
}

export default Fish;

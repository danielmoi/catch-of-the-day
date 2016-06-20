import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';

import autobind from 'autobind-decorator';

import h from '../helpers';

@autobind
class Order extends React.Component {

  renderOrder(key) {
    var fish = this.props.fishes[key];
    var count = this.props.order[key];
    var removeButton = <button onClick={ this.props._removeFromOrder.bind(null, key) }>&times;</button>

    if (!fish) {
      return (
        <li key={ key }>Sorry, fish no longer available! { removeButton }</li>
      )
    }

    return (
      <li key={ key }>
        <span>
          <CSSTransitionGroup
            component="span"
            transitionName="count"
            transitionLeaveTimeout={250}
            transitionEnterTimeout={250}>
            <span key={ count }>{ count } </span>
          </CSSTransitionGroup>
           lbs { fish.name } { removeButton }
        </span>
        <span className="price">{ h.formatPrice(count * fish.price) }</span>
      </li>
    )
  }

  render() {
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

        <CSSTransitionGroup
          className="order"
          component="ul"
          transitionName="order"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}>
          { orderIDs.map(this.renderOrder) }
          <li className="total">
            <strong>Total: </strong>{h.formatPrice(total)}</li>
        </CSSTransitionGroup>

      </div>
    )
  }

}

Order.propTypes = {
  order: React.PropTypes.object.isRequired,
  fishes: React.PropTypes.object.isRequired,
  _removeFromOrder: React.PropTypes.func.isRequired
}
export default Order;

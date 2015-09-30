var React = require('react');
var Utils = require('../utils.js');

var componentsList = [];
var isListenerSet = false;

var updateListVisibility = () => {
  componentsList.forEach((component) => {
    if (!component.state || !component.state.isVisible) {
      component.updateVisibility();
    }
  });
};

var ReactFastAndLazy = React.createClass({
  updateVisibility () {
    var bounds = this.getDOMNode().getBoundingClientRect(),
      scrollTop = Utils.getScrollTop(),
      top = bounds.top + scrollTop,
      height = bounds.bottom - bounds.top;

    if (top === 0 || (top < (scrollTop + window.innerHeight) && (top + height) > scrollTop)) {
      this.setState({
        isVisible: true
      });
    }
  },
  componentDidMount () {
    var node = this.getDOMNode();

    if (!isListenerSet) {
      window.addEventListener('scroll', updateListVisibility);
      isListenerSet = true;
    }

    componentsList.push(this);
    this.updateVisibility();
  },
  componentDidUpdate () {
    if (!this.state || !this.state.isVisible) {
      this.updateVisibility();
    }
  },
  componentWillUnmount () {
    var indexOfComponent = componentsList.indexOf(this);
    if (indexOfComponent !== -1) {
      componentsList.splice(indexOfComponent, 1);
    }
  },
  render () {
    return React.createElement("div", {},
            this.state && this.state.isVisible ? this.props.children : ''
    )
});

module.exports = ReactFastAndLazy;

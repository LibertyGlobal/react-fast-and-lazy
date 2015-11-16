var React = require('react');

var componentsList = [];
var isListenerSet = false;

var updateListVisibility = function () {
    componentsList.forEach(function (component) {
        if (!component.state || !component.state.isVisible) {
            component.updateVisibility();
        }
    });
};

var getScrollTop = function () {
    var B;
    var D;

    if (typeof window.pageYOffset !== 'undefined') {
        return window.pageYOffset;
    } else {
        B = window.document.body;
        D = window.document.documentElement;
        D = (D.clientHeight) ? D : B;
        return D.scrollTop;
    }
};

var debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

var ReactFastAndLazy = React.createClass({
    updateVisibility: function () {
        var bounds = this.getDOMNode().getBoundingClientRect(),
            scrollTop = getScrollTop(),
            top = bounds.top + scrollTop,
            height = bounds.bottom - bounds.top;

        if (top === 0 || (top < (scrollTop + window.innerHeight) && (top + height) > scrollTop)) {
            this.setState({
                isVisible: true
            });
        }
    },
    componentDidMount: function () {
        var node = this.getDOMNode();

        if (!isListenerSet) {
            window.addEventListener('scroll', debounce(updateListVisibility, 200));
            isListenerSet = true;
        }

        componentsList.push(this);
        this.updateVisibility();
    },
    componentDidUpdate: function () {
        if (!this.state || !this.state.isVisible) {
            this.updateVisibility();
        }
    },
    componentWillUnmount: function () {
        var indexOfComponent = componentsList.indexOf(this);
        if (indexOfComponent !== -1) {
            componentsList.splice(indexOfComponent, 1);
        }
    },

    render: function () {
        if (this.state && this.state.isVisible) {
            if (this.props.children.length === undefined || this.props.children.length === 1) {
                return this.props.children;
            } else {
                return React.createElement("div", {}, this.props.children);
            }
        } else {
            return React.createElement("div", {});
        }
    }
});

module.exports = ReactFastAndLazy;
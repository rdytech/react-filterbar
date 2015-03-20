var ApplyConfigurationButton = React.createClass({
  render: function() {
    return (
      <button className="btn btn-primary" onClick={this.props.onClick}>
        <i className="icon icon-tick" />
        Apply
      </button>
    );
  }
});

module.exports = ApplyConfigurationButton;

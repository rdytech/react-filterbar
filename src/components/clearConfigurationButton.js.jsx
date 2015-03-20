var ClearConfigurationButton = React.createClass({
  render: function() {
    return (
      <button className="btn btn-warning" onClick={this.props.onClick}>
        <i className="icon icon-delete" />
        Clear
      </button>
    );
  }
});

module.exports = ClearConfigurationButton;

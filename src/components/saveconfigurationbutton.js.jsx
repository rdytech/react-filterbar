var SaveConfigurationButton = React.createClass({
  onClick: function() {
    this.props.onClick(this.state.configurationName);
  },
  onChange: function(event) {
    this.setState({configurationName: event.target.value});
  },
  getInitialState: function() {
    return {
      configurationName: ''
    };
  },
  render: function() {
    return (
        <ReactBootstrap.DropdownButton title="Save Search" type="button" bsStyle="default" className="btn btn-default margin-bottom-sm">
          <ReactBootstrap.MenuItem eventKey="1">
            <div className="form-group">
              <label>Search Title</label>
              <input className="form-control" value={this.state.configurationName} type="text" onChange={this.onChange} />
            </div>
            <button className="btn btn-primary" type="button" onClick={this.onClick}>Save</button>
          </ReactBootstrap.MenuItem>
        </ReactBootstrap.DropdownButton>
    );
  }
});

module.exports = SaveConfigurationButton;

var ConfigurationList = React.createClass({
  render: function() {
    var configurations = this.props.configurations.map(function(configuration) {
      return (
        <ConfigurationList.Configuration
          configuration={configuration}
          onClick={this.props.loadConfiguration}
        />
      );
    },this);
    if (configurations.length !== 0) {
      return (
        <div className="btn-group margin-bottom-sm">
          <div className="btn-group">
            <button className="btn btn-default dropdown-toggle" data-toggle="dropdown" type="button" aria-expanded="false">
              <i className="icon icon-save" />
              Saved Searches
              <i className="icon icon-chevron-down" />
            </button>
            <ul className="dropdown-menu" role="menu">
              {configurations}
            </ul>
          </div>
          <button type="button" className="btn btn-danger">
            <i className="icon icon-delete" />
          </button>
        </div>
      );
    } else {
      return (
        <div className="btn-group margin-bottom-sm">
          <div className="btn-group">
            <button className="btn btn-default dropdown-toggle disabled" data-toggle="dropdown" type="button" aria-expanded="false">
              <i className="icon icon-save" />
              Saved Searches
              <i className="icon icon-chevron-down" />
            </button>
            <ul className="dropdown-menu" role="menu">
              {configurations}
            </ul>
          </div>
          <button type="button" className="btn btn-danger">
            <i className="icon icon-delete" />
          </button>
        </div>
      );
    }
  }
});

ConfigurationList.Configuration = React.createClass({
  onClick: function() {
    this.props.onClick(this.props.configuration.configuration);
  },
  render: function() {
    return(
      <li>
        <a className="dynamic-text-filter" onClick={this.onClick}>
          {this.props.configuration.name}
        </a>
      </li>
    );
  }
});

module.exports = ConfigurationList;

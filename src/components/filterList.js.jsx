var FilterList = React.createClass({
  render: function() {
    var filterOptions = this.props.filters.map(function(filter) {
      if (filter.enabled === false) {
        return (
          <FilterList.FilterOption
            filter={filter}
            onClick={this.props.enableFilter}
          />
        );
      }
    },this);
    return (
      <div className="btn-group">
        <button className="btn btn-default dropdown-toggle" data-toggle="dropdown" type="button">
          <i className="icon icon-add" />
          Add Filter
          <i className="icon icon-chevron-down" />
        </button>
        <ul className="dropdown-menu" role="menu">
          {filterOptions}
        </ul>
      </div>
    );
  }
});

FilterList.FilterOption = React.createClass({
  onClick: function() {
    this.props.onClick(this.props.filter);
  },
  render: function() {
    return (
      <li>
        <a onClick={this.onClick}>
          {this.props.filter.label}
        </a>
      </li>
    );
  },
});

module.exports = FilterList;

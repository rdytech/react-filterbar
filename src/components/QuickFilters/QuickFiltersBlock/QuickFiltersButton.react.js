export class QuickFiltersButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      label: this.props.filters.label,
      filters: this.props.filters.filters
    };
  }

  onClick(e) {
    Object.keys(this.state.filters).map(function(filter) {
      var value = this.state.filters[filter].value;
      var filterName = this.state.filters[filter].filter;

      this.context.filterBarActor.applyQuickFilter(filterName, value);
    }, this);
  }

  render() {
    return (
      <button className="btn btn-primary btn-xs quick-filters-button"  type="button"  onClick={this.onClick.bind(this)}>
        {this.state.label}
      </button>
    );
  }
}

QuickFiltersButton.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired
};

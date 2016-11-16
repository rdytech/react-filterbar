export class QuickFiltersButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      label: this.props.filters.label,
      filters: this.props.filters.filters,
      active: '' 
    };
  }

  onClick() {
    Object.keys(this.state.filters).map(function(filter) {
      var value = this.state.filters[filter].value;
      var filterName = this.state.filters[filter].filter;

      this.context.filterBarActor.applyQuickFilter(filterName, value);
    }, this);
  }

  render() {
    var buttonName = "quick_filter_" + this.state.filterName;
    var labelClasses = "btn btn-primary quick-filters-button " + this.state.active

    return (
      <label className={labelClasses} onClick={this.onClick.bind(this)} >
        <input type="radio" name={buttonName} /> {this.state.label}
      </label>
    );
  }
}

QuickFiltersButton.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired
};

export class QuickFiltersButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      label: this.props.filter.label,
      value: this.props.filter.value,
      valueFrom: this.props.filter.valueFrom,
      valueTo: this.props.filter.valueTo,
      filterName: this.props.filter.filter,
    };
  }

  onClick(e) {
    var radio = e.currentTarget.firstChild;
    var alreadyChecked = radio.dataset['checked'] === 'true'
    var children = e.currentTarget.parentElement.children;

    if(alreadyChecked) {
      e.stopPropagation();
    } else {
      for (var index in children) {
        if(children.hasOwnProperty(index)) {
          children[index].firstChild.dataset['checked'] = false;
        }
      }
      radio.dataset['checked'] = true;
      this.applyFilter();
    }
  }

  applyFilter() {
    this.context.filterBarActor.applyQuickFilter(this.state.filterName, this.state.value, this.state.valueFrom, this.state.valueTo);
  }

  render() {
    var buttonName = "quick_filter_" + this.state.filterName;
    return (
      <label className="btn btn-primary quick-filters-button" onClick={this.onClick.bind(this)}>
        <input type="radio" name={buttonName}/> {this.state.label}
      </label>
    );
  }
}

QuickFiltersButton.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired
};

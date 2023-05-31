export class ApplyFiltersButton extends React.Component {
  constructor(props) {
    super(props);
  }

  onClick() {
    this.context.filterBarActor.applyFilters();
  }

  render() {
    return (
      <button className="btn btn-primary" onClick={this.onClick.bind(this)}>
        <i className="icon icon-tick" />
        {this.context.filterBarStore?.localizations?.apply || 'Apply'}
      </button>
    );
  }
}

ApplyFiltersButton.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object
};

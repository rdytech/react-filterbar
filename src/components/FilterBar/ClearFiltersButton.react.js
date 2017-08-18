export class ClearFiltersButton extends React.Component {
  constructor(props) {
    super(props);
  }

  onClick() {
    this.context.filterBarActor.disableAllFiltersAndApply();
  }

  render() {
    return (
      <button className="btn btn-warning" onClick={this.onClick.bind(this)}>
        <i className="icon icon-delete" />
        Clear
      </button>
    );
  }
}

ClearFiltersButton.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired
};

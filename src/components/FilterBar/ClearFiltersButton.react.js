export class ClearFiltersButton extends React.Component {
  constructor(props) {
    super(props);
  }

  _onClick() {
    this.props.filterBarActor.disableAllFilters();
  }

  render() {
    return (
      <button className="btn btn-warning" onClick={this._onClick.bind(this)}>
        <i className="icon icon-delete" />
        Clear
      </button>
    );
  }
}

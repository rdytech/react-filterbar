export class ApplyFiltersButton extends React.Component {
  constructor(props) {
    super(props);
  }

  _onClick() {
    this.props.filterBarActor.applyFilters();
  }

  render() {
    return (
      <button className="btn btn-primary" onClick={this._onClick.bind(this)}>
        <i className="icon icon-tick" />
        Apply
      </button>
    );
  }
}

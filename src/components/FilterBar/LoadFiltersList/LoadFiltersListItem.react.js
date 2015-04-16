export class LoadFiltersListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  _onClick() {
    this.props.filterBarActor.loadFilters(this.props.filters);
  }

  render() {
    return(
      <li>
        <a className="dynamic-text-filter" onClick={this._onClick.bind(this)}>
          {this.props.name}
        </a>
      </li>
    );
  }
}

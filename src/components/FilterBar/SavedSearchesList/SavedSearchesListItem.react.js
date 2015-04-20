export class SavedSearchesListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  _onClick() {
    this.props.filterBarActor.loadSavedSearch(this.props.searchId);
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

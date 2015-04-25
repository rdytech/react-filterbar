export class SavedSearchesListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  onClick() {
    this.context.filterBarActor.loadSavedSearch(this.props.searchId);
  }

  render() {
    return (
      <li>
        <a className="dynamic-text-filter" onClick={this.onClick.bind(this)}>
          {this.props.name}
        </a>
      </li>
    );
  }
}

SavedSearchesListItem.propTypes = {
  name: React.PropTypes.string.isRequired,
  searchId: React.PropTypes.string.isRequired
};

SavedSearchesListItem.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired
};

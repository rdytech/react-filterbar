export class SavedSearchesListItem extends React.Component {
  constructor(props) {
    super(props);
  }

  onClick() {
    this.context.filterBarActor.loadSavedSearch(this.props.searchId);
  }

  onClickDelete() {
    this.context.filterBarActor.deleteSavedSearch(this.props.searchId);
  }

  render() {
    var liStyles = {
          display: "inline-flex !important",
          width: "100%",
          marginBottom: "5px"
        };
    return (
      <li style={liStyles}>
        <a className="dynamic-text-filter" onClick={this.onClick.bind(this)} style={ {cursor: "pointer", marginRight: "39px"} }>
          {this.props.name}
        </a>
        <a className="btn btn-circle-danger btn-sm" title="Delete" style={ { position: "absolute", right: "4px"} } onClick={this.onClickDelete.bind(this)}>
          <span className="icon icon-delete"></span>
        </a>
      </li>
    );
  }
}

SavedSearchesListItem.propTypes = {
  name: React.PropTypes.string.isRequired,
  searchId: React.PropTypes.number.isRequired
};

SavedSearchesListItem.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired
};

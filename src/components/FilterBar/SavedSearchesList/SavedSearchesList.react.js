import {SavedSearchesListItem} from './SavedSearchesListItem.react';

export class SavedSearchesList extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.getStateFromStores();
    this.props.filterBarStore.addChangeListener(this._onChange.bind(this));
  }

  getStateFromStores() {
    return {
      savedSearches: this.props.filterBarStore.getSavedSearches()
    };
  }

  _onChange() {
    this.setState(this.getStateFromStores());
  }

  render() {
    var buttonClass = 'btn btn-default dropdown-toggle';

    if (this.state.savedSearches.length === 0) {
      buttonClass += ' disabled';
    }

    var savedSearches = this.state.savedSearches.map(function(savedSearch, index) {
      return (
        <SavedSearchesListItem
          key={index}
          searchId={index}
          name={savedSearch.name}
          filterBarActor={this.props.filterBarActor}
        />
      );
    }, this);

    return (
      <div className="btn-group margin-bottom-sm">
        <div className="btn-group">
          <button className={buttonClass} data-toggle="dropdown" type="button" aria-expanded="false">
            <i className="icon icon-save" />
            Saved Searches
            <i className="icon icon-chevron-down" />
          </button>
          <ul className="dropdown-menu" role="menu">
            {savedSearches}
          </ul>
        </div>
        <button type="button" className="btn btn-danger">
          <i className="icon icon-delete" />
        </button>
      </div>
    );
  }
}

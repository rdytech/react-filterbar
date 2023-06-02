import {SavedSearchesListItem} from "./SavedSearchesListItem.react";
import t from "../../../locales/i18n";

export class SavedSearchesList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    this.setState(this.getStateFromStores());
    this.context.filterBarStore.addChangeListener(this.onChange.bind(this));
  }

  getStateFromStores() {
    return {
      savedSearches: this.context.filterBarStore.getSavedSearches()
    };
  }

  onChange() {
    this.setState(this.getStateFromStores());
  }

  render() {
    var buttonClass = "btn btn-default dropdown-toggle";

    if (this.state.savedSearches.length === 0) {
      buttonClass += " disabled";
    }

    var savedSearches = this.state.savedSearches.map(function(savedSearch, index) {
      return (
        <SavedSearchesListItem
          key={index}
          name={savedSearch.name}
          searchId={index}
        />
      );
    }, this);

    return (
        <div className="btn-group">
          <button
            aria-expanded="false"
            className={buttonClass}
            data-toggle="dropdown"
            type="button"
          >
            <i className="icon icon-save" />
            {t('filterbar.buttons.saved_searches')}
            <i className="icon icon-chevron-down" />
          </button>
          <ul className="dropdown-menu" role="menu">
            {savedSearches}
          </ul>
        </div>
    );
  }
}

SavedSearchesList.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};

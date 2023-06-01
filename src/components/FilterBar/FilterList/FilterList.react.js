import {FilterListOption} from "./FilterListOption.react";
import t from "../../../locales/i18n";

export class FilterList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: props.disabledFilters,
      searchTerm: ''
    };
  }

  componentDidMount() {
    this.context.filterBarStore.addChangeListener(this.onChange.bind(this));
  }

  onChange() {
    this.setState(this.getStateFromStores());
  }

  getStateFromStores() {
    return {
      filters: this.context.filterBarStore.getDisabled()
    };
  }

  onSearchTermChange(event) {
    this.setState({ searchTerm: event.target.value.toLowerCase() });
  }

  render() {
    var optionKey = "";
    var filters = this.state.filters;
    var term = this.state.searchTerm;
    var uids = Object.keys(filters).filter(function(uid) {
      return filters[uid].label.toLowerCase().search(term) !== -1;
    });
    var filterOptions = uids.map(function(filterUid) {
      optionKey = "option-" + filterUid;
      return (
        <FilterListOption
          filterUid={filterUid}
          key={optionKey}
          label={filters[filterUid].label}
        />
      );
    }, this);
    return (
      <div className="btn-group">
        <button className="btn btn-default dropdown-toggle" data-toggle="dropdown" type="button">
          <i className="icon icon-add" />
          { t('buttons.add_filter') }
          <i className="icon icon-chevron-down" />
        </button>
        <div className="dropdown-menu" role="menu">
          <input type="text"
            placeholder="Search"
            onChange={this.onSearchTermChange.bind(this)} />
          <ul className="filter-options">
            {filterOptions}
          </ul>
        </div>
      </div>
    );
  }
}

FilterList.contextTypes = {
  filterBarActor: React.PropTypes.object,
  filterBarStore: React.PropTypes.object
};

FilterList.propTypes = {
  disabledFilters: React.PropTypes.object.isRequired
};

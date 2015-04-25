import {FilterListOption} from "./FilterListOption.react";

export class FilterList extends React.Component {
  constructor(props) {
    super(props);

    this.state = { filters: props.disabledFilters };
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

  render() {
    var optionKey = "";
    var filterOptions = Object.keys(this.state.filters).map(function(filterUid) {
      optionKey = "option-" + filterUid;
      return (
        <FilterListOption
          filterUid={filterUid}
          key={optionKey}
          label={this.state.filters[filterUid].label}
        />
      );
    }, this);
    return (
      <div className="btn-group">
        <button className="btn btn-default dropdown-toggle" data-toggle="dropdown" type="button">
          <i className="icon icon-add" />
          Add Filter
          <i className="icon icon-chevron-down" />
        </button>
        <ul className="dropdown-menu" role="menu">
          {filterOptions}
        </ul>
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

import {FilterInput} from "./FilterInput.react";

export class FilterDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = { filters: props.enabledFilters };
  }

  componentWillMount() {
    this.context.filterBarStore.addChangeListener(this.onChange.bind(this));
  }

  onChange() {
    this.setState(this.getStateFromStores());
  }

  getStateFromStores() {
    return {
      filters: this.context.filterBarStore.getEnabled()
    };
  }

  render() {
    var filters = Object.keys(this.state.filters).map(function(filterUid) {
      var filter = this.state.filters[filterUid];

      return (
        <FilterInput
          filterUid={filterUid}
          key={filterUid}
          label={filter.label}
          type={filter.type}
          value={filter.value}
          operator={filter.operator}
        />
      );
    }, this);

    if (filters.length === 0) {
      filters = (<div>No Filters Enabled!</div>);
    }

    return (
      <div className="navbar filterbar">
        <div className="panel panel-default">
          {filters}
        </div>
      </div>
    );
  }
}

FilterDisplay.propTypes = {
  enabledFilters: React.PropTypes.object.isRequired
};

FilterDisplay.defaultProps = {
  enabledFilters: {}
};

FilterDisplay.contextTypes = {
 filterBarStore: React.PropTypes.object.isRequired,
 filterBarActor: React.PropTypes.object.isRequired
};

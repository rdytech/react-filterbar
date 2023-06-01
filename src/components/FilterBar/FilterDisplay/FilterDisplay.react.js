import {FilterInput} from "./FilterInput.react";
import t from "../../../locales/i18n";

export class FilterDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = { filters: props.enabledFilters };
  }

  componentWillMount() {
    var self = this;
    var quickFilters = this.context.filterBarStore.quickFilters;
    Object.keys(this.getStateFromStores().filters).map(function(filterUid) {
      Object.keys(quickFilters).map(function(blockName) {
        Object.keys(quickFilters[blockName]).map(function(filterName) {
          var quickFilter = quickFilters[blockName][filterName];
          if (quickFilter.filters && quickFilter.filters[filterUid]) {
            if (self.getStateFromStores().filters[filterUid].type == 'multi_select') {
              if (self.getStateFromStores().filters[filterUid].value.join(",") === quickFilter.filters[filterUid].value)
                quickFilter.active = true;
            } else {
              if (self.getStateFromStores().filters[filterUid].value ===  quickFilter.filters[filterUid].value) {
                quickFilter.active = true;
              }
            }
          }
        });
      });
    });
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
      filters = (<div>{t('buttons.no_filters_enabled')}</div>);
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

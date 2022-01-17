import {FilterInput} from "./FilterInput.react";
import {FilterButton} from "./FilterButton.react";
import {FilterGroup} from "./FilterGroup.react";
import { FilterList } from "../FilterList/FilterList.react";
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

  getActiveFilters() {
    return this.context.filterBarStore.getActiveFilters();
  }

  getFilters() {
    return this.context.filterBarStore.getFilters();
  }

  addGroup(filterUid) {
    this.context.filterBarStore.addGroupFilter(-1, filterUid);
  }

  render() {
    var filters = [];
    this.getActiveFilters().map(function(groupFilters, idx) {
      if (idx > 0) {
        filters.push(
          (
            <div style={ { marginTop: 'auto', marginBottom: 'auto', padding: '10px'} }>OR</div>
          )
        )
      }

      filters.push(
        (<FilterGroup
          key={ idx }
          groupKey={ idx }
          filters={ groupFilters }
        />)
      );

    })

    if (filters.length === 0) {
      filters.push((
        <div style={ { marginTop: 'auto', marginBottom: 'auto', padding: '10px'} }>
          <FilterButton
          filters={ this.getFilters() }
          title="ADD FILTER"
          onClick={ this.addGroup.bind(this) }
        />
        </div>)
      );
    } else {
      filters.push(
        (
        <div style={ { marginTop: 'auto', marginBottom: 'auto', padding: '10px'} }>
          <FilterButton
            filters={ this.getFilters() }
            title="OR"
            onClick={ this.addGroup.bind(this) }
          />
        </div>
      ));
    }

    return (
      <div className="navbar filterbar">
        <div className="panel panel-default" style={ { paddingTop: 'unset', paddingBottom: 'unset' } }>
          <div style={ { display: 'flex', float: 'left', flexWrap: 'wrap' } }>
            {filters}
          </div>
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

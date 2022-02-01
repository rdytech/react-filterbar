import {FilterInput} from "./FilterInput.react";
import {FilterButton} from "./FilterButton.react";
import {FilterGroup} from "./FilterGroup.react";
import { FilterList } from "../FilterList/FilterList.react";
export class FilterDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = { filters: props.filters };
  }

  componentDidMount() {
    // TODO: Potential memory leak issue
    // https://github.com/facebook/react/issues/6266#issuecomment-196998237
    this.onChange = this.onChange.bind(this);
    this.context.filterBarStore.addChangeListener(this.onChange);
  }

  onChange() {
    this.setState(this.getStateFromStores());
  }

  onFilterRemove(groupKey, inputKey) {
    this.context.filterBarActor.clearActiveFilter(groupKey, inputKey);
  }

  onButtonClick(filterUid, groupKey) {
    this.context.filterBarStore.addGroupFilter(filterUid, groupKey);
  }

  getStateFromStores() {
    return {
      filters: this.context.filterBarStore.getActiveFilters()
    };
  }

  getActiveFilters() {
    return this.context.filterBarStore.getActiveFilters();
  }

  getFilters() {
    return this.context.filterBarStore.getFilters();
  }

  addGroup(filterUid) {
    this.context.filterBarStore.addGroupFilter(filterUid);
  }

  render() {
    const filters = []
    const ctrl = this;

    this.state.filters.map(function(groupFilters, idx) {
      if (idx > 0) {
        filters.push(
          (
            <div
              key={ Math.random() }
              style={ { marginTop: 'auto', marginBottom: 'auto', padding: '10px'} }
            >OR</div>
          )
        )
      }

      filters.push(
        (<FilterGroup
          key={ Math.random() }
          groupKey={ idx }
          filters={ groupFilters }
          onFilterRemove={ ctrl.onFilterRemove.bind(ctrl) }
          onButtonClick={ ctrl.onButtonClick.bind(ctrl) }
        />)
      );

    })

    if (filters.length === 0) {
      filters.push((
        <div
          style={ { marginTop: 'auto', marginBottom: 'auto', padding: '10px'} }
          key={ Math.random() }
        >
          <FilterButton
            key={ Math.random() }
            filters={ this.getFilters() }
            title="ADD FILTER"
            onClick={ this.addGroup.bind(this) }
        />
        </div>)
      );
    } else {
      filters.push(
        (
        <div
          style={ { marginTop: 'auto', marginBottom: 'auto', padding: '10px'} }
          key={ Math.random() }
        >
          <FilterButton
            key={ Math.random() }
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
  filters: React.PropTypes.array.isRequired
};

FilterDisplay.defaultProps = {
  filters: []
};

FilterDisplay.contextTypes = {
 filterBarStore: React.PropTypes.object.isRequired,
 filterBarActor: React.PropTypes.object.isRequired
};

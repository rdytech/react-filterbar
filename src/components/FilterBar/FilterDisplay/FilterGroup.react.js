import { FilterInput } from "./FilterInput.react"
import { FilterButton } from "./FilterButton.react"

export class FilterGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = { filters: props.filters };
  }

  getFilters() {
    return this.context.filterBarStore.getFilters();
  }

  onButtonClick(filterUid) {
    this.props.onButtonClick(filterUid, this.props.groupKey)
  }

  onFilterRemove(groupKey, inputKey) {
    this.props.onFilterRemove(groupKey, inputKey);
  }

  render() {
    const { groupKey } = this.props;
    const ctrl = this;
    var filters = [];
    this.state.filters.map(function(filter, idx) {
      if (idx > 0) {
        filters.push(
          (
            <div
              key={ Math.random() }
              style={ { marginTop: 'auto', marginBottom: 'auto', padding: '10px'} }
            >AND</div>
          )
        );
      }

      filters.push(
        (
        <div
          style={ { marginTop: 'auto', marginBottom: 'auto', padding: '10px', minWidth: '150px'} }
          key={ Math.random() }
        >
          <FilterInput
            key={ idx }
            groupKey={ groupKey }
            inputKey={ idx }
            onFilterRemove={ ctrl.onFilterRemove.bind(ctrl) }
            filterUid={ filter.uid }
            label={ filter.label }
            type={ filter.type }
            value={ filter.value || "" }
            operator={ filter.operator }
          />
        </div>)
      );
    });

    filters.push(
      (
        <div
          style={ { marginTop: 'auto', marginBottom: 'auto', padding: '10px'} }
          key={ Math.random() }
        >
          <FilterButton
            key={ Math.random() }
            filters={ this.getFilters() }
            title="ADD"
            onClick={ ctrl.onButtonClick.bind(ctrl) }
          />
        </div>
      )
    );

    return (
      <div style={ { display: 'flex', flexWrap: 'wrap', borderRadius: '5px', border: '1px solid #c0c0c0', backgroundColor: '#eee', marginTop: '7px', marginBottom: '7px' } }>
        {filters}
      </div>
    )
  }
}

FilterGroup.propTypes = {
  groupKey: React.PropTypes.number.isRequired,
  filters: React.PropTypes.array.isRequired,
  onFilterRemove: React.PropTypes.func.isRequired
};

FilterGroup.contextTypes = {
  filterBarActor: React.PropTypes.object,
  filterBarStore: React.PropTypes.object
};

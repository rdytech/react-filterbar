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
    this.context.filterBarStore.addGroupFilter(this.props.groupKey, filterUid);
  }

  render() {
    const { groupKey } = this.props;
    var filters = [];
    this.state.filters.map(function(filter, idx) {
      if (idx > 0) {
        filters.push(
          (
            <div style={ { marginTop: 'auto', marginBottom: 'auto', padding: '10px'} }>AND</div>
          )
        );
      }

      filters.push(
        (
        <div style={ { marginTop: 'auto', marginBottom: 'auto', padding: '10px'} }>
          <FilterInput
            groupKey={ groupKey }
            inputKey={ idx }
            filterUid={filter.uid}
            key={filter.uid}
            label={filter.label}
            type={filter.type}
            value={filter.value}
            operator={filter.operator}
          />
        </div>)
      );
    });

    filters.push(
      (
        <div style={ { marginTop: 'auto', marginBottom: 'auto', padding: '10px'} }>
          <FilterButton
            filters={ this.getFilters() }
            title="ADD"
            onClick={ this.onButtonClick.bind(this) }
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

FilterGroup.contextTypes = {
  filterBarActor: React.PropTypes.object,
  filterBarStore: React.PropTypes.object
};

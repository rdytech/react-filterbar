import {QuickFiltersBlock} from "./QuickFiltersBlock/QuickFiltersBlock.react";

export class QuickFilters extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var quickFilters = this.context.filterBarStore.quickFilters;
    if (quickFilters !== undefined)
    {
      var filterBlocks = Object.keys(quickFilters).map(function(filter) {
        return (
          <QuickFiltersBlock filters={quickFilters[filter]} name={filter}/>
        );
      }, this);
    } else {
      var filterBlocks = '';
    }

    return (
      <div className="quick-filters">
        {filterBlocks}
      </div>
    );
  }
}

QuickFilters.contextTypes = {
  filterBarStore: React.PropTypes.object,
};

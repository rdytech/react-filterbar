import {QuickFiltersBlock} from "./QuickFiltersBlock/QuickFiltersBlock.react";

export class QuickFilters extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var quickFilters = this.context.filterBarStore.quickFilters;
    var filterBlocks = Object.keys(quickFilters).map(function(filter) {
      return (
        <QuickFiltersBlock filters={quickFilters[filter]}/>
      );
    }, this);
    return (
      <div>
        {filterBlocks}
      </div>
    );
  }
}

QuickFilters.contextTypes = {
  filterBarStore: React.PropTypes.object,
};

import {QuickFiltersButton} from "./QuickFiltersButton.react";

export class QuickFiltersBlock extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var filters = this.props.filters;
    var buttons = Object.keys(filters).map(function(filter) {
      return (
        <QuickFiltersButton filter={filters[filter]}/>
      );
    }, this);
    return (
      <div className="btn-group quick-filters-block" data-toggle="buttons">
        {buttons}
      </div>
    );
  }
}

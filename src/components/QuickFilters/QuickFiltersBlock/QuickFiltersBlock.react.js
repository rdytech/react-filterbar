import {QuickFiltersButton} from "./QuickFiltersButton.react";

export class QuickFiltersBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name
    };
  }

  render() {
    var filters = this.props.filters;
    var buttons = Object.keys(filters).map(function(filter) {
      return (
        <QuickFiltersButton filters={filters[filter]} name={filter} blockName={this.state.name}/>
      );
    }, this);
    return (
      <div className="btn-group quick-filters-block">
        {buttons}
      </div>
    );
  }
}

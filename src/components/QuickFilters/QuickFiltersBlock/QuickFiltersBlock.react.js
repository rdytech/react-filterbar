import {QuickFiltersButton} from "./QuickFiltersButton.react";

export class QuickFiltersBlock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      label: this.props.label,
    };
  }

  render() {
    var filters = this.props.filters;
    var buttons = Object.keys(filters).map(function(filter, idx) {
      if (filter != "label") {
        return (
          <QuickFiltersButton
            key={ idx }
            filters={ filters[filter] }
            name={ filter }
            blockName={ this.state.name }
          />
        );
      }
    }, this);
    return (
      <div>
        {this.props.label}
        <div className="btn-group quick-filters-block">
          {buttons}
        </div>
      </div>
    );
  }
}

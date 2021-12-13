import {FilterInput} from "./FilterInput.react";

export class FilterDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = { filters: props.enabledFilters, advanced: false };
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

  onClickSwitchView() {
    this.setState({ advanced: !this.state.advanced})
  }

  renderBasicView() {
    return Object.keys(this.state.filters).map(function(filterUid) {
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
  }

  renderAdvancedView() {
    return (<textarea className="form-control text optional form-control">{ JSON.stringify(this.state.filters) }</textarea>);
  }

  render() {
    var switcher;
    var filters;

    if (this.state.advanced) {
      switcher = (<div><a href="#" onClick={ this.onClickSwitchView.bind(this) }>Switch to Basic</a></div>)
      filters = this.renderAdvancedView();
    } else {
      switcher = (<div><a href="#" onClick={ this.onClickSwitchView.bind(this) }>Switch to Advanced</a></div>)
      filters = this.renderBasicView();
    }

    if (this.state.filters.length === 0) {
      filters = (<div>No Filters Enabled!</div>);
      switcher = null;
    }


    return (
      <div className="navbar filterbar">
        <div className="panel panel-default">
          {switcher}
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

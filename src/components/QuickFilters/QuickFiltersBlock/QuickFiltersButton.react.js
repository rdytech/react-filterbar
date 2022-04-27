export class QuickFiltersButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      disabled: this.props.filters.disabled,
      label: this.props.filters.label,
      tooltip: this.props.filters.tooltip,
      filters: this.props.filters.filters,
      blockName: this.props.blockName,
      quickFilterButton: this.props.filters
    };
  }

  onClick(e) {
    if(this.state.disabled) {
      e.stopPropagation();
    } else {
      Object.keys(this.state.filters).map(function(filter) {
        let clonedFilter = JSON.parse(JSON.stringify(this.state.filters[filter])); // avoid value to be overwritten when filter changes
        let value = clonedFilter.value;
        let filterName = clonedFilter.filter;
        this.context.filterBarActor.applyQuickFilter(filterName, value, this.state.name, this.state.blockName);
      }, this);
    }
  }

  componentDidMount() {
    this.context.filterBarStore.addChangeListener(this.onChange.bind(this));
  }

  onChange(e) {
    this.forceUpdate();
  }

  buttonClasses() {
    let klasses = 'btn quick-filters-button';
    if (this.state.quickFilterButton.active === true)
      klasses += ' btn-primary';
    else
      if (this.state.disabled)
        klasses += ' btn-secondary disabled';
      else
        klasses += ' btn-default';

    return klasses;
  }

  button() {
    return (
      <button className={this.buttonClasses()} type="button" onClick={this.onClick.bind(this)}>
        {this.state.label}
      </button>
    );
  }

  tooltip() {
    return (
      <ReactBootstrap.Tooltip id="quick-filters-tooltip">{this.state.tooltip}</ReactBootstrap.Tooltip>
    );
  }

  disabledTooltip() {
    return (
      <ReactBootstrap.Tooltip id="quick-filters-tooltip">{this.state.disabled}</ReactBootstrap.Tooltip>
    );
  }

  render() {
    if(this.state.disabled) {
      return (
        <ReactBootstrap.OverlayTrigger placement="top" overlay={this.disabledTooltip()}>
          {this.button()}
        </ReactBootstrap.OverlayTrigger>
      );
    } else {
      return (
        <ReactBootstrap.OverlayTrigger placement="top" overlay={this.tooltip()}>
          {this.button()}
        </ReactBootstrap.OverlayTrigger>
      );
    }
  }
}

QuickFiltersButton.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object
};

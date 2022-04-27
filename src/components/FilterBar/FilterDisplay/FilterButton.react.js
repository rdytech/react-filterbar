import { FilterListOption } from "../FilterList/FilterListOption.react";
export class FilterButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = { filters: props.filters };
  }

  componentDidMount() {
    this.context.filterBarStore.addChangeListener(this.onChange.bind(this));
  }

  onChange() {
    this.setState(this.getStateFromStores());
  }

  getStateFromStores() {
    return {
      filters: this.context.filterBarStore.getFilters()
    };
  }

  onClick(filterUid) {
    this.props.onClick(filterUid);
  }

  render() {
    var optionKey = "";
    var filterOptions = Object.keys(this.state.filters).map(function(filterUid) {
      optionKey = "option-" + filterUid;
      return (
        <FilterListOption
          onClick={ this.onClick.bind(this) }
          filterUid={filterUid}
          key={optionKey}
          label={this.state.filters[filterUid].label}
        />
      );
    }, this);
    return (
      <div className='btn-group'>
        <button className='btn btn-default dropdown-toggle' data-toggle='dropdown' type='button'>
          <span>{ this.props.title }</span>
          <i className='icon icon-add'></i>
        </button>
        <div className='dropdown-menu' role='menu'>
          <ul className='filter-options'>
            {filterOptions}
          </ul>
        </div>
      </div>
    )
  }
}

FilterButton.propTypes = {
  filters: React.PropTypes.object.isRequired,
  onClick: React.PropTypes.func.isRequired,
  title: React.PropTypes.string.isRequired
};

FilterButton.contextTypes = {
  filterBarActor: React.PropTypes.object,
  filterBarStore: React.PropTypes.object
};

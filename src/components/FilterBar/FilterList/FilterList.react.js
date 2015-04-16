import {FilterListOption} from './FilterListOption.react';

export class FilterList extends React.Component {
  constructor(props) {
    super(props);
    this.filterBarActor = props.filterBarActor;
    this.filterBarStore = props.filterBarStore;

    this.filterBarStore.addChangeListener(this._onChange.bind(this));
    this.state = this.getStateFromStores();
  }

  _onChange() {
    this.setState(this.getStateFromStores());
  }

  getStateFromStores() {
    return {
      filters: this.filterBarActor.getDisabled()
    }
  }

  render() {
    var filter = {};
    var optionKey = "";
    var filterOptions = Object.keys(this.state.filters).map(function(filterUid) {
      optionKey = "option-"+filterUid;
      return (
        <FilterListOption
          key={optionKey}
          filterUid={filterUid}
          filterBarActor={this.filterBarActor}
        />
      );
    },this);
    return (
      <div className="btn-group">
        <button className="btn btn-default dropdown-toggle" data-toggle="dropdown" type="button">
          <i className="icon icon-add" />
          Add Filter
          <i className="icon icon-chevron-down" />
        </button>
        <ul className="dropdown-menu" role="menu">
          {filterOptions}
        </ul>
      </div>
    );
  }
}

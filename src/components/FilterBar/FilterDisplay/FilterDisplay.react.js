import {FilterInput} from './FilterInput.react';

export class FilterDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.filterBarActor = props.filterBarActor;
    this.filterBarStore = props.filterBarStore;
    this.state = this.getStateFromStores();

    this.filterBarStore.addChangeListener(this._onChange.bind(this));
  }

  _onChange() {
    this.setState(this.getStateFromStores());
  }

  getStateFromStores() {
    return {
      filters: this.filterBarActor.getEnabled()
    }
  }

  render() {
    var filters = Object.keys(this.state.filters).map(function(filterUid) {
      return (
        <FilterInput
          key={filterUid}
          filterUid={filterUid}
          filter={this.state.filters[filterUid]}
          filterBarActor={this.filterBarActor}
        />
      );
    },this);

    if (filters.length === 0) {
      filters = (<div>No Filters Enabled!</div>);
    }

    return (
      <div className='navbar filterbar'>
        <div className='panel panel-default'>
          {filters}
        </div>
      </div>
    );
  }
}

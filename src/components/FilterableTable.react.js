import {FilterBarActor} from '../actors/FilterBarActor';
import {TableActor} from '../actors/TableActor';

import {FilterBarStore} from '../stores/FilterBarStore';
import {TableStore} from '../stores/TableStore';

import {FilterBar} from './FilterBar/FilterBar.react';
import {Table}  from './Table/Table.react';

export class FilterableTable extends React.Component {
  constructor(props) {
    super(props);
    this.id = props.filterableTableId;


    this.tableStore = new TableStore(props.table);
    this.tableActor = new TableActor(this.tableStore);

    this.filterBarStore = new FilterBarStore(props.filterbar);
    this.filterBarActor = new FilterBarActor(this.filterBarStore, this.tableStore);
  }

  render() {
    return (
      <div key={this.id}>
        <FilterBar
          filterBarActor={this.filterBarActor}
          filterBarStore={this.filterBarStore}
        />
        <Table
          tableActor={this.tableActor}
          tableStore={this.tableStore}
        />
      </div>
    );
  }
}

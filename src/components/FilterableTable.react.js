import {FilterBarActor} from "../actors/FilterBarActor";
import {TableActor} from "../actors/TableActor";

import {FilterBarStore} from "../stores/FilterBarStore";
import {TableStore} from "../stores/TableStore";
import {BatchActionsStore} from "../stores/BatchActionsStore";

import {FilterBar} from "./FilterBar/FilterBar.react";
import {Table} from "./Table/Table.react";

export class FilterableTable extends React.Component {
  constructor(props) {
    super(props);

    this.filterBarStore = new FilterBarStore(props.filterBarConfiguration);
    this.tableStore = new TableStore(props.tableConfiguration);
    this.batchActionsStore = new BatchActionsStore(props.batchActionsConfiguration);

    this.filterBarActor = new FilterBarActor(this.filterBarStore, this.tableStore);
    this.tableActor = new TableActor(this.filterBarStore, this.tableStore);
  }

  getChildContext() {
    return {
      filterBarStore: this.filterBarStore,
      filterBarActor: this.filterBarActor,
      tableStore: this.tableStore,
      batchActionsStore: this.batchActionsStore,
      tableActor: this.tableActor
    };
  }

  render() {
    return (
      <div>
        <FilterBar />
        <Table />
      </div>
    );
  }
}

FilterableTable.childContextTypes = {
  filterBarStore: React.PropTypes.object,
  filterBarActor: React.PropTypes.object,
  tableStore: React.PropTypes.object,
  batchActionsStore: React.PropTypes.object,
  tableActor: React.PropTypes.object
};

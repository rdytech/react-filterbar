import {FilterBarActor} from "../actors/FilterBarActor";
import {JobsBoardActor} from "../actors/JobsBoardActor";
import {FilterBarStore} from "../stores/FilterBarStore";
import {JobsBoardStore} from "../stores/JobsBoardStore";

import {FilterBar} from "./FilterBar/FilterBar.react";
import {JobsBoard} from "./JobsBoard/JobsBoard.react";

export class FilterableJobsBoard extends React.Component {
  constructor(props) {
    super(props);

    this.filterBarStore = new FilterBarStore(props.filterBarConfiguration);
    this.tableStore = new JobsBoardStore(props.jobsBoardConfiguration);

    this.filterBarActor = new FilterBarActor(this.filterBarStore, this.tableStore);
    this.tableActor = new JobsBoardActor(this.filterBarStore, this.tableStore);
  }

  getChildContext() {
    return {
      filterBarStore: this.filterBarStore,
      filterBarActor: this.filterBarActor,
      tableStore: this.tableStore,
      tableActor: this.tableActor
    };
  }

  render() {
    return (
      <div>
        <FilterBar />
        <JobsBoard />
      </div>
    );
  }
}

FilterableJobsBoard.childContextTypes = {
  filterBarStore: React.PropTypes.object,
  filterBarActor: React.PropTypes.object,
  tableStore: React.PropTypes.object,
  tableActor: React.PropTypes.object
};

import {TableActor} from "./TableActor";

export class JobsBoardActor extends TableActor {
  constructor(filterBarStore, jobsBoardStore) {
    this.filterBarStore = filterBarStore;
    this.tableStore = jobsBoardStore;
  }
}

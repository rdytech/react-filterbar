import {TableStore} from "./TableStore";

export class JobsBoardStore extends TableStore {
  constructor(configuration) {
    super(configuration);

    this.header = configuration.header;
    this.body = configuration.body;
    this.sortableColumns = configuration.sortableColumns;
  }

  getHeader() {
    return this.header;
  }

  getBody() {
    return this.body;
  }

  getSortableColumns() {
    return this.sortableColumns;
  }
}
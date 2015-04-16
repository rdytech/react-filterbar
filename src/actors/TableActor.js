export class TableActor {
  constructor(tableStore) {
    this.tableStore = tableStore;
  }

  getColumnHeadings() {
    return this.tableStore.getColumnHeadings();
  }

  getRows() {
    return this.tableStore.getRows();
  }

  getCurrentPage() {
    return this.tableStore.getCurrentPage();
  }

  getTotalPages() {
    return this.tableStore.getTotalPages();
  }

  fetchPagedData(page) {
    this.tableStore.fetchData(page);
  }
}

var uri = require("URIjs");

function changePage(url, page) {
  return uri(url).removeSearch("page").addSearch("page", page);
}

export class TableStore {
  constructor(configuration) {
    this.CHANGE_EVENT = "change";
    this.eventEmitter = new EventEmitter();

    this.rows = [];
    this.currentPage = configuration.page || 1;
    this.totalPages = 1;
    this.columns = configuration.columns;
    this.url = configuration.dataUrl;
    this.selectColumn = configuration.selectColumn;
    this.selectedValues = [];
  }

  setUrl(url) {
    this.url = url;
  }

  getUrl() {
    return changePage(this.url, this.currentPage);
  }

  getColumns() {
    return this.columns;
  }

  setRows(rows) {
    this.rows = rows;
  }

  getRows() {
    return this.rows;
  }

  getCurrentPage() {
    return this.currentPage;
  }

  getTotalPages() {
    return this.totalPages;
  }

  getSelectColumn() {
    return this.selectColumn;
  }

  setTotalPages(totalPages) {
    this.totalPages = totalPages;
  }

  setCurrentPage(page) {
    this.currentPage = page;
  }

  setSelectedValues(selectedValues) {
    this.selectedValues = selectedValues;
  }

  getSelectedValues() {
    return this.selectedValues;
  }

  updateTable(tableStateObject) {
    this.setRows(tableStateObject.results);
    this.setCurrentPage(tableStateObject.current_page);
    this.setTotalPages(tableStateObject.total_pages);
    this.emitChange();
  }

  emitChange() {
    this.eventEmitter.emit(this.CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.eventEmitter.on(this.CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.eventEmitter.removeListener(this.CHANGE_EVENT, callback);
  }
}

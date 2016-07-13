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
    this.selectable = configuration.selectable;
    this.selectedRows = [];
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

  getSelectableValuesFromRows() {
    return this.rows.map(function(row) {
      return row[this.selectable].toString()
    }, this);
  }

  getCurrentPage() {
    return this.currentPage;
  }

  getTotalPages() {
    return this.totalPages;
  }

  getTableCaption() {
    return this.tableCaption;
  }

  getSelectableColumn() {
    return this.selectable;
  }

  getSelectedRows() {
    return this.selectedRows;
  }

  clearSelectedRows() {
    this.selectedRows = [];
  }

  pushAllValuesToSelectedRows() {
    this.rows.forEach(function(row) {
      this.pushValueToSelectedRows(row[this.selectable].toString());
    }, this);
  }

  removeAllValuesFromSelectedRows() {
    this.rows.forEach(function(row) {
      this.removeFromSelectedRows(row[this.selectable].toString());
    }, this);
  }

  pushValueToSelectedRows(value) {
    var indexOfValue = this.selectedRows.indexOf(value);
    if (indexOfValue == -1) {
      this.selectedRows.push(value);
    }
  }

  removeFromSelectedRows(value) {
    var indexOfValue = this.selectedRows.indexOf(value);
    if (indexOfValue > -1) {
      this.selectedRows.splice(indexOfValue, 1);
    }
  }

  valueInSelectedRows(value) {
    return this.selectedRows.indexOf(value) > -1;
  }

  allSelectableValuesInSelectedRows() {
    if (this.getSelectableValuesFromRows().length > 0) {
      return this.getSelectableValuesFromRows().every(this.isInSelectedRows, this);
    }
    else {
      return false;
    }
  }

  isInSelectedRows(element) {
    return this.selectedRows.includes(element);
  }

  setSelectedRows(selectedRows) {
    this.selectedRows = selectedRows;
  }

  setTotalPages(totalPages) {
    this.totalPages = totalPages;
  }

  setCurrentPage(page) {
    this.currentPage = page;
  }

  setTableCaption(tableCaption) {
    this.tableCaption = tableCaption;
  }

  updateTable(tableStateObject) {
    this.setRows(tableStateObject.results);
    this.setCurrentPage(tableStateObject.current_page);
    this.setTotalPages(tableStateObject.total_pages);
    this.setTableCaption(tableStateObject.table_caption);
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

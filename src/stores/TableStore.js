import * as SearchUtils from '../utils/SearchUtils';

export class TableStore {
  constructor(configuration) {
    this.CHANGE_EVENT = 'change';
    this.eventEmitter = new EventEmitter();

    this.id = configuration.id;
    this.rows = [];
    this.currentPage = configuration.page || 1;
    this.totalPages = 1;

    this.columnHeadings = configuration.columns;
    this.url = configuration.dataUrl;
    this.fetchData();
  }

  getId() {
    return this.id;
  }

  setUrl(url) {
    this.url = url;
  }

  getUrl() {
    return this.url;
  }

  fetchData() {
    SearchUtils.search(
      this.url + `&page=${this.currentPage}`,
      this.setData.bind(this)
    );
  }

  setData(response) {
    this.rows = response.results;
    this.currentPage = response.current_page;
    this.totalPages = response.total_pages;
    this.emitChange();
  }

  getColumnHeadings() {
    return this.columnHeadings;
  }

  setRows(rows) {
    this.rows = rows;
    this.emitChange();
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

  setTotalPages(totalPages) {
    this.totalPages = totalPages;
  }

  setCurrentPage(page) {
    this.currentPage = page;
  }

  updateTable(tableStateObject) {
    this.setRows(tableStateObject.results);
    this.setCurrentPage(tableStateObject.current_page);
    this.setTotalPages(tableStateObject.total_pages);
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

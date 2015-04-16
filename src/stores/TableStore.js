import {TableConstants} from '../constants/TableConstants';

import * as SearchUtils from '../utils/SearchUtils';

export class TableStore {
  constructor(tableOptions) {
    this.CHANGE_EVENT = 'change';
    this.eventEmitter = new EventEmitter();
    this.constants = TableConstants;

    this.rows = [];
    this.currentPage = 1;
    this.totalPages = 1;

    this.columnHeadings = this.parseRawColumnHeadingList(
      tableOptions.configuration.querySelector('dl.columns').querySelectorAll('dt.column')
    )
    this.baseUrl = tableOptions.configuration.querySelector('dt.data-url').getAttribute('data-url');
    this.url = window.location;
    this.fetchData();
  }



  setUrl(url) {
    this.url = url;
  }

  getUrl() {
    return this.url;
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  fetchData(page) {
    var url = this.url;
    if(page != null) {
      url += '&page=' + page;
    }
    SearchUtils.search(
      url,
      this.setData.bind(this)
    );
  }

  setData(response) {
    this.rows = response.results;
    this.currentPage = response.current_page;
    this.totalPages = response.total_pages;
    this.emitChange();
  }

  parseRawColumnHeadingList(rawColumnHeadingList) {
    var rawColumnHeadingList,
        rawColumn,
        parsedColumnList = {};

    for (var i = 0; i < rawColumnHeadingList.length; i++) {
      rawColumn = rawColumnHeadingList[i];
      parsedColumnList[rawColumn.getAttribute('data-field')] = {
        heading: rawColumn.getAttribute('data-heading')
      };
    }
    return parsedColumnList;
  }

  getColumnHeadings() {
    return this.columnHeadings;
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

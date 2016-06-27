import * as SearchClient from "../clients/SearchClient";
import * as URLHelper from "../helpers/URLHelper";
import {FilterVerificator} from "../helpers/FilterVerificator";

function updateTable(tableStore) {
  return function (tableStateObject) {
    tableStore.setRows(tableStateObject.results);
    tableStore.setCurrentPage(tableStateObject.current_page);
    tableStore.setTotalPages(tableStateObject.total_pages);
    tableStore.setTableCaption(tableStateObject.table_caption);
    tableStore.emitChange();
  };
}

export class FilterBarActor {
  constructor(filterBarStore, tableStore) {
    this.filterBarStore = filterBarStore;
    this.tableStore = tableStore;
  }

  enableFilter(filterUid, value) {
    this.filterBarStore.enableFilter(filterUid, value);
  }

  disableFilter(filterUid) {
    this.filterBarStore.disableFilter(filterUid);
  }

  disableAllFilters() {
    this.filterBarStore.disableAllFilters();
    this.applyFilters();
  }

  updateFilter(filterUid, propKey, propValue) {
    this.filterBarStore.updateFilter(filterUid, propKey, propValue);
  }

  applyFilters() {
    var url = URLHelper.updateUrlSearch(
        this.filterBarStore.getSearchUrl(), "q", this.filterBarStore.getQuery()
    ).toString();

    this.tableStore.setUrl(url);
    this.tableStore.setCurrentPage(1);

    url = this.tableStore.getUrl();

    SearchClient.search(url, updateTable(this.tableStore));

    if (this.filterBarStore.persistent) {
      URLHelper.updateApplicationUrlState(url);
    }
  }

  exportResults() {
    var url = URLHelper.updateUrlSearch(
        this.filterBarStore.getExportResultsUrl(), "q", this.filterBarStore.getQuery()
    ).toString();

    if (this.filterBarStore.persistent) {
      URLHelper.redirectUrl(url);
    }
  }

  loadSavedSearch(searchId) {
    this.disableAllFilters();

    var savedSearch = this.filterBarStore.getSavedSearch(searchId);
    var filters = JSON.parse(savedSearch.configuration);

    if (this.verifySavedFilters(filters)) {
      for (var filter in filters) {
        this.enableFilter(filter, filters[filter]);
      }

      this.applyFilters();
    } else {
      this.deleteSavedSearch(searchId);
    }
  }

  verifySavedFilters(filters) {
    var filtersArr = Object.keys(filters)
                      .map(function(name) {
                        return { field: name }
                      });
    return new FilterVerificator(this.filterBarStore.getFilters(), filtersArr).verify();
  }

  saveFilters(name) {
    var savedSearchPacket = {
      saved_search: {
        filters: {},
        search_title: name
      }
    };

    for (var [filterUid, filter] of this.filterBarStore.enabledFilters()) {
      savedSearchPacket.saved_search.filters[filterUid] = filter.value;
    }

    SearchClient.saveSearch(
      this.filterBarStore.getSavedSearchesUrl(),
      savedSearchPacket,
      this.reloadSavedSearches.bind(this)
    );

    this.applyFilters();
  }

  deleteSavedSearch(searchId) {
    var savedSearch = this.filterBarStore.getSavedSearch(searchId);

    if (!savedSearch.url) {
      return;
    }

    var confirmation = confirm('Unfortunately one of the filters cannot be applied anymore. Remove the saved search?');
    
    if (confirmation) {
      SearchClient.deleteSearch(
        savedSearch.url,
        this.reloadSavedSearches.bind(this)
      );
    }
  }

  reloadSavedSearches() {
    SearchClient.getSavedSearches(
      this.filterBarStore.getSavedSearchesUrl(),
      this.filterBarStore.setSavedSearches.bind(this.filterBarStore)
    );
  }
}


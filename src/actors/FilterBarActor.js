import * as SearchClient from "../clients/SearchClient";
import * as URLHelper from "../helpers/URLHelper";
import {FilterVerificator} from "../helpers/FilterVerificator";

function updateTable(tableStore) {
  return function (tableStateObject) {
    tableStore.setRows(tableStateObject.results);
    tableStore.setCurrentPage(tableStateObject.current_page);
    tableStore.setTotalPages(tableStateObject.total_pages);
    tableStore.setTableCaption(tableStateObject.table_caption);
    tableStore.clearSelectedRows();
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

  disableAllFilters() {
    this.filterBarStore.disableAllFilters();
    this.filterBarStore.disableAllQuickFilters();
  }

  disableAllFiltersAndApply() {
    this.disableAllFilters();
    this.applyFilters();
  }

  updateFilter(groupKey, inputKey, value) {
    this.filterBarStore.updateFilter(groupKey, inputKey, value);
  }

  clearActiveFilter(groupKey, inputKey) {
    this.filterBarStore.clearActiveFilter(groupKey, inputKey)
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

  applyQuickFilter(filterName, value, quickFilterName, blockName) {
    var filter = this.filterBarStore.getFilter(filterName)

    if (filter.type === 'multi_select') {
      value = value.split(",").map(function (string) {
        return string.trim();
      });
    }

    this.filterBarStore.enableQuickFilter(quickFilterName, blockName);
    this.filterBarStore.setActiveFilters([]);
    this.filterBarStore.addGroupFilter(filterName, undefined, value);
    this.applyFilters();
  }

  disableBlockFilters(blockName) {
    var self = this;
    var filterBarStore = this.filterBarStore;
    var buttons = filterBarStore.quickFilters[blockName];
    Object.keys(buttons).map(function(buttonName) {
      var filters = filterBarStore.quickFilters[blockName][buttonName].filters;
      if (typeof filters == "object") {
        Object.keys(filters).map(function(filterName) {
          self.disableFilter(filters[filterName].filter)
        });
      }
    });
  }

  exportResults() {
    if (this.exportPageLimitExceeded()) {
      alert(this.filterBarStore.getExportPageLimitExceededMessage());
    } else if (this.filterBarStore.persistent) {
      URLHelper.redirectUrl(this.exportUrl());
    }
  }

  exportPageLimitExceeded() {
    return this.filterBarStore.getExportPageLimit() !== NaN && this.tableStore.getTotalPages() > this.filterBarStore.getExportPageLimit();
  }

  exportUrl() {
    return URLHelper.updateUrlSearch(this.filterBarStore.getExportResultsUrl(), "q", this.filterBarStore.getQuery()).toString();
  }

  loadSavedSearch(searchId) {
    this.disableAllFilters();

    var savedSearch = this.filterBarStore.getSavedSearch(searchId);
    var filters = JSON.parse(savedSearch.configuration);

    if (this.verifySavedFilters(filters)) {
      this.filterBarStore.setActiveFilters(filters);
      this.applyFilters();
      this.filterBarStore.emitChange();
    } else {
      this.deleteSavedSearch(searchId, 'One of the filters in this saved search cannot be applied anymore. Remove saved search?');
    }
  }

  verifySavedFilters(filters) {
    var filtersArr;

    if (filters instanceof Array) {
      filtersArr = filters;
    } else {
      filtersArr = Object.keys(filters)
        .map(function (name) {
          return { uid: name }
      });
    }

    return new FilterVerificator(this.filterBarStore.getFilters(), filtersArr).verify();
  }

  saveFilters(name) {
    const filters = this.filterBarStore.getActiveFilters();

    var savedSearchPacket = {
      saved_search: {
        filters: JSON.stringify(filters),
        search_title: name,
      },
    };

    if (Object.keys(savedSearchPacket.saved_search.filters).length === 0) {
      return false;
    }

    SearchClient.saveSearch(
      this.filterBarStore.getSavedSearchesUrl(),
      savedSearchPacket,
      this.reloadSavedSearches.bind(this)
    );

    this.applyFilters();
    return true;
  }

  deleteSavedSearch(searchId, confirmationMessage) {
    var savedSearch = this.filterBarStore.getSavedSearch(searchId);

    if (!savedSearch.url) {
      return;
    }

    if(confirmationMessage === undefined) {
      confirmationMessage = 'Are you sure remove saved search "' + savedSearch.name + '"?';
    }

    var confirmation = confirm(confirmationMessage);

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

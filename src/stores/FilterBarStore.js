import * as FilterClient from "../clients/FilterClient";
import * as SearchClient from "../clients/SearchClient";

export class FilterBarStore {
  constructor(configuration) {
    this.CHANGE_EVENT = "change";
    this.eventEmitter = new EventEmitter();

    this.id = configuration.id;
    this.persistent = configuration.persistent;
    this.url = configuration.searchUrl;
    this.searchUrl = configuration.searchUrl;
    this.saveSearchUrl = configuration.saveSearchUrl;
    this.savedSearchesUrl = configuration.savedSearchesUrl;
    this.exportResultsUrl = configuration.exportResultsUrl;
    this.filters = configuration.filters;

    this.setFilterOptions();

    SearchClient.getSavedSearches(this.savedSearchesUrl, this.setSavedSearches.bind(this));
  }

  *filterGenerator() {
    for (var filterUid in this.filters) {
      if (this.filters.hasOwnProperty(filterUid)) {
        yield this.filters[filterUid];
      }
    }
  }

  *enabledFilters() {
    for (var filterUid in this.filters) {
      if (this.filters.hasOwnProperty(filterUid) && this.filters[filterUid].enabled) {
        yield this.filters[filterUid];
      }
    }
  }

  *disabledFilters() {
    for (var filterUid in this.filters) {
      if (this.filters.hasOwnProperty(filterUid) && !this.filters[filterUid].enabled) {
        yield this.filters[filterUid];
      }
    }
  }

  *selectFilters() {
    for (var filterUid in this.filters) {
      if (this.filters.hasOwnProperty(filterUid) && this.filters[filterUid].url !== null) {
        yield this.filters[filterUid];
      }
    }
  }

  setFilterOptions() {
    for (var filter of this.selectFilters()) {
      FilterClient.updateFilterOptions(filter);
    }
  }

  getId() {
    return this.id;
  }

  getSearchUrl() {
    return this.searchUrl;
  }

  getSaveSearchUrl() {
    return this.saveSearchUrl;
  }

  getSavedSearchesUrl() {
    return this.savedSearchesUrl;
  }

  getSavedSearches() {
    return this.savedSearches || [];
  }

  getSavedSearch(searchId) {
    return this.savedSearches[searchId];
  }

  getFilter(filterUid) {
    return this.filters[filterUid];
  }

  getDisabled() {
    var disabledFilters = {};
    for (var filterUid in this.filters) {
      if (this.filters[filterUid].enabled !== true) {
        disabledFilters[filterUid] = this.filters[filterUid];
      }
    }
    return disabledFilters;
  }

  getEnabled() {
    var enabledFilters = {};
    for (var filterUid in this.filters) {
      if (this.filters[filterUid].enabled === true) {
        enabledFilters[filterUid] = this.filters[filterUid];
      }
    }
    return enabledFilters;
  }

  getQuery() {
    var enabledFilters = Object.keys(this.getEnabled()).map(function(filterUid) {
      var filter = this.getFilter(filterUid);
      return {
        uid: filterUid,
        type: filter.type,
        field: filter.field,
        value: filter.value
      };
    }, this);
    return enabledFilters.length > 0 ? JSON.stringify(enabledFilters) : "";
  }

  setSavedSearches(savedSearches) {
    this.savedSearches = savedSearches;
    this.emitChange();
  }

  disableAllFilters() {
    var enabledFilters = this.getEnabled();

    for (var filterUid in enabledFilters) {
      this.disableFilter(filterUid);
    }
    this.emitChange();
  }

  disableFilter(filterUid) {
    this.filters[filterUid].enabled = false;
    this.filters[filterUid].value = "";
    this.emitChange();
  }

  enableFilter(filterUid, value) {
    this.filters[filterUid].enabled = true;
    this.filters[filterUid].value = value || this.filters[filterUid].value || "";
    this.emitChange();
  }

  updateFilter(filterUid, propKey, propValue) {
    this.filters[filterUid][propKey] = propValue;
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
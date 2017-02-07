import {getSavedSearches} from "../clients/SearchClient";

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
    this.quickFilters = configuration.quickFilters || {};

    if (this.savedSearchesUrl !== undefined) {
      getSavedSearches(this.savedSearchesUrl, this.setSavedSearches.bind(this));
    }
  }

  *enabledFilters() {
    for (var filterUid in this.filters) {
      if (this.filters.hasOwnProperty(filterUid) && this.filters[filterUid].enabled) {
        yield [ filterUid, this.filters[filterUid] ];
      }
    }
  }

  *disabledFilters() {
    for (var filterUid in this.filters) {
      if (this.filters.hasOwnProperty(filterUid) && !this.filters[filterUid].enabled) {
        yield [ filterUid, this.filters[filterUid] ];
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

  *quickFiltersGenerator(quickFilters) {
    for (let quickFilter of quickFilters) {
      for (var property in quickFilter.filters) {
        if (quickFilter.filters.hasOwnProperty(property)) {
          yield [quickFilter, property];
        }
      }
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

  getExportResultsUrl() {
    return this.exportResultsUrl;
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

  getFilters() {
    return this.filters;
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
    this.deactivateQuickFiltersBasedOnRemovedFilter(filterUid, this.activeQuickFilters());
    this.emitChange();
  }

  enableFilter(filterUid, value) {
    this.filters[filterUid].enabled = true;
    this.filters[filterUid].value = value || this.filters[filterUid].value || "";
    this.emitChange();
  }

  enableQuickFilter(quickFilterName, blockName) {
    var self = this;
    Object.keys(this.quickFilters[blockName]).map(function(filterName) {
      if (typeof self.quickFilters[blockName][filterName] == "object") {
        self.quickFilters[blockName][filterName].active = false
      }
    })
    this.quickFilters[blockName][quickFilterName].active = true
  }

  disableAllQuickFilters() {
    var self = this;
    Object.keys(self.quickFilters).map(function(blockName) {
      Object.keys(self.quickFilters[blockName]).map(function(filterName) {
        self.quickFilters[blockName][filterName].active = false
      })
    })
  }

  updateFilter(filterUid, propKey, propValue) {
    this.filters[filterUid][propKey] = propValue;
    if(propKey === 'value')
      this.deactivateQuickFiltersBasedOnFilterValue(filterUid, propValue, this.activeQuickFilters());
    this.emitChange();
  }

  deactivateQuickFiltersBasedOnRemovedFilter(filterName, quickFilters) {
    var self = this;
    for (var outcome of self.quickFiltersGenerator(quickFilters)) {
      let quickFilter = outcome[0],
          quickFilterName = outcome[1];
      if(quickFilter.filters[quickFilterName].filter === filterName)
        self.inactivateQuickFilter(quickFilter);
    }
    this.emitChange();
  }

  deactivateQuickFiltersBasedOnFilterValue(filterName, filterValue, quickFilters) {
    var self = this;
    for (var outcome of self.quickFiltersGenerator(quickFilters)) {
      let quickFilter = outcome[0],
          quickFilterName = outcome[1];
      self.inactivateQuickFilterIfValueChanged(quickFilter.filters[quickFilterName], filterName, filterValue, quickFilter);
    }
    this.emitChange();
  }

  inactivateQuickFilterIfValueChanged(quickFilterFilter, filterName, filterValue, quickFilter) {
    if (quickFilterFilter.filter === filterName) {
      if (typeof quickFilterFilter.value === "object") {
        if (this.rangeFilterValuesChanged(quickFilterFilter.value, filterValue))
          this.inactivateQuickFilter(quickFilter);
      } else if (filterValue !== quickFilterFilter.value) {
        this.inactivateQuickFilter(quickFilter);
      }
    }
  }

  rangeFilterValuesChanged(value1, value2) {
    return value1.from !== value2.from || value1.to !== value2.to;
  }

  inactivateQuickFilter(quickFilter) {
    quickFilter.active = false;
  }

  activeQuickFilters() {
    var self = this;
    var active = [];
    Object.keys(self.quickFilters).map(function(blockName) {
      Object.keys(self.quickFilters[blockName]).map(function(filterName) {
        var quickFilter = self.quickFilters[blockName][filterName];
        if(quickFilter.active)
          active.push(quickFilter)
      })
    })
    return active;
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

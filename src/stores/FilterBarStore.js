import {getSavedSearches} from "../clients/SearchClient";

export class FilterBarStore {
  constructor(configuration) {
    this.CHANGE_EVENT = "change";
    this.eventEmitter = new EventEmitter();

    this.eventEmitter.setMaxListeners(30);

    this.id = configuration.id;
    this.persistent = configuration.persistent;
    this.url = configuration.searchUrl;
    this.searchUrl = configuration.searchUrl;
    this.savedSearchesUrl = configuration.savedSearchesUrl;
    this.configurationUrl = configuration.configurationUrl;
    this.exportResultsUrl = configuration.exportResultsUrl;
    this.exportPageLimit = configuration.exportPageLimit;
    this.exportPageLimitExceededMessage = configuration.exportPageLimitExceededMessage;
    this.filters = configuration.filters || {};
    this.activeFilters = configuration.activeFilters || [];
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

  getSavedSearchesUrl() {
    return this.savedSearchesUrl;
  }

  getConfigurationUrl() {
    return this.configurationUrl;
  }

  getExportResultsUrl() {
    return this.exportResultsUrl;
  }

  getExportPageLimit() {
    return Number(this.exportPageLimit);
  }

  getExportPageLimitExceededMessage() {
    return this.exportPageLimitExceededMessage || "Cannot Export CSV. Exporting is limited to " + this.getExportPageLimit() + " page(s) at a time.";
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

  getActiveFilters() {
    return this.activeFilters;
  }

  setActiveFilters(filters) {
    this.activeFilters = filters;
  }

  getQuery() {
    var enabledFilters = this.activeFilters.map(function(filters) {
      return filters.map(function(filter) {
          return {
            uid: filter.uid,
            type: filter.type,
            field: filter.field,
            value: filter.value,
            operator: filter.operator,
          };
        })
    });
    return enabledFilters.length > 0 ? JSON.stringify(enabledFilters) : "";
  }

  isConfigurable() {
    return this.getConfigurationUrl() !== undefined;
  }

  isExportable() {
    return this.getExportResultsUrl() !== undefined;
  }

  setSavedSearches(savedSearches) {
    this.savedSearches = savedSearches;
    this.emitChange();
  }

  disableAllFilters() {
    this.activeFilters = []
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
    const ctrl = this;

    Object.keys(ctrl.quickFilters).map(function(groupName) {
      Object.keys(ctrl.quickFilters[groupName]).map(function(filterName) {
        ctrl.quickFilters[groupName][filterName].active = false
      });
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

  clearActiveFilter(groupKey, inputKey) {
    this.activeFilters[groupKey].splice(inputKey, 1);
    if (this.activeFilters[groupKey].length === 0) {
      this.activeFilters.splice(groupKey, 1);
    }

    this.emitChange();
  }

  updateFilter(groupKey, inputKey, value) {
    this.activeFilters[groupKey][inputKey].value = value;
  }

  addGroupFilter(filterUid, groupKey, value) {
    const filterTemplate = this.filters[filterUid];
    const filter = { ...filterTemplate };

    filter.filterUid = filterUid;
    filter.uid = filterUid;
    filter.value = value;

    if (groupKey == undefined) {
      this.activeFilters.push([filter])
    } else {
      this.activeFilters[groupKey].push(filter);
    }

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

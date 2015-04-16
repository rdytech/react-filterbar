var Dispatcher = require('../dispatcher/Dispatcher');
var Constants = require('../constants/Constants');
var FilterBarStore = require('../stores/FilterBarStore');

module.exports = {
  enableFilter: function(filterBarId,filterUid) {
    Dispatcher.dispatch({
      type: Constants.ActionTypes.ENABLE_FILTER,
      filterBarId: filterBarId,
      filterUid: filterUid
    });
  },
  disableFilter: function(filterBarId,filterUid) {
    Dispatcher.dispatch({
      type: Constants.ActionTypes.DISABLE_FILTER,
      filterBarId: filterBarId,
      filterUid: filterUid
    });
  },
  updateFilter: function(filterBarId, filterUid, value) {
    Dispatcher.dispatch({
      type: Constants.ActionTypes.UPDATE_FILTER,
      filterBarId: filterBarId,
      filterUid: filterUid,
      value: value
    });
  },
  disableAllFilters: function(filterBarId) {
    Dispatcher.dispatch({
      type: Constants.ActionTypes.DISABLE_ALL_FILTERS,
      filterBarId: filterBarId
    });
  },
  applyFilters: function(filterBarId) {
    Dispatcher.dispatch({
      type: Constants.ActionTypes.APPLY_FILTERS,
      filterBarId: filterBarId
    });
  }
};
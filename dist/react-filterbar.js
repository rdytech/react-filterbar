(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var FilterableTable = require("./components/FilterableTable.react").FilterableTable;

var SharedUtils = _interopRequireWildcard(require("./utils/SharedUtils"));

document.addEventListener("DOMContentLoaded", function () {
  var searchObject = SharedUtils.parseUrlSearchString(),
      filterableTables = document.getElementsByClassName("react-filterable-table"),
      filterableTableNode,
      filterBarConfiguration,
      tableConfiguration,
      filterableTableId,
      filterbar,
      table,
      page,
      filters;

  for (var i = 0; i < filterableTables.length; i++) {

    filterableTableNode = filterableTables[i];
    filterBarConfiguration = filterableTableNode.querySelector("dl.filterBarConfiguration");
    tableConfiguration = filterableTableNode.querySelector("dl.tableConfiguration");
    filterableTableId = filterableTableNode.getAttribute("id") || i;

    filterbar = SharedUtils.parseFilterBarConfiguration(filterBarConfiguration, filterableTableId);
    table = SharedUtils.parseTableConfiguration(tableConfiguration, filterableTableId);

    if (filterbar.persistent == "true") {
      if (window.location.href.indexOf("?") == -1) {
        if (localStorage[window.location.pathname.replace(/\//g, "")]) {
          window.location.search = localStorage[window.location.pathname.replace(/\//g, "")];
        } else {
          SharedUtils.updateUrl("q", "");
          SharedUtils.updateUrl("page", 1);
        }
      }

      table.dataUrl = window.location.href;

      if (searchObject.hasOwnProperty("q") && searchObject.q != "") {
        filters = JSON.parse(searchObject.q);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = filters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var filter = _step.value;

            filterbar.filters[filter.uid].enabled = true;
            filterbar.filters[filter.uid].value = filter.value;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"]) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }

      if (searchObject.hasOwnProperty("page")) {
        table.page = JSON.parse(searchObject.page);
      }
    }

    React.render(React.createElement(FilterableTable, {
      filterableTableId: filterableTableId,
      filterbar: filterbar,
      table: table
    }), filterableTableNode);
  }
});

},{"./components/FilterableTable.react":17,"./utils/SharedUtils":23}],2:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var SharedUtils = _interopRequireWildcard(require("../utils/SharedUtils"));

var FilterBarActor = exports.FilterBarActor = (function () {
  function FilterBarActor(filterBarStore, tableStore) {
    _classCallCheck(this, FilterBarActor);

    this.filterBarStore = filterBarStore;
    this.tableStore = tableStore;
  }

  _createClass(FilterBarActor, {
    getSavedSearches: {
      value: function getSavedSearches() {
        return this.filterBarStore.getSavedSearches() || [];
      }
    },
    getFilter: {
      value: function getFilter(filterUid) {
        return this.filterBarStore.getFilter(filterUid);
      }
    },
    enableFilter: {
      value: function enableFilter(filterUid, value) {
        this.filterBarStore.enableFilter(filterUid, value);
      }
    },
    disableFilter: {
      value: function disableFilter(filterUid) {
        this.filterBarStore.disableFilter(filterUid);
      }
    },
    disableAllFilters: {
      value: function disableAllFilters() {
        this.filterBarStore.disableAllFilters();
        this.applyFilters();
      }
    },
    updateFilter: {
      value: function updateFilter(filterUid, propKey, propValue) {
        this.filterBarStore.updateFilter(filterUid, propKey, propValue);
      }
    },
    getEnabled: {
      value: function getEnabled() {
        return this.filterBarStore.getEnabled();
      }
    },
    getDisabled: {
      value: function getDisabled() {
        return this.filterBarStore.getDisabled();
      }
    },
    applyFilters: {
      value: function applyFilters() {
        var id = this.filterBarStore.getId();
        var searchUrl = this.filterBarStore.getSearchUrl();
        var queryObject = this.filterBarStore.getQuery();

        if (this.filterBarStore.persistent) {
          SharedUtils.updateUrl("q", queryObject);
        }

        this.tableStore.setUrl(window.location.href);
        this.tableStore.setCurrentPage(1);
        this.tableStore.fetchData();
      }
    },
    loadSavedSearch: {
      value: function loadSavedSearch(searchId) {
        this.disableAllFilters();

        var savedSearch = this.filterBarStore.getSavedSearch(searchId);
        var filters = JSON.parse(savedSearch.configuration);

        for (var filter in filters) {
          this.enableFilter(filter, filters[filter]);
        }

        this.applyFilters();
      }
    },
    saveFilters: {
      value: function saveFilters(name) {
        var enabledFilters = this.filterBarStore.getEnabled(),
            savedFiltersPacket = {};
        savedFiltersPacket.search_title = name;
        savedFiltersPacket.filters = {};
        for (var filterUid in enabledFilters) {
          savedFiltersPacket.filters[filterUid] = enabledFilters[filterUid].value;
        }
        SharedUtils.ajaxPost(this.filterBarStore.getSaveSearchUrl(), "json", savedFiltersPacket);
        this.applyFilters();
      }
    },
    getOptionsFromServer: {
      value: function getOptionsFromServer(filterUid) {
        var filter = this.getFilter(filterUid);

        var url = filter.url;

        SharedUtils.ajaxGet(url, "json", (function (response) {
          this.updateFilter(filterUid, "options", response);
        }).bind(this));
      }
    }
  });

  return FilterBarActor;
})();

},{"../utils/SharedUtils":23}],3:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var SharedUtils = _interopRequireWildcard(require("../utils/SharedUtils"));

var TableActor = exports.TableActor = (function () {
  function TableActor(filterBarStore, tableStore) {
    _classCallCheck(this, TableActor);

    this.filterBarStore = filterBarStore;
    this.tableStore = tableStore;
  }

  _createClass(TableActor, {
    getColumnHeadings: {
      value: function getColumnHeadings() {
        return this.tableStore.getColumnHeadings();
      }
    },
    getRows: {
      value: function getRows() {
        return this.tableStore.getRows();
      }
    },
    getCurrentPage: {
      value: function getCurrentPage() {
        return this.tableStore.getCurrentPage();
      }
    },
    getTotalPages: {
      value: function getTotalPages() {
        return this.tableStore.getTotalPages();
      }
    },
    fetchPagedData: {
      value: function fetchPagedData(page) {
        var id = this.tableStore.getId();
        var currentUrl = this.tableStore.getUrl();
        var newUrl = currentUrl + "page=" + page + "&";

        if (this.filterBarStore.persistent) {
          SharedUtils.updateUrl("page", page);
        }

        this.tableStore.setCurrentPage(page);
        this.tableStore.fetchData();
      }
    }
  });

  return TableActor;
})();

},{"../utils/SharedUtils":23}],4:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ApplyFiltersButton = exports.ApplyFiltersButton = (function (_React$Component) {
  function ApplyFiltersButton(props) {
    _classCallCheck(this, ApplyFiltersButton);

    _get(Object.getPrototypeOf(ApplyFiltersButton.prototype), "constructor", this).call(this, props);
  }

  _inherits(ApplyFiltersButton, _React$Component);

  _createClass(ApplyFiltersButton, {
    _onClick: {
      value: function _onClick() {
        this.props.filterBarActor.applyFilters();
      }
    },
    render: {
      value: function render() {
        return React.createElement(
          "button",
          { className: "btn btn-primary", onClick: this._onClick.bind(this) },
          React.createElement("i", { className: "icon icon-tick" }),
          "Apply"
        );
      }
    }
  });

  return ApplyFiltersButton;
})(React.Component);

},{}],5:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var ClearFiltersButton = exports.ClearFiltersButton = (function (_React$Component) {
  function ClearFiltersButton(props) {
    _classCallCheck(this, ClearFiltersButton);

    _get(Object.getPrototypeOf(ClearFiltersButton.prototype), "constructor", this).call(this, props);
  }

  _inherits(ClearFiltersButton, _React$Component);

  _createClass(ClearFiltersButton, {
    _onClick: {
      value: function _onClick() {
        this.props.filterBarActor.disableAllFilters();
      }
    },
    render: {
      value: function render() {
        return React.createElement(
          "button",
          { className: "btn btn-warning", onClick: this._onClick.bind(this) },
          React.createElement("i", { className: "icon icon-delete" }),
          "Clear"
        );
      }
    }
  });

  return ClearFiltersButton;
})(React.Component);

},{}],6:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var FilterList = require("./FilterList/FilterList.react").FilterList;

var FilterDisplay = require("./FilterDisplay/FilterDisplay.react").FilterDisplay;

var ApplyFiltersButton = require("./ApplyFiltersButton.react").ApplyFiltersButton;

var ClearFiltersButton = require("./ClearFiltersButton.react").ClearFiltersButton;

var SaveFiltersButton = require("./SaveFiltersButton.react").SaveFiltersButton;

var SavedSearchesList = require("./SavedSearchesList/SavedSearchesList.react").SavedSearchesList;

var FilterBar = exports.FilterBar = (function (_React$Component) {
  function FilterBar(props) {
    _classCallCheck(this, FilterBar);

    _get(Object.getPrototypeOf(FilterBar.prototype), "constructor", this).call(this, props);

    this.filterBarActor = props.filterBarActor;
    this.filterBarStore = props.filterBarStore;
  }

  _inherits(FilterBar, _React$Component);

  _createClass(FilterBar, {
    render: {
      value: function render() {
        return React.createElement(
          "div",
          null,
          React.createElement(
            "div",
            null,
            React.createElement(
              "div",
              { className: "btn-group margin-bottom-sm" },
              React.createElement(FilterList, {
                filterBarActor: this.filterBarActor,
                filterBarStore: this.filterBarStore
              }),
              React.createElement(
                "button",
                { type: "button", className: "btn btn-default disabled" },
                React.createElement("i", { className: "icon icon-download" }),
                "Export CSV"
              ),
              React.createElement(ApplyFiltersButton, {
                filterBarActor: this.filterBarActor
              }),
              React.createElement(ClearFiltersButton, {
                filterBarActor: this.filterBarActor
              }),
              React.createElement(SaveFiltersButton, {
                filterBarActor: this.filterBarActor
              }),
              React.createElement(SavedSearchesList, {
                filterBarActor: this.filterBarActor,
                filterBarStore: this.filterBarStore
              })
            ),
            React.createElement(FilterDisplay, {
              filterBarActor: this.filterBarActor,
              filterBarStore: this.filterBarStore
            })
          )
        );
      }
    }
  });

  return FilterBar;
})(React.Component);

},{"./ApplyFiltersButton.react":4,"./ClearFiltersButton.react":5,"./FilterDisplay/FilterDisplay.react":7,"./FilterList/FilterList.react":12,"./SaveFiltersButton.react":14,"./SavedSearchesList/SavedSearchesList.react":15}],7:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var FilterInput = require("./FilterInput.react").FilterInput;

var FilterDisplay = exports.FilterDisplay = (function (_React$Component) {
  function FilterDisplay(props) {
    _classCallCheck(this, FilterDisplay);

    _get(Object.getPrototypeOf(FilterDisplay.prototype), "constructor", this).call(this, props);
    this.filterBarActor = props.filterBarActor;
    this.filterBarStore = props.filterBarStore;
    this.state = this.getStateFromStores();

    this.filterBarStore.addChangeListener(this._onChange.bind(this));
  }

  _inherits(FilterDisplay, _React$Component);

  _createClass(FilterDisplay, {
    _onChange: {
      value: function _onChange() {
        this.setState(this.getStateFromStores());
      }
    },
    getStateFromStores: {
      value: function getStateFromStores() {
        return {
          filters: this.filterBarActor.getEnabled()
        };
      }
    },
    render: {
      value: function render() {
        var filters = Object.keys(this.state.filters).map(function (filterUid) {
          return React.createElement(FilterInput, {
            key: filterUid,
            filterUid: filterUid,
            filter: this.state.filters[filterUid],
            filterBarActor: this.filterBarActor
          });
        }, this);

        if (filters.length === 0) {
          filters = React.createElement(
            "div",
            null,
            "No Filters Enabled!"
          );
        }

        return React.createElement(
          "div",
          { className: "navbar filterbar" },
          React.createElement(
            "div",
            { className: "panel panel-default" },
            filters
          )
        );
      }
    }
  });

  return FilterDisplay;
})(React.Component);

},{"./FilterInput.react":8}],8:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var TextInput = require("./Inputs/TextInput.react").TextInput;

var DateInput = require("./Inputs/DateInput.react").DateInput;

var SelectInput = require("./Inputs/SelectInput.react").SelectInput;

var FilterInput = exports.FilterInput = (function (_React$Component) {
  function FilterInput(props) {
    _classCallCheck(this, FilterInput);

    _get(Object.getPrototypeOf(FilterInput.prototype), "constructor", this).call(this, props);

    this.filterBarActor = props.filterBarActor;
    this.filterUid = props.filterUid;
  }

  _inherits(FilterInput, _React$Component);

  _createClass(FilterInput, {
    _onClick: {
      value: function _onClick() {
        this.filterBarActor.disableFilter(this.filterUid);
      }
    },
    inputFactory: {
      value: function inputFactory() {
        var type = this.props.filter.type;
        if (type == "text" || type == "id") {
          return React.createElement(TextInput, {
            filterBarActor: this.filterBarActor,
            filterUid: this.filterUid
          });
        } else if (type == "date") {
          return React.createElement(DateInput, {
            filterBarActor: this.filterBarActor,
            filterUid: this.props.filterUid
          });
        } else if (type == "select") {
          return React.createElement(SelectInput, {
            filterBarActor: this.filterBarActor,
            filterUid: this.props.filterUid
          });
        } else if (type == "age_select") {
          return React.createElement(AgeSelectInput, {
            filterBarActor: this.filterBarActor,
            filterUid: this.props.filterUid
          });
        } else {
          console.error("Not implemented yet!");
        }
      }
    },
    render: {
      value: function render() {
        var inputs = this.inputFactory();
        return React.createElement(
          "div",
          { className: "col-lg-3 col-md-4 col-sm-6 col-xs-12 filter" },
          React.createElement(
            "ul",
            { className: this.filterKey },
            React.createElement(
              "li",
              null,
              React.createElement("i", { onClick: this._onClick.bind(this), className: "btn btn-circle-primary btn-xs icon icon-close remove-filter" }),
              React.createElement(
                "label",
                null,
                this.props.filter.label
              )
            ),
            inputs
          )
        );
      }
    }
  });

  return FilterInput;
})(React.Component);

},{"./Inputs/DateInput.react":9,"./Inputs/SelectInput.react":10,"./Inputs/TextInput.react":11}],9:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var DateInput = exports.DateInput = (function (_React$Component) {
  function DateInput(props) {
    _classCallCheck(this, DateInput);

    _get(Object.getPrototypeOf(DateInput.prototype), "constructor", this).call(this, props);

    this.state = { value: this.props.filterBarActor.getFilter(this.props.filterUid).value || { from: null, to: null } };
  }

  _inherits(DateInput, _React$Component);

  _createClass(DateInput, {
    _onChange: {
      value: function _onChange(event) {
        var newValue = this.state.value;

        if (event.type === "dp") {
          newValue[event.target.querySelector("input").getAttribute("placeholder")] = event.target.querySelector("input").value;
        } else if (event.type === "input") {
          newValue[event.target.getAttribute("placeholder")] = event.target.value;
        }

        this.setState({ value: newValue });
        this.props.filterBarActor.updateFilter(this.props.filterUid, "value", newValue);
      }
    },
    componentDidMount: {
      value: function componentDidMount() {
        var datePickerFrom = $(React.findDOMNode(this.refs.dateRangeFrom));
        datePickerFrom.datetimepicker({ format: "DD-MM-YYYY" });
        datePickerFrom.datetimepicker().on("dp.change", this._onChange.bind(this));

        var datePickerTo = $(React.findDOMNode(this.refs.dateRangeTo));
        datePickerTo.datetimepicker({ format: "DD-MM-YYYY" });
        datePickerTo.datetimepicker().on("dp.change", this._onChange.bind(this));
      }
    },
    render: {
      value: function render() {
        return React.createElement(
          "li",
          null,
          React.createElement(
            "div",
            { className: "input-group datepicker dateRangeFrom", ref: "dateRangeFrom" },
            React.createElement("input", {
              className: "form-control",
              type: "text",
              "data-date-format": "DD/MM/YYYY",
              "aria-required": "true",
              placeholder: "from",
              onChange: this._onChange.bind(this),
              value: this.state.value.from
            }),
            React.createElement(
              "span",
              { className: "input-group-addon" },
              React.createElement("span", { className: "icon-calendar icon", "aria-hidden": "true" }),
              React.createElement(
                "span",
                { className: "sr-only icon icon-calendar" },
                "Calendar"
              )
            )
          ),
          React.createElement(
            "div",
            { className: "input-group datepicker dateRangeTo", ref: "dateRangeTo" },
            React.createElement("input", {
              className: "form-control",
              type: "text",
              "data-date-format": "DD/MM/YYYY",
              "aria-required": "true",
              placeholder: "to",
              onChange: this._onChange.bind(this),
              value: this.state.value.to
            }),
            React.createElement(
              "span",
              { className: "input-group-addon" },
              React.createElement("span", { className: "icon-calendar icon", "aria-hidden": "true" }),
              React.createElement(
                "span",
                { className: "sr-only icon icon-calendar" },
                "Calendar"
              )
            )
          )
        );
      }
    }
  });

  return DateInput;
})(React.Component);

},{}],10:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var SelectInput = exports.SelectInput = (function (_React$Component) {
  function SelectInput(props) {
    _classCallCheck(this, SelectInput);

    _get(Object.getPrototypeOf(SelectInput.prototype), "constructor", this).call(this, props);
    var filter = props.filterBarActor.getFilter(props.filterUid);

    this.state = { value: filter.value || filter.options[0].value };
    this.props.filterBarActor.updateFilter(this.props.filterUid, "value", this.state.value);
  }

  _inherits(SelectInput, _React$Component);

  _createClass(SelectInput, {
    _onChange: {
      value: function _onChange(event) {
        this.setState({ value: event.target.value });
        this.props.filterBarActor.updateFilter(this.props.filterUid, "value", event.target.value);
      }
    },
    render: {
      value: function render() {
        var options = this.props.filterBarActor.getFilter(this.props.filterUid).options || [];

        options = options.map(function (option) {
          return React.createElement(
            "option",
            { value: option.value },
            option.label
          );
        }, this);

        return React.createElement(
          "li",
          null,
          React.createElement(
            "select",
            {
              className: "form-control",
              selected: this.state.value,
              onChange: this._onChange.bind(this)
            },
            options
          )
        );
      }
    }
  });

  return SelectInput;
})(React.Component);

},{}],11:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var TextInput = exports.TextInput = (function (_React$Component) {
  function TextInput(props) {
    _classCallCheck(this, TextInput);

    _get(Object.getPrototypeOf(TextInput.prototype), "constructor", this).call(this, props);
    this.filterBarActor = props.filterBarActor;
    this.filterUid = props.filterUid;

    this.state = { value: this.filterBarActor.getFilter(this.filterUid).value };
  }

  _inherits(TextInput, _React$Component);

  _createClass(TextInput, {
    _onChange: {
      value: function _onChange(event) {
        this.setState({ value: event.target.value });
        this.filterBarActor.updateFilter(this.filterUid, "value", event.target.value);
      }
    },
    render: {
      value: function render() {
        return React.createElement(
          "li",
          null,
          React.createElement("input", {
            className: "form-control",
            type: "text",
            value: this.state.value,
            onChange: this._onChange.bind(this)
          })
        );
      }
    }
  });

  return TextInput;
})(React.Component);

},{}],12:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var FilterListOption = require("./FilterListOption.react").FilterListOption;

var FilterList = exports.FilterList = (function (_React$Component) {
  function FilterList(props) {
    _classCallCheck(this, FilterList);

    _get(Object.getPrototypeOf(FilterList.prototype), "constructor", this).call(this, props);
    this.filterBarActor = props.filterBarActor;
    this.filterBarStore = props.filterBarStore;

    this.filterBarStore.addChangeListener(this._onChange.bind(this));
    this.state = this.getStateFromStores();
  }

  _inherits(FilterList, _React$Component);

  _createClass(FilterList, {
    _onChange: {
      value: function _onChange() {
        this.setState(this.getStateFromStores());
      }
    },
    getStateFromStores: {
      value: function getStateFromStores() {
        return {
          filters: this.filterBarActor.getDisabled()
        };
      }
    },
    render: {
      value: function render() {
        var filter = {};
        var optionKey = "";
        var filterOptions = Object.keys(this.state.filters).map(function (filterUid) {
          optionKey = "option-" + filterUid;
          return React.createElement(FilterListOption, {
            key: optionKey,
            filterUid: filterUid,
            filterBarActor: this.filterBarActor
          });
        }, this);
        return React.createElement(
          "div",
          { className: "btn-group" },
          React.createElement(
            "button",
            { className: "btn btn-default dropdown-toggle", "data-toggle": "dropdown", type: "button" },
            React.createElement("i", { className: "icon icon-add" }),
            "Add Filter",
            React.createElement("i", { className: "icon icon-chevron-down" })
          ),
          React.createElement(
            "ul",
            { className: "dropdown-menu", role: "menu" },
            filterOptions
          )
        );
      }
    }
  });

  return FilterList;
})(React.Component);

},{"./FilterListOption.react":13}],13:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var FilterListOption = exports.FilterListOption = (function (_React$Component) {
  function FilterListOption(props) {
    _classCallCheck(this, FilterListOption);

    _get(Object.getPrototypeOf(FilterListOption.prototype), "constructor", this).call(this, props);
    this.filterBarActor = props.filterBarActor;
    this.filterUid = props.filterUid;
  }

  _inherits(FilterListOption, _React$Component);

  _createClass(FilterListOption, {
    _onClick: {
      value: function _onClick() {
        this.filterBarActor.enableFilter(this.filterUid);
      }
    },
    render: {
      value: function render() {
        return React.createElement(
          "li",
          null,
          React.createElement(
            "a",
            { onClick: this._onClick.bind(this) },
            this.filterBarActor.getFilter(this.filterUid).label
          )
        );
      }
    }
  });

  return FilterListOption;
})(React.Component);

},{}],14:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var SaveFiltersButton = exports.SaveFiltersButton = (function (_React$Component) {
  function SaveFiltersButton(props) {
    _classCallCheck(this, SaveFiltersButton);

    _get(Object.getPrototypeOf(SaveFiltersButton.prototype), "constructor", this).call(this, props);
    this.state = { configurationName: "" };
  }

  _inherits(SaveFiltersButton, _React$Component);

  _createClass(SaveFiltersButton, {
    _onClick: {
      value: function _onClick() {
        this.props.filterBarActor.saveFilters(this.state.configurationName);
      }
    },
    _onChange: {
      value: function _onChange(event) {
        this.setState({ configurationName: event.target.value });
      }
    },
    render: {
      value: function render() {
        return React.createElement(
          ReactBootstrap.DropdownButton,
          { title: "Save Search", type: "button", bsStyle: "default", className: "btn btn-default margin-bottom-sm" },
          React.createElement(
            ReactBootstrap.MenuItem,
            { eventKey: "1" },
            React.createElement(
              "div",
              { className: "form-group" },
              React.createElement(
                "label",
                null,
                "Search Title"
              ),
              React.createElement("input", { className: "form-control", value: this.state.configurationName, type: "text", onChange: this._onChange.bind(this) })
            ),
            React.createElement(
              "button",
              { className: "btn btn-primary", type: "button", onClick: this._onClick.bind(this) },
              "Save"
            )
          )
        );
      }
    }
  });

  return SaveFiltersButton;
})(React.Component);

},{}],15:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var SavedSearchesListItem = require("./SavedSearchesListItem.react").SavedSearchesListItem;

var SavedSearchesList = exports.SavedSearchesList = (function (_React$Component) {
  function SavedSearchesList(props) {
    _classCallCheck(this, SavedSearchesList);

    _get(Object.getPrototypeOf(SavedSearchesList.prototype), "constructor", this).call(this, props);

    this.state = this.getStateFromStores();
    this.props.filterBarStore.addChangeListener(this._onChange.bind(this));
  }

  _inherits(SavedSearchesList, _React$Component);

  _createClass(SavedSearchesList, {
    getStateFromStores: {
      value: function getStateFromStores() {
        return {
          savedSearches: this.props.filterBarActor.getSavedSearches()
        };
      }
    },
    _onChange: {
      value: function _onChange() {
        this.setState(this.getStateFromStores());
      }
    },
    render: {
      value: function render() {
        var buttonClass = "btn btn-default dropdown-toggle";

        if (this.state.savedSearches.length === 0) {
          buttonClass += " disabled";
        }

        var savedSearches = this.state.savedSearches.map(function (savedSearch, index) {
          return React.createElement(SavedSearchesListItem, {
            key: index,
            searchId: index,
            name: savedSearch.name,
            filterBarActor: this.props.filterBarActor
          });
        }, this);

        return React.createElement(
          "div",
          { className: "btn-group margin-bottom-sm" },
          React.createElement(
            "div",
            { className: "btn-group" },
            React.createElement(
              "button",
              { className: buttonClass, "data-toggle": "dropdown", type: "button", "aria-expanded": "false" },
              React.createElement("i", { className: "icon icon-save" }),
              "Saved Searches",
              React.createElement("i", { className: "icon icon-chevron-down" })
            ),
            React.createElement(
              "ul",
              { className: "dropdown-menu", role: "menu" },
              savedSearches
            )
          ),
          React.createElement(
            "button",
            { type: "button", className: "btn btn-danger" },
            React.createElement("i", { className: "icon icon-delete" })
          )
        );
      }
    }
  });

  return SavedSearchesList;
})(React.Component);

},{"./SavedSearchesListItem.react":16}],16:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var SavedSearchesListItem = exports.SavedSearchesListItem = (function (_React$Component) {
  function SavedSearchesListItem(props) {
    _classCallCheck(this, SavedSearchesListItem);

    _get(Object.getPrototypeOf(SavedSearchesListItem.prototype), "constructor", this).call(this, props);
  }

  _inherits(SavedSearchesListItem, _React$Component);

  _createClass(SavedSearchesListItem, {
    _onClick: {
      value: function _onClick() {
        this.props.filterBarActor.loadSavedSearch(this.props.searchId);
      }
    },
    render: {
      value: function render() {
        return React.createElement(
          "li",
          null,
          React.createElement(
            "a",
            { className: "dynamic-text-filter", onClick: this._onClick.bind(this) },
            this.props.name
          )
        );
      }
    }
  });

  return SavedSearchesListItem;
})(React.Component);

},{}],17:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var FilterBarActor = require("../actors/FilterBarActor").FilterBarActor;

var TableActor = require("../actors/TableActor").TableActor;

var FilterBarStore = require("../stores/FilterBarStore").FilterBarStore;

var TableStore = require("../stores/TableStore").TableStore;

var FilterBar = require("./FilterBar/FilterBar.react").FilterBar;

var Table = require("./Table/Table.react").Table;

var FilterableTable = exports.FilterableTable = (function (_React$Component) {
  function FilterableTable(props) {
    _classCallCheck(this, FilterableTable);

    _get(Object.getPrototypeOf(FilterableTable.prototype), "constructor", this).call(this, props);
    this.id = props.filterableTableId;

    this.filterBarStore = new FilterBarStore(props.filterbar);
    this.tableStore = new TableStore(props.table);

    this.tableActor = new TableActor(this.filterBarStore, this.tableStore);
    this.filterBarActor = new FilterBarActor(this.filterBarStore, this.tableStore);
  }

  _inherits(FilterableTable, _React$Component);

  _createClass(FilterableTable, {
    render: {
      value: function render() {
        return React.createElement(
          "div",
          { key: this.id },
          React.createElement(FilterBar, {
            filterBarActor: this.filterBarActor,
            filterBarStore: this.filterBarStore
          }),
          React.createElement(Table, {
            tableActor: this.tableActor,
            tableStore: this.tableStore
          })
        );
      }
    }
  });

  return FilterableTable;
})(React.Component);

},{"../actors/FilterBarActor":2,"../actors/TableActor":3,"../stores/FilterBarStore":20,"../stores/TableStore":21,"./FilterBar/FilterBar.react":6,"./Table/Table.react":18}],18:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var TableHeadingCell = require("./TableHeadingCell.react").TableHeadingCell;

var Table = exports.Table = (function (_React$Component) {
  function Table(props) {
    _classCallCheck(this, Table);

    _get(Object.getPrototypeOf(Table.prototype), "constructor", this).call(this, props);

    this.tableActor = props.tableActor;
    this.tableStore = props.tableStore;

    this.state = this.getStateFromStores();
    this.tableStore.addChangeListener(this._onChange.bind(this));
  }

  _inherits(Table, _React$Component);

  _createClass(Table, {
    _onChange: {
      value: function _onChange() {
        this.setState(this.getStateFromStores());
      }
    },
    _onClick: {
      value: function _onClick(event) {
        this.tableActor.fetchPagedData(event.target.innerHTML);
      }
    },
    getStateFromStores: {
      value: function getStateFromStores() {
        return {
          columnHeadings: this.tableActor.getColumnHeadings(),
          rows: this.tableActor.getRows(),
          currentPage: this.tableActor.getCurrentPage(),
          totalPages: this.tableActor.getTotalPages()
        };
      }
    },
    render: {
      value: function render() {
        var columns = Object.keys(this.state.columnHeadings).map(function (columnId) {
          return React.createElement(TableHeadingCell, { key: columnId, heading: this.state.columnHeadings[columnId].heading });
        }, this);

        if (this.state.totalPages > 1) {
          var pages = Array.apply(null, Array(this.state.totalPages)).map(function (_, i) {
            return i + 1;
          });
          var pagination = pages.map(function (pageNumber) {
            var classes = "";
            if (pageNumber === this.state.currentPage) {
              classes = "active";
            }
            return React.createElement(
              "li",
              { key: pageNumber, className: classes },
              React.createElement(
                "a",
                { onClick: this._onClick.bind(this) },
                pageNumber
              )
            );
          }, this);
        }

        var rows = this.state.rows.map(function (row) {
          var columns = Object.keys(row).map(function (columnId) {
            return React.createElement(
              "td",
              null,
              row[columnId]
            );
          }, this);

          return React.createElement(
            "tr",
            null,
            columns
          );
        }, this);

        return React.createElement(
          "div",
          { className: "panel panel-responsive" },
          React.createElement(
            "div",
            { className: "table-responsive" },
            React.createElement(
              "table",
              { className: "table table-hover table-striped" },
              React.createElement(
                "thead",
                null,
                React.createElement(
                  "tr",
                  null,
                  columns
                )
              ),
              React.createElement(
                "tbody",
                null,
                rows
              )
            ),
            React.createElement(
              "nav",
              null,
              React.createElement(
                "ul",
                { className: "pagination" },
                pagination
              )
            )
          )
        );
      }
    }
  });

  return Table;
})(React.Component);

},{"./TableHeadingCell.react":19}],19:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var TableHeadingCell = exports.TableHeadingCell = (function (_React$Component) {
  function TableHeadingCell(props) {
    _classCallCheck(this, TableHeadingCell);

    _get(Object.getPrototypeOf(TableHeadingCell.prototype), "constructor", this).call(this, props);
    this.heading = props.heading;
  }

  _inherits(TableHeadingCell, _React$Component);

  _createClass(TableHeadingCell, {
    render: {
      value: function render() {
        return React.createElement(
          "th",
          null,
          this.heading
        );
      }
    }
  });

  return TableHeadingCell;
})(React.Component);

},{}],20:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});
var SharedUtils = require("../utils/SharedUtils");

var FilterBarStore = exports.FilterBarStore = (function () {
  function FilterBarStore(configuration) {
    _classCallCheck(this, FilterBarStore);

    this.CHANGE_EVENT = "change";
    this.eventEmitter = new EventEmitter();

    this.id = configuration.id;
    this.persistent = configuration.persistent;
    this.url = configuration.searchUrl;
    this.searchUrl = configuration.searchUrl;
    this.saveSearchUrl = configuration.saveSearchUrl;
    this.savedSearchUrl = configuration.savedSearchUrl;
    this.exportResultsUrl = configuration.exportResultsUrl;
    this.filters = configuration.filters;

    var filter, filterUid;

    for (var i = 0; i < Object.keys(this.filters).length; i++) {
      filterUid = Object.keys(this.filters)[i];
      filter = this.filters[filterUid];

      if (filter.url) {
        SharedUtils.ajaxGet(filter.url, "json", (function (filterUid) {
          return function (response) {
            this.updateFilter(filterUid, "options", response);
          };
        })(filterUid).bind(this));
      }
    }

    this.receieveSavedSearches();
  }

  _createClass(FilterBarStore, {
    getId: {
      value: function getId() {
        return this.id;
      }
    },
    getSearchUrl: {
      value: function getSearchUrl() {
        return this.searchUrl;
      }
    },
    getSaveSearchUrl: {
      value: function getSaveSearchUrl() {
        return this.saveSearchUrl;
      }
    },
    getSavedSearches: {
      value: function getSavedSearches() {
        return this.savedSearches;
      }
    },
    getSavedSearch: {
      value: function getSavedSearch(searchId) {
        return this.savedSearches[searchId];
      }
    },
    getFilter: {
      value: function getFilter(filterUid) {
        return this.filters[filterUid];
      }
    },
    getDisabled: {
      value: function getDisabled() {
        var disabledFilters = {};
        for (var filterUid in this.filters) {
          if (this.filters[filterUid].enabled === false) {
            disabledFilters[filterUid] = this.filters[filterUid];
          }
        }
        return disabledFilters;
      }
    },
    getEnabled: {
      value: function getEnabled() {
        var enabledFilters = {};
        for (var filterUid in this.filters) {
          if (this.filters[filterUid].enabled === true) {
            enabledFilters[filterUid] = this.filters[filterUid];
          }
        }
        return enabledFilters;
      }
    },
    getQuery: {
      value: function getQuery() {
        var enabledFilters = Object.keys(this.getEnabled()).map(function (filterUid) {
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
    },
    receieveSavedSearches: {

      /* Mutation Methods */

      value: function receieveSavedSearches() {
        SharedUtils.ajaxGet(this.savedSearchUrl, "json", (function (response) {
          this.savedSearches = response;this.emitChange();
        }).bind(this));
      }
    },
    disableAllFilters: {
      value: function disableAllFilters() {
        var enabledFilters = this.getEnabled();

        for (var filterUid in enabledFilters) {
          this.disableFilter(filterUid);
        }
        this.emitChange();
      }
    },
    disableFilter: {
      value: function disableFilter(filterUid) {
        this.filters[filterUid].enabled = false;
        this.filters[filterUid].value = "";
        this.emitChange();
      }
    },
    enableFilter: {
      value: function enableFilter(filterUid, value) {
        this.filters[filterUid].enabled = true;
        this.filters[filterUid].value = value || "";
        this.emitChange();
      }
    },
    updateFilter: {
      value: function updateFilter(filterUid, propKey, propValue) {
        this.filters[filterUid][propKey] = propValue;
        this.emitChange();
      }
    },
    emitChange: {
      value: function emitChange() {
        this.eventEmitter.emit(this.CHANGE_EVENT);
      }
    },
    addChangeListener: {
      value: function addChangeListener(callback) {
        this.eventEmitter.on(this.CHANGE_EVENT, callback);
      }
    },
    removeChangeListener: {
      value: function removeChangeListener(callback) {
        this.eventEmitter.removeListener(this.CHANGE_EVENT, callback);
      }
    }
  });

  return FilterBarStore;
})();

},{"../utils/SharedUtils":23}],21:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var SearchUtils = _interopRequireWildcard(require("../utils/SearchUtils"));

var TableStore = exports.TableStore = (function () {
  function TableStore(configuration) {
    _classCallCheck(this, TableStore);

    this.CHANGE_EVENT = "change";
    this.eventEmitter = new EventEmitter();

    this.id = configuration.id;
    this.rows = [];
    this.currentPage = configuration.page || 1;
    this.totalPages = 1;

    this.columnHeadings = configuration.columns;
    this.url = configuration.dataUrl;
    this.fetchData();
  }

  _createClass(TableStore, {
    getId: {
      value: function getId() {
        return this.id;
      }
    },
    setUrl: {
      value: function setUrl(url) {
        this.url = url;
      }
    },
    getUrl: {
      value: function getUrl() {
        return this.url;
      }
    },
    fetchData: {
      value: function fetchData() {
        SearchUtils.search(this.url + ("&page=" + this.currentPage), this.setData.bind(this));
      }
    },
    setData: {
      value: function setData(response) {
        this.rows = response.results;
        this.currentPage = response.current_page;
        this.totalPages = response.total_pages;
        this.emitChange();
      }
    },
    getColumnHeadings: {
      value: function getColumnHeadings() {
        return this.columnHeadings;
      }
    },
    getRows: {
      value: function getRows() {
        return this.rows;
      }
    },
    getCurrentPage: {
      value: function getCurrentPage() {
        return this.currentPage;
      }
    },
    getTotalPages: {
      value: function getTotalPages() {
        return this.totalPages;
      }
    },
    setCurrentPage: {
      value: function setCurrentPage(page) {
        this.currentPage = page;
      }
    },
    emitChange: {
      value: function emitChange() {
        this.eventEmitter.emit(this.CHANGE_EVENT);
      }
    },
    addChangeListener: {
      value: function addChangeListener(callback) {
        this.eventEmitter.on(this.CHANGE_EVENT, callback);
      }
    },
    removeChangeListener: {
      value: function removeChangeListener(callback) {
        this.eventEmitter.removeListener(this.CHANGE_EVENT, callback);
      }
    }
  });

  return TableStore;
})();

},{"../utils/SearchUtils":22}],22:[function(require,module,exports){
"use strict";

exports.search = search;
Object.defineProperty(exports, "__esModule", {
  value: true
});

var ajaxGet = require("./SharedUtils").ajaxGet;

function search(url, success) {
  ajaxGet(url, "json", success);
}

},{"./SharedUtils":23}],23:[function(require,module,exports){
"use strict";

exports.serialize = serialize;
exports.ajaxGet = ajaxGet;
exports.ajaxPost = ajaxPost;
exports.updateUrl = updateUrl;
exports.parseFilterBarConfiguration = parseFilterBarConfiguration;
exports.parseTableConfiguration = parseTableConfiguration;
exports.parseUrlSearchString = parseUrlSearchString;
exports.createUrlSearchString = createUrlSearchString;
Object.defineProperty(exports, "__esModule", {
  value: true
});

function serialize(obj, prefix) {
  var str = [];
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      var k = prefix ? prefix + "[" + p + "]" : p,
          v = obj[p];
      str.push(typeof v == "object" ? this.serialize(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
    }
  }
  return str.join("&");
}

function ajaxGet(url, type, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.responseType = type;
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhr.onload = function () {
    var status = xhr.status;
    var response = xhr.response;
    if (status === 200) {
      return success(response);
    } else {
      return error(response);
    }
  };
  xhr.send();
}

function ajaxPost(url, type, data, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.responseType = type;
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  xhr.setRequestHeader("X_CSRF_TOKEN", document.querySelector("meta[name=csrf-token]").getAttribute("content"));
  xhr.onload = function () {
    var status = xhr.status;
    var response = xhr.response;
  };
  xhr.send(JSON.stringify(data));
}

function updateUrl(propKey, propValue) {
  var searchObject = parseUrlSearchString();

  searchObject[propKey] = propValue;

  var newSearchString = "?" + createUrlSearchString(searchObject);

  history.pushState({}, "", window.location.origin + window.location.pathname + newSearchString);
  localStorage[window.location.pathname.replace(/\//g, "")] = newSearchString;
}

function parseFilterBarConfiguration(filterBarConfiguration, id) {
  var parsedFilterBarConfiguration = {},
      rawFilter,
      rawFilters,
      parsedFilters = {};

  rawFilters = filterBarConfiguration.querySelector("dl.filters").querySelectorAll("dt.filter");

  for (var i = 0; i < rawFilters.length; i++) {
    rawFilter = rawFilters[i];
    parsedFilters[rawFilter.getAttribute("data-uid")] = {
      label: rawFilter.getAttribute("data-label"),
      type: rawFilter.getAttribute("data-type"),
      field: rawFilter.getAttribute("data-field"),
      url: rawFilter.getAttribute("data-url"),
      value: "",
      enabled: false
    };
  }

  parsedFilterBarConfiguration.id = id;
  parsedFilterBarConfiguration.persistent = filterBarConfiguration.querySelector("dt.persistent").getAttribute("data-persistent");
  parsedFilterBarConfiguration.searchUrl = filterBarConfiguration.querySelector("dt.search-url").getAttribute("data-url");
  parsedFilterBarConfiguration.saveSearchUrl = filterBarConfiguration.querySelector("dt.save-search-url").getAttribute("data-url");
  parsedFilterBarConfiguration.savedSearchUrl = filterBarConfiguration.querySelector("dt.saved-search-url").getAttribute("data-url");
  parsedFilterBarConfiguration.exportResultsUrl = filterBarConfiguration.querySelector("dt.export-results-url").getAttribute("data-url");
  parsedFilterBarConfiguration.filters = parsedFilters;

  return parsedFilterBarConfiguration;
}

function parseTableConfiguration(tableConfiguration, id) {
  var parsedTableConfiguration = {},
      rawColumns,
      rawColumn,
      parsedColumns = {};

  rawColumns = tableConfiguration.querySelector("dl.columns").querySelectorAll("dt.column");

  for (var i = 0; i < rawColumns.length; i++) {
    rawColumn = rawColumns[i];
    parsedColumns[rawColumn.getAttribute("data-field")] = {
      heading: rawColumn.getAttribute("data-heading"),
      type: rawColumn.getAttribute("data-type")
    };
  }

  parsedTableConfiguration.id = id;
  parsedTableConfiguration.dataUrl = tableConfiguration.querySelector("dt.data-url").getAttribute("data-url");
  parsedTableConfiguration.columns = parsedColumns;

  return parsedTableConfiguration;
}

function parseUrlSearchString() {
  // taken from https://github.com/sindresorhus/query-string/blob/master/query-string.js

  var str = window.location.search;

  if (typeof str !== "string") {
    return {};
  }

  str = str.trim().replace(/^(\?|#)/, "");

  if (!str) {
    return {};
  }

  return str.trim().split("&").reduce(function (ret, param) {
    var parts = param.replace(/\+/g, " ").split("=");
    var key = parts[0];
    var val = parts[1];

    key = decodeURIComponent(key);
    // missing `=` should be `null`:
    // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
    val = val === undefined ? null : decodeURIComponent(val);

    if (!ret.hasOwnProperty(key)) {
      ret[key] = val;
    } else if (Array.isArray(ret[key])) {
      ret[key].push(val);
    } else {
      ret[key] = [ret[key], val];
    }

    return ret;
  }, {});
}

function createUrlSearchString(obj) {
  // taken from https://github.com/sindresorhus/query-string/blob/master/query-string.js
  return obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];

    if (Array.isArray(val)) {
      return val.map(function (val2) {
        return encodeURIComponent(key) + "=" + encodeURIComponent(val2);
      }).join("&");
    }

    return encodeURIComponent(key) + "=" + encodeURIComponent(val);
  }).join("&") : "";
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvamFjb2JiMS9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2FwcC5qcyIsIi9Vc2Vycy9qYWNvYmIxL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvYWN0b3JzL0ZpbHRlckJhckFjdG9yLmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9hY3RvcnMvVGFibGVBY3Rvci5qcyIsIi9Vc2Vycy9qYWNvYmIxL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvY29tcG9uZW50cy9GaWx0ZXJCYXIvQXBwbHlGaWx0ZXJzQnV0dG9uLnJlYWN0LmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9jb21wb25lbnRzL0ZpbHRlckJhci9DbGVhckZpbHRlcnNCdXR0b24ucmVhY3QuanMiLCIvVXNlcnMvamFjb2JiMS9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2NvbXBvbmVudHMvRmlsdGVyQmFyL0ZpbHRlckJhci5yZWFjdC5qcyIsIi9Vc2Vycy9qYWNvYmIxL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvY29tcG9uZW50cy9GaWx0ZXJCYXIvRmlsdGVyRGlzcGxheS9GaWx0ZXJEaXNwbGF5LnJlYWN0LmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9jb21wb25lbnRzL0ZpbHRlckJhci9GaWx0ZXJEaXNwbGF5L0ZpbHRlcklucHV0LnJlYWN0LmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9jb21wb25lbnRzL0ZpbHRlckJhci9GaWx0ZXJEaXNwbGF5L0lucHV0cy9EYXRlSW5wdXQucmVhY3QuanMiLCIvVXNlcnMvamFjb2JiMS9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2NvbXBvbmVudHMvRmlsdGVyQmFyL0ZpbHRlckRpc3BsYXkvSW5wdXRzL1NlbGVjdElucHV0LnJlYWN0LmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9jb21wb25lbnRzL0ZpbHRlckJhci9GaWx0ZXJEaXNwbGF5L0lucHV0cy9UZXh0SW5wdXQucmVhY3QuanMiLCIvVXNlcnMvamFjb2JiMS9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2NvbXBvbmVudHMvRmlsdGVyQmFyL0ZpbHRlckxpc3QvRmlsdGVyTGlzdC5yZWFjdC5qcyIsIi9Vc2Vycy9qYWNvYmIxL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvY29tcG9uZW50cy9GaWx0ZXJCYXIvRmlsdGVyTGlzdC9GaWx0ZXJMaXN0T3B0aW9uLnJlYWN0LmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9jb21wb25lbnRzL0ZpbHRlckJhci9TYXZlRmlsdGVyc0J1dHRvbi5yZWFjdC5qcyIsIi9Vc2Vycy9qYWNvYmIxL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvY29tcG9uZW50cy9GaWx0ZXJCYXIvU2F2ZWRTZWFyY2hlc0xpc3QvU2F2ZWRTZWFyY2hlc0xpc3QucmVhY3QuanMiLCIvVXNlcnMvamFjb2JiMS9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2NvbXBvbmVudHMvRmlsdGVyQmFyL1NhdmVkU2VhcmNoZXNMaXN0L1NhdmVkU2VhcmNoZXNMaXN0SXRlbS5yZWFjdC5qcyIsIi9Vc2Vycy9qYWNvYmIxL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvY29tcG9uZW50cy9GaWx0ZXJhYmxlVGFibGUucmVhY3QuanMiLCIvVXNlcnMvamFjb2JiMS9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2NvbXBvbmVudHMvVGFibGUvVGFibGUucmVhY3QuanMiLCIvVXNlcnMvamFjb2JiMS9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2NvbXBvbmVudHMvVGFibGUvVGFibGVIZWFkaW5nQ2VsbC5yZWFjdC5qcyIsIi9Vc2Vycy9qYWNvYmIxL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvc3RvcmVzL0ZpbHRlckJhclN0b3JlLmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9zdG9yZXMvVGFibGVTdG9yZS5qcyIsIi9Vc2Vycy9qYWNvYmIxL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvdXRpbHMvU2VhcmNoVXRpbHMuanMiLCIvVXNlcnMvamFjb2JiMS9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL3V0aWxzL1NoYXJlZFV0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztJQ0FRLGVBQWUsV0FBTyxvQ0FBb0MsRUFBMUQsZUFBZTs7SUFFWCxXQUFXLG1DQUFNLHFCQUFxQjs7QUFFbEQsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLFlBQVU7QUFDdEQsTUFBSSxZQUFZLEdBQUcsV0FBVyxDQUFDLG9CQUFvQixFQUFFO01BQ2pELGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyx3QkFBd0IsQ0FBQztNQUM1RSxtQkFBbUI7TUFDbkIsc0JBQXNCO01BQ3RCLGtCQUFrQjtNQUNsQixpQkFBaUI7TUFDakIsU0FBUztNQUNULEtBQUs7TUFDTCxJQUFJO01BQ0osT0FBTyxDQUFDOztBQUVaLE9BQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O0FBRWhELHVCQUFtQixHQUFHLGdC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QUFxQixDQUFDLEdBQUcsRUFBRTs7QUFFekMsU0FBTyxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLEVBQUU7QUFDL0MsUUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVuQixRQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDdEIsYUFBTyxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSxFQUFFO0FBQzdCLGVBQU8sa0JBQWtCLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO09BQ2pFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDZDs7QUFFRCxXQUFPLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUNoRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztDQUNuQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQge0ZpbHRlcmFibGVUYWJsZX0gZnJvbSAnLi9jb21wb25lbnRzL0ZpbHRlcmFibGVUYWJsZS5yZWFjdCc7XG5cbmltcG9ydCAqIGFzIFNoYXJlZFV0aWxzIGZyb20gJy4vdXRpbHMvU2hhcmVkVXRpbHMnO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKXtcbiAgdmFyIHNlYXJjaE9iamVjdCA9IFNoYXJlZFV0aWxzLnBhcnNlVXJsU2VhcmNoU3RyaW5nKCksXG4gICAgICBmaWx0ZXJhYmxlVGFibGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncmVhY3QtZmlsdGVyYWJsZS10YWJsZScpLFxuICAgICAgZmlsdGVyYWJsZVRhYmxlTm9kZSxcbiAgICAgIGZpbHRlckJhckNvbmZpZ3VyYXRpb24sXG4gICAgICB0YWJsZUNvbmZpZ3VyYXRpb24sXG4gICAgICBmaWx0ZXJhYmxlVGFibGVJZCxcbiAgICAgIGZpbHRlcmJhcixcbiAgICAgIHRhYmxlLFxuICAgICAgcGFnZSxcbiAgICAgIGZpbHRlcnM7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBmaWx0ZXJhYmxlVGFibGVzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICBmaWx0ZXJhYmxlVGFibGVOb2RlID0gZmlsdGVyYWJsZVRhYmxlc1tpXTtcbiAgICBmaWx0ZXJCYXJDb25maWd1cmF0aW9uID0gZmlsdGVyYWJsZVRhYmxlTm9kZS5xdWVyeVNlbGVjdG9yKCdkbC5maWx0ZXJCYXJDb25maWd1cmF0aW9uJyk7XG4gICAgdGFibGVDb25maWd1cmF0aW9uID0gZmlsdGVyYWJsZVRhYmxlTm9kZS5xdWVyeVNlbGVjdG9yKCdkbC50YWJsZUNvbmZpZ3VyYXRpb24nKTtcbiAgICBmaWx0ZXJhYmxlVGFibGVJZCA9IGZpbHRlcmFibGVUYWJsZU5vZGUuZ2V0QXR0cmlidXRlKCdpZCcpIHx8IGk7XG5cbiAgICBmaWx0ZXJiYXIgPSBTaGFyZWRVdGlscy5wYXJzZUZpbHRlckJhckNvbmZpZ3VyYXRpb24oZmlsdGVyQmFyQ29uZmlndXJhdGlvbiwgZmlsdGVyYWJsZVRhYmxlSWQpO1xuICAgIHRhYmxlID0gU2hhcmVkVXRpbHMucGFyc2VUYWJsZUNvbmZpZ3VyYXRpb24odGFibGVDb25maWd1cmF0aW9uLCBmaWx0ZXJhYmxlVGFibGVJZCk7XG5cbiAgICBpZiAoZmlsdGVyYmFyLnBlcnNpc3RlbnQgPT0gJ3RydWUnKSB7XG4gICAgICBpZiAod2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZignPycpID09IC0xKSB7XG4gICAgICAgIGlmIChsb2NhbFN0b3JhZ2Vbd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcLy9nLCcnKV0pIHtcbiAgICAgICAgICB3aW5kb3cubG9jYXRpb24uc2VhcmNoID0gbG9jYWxTdG9yYWdlW3dpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC8vZywnJyldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIFNoYXJlZFV0aWxzLnVwZGF0ZVVybCgncScsICcnKTtcbiAgICAgICAgICBTaGFyZWRVdGlscy51cGRhdGVVcmwoJ3BhZ2UnLCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0YWJsZS5kYXRhVXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG5cbiAgICAgIGlmIChzZWFyY2hPYmplY3QuaGFzT3duUHJvcGVydHkoJ3EnKSAmJiBzZWFyY2hPYmplY3QucSAhPSAnJykge1xuICAgICAgICBmaWx0ZXJzID0gSlNPTi5wYXJzZShzZWFyY2hPYmplY3QucSk7XG4gICAgICAgIGZvciAodmFyIGZpbHRlciBvZiBmaWx0ZXJzKSB7XG4gICAgICAgICAgZmlsdGVyYmFyLmZpbHRlcnNbZmlsdGVyLnVpZF0uZW5hYmxlZCA9IHRydWU7XG4gICAgICAgICAgZmlsdGVyYmFyLmZpbHRlcnNbZmlsdGVyLnVpZF0udmFsdWUgPSBmaWx0ZXIudmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHNlYXJjaE9iamVjdC5oYXNPd25Qcm9wZXJ0eSgncGFnZScpKSB7XG4gICAgICAgIHRhYmxlLnBhZ2UgPSBKU09OLnBhcnNlKHNlYXJjaE9iamVjdC5wYWdlKTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIFJlYWN0LnJlbmRlcihcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgIEZpbHRlcmFibGVUYWJsZSxcbiAgICAgICAge1xuICAgICAgICAgIGZpbHRlcmFibGVUYWJsZUlkOiBmaWx0ZXJhYmxlVGFibGVJZCxcbiAgICAgICAgICBmaWx0ZXJiYXI6IGZpbHRlcmJhcixcbiAgICAgICAgICB0YWJsZTogdGFibGVcbiAgICAgICAgfVxuICAgICAgKSxcbiAgICAgIGZpbHRlcmFibGVUYWJsZU5vZGVcbiAgICApO1xuICB9XG59KTtcbiIsImltcG9ydCAqIGFzIFNoYXJlZFV0aWxzIGZyb20gJy4uL3V0aWxzL1NoYXJlZFV0aWxzJztcblxuZXhwb3J0IGNsYXNzIEZpbHRlckJhckFjdG9yIHtcbiAgY29uc3RydWN0b3IoZmlsdGVyQmFyU3RvcmUsIHRhYmxlU3RvcmUpIHtcbiAgICB0aGlzLmZpbHRlckJhclN0b3JlID0gZmlsdGVyQmFyU3RvcmU7XG4gICAgdGhpcy50YWJsZVN0b3JlID0gdGFibGVTdG9yZTtcbiAgfVxuXG4gIGdldFNhdmVkU2VhcmNoZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyQmFyU3RvcmUuZ2V0U2F2ZWRTZWFyY2hlcygpIHx8IFtdO1xuICB9XG5cbiAgZ2V0RmlsdGVyKGZpbHRlclVpZCkge1xuICAgIHJldHVybiB0aGlzLmZpbHRlckJhclN0b3JlLmdldEZpbHRlcihmaWx0ZXJVaWQpXG4gIH1cblxuICBlbmFibGVGaWx0ZXIoZmlsdGVyVWlkLCB2YWx1ZSkge1xuICAgIHRoaXMuZmlsdGVyQmFyU3RvcmUuZW5hYmxlRmlsdGVyKGZpbHRlclVpZCwgdmFsdWUpO1xuICB9XG5cbiAgZGlzYWJsZUZpbHRlcihmaWx0ZXJVaWQpIHtcbiAgICB0aGlzLmZpbHRlckJhclN0b3JlLmRpc2FibGVGaWx0ZXIoZmlsdGVyVWlkKTtcbiAgfVxuXG4gIGRpc2FibGVBbGxGaWx0ZXJzKCkge1xuICAgIHRoaXMuZmlsdGVyQmFyU3RvcmUuZGlzYWJsZUFsbEZpbHRlcnMoKTtcbiAgICB0aGlzLmFwcGx5RmlsdGVycygpO1xuICB9XG5cbiAgdXBkYXRlRmlsdGVyKGZpbHRlclVpZCwgcHJvcEtleSwgcHJvcFZhbHVlKSB7XG4gICAgdGhpcy5maWx0ZXJCYXJTdG9yZS51cGRhdGVGaWx0ZXIoZmlsdGVyVWlkLCBwcm9wS2V5LCBwcm9wVmFsdWUpXG4gIH1cblxuICBnZXRFbmFibGVkKCkge1xuICAgIHJldHVybiB0aGlzLmZpbHRlckJhclN0b3JlLmdldEVuYWJsZWQoKTtcbiAgfVxuXG4gIGdldERpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLmZpbHRlckJhclN0b3JlLmdldERpc2FibGVkKCk7XG4gIH1cblxuICBhcHBseUZpbHRlcnMoKSB7XG4gICAgdmFyIGlkID0gdGhpcy5maWx0ZXJCYXJTdG9yZS5nZXRJZCgpO1xuICAgIHZhciBzZWFyY2hVcmwgPSB0aGlzLmZpbHRlckJhclN0b3JlLmdldFNlYXJjaFVybCgpO1xuICAgIHZhciBxdWVyeU9iamVjdCA9IHRoaXMuZmlsdGVyQmFyU3RvcmUuZ2V0UXVlcnkoKTtcblxuICAgIGlmICh0aGlzLmZpbHRlckJhclN0b3JlLnBlcnNpc3RlbnQpIHtcbiAgICAgIFNoYXJlZFV0aWxzLnVwZGF0ZVVybCgncScsIHF1ZXJ5T2JqZWN0KTtcbiAgICB9XG5cbiAgICB0aGlzLnRhYmxlU3RvcmUuc2V0VXJsKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgICB0aGlzLnRhYmxlU3RvcmUuc2V0Q3VycmVudFBhZ2UoMSk7XG4gICAgdGhpcy50YWJsZVN0b3JlLmZldGNoRGF0YSgpO1xuICB9XG5cbiAgbG9hZFNhdmVkU2VhcmNoKHNlYXJjaElkKSB7XG4gICAgdGhpcy5kaXNhYmxlQWxsRmlsdGVycygpO1xuXG4gICAgdmFyIHNhdmVkU2VhcmNoID0gdGhpcy5maWx0ZXJCYXJTdG9yZS5nZXRTYXZlZFNlYXJjaChzZWFyY2hJZCk7XG4gICAgdmFyIGZpbHRlcnMgPSBKU09OLnBhcnNlKHNhdmVkU2VhcmNoLmNvbmZpZ3VyYXRpb24pO1xuXG4gICAgZm9yICh2YXIgZmlsdGVyIGluIGZpbHRlcnMpIHtcbiAgICAgIHRoaXMuZW5hYmxlRmlsdGVyKGZpbHRlciwgZmlsdGVyc1tmaWx0ZXJdKTtcbiAgICB9XG5cbiAgICB0aGlzLmFwcGx5RmlsdGVycygpO1xuICB9XG5cbiAgc2F2ZUZpbHRlcnMobmFtZSkge1xuICAgIHZhciBlbmFibGVkRmlsdGVycyA9IHRoaXMuZmlsdGVyQmFyU3RvcmUuZ2V0RW5hYmxlZCgpLFxuICAgICAgICBzYXZlZEZpbHRlcnNQYWNrZXQgPSB7fTtcbiAgICBzYXZlZEZpbHRlcnNQYWNrZXQuc2VhcmNoX3RpdGxlID0gbmFtZTtcbiAgICBzYXZlZEZpbHRlcnNQYWNrZXQuZmlsdGVycyA9IHt9XG4gICAgZm9yICh2YXIgZmlsdGVyVWlkIGluIGVuYWJsZWRGaWx0ZXJzKSB7XG4gICAgICBzYXZlZEZpbHRlcnNQYWNrZXQuZmlsdGVyc1tmaWx0ZXJVaWRdID0gZW5hYmxlZEZpbHRlcnNbZmlsdGVyVWlkXS52YWx1ZTtcbiAgICB9XG4gICAgU2hhcmVkVXRpbHMuYWpheFBvc3QodGhpcy5maWx0ZXJCYXJTdG9yZS5nZXRTYXZlU2VhcmNoVXJsKCksICdqc29uJywgc2F2ZWRGaWx0ZXJzUGFja2V0KTtcbiAgICB0aGlzLmFwcGx5RmlsdGVycygpO1xuICB9XG5cbiAgZ2V0T3B0aW9uc0Zyb21TZXJ2ZXIoZmlsdGVyVWlkKSB7XG4gICAgdmFyIGZpbHRlciA9IHRoaXMuZ2V0RmlsdGVyKGZpbHRlclVpZCk7XG5cbiAgICB2YXIgdXJsID0gZmlsdGVyLnVybDtcblxuICAgIFNoYXJlZFV0aWxzLmFqYXhHZXQodXJsLCAnanNvbicsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7IHRoaXMudXBkYXRlRmlsdGVyKGZpbHRlclVpZCwgJ29wdGlvbnMnLCByZXNwb25zZSl9LmJpbmQodGhpcykpO1xuICB9XG59IiwiaW1wb3J0ICogYXMgU2hhcmVkVXRpbHMgZnJvbSAnLi4vdXRpbHMvU2hhcmVkVXRpbHMnO1xuXG5leHBvcnQgY2xhc3MgVGFibGVBY3RvciB7XG4gIGNvbnN0cnVjdG9yKGZpbHRlckJhclN0b3JlLCB0YWJsZVN0b3JlKSB7XG4gICAgdGhpcy5maWx0ZXJCYXJTdG9yZSA9IGZpbHRlckJhclN0b3JlO1xuICAgIHRoaXMudGFibGVTdG9yZSA9IHRhYmxlU3RvcmU7XG4gIH1cblxuICBnZXRDb2x1bW5IZWFkaW5ncygpIHtcbiAgICByZXR1cm4gdGhpcy50YWJsZVN0b3JlLmdldENvbHVtbkhlYWRpbmdzKCk7XG4gIH1cblxuICBnZXRSb3dzKCkge1xuICAgIHJldHVybiB0aGlzLnRhYmxlU3RvcmUuZ2V0Um93cygpO1xuICB9XG5cbiAgZ2V0Q3VycmVudFBhZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMudGFibGVTdG9yZS5nZXRDdXJyZW50UGFnZSgpO1xuICB9XG5cbiAgZ2V0VG90YWxQYWdlcygpIHtcbiAgICByZXR1cm4gdGhpcy50YWJsZVN0b3JlLmdldFRvdGFsUGFnZXMoKTtcbiAgfVxuXG4gIGZldGNoUGFnZWREYXRhKHBhZ2UpIHtcbiAgICB2YXIgaWQgPSB0aGlzLnRhYmxlU3RvcmUuZ2V0SWQoKTtcbiAgICB2YXIgY3VycmVudFVybCA9IHRoaXMudGFibGVTdG9yZS5nZXRVcmwoKTtcbiAgICB2YXIgbmV3VXJsID0gY3VycmVudFVybCArICdwYWdlPScgKyBwYWdlICsgJyYnO1xuXG4gICAgaWYgKHRoaXMuZmlsdGVyQmFyU3RvcmUucGVyc2lzdGVudCkge1xuICAgICAgU2hhcmVkVXRpbHMudXBkYXRlVXJsKCdwYWdlJywgcGFnZSk7XG4gICAgfVxuXG4gICAgdGhpcy50YWJsZVN0b3JlLnNldEN1cnJlbnRQYWdlKHBhZ2UpO1xuICAgIHRoaXMudGFibGVTdG9yZS5mZXRjaERhdGEoKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIEFwcGx5RmlsdGVyc0J1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICB9XG5cbiAgX29uQ2xpY2soKSB7XG4gICAgdGhpcy5wcm9wcy5maWx0ZXJCYXJBY3Rvci5hcHBseUZpbHRlcnMoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIiBvbkNsaWNrPXt0aGlzLl9vbkNsaWNrLmJpbmQodGhpcyl9PlxuICAgICAgICA8aSBjbGFzc05hbWU9XCJpY29uIGljb24tdGlja1wiIC8+XG4gICAgICAgIEFwcGx5XG4gICAgICA8L2J1dHRvbj5cbiAgICApO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgQ2xlYXJGaWx0ZXJzQnV0dG9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gIH1cblxuICBfb25DbGljaygpIHtcbiAgICB0aGlzLnByb3BzLmZpbHRlckJhckFjdG9yLmRpc2FibGVBbGxGaWx0ZXJzKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi13YXJuaW5nXCIgb25DbGljaz17dGhpcy5fb25DbGljay5iaW5kKHRoaXMpfT5cbiAgICAgICAgPGkgY2xhc3NOYW1lPVwiaWNvbiBpY29uLWRlbGV0ZVwiIC8+XG4gICAgICAgIENsZWFyXG4gICAgICA8L2J1dHRvbj5cbiAgICApO1xuICB9XG59XG4iLCJpbXBvcnQge0ZpbHRlckxpc3R9IGZyb20gJy4vRmlsdGVyTGlzdC9GaWx0ZXJMaXN0LnJlYWN0JztcbmltcG9ydCB7RmlsdGVyRGlzcGxheX0gZnJvbSAnLi9GaWx0ZXJEaXNwbGF5L0ZpbHRlckRpc3BsYXkucmVhY3QnO1xuaW1wb3J0IHtBcHBseUZpbHRlcnNCdXR0b259IGZyb20gJy4vQXBwbHlGaWx0ZXJzQnV0dG9uLnJlYWN0JztcbmltcG9ydCB7Q2xlYXJGaWx0ZXJzQnV0dG9ufSBmcm9tICcuL0NsZWFyRmlsdGVyc0J1dHRvbi5yZWFjdCc7XG5pbXBvcnQge1NhdmVGaWx0ZXJzQnV0dG9ufSBmcm9tICcuL1NhdmVGaWx0ZXJzQnV0dG9uLnJlYWN0JztcbmltcG9ydCB7U2F2ZWRTZWFyY2hlc0xpc3R9IGZyb20gJy4vU2F2ZWRTZWFyY2hlc0xpc3QvU2F2ZWRTZWFyY2hlc0xpc3QucmVhY3QnO1xuXG5leHBvcnQgY2xhc3MgRmlsdGVyQmFyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLmZpbHRlckJhckFjdG9yID0gcHJvcHMuZmlsdGVyQmFyQWN0b3I7XG4gICAgdGhpcy5maWx0ZXJCYXJTdG9yZSA9IHByb3BzLmZpbHRlckJhclN0b3JlO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIG1hcmdpbi1ib3R0b20tc21cIj5cbiAgICAgICAgICAgIDxGaWx0ZXJMaXN0XG4gICAgICAgICAgICAgIGZpbHRlckJhckFjdG9yPXt0aGlzLmZpbHRlckJhckFjdG9yfVxuICAgICAgICAgICAgICBmaWx0ZXJCYXJTdG9yZT17dGhpcy5maWx0ZXJCYXJTdG9yZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgZGlzYWJsZWRcIj48aSBjbGFzc05hbWU9XCJpY29uIGljb24tZG93bmxvYWRcIj48L2k+RXhwb3J0IENTVjwvYnV0dG9uPlxuICAgICAgICAgICAgPEFwcGx5RmlsdGVyc0J1dHRvblxuICAgICAgICAgICAgICBmaWx0ZXJCYXJBY3Rvcj17dGhpcy5maWx0ZXJCYXJBY3Rvcn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8Q2xlYXJGaWx0ZXJzQnV0dG9uXG4gICAgICAgICAgICAgIGZpbHRlckJhckFjdG9yPXt0aGlzLmZpbHRlckJhckFjdG9yfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxTYXZlRmlsdGVyc0J1dHRvblxuICAgICAgICAgICAgICBmaWx0ZXJCYXJBY3Rvcj17dGhpcy5maWx0ZXJCYXJBY3Rvcn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8U2F2ZWRTZWFyY2hlc0xpc3RcbiAgICAgICAgICAgICAgZmlsdGVyQmFyQWN0b3I9e3RoaXMuZmlsdGVyQmFyQWN0b3J9XG4gICAgICAgICAgICAgIGZpbHRlckJhclN0b3JlPXt0aGlzLmZpbHRlckJhclN0b3JlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8RmlsdGVyRGlzcGxheVxuICAgICAgICAgICAgZmlsdGVyQmFyQWN0b3I9e3RoaXMuZmlsdGVyQmFyQWN0b3J9XG4gICAgICAgICAgICBmaWx0ZXJCYXJTdG9yZT17dGhpcy5maWx0ZXJCYXJTdG9yZX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiIsImltcG9ydCB7RmlsdGVySW5wdXR9IGZyb20gJy4vRmlsdGVySW5wdXQucmVhY3QnO1xuXG5leHBvcnQgY2xhc3MgRmlsdGVyRGlzcGxheSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuZmlsdGVyQmFyQWN0b3IgPSBwcm9wcy5maWx0ZXJCYXJBY3RvcjtcbiAgICB0aGlzLmZpbHRlckJhclN0b3JlID0gcHJvcHMuZmlsdGVyQmFyU3RvcmU7XG4gICAgdGhpcy5zdGF0ZSA9IHRoaXMuZ2V0U3RhdGVGcm9tU3RvcmVzKCk7XG5cbiAgICB0aGlzLmZpbHRlckJhclN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlLmJpbmQodGhpcykpO1xuICB9XG5cbiAgX29uQ2hhbmdlKCkge1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5nZXRTdGF0ZUZyb21TdG9yZXMoKSk7XG4gIH1cblxuICBnZXRTdGF0ZUZyb21TdG9yZXMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbHRlcnM6IHRoaXMuZmlsdGVyQmFyQWN0b3IuZ2V0RW5hYmxlZCgpXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHZhciBmaWx0ZXJzID0gT2JqZWN0LmtleXModGhpcy5zdGF0ZS5maWx0ZXJzKS5tYXAoZnVuY3Rpb24oZmlsdGVyVWlkKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RmlsdGVySW5wdXRcbiAgICAgICAgICBrZXk9e2ZpbHRlclVpZH1cbiAgICAgICAgICBmaWx0ZXJVaWQ9e2ZpbHRlclVpZH1cbiAgICAgICAgICBmaWx0ZXI9e3RoaXMuc3RhdGUuZmlsdGVyc1tmaWx0ZXJVaWRdfVxuICAgICAgICAgIGZpbHRlckJhckFjdG9yPXt0aGlzLmZpbHRlckJhckFjdG9yfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9LHRoaXMpO1xuXG4gICAgaWYgKGZpbHRlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICBmaWx0ZXJzID0gKDxkaXY+Tm8gRmlsdGVycyBFbmFibGVkITwvZGl2Pik7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSduYXZiYXIgZmlsdGVyYmFyJz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3BhbmVsIHBhbmVsLWRlZmF1bHQnPlxuICAgICAgICAgIHtmaWx0ZXJzfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiIsImltcG9ydCB7VGV4dElucHV0fSBmcm9tICcuL0lucHV0cy9UZXh0SW5wdXQucmVhY3QnO1xuaW1wb3J0IHtEYXRlSW5wdXR9IGZyb20gJy4vSW5wdXRzL0RhdGVJbnB1dC5yZWFjdCc7XG5pbXBvcnQge1NlbGVjdElucHV0fSBmcm9tICcuL0lucHV0cy9TZWxlY3RJbnB1dC5yZWFjdCc7XG5cbmV4cG9ydCBjbGFzcyBGaWx0ZXJJbnB1dCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5maWx0ZXJCYXJBY3RvciA9IHByb3BzLmZpbHRlckJhckFjdG9yO1xuICAgIHRoaXMuZmlsdGVyVWlkID0gcHJvcHMuZmlsdGVyVWlkO1xuICB9XG5cbiAgX29uQ2xpY2soKSB7XG4gICAgdGhpcy5maWx0ZXJCYXJBY3Rvci5kaXNhYmxlRmlsdGVyKHRoaXMuZmlsdGVyVWlkKTtcbiAgfVxuXG4gIGlucHV0RmFjdG9yeSgpIHtcbiAgICB2YXIgdHlwZSA9IHRoaXMucHJvcHMuZmlsdGVyLnR5cGU7XG4gICAgaWYgKHR5cGUgPT0gJ3RleHQnIHx8IHR5cGUgPT0gJ2lkJykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFRleHRJbnB1dFxuICAgICAgICAgIGZpbHRlckJhckFjdG9yPXt0aGlzLmZpbHRlckJhckFjdG9yfVxuICAgICAgICAgIGZpbHRlclVpZD17dGhpcy5maWx0ZXJVaWR9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PSAnZGF0ZScpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEYXRlSW5wdXRcbiAgICAgICAgICBmaWx0ZXJCYXJBY3Rvcj17dGhpcy5maWx0ZXJCYXJBY3Rvcn1cbiAgICAgICAgICBmaWx0ZXJVaWQ9e3RoaXMucHJvcHMuZmlsdGVyVWlkfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJ3NlbGVjdCcpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxTZWxlY3RJbnB1dFxuICAgICAgICAgIGZpbHRlckJhckFjdG9yPXt0aGlzLmZpbHRlckJhckFjdG9yfVxuICAgICAgICAgIGZpbHRlclVpZD17dGhpcy5wcm9wcy5maWx0ZXJVaWR9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PSAnYWdlX3NlbGVjdCcpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxBZ2VTZWxlY3RJbnB1dFxuICAgICAgICAgIGZpbHRlckJhckFjdG9yPXt0aGlzLmZpbHRlckJhckFjdG9yfVxuICAgICAgICAgIGZpbHRlclVpZD17dGhpcy5wcm9wcy5maWx0ZXJVaWR9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldCFcIik7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHZhciBpbnB1dHMgPSB0aGlzLmlucHV0RmFjdG9yeSgpO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy0zIGNvbC1tZC00IGNvbC1zbS02IGNvbC14cy0xMiBmaWx0ZXJcIj5cbiAgICAgICAgPHVsIGNsYXNzTmFtZT17dGhpcy5maWx0ZXJLZXl9PlxuICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgIDxpIG9uQ2xpY2s9e3RoaXMuX29uQ2xpY2suYmluZCh0aGlzKX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1jaXJjbGUtcHJpbWFyeSBidG4teHMgaWNvbiBpY29uLWNsb3NlIHJlbW92ZS1maWx0ZXJcIiAvPlxuICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5maWx0ZXIubGFiZWx9XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgICAge2lucHV0c31cbiAgICAgICAgPC91bD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBEYXRlSW5wdXQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7IHZhbHVlOiB0aGlzLnByb3BzLmZpbHRlckJhckFjdG9yLmdldEZpbHRlcih0aGlzLnByb3BzLmZpbHRlclVpZCkudmFsdWUgfHwgeyBmcm9tOiBudWxsLCB0bzogbnVsbCB9IH07XG4gIH1cblxuICBfb25DaGFuZ2UoZXZlbnQpIHtcbiAgICB2YXIgbmV3VmFsdWUgPSB0aGlzLnN0YXRlLnZhbHVlO1xuXG4gICAgaWYoZXZlbnQudHlwZSA9PT0gJ2RwJykge1xuICAgICAgbmV3VmFsdWVbZXZlbnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJ2lucHV0JykuZ2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicpXSA9IGV2ZW50LnRhcmdldC5xdWVyeVNlbGVjdG9yKCdpbnB1dCcpLnZhbHVlO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQudHlwZSA9PT0gJ2lucHV0Jykge1xuICAgICAgbmV3VmFsdWVbZXZlbnQudGFyZ2V0LmdldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInKV0gPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRTdGF0ZSh7dmFsdWU6IG5ld1ZhbHVlfSk7XG4gICAgdGhpcy5wcm9wcy5maWx0ZXJCYXJBY3Rvci51cGRhdGVGaWx0ZXIodGhpcy5wcm9wcy5maWx0ZXJVaWQsICd2YWx1ZScsIG5ld1ZhbHVlKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIHZhciBkYXRlUGlja2VyRnJvbSA9ICQoUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmRhdGVSYW5nZUZyb20pKTtcbiAgICBkYXRlUGlja2VyRnJvbS5kYXRldGltZXBpY2tlcih7Zm9ybWF0OiAnREQtTU0tWVlZWSd9KTtcbiAgICBkYXRlUGlja2VyRnJvbS5kYXRldGltZXBpY2tlcigpLm9uKCdkcC5jaGFuZ2UnLHRoaXMuX29uQ2hhbmdlLmJpbmQodGhpcykpO1xuXG4gICAgdmFyIGRhdGVQaWNrZXJUbyA9ICQoUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmRhdGVSYW5nZVRvKSk7XG4gICAgZGF0ZVBpY2tlclRvLmRhdGV0aW1lcGlja2VyKHtmb3JtYXQ6ICdERC1NTS1ZWVlZJ30pO1xuICAgIGRhdGVQaWNrZXJUby5kYXRldGltZXBpY2tlcigpLm9uKCdkcC5jaGFuZ2UnLHRoaXMuX29uQ2hhbmdlLmJpbmQodGhpcykpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8bGk+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAgZGF0ZXBpY2tlciBkYXRlUmFuZ2VGcm9tXCIgcmVmPVwiZGF0ZVJhbmdlRnJvbVwiPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgIGRhdGEtZGF0ZS1mb3JtYXQ9XCJERC9NTS9ZWVlZXCJcbiAgICAgICAgICAgIGFyaWEtcmVxdWlyZWQ9XCJ0cnVlXCJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiZnJvbVwiXG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5fb25DaGFuZ2UuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlLmZyb219XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpbnB1dC1ncm91cC1hZGRvblwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbi1jYWxlbmRhciBpY29uXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzci1vbmx5IGljb24gaWNvbi1jYWxlbmRhclwiPlxuICAgICAgICAgICAgICBDYWxlbmRhclxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAgZGF0ZXBpY2tlciBkYXRlUmFuZ2VUb1wiIHJlZj1cImRhdGVSYW5nZVRvXCI+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgZGF0YS1kYXRlLWZvcm1hdD1cIkREL01NL1lZWVlcIlxuICAgICAgICAgICAgYXJpYS1yZXF1aXJlZD1cInRydWVcIlxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJ0b1wiXG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5fb25DaGFuZ2UuYmluZCh0aGlzKX1cbiAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlLnRvfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAtYWRkb25cIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24tY2FsZW5kYXIgaWNvblwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3Itb25seSBpY29uIGljb24tY2FsZW5kYXJcIj5cbiAgICAgICAgICAgICAgQ2FsZW5kYXJcbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9saT5cbiAgICApO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgU2VsZWN0SW5wdXQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKVxuICAgIHZhciBmaWx0ZXIgPSBwcm9wcy5maWx0ZXJCYXJBY3Rvci5nZXRGaWx0ZXIocHJvcHMuZmlsdGVyVWlkKTtcblxuICAgIHRoaXMuc3RhdGUgPSB7IHZhbHVlOiAoZmlsdGVyLnZhbHVlIHx8IGZpbHRlci5vcHRpb25zWzBdLnZhbHVlKSB9O1xuICAgIHRoaXMucHJvcHMuZmlsdGVyQmFyQWN0b3IudXBkYXRlRmlsdGVyKHRoaXMucHJvcHMuZmlsdGVyVWlkLCAndmFsdWUnLCB0aGlzLnN0YXRlLnZhbHVlKTtcbiAgfVxuXG4gIF9vbkNoYW5nZShldmVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe3ZhbHVlOiBldmVudC50YXJnZXQudmFsdWV9KTtcbiAgICB0aGlzLnByb3BzLmZpbHRlckJhckFjdG9yLnVwZGF0ZUZpbHRlcih0aGlzLnByb3BzLmZpbHRlclVpZCwgJ3ZhbHVlJywgZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICB2YXIgb3B0aW9ucyA9IHRoaXMucHJvcHMuZmlsdGVyQmFyQWN0b3IuZ2V0RmlsdGVyKHRoaXMucHJvcHMuZmlsdGVyVWlkKS5vcHRpb25zIHx8IFtdO1xuXG4gICAgb3B0aW9ucyA9IG9wdGlvbnMubWFwKGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPG9wdGlvbiB2YWx1ZT17b3B0aW9uLnZhbHVlfT57b3B0aW9uLmxhYmVsfTwvb3B0aW9uPlxuICAgICAgKTtcbiAgICB9LCB0aGlzKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8bGk+XG4gICAgICAgIDxzZWxlY3RcbiAgICAgICAgICBjbGFzc05hbWU9J2Zvcm0tY29udHJvbCdcbiAgICAgICAgICBzZWxlY3RlZD17dGhpcy5zdGF0ZS52YWx1ZX1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5fb25DaGFuZ2UuYmluZCh0aGlzKX1cbiAgICAgICAgPlxuICAgICAgICAgIHtvcHRpb25zfVxuICAgICAgICA8L3NlbGVjdD5cbiAgICAgIDwvbGk+XG4gICAgKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFRleHRJbnB1dCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuZmlsdGVyQmFyQWN0b3IgPSBwcm9wcy5maWx0ZXJCYXJBY3RvcjtcbiAgICB0aGlzLmZpbHRlclVpZCA9IHByb3BzLmZpbHRlclVpZDtcblxuICAgIHRoaXMuc3RhdGUgPSB7dmFsdWU6IHRoaXMuZmlsdGVyQmFyQWN0b3IuZ2V0RmlsdGVyKHRoaXMuZmlsdGVyVWlkKS52YWx1ZX07XG4gIH1cblxuICBfb25DaGFuZ2UoZXZlbnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHt2YWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlfSk7XG4gICAgdGhpcy5maWx0ZXJCYXJBY3Rvci51cGRhdGVGaWx0ZXIodGhpcy5maWx0ZXJVaWQsICd2YWx1ZScsIGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxsaT5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUudmFsdWV9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuX29uQ2hhbmdlLmJpbmQodGhpcyl9XG4gICAgICAgIC8+XG4gICAgICA8L2xpPlxuICAgICk7XG4gIH1cbn1cbiIsImltcG9ydCB7RmlsdGVyTGlzdE9wdGlvbn0gZnJvbSAnLi9GaWx0ZXJMaXN0T3B0aW9uLnJlYWN0JztcblxuZXhwb3J0IGNsYXNzIEZpbHRlckxpc3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmZpbHRlckJhckFjdG9yID0gcHJvcHMuZmlsdGVyQmFyQWN0b3I7XG4gICAgdGhpcy5maWx0ZXJCYXJTdG9yZSA9IHByb3BzLmZpbHRlckJhclN0b3JlO1xuXG4gICAgdGhpcy5maWx0ZXJCYXJTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLnN0YXRlID0gdGhpcy5nZXRTdGF0ZUZyb21TdG9yZXMoKTtcbiAgfVxuXG4gIF9vbkNoYW5nZSgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0U3RhdGVGcm9tU3RvcmVzKCkpO1xuICB9XG5cbiAgZ2V0U3RhdGVGcm9tU3RvcmVzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBmaWx0ZXJzOiB0aGlzLmZpbHRlckJhckFjdG9yLmdldERpc2FibGVkKClcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdmFyIGZpbHRlciA9IHt9O1xuICAgIHZhciBvcHRpb25LZXkgPSBcIlwiO1xuICAgIHZhciBmaWx0ZXJPcHRpb25zID0gT2JqZWN0LmtleXModGhpcy5zdGF0ZS5maWx0ZXJzKS5tYXAoZnVuY3Rpb24oZmlsdGVyVWlkKSB7XG4gICAgICBvcHRpb25LZXkgPSBcIm9wdGlvbi1cIitmaWx0ZXJVaWQ7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RmlsdGVyTGlzdE9wdGlvblxuICAgICAgICAgIGtleT17b3B0aW9uS2V5fVxuICAgICAgICAgIGZpbHRlclVpZD17ZmlsdGVyVWlkfVxuICAgICAgICAgIGZpbHRlckJhckFjdG9yPXt0aGlzLmZpbHRlckJhckFjdG9yfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9LHRoaXMpO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cFwiPlxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgdHlwZT1cImJ1dHRvblwiPlxuICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImljb24gaWNvbi1hZGRcIiAvPlxuICAgICAgICAgIEFkZCBGaWx0ZXJcbiAgICAgICAgICA8aSBjbGFzc05hbWU9XCJpY29uIGljb24tY2hldnJvbi1kb3duXCIgLz5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDx1bCBjbGFzc05hbWU9XCJkcm9wZG93bi1tZW51XCIgcm9sZT1cIm1lbnVcIj5cbiAgICAgICAgICB7ZmlsdGVyT3B0aW9uc31cbiAgICAgICAgPC91bD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBGaWx0ZXJMaXN0T3B0aW9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5maWx0ZXJCYXJBY3RvciA9IHByb3BzLmZpbHRlckJhckFjdG9yO1xuICAgIHRoaXMuZmlsdGVyVWlkID0gcHJvcHMuZmlsdGVyVWlkO1xuICB9XG5cbiAgX29uQ2xpY2soKSB7XG4gICAgdGhpcy5maWx0ZXJCYXJBY3Rvci5lbmFibGVGaWx0ZXIodGhpcy5maWx0ZXJVaWQpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8bGk+XG4gICAgICAgIDxhIG9uQ2xpY2s9e3RoaXMuX29uQ2xpY2suYmluZCh0aGlzKX0+XG4gICAgICAgICAge3RoaXMuZmlsdGVyQmFyQWN0b3IuZ2V0RmlsdGVyKHRoaXMuZmlsdGVyVWlkKS5sYWJlbH1cbiAgICAgICAgPC9hPlxuICAgICAgPC9saT5cbiAgICApO1xuICB9XG59IiwiZXhwb3J0IGNsYXNzIFNhdmVGaWx0ZXJzQnV0dG9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtjb25maWd1cmF0aW9uTmFtZTogJyd9O1xuICB9XG5cbiAgX29uQ2xpY2soKSB7XG4gICAgdGhpcy5wcm9wcy5maWx0ZXJCYXJBY3Rvci5zYXZlRmlsdGVycyh0aGlzLnN0YXRlLmNvbmZpZ3VyYXRpb25OYW1lKTtcbiAgfVxuXG4gIF9vbkNoYW5nZShldmVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe2NvbmZpZ3VyYXRpb25OYW1lOiBldmVudC50YXJnZXQudmFsdWV9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFJlYWN0Qm9vdHN0cmFwLkRyb3Bkb3duQnV0dG9uIHRpdGxlPVwiU2F2ZSBTZWFyY2hcIiB0eXBlPVwiYnV0dG9uXCIgYnNTdHlsZT1cImRlZmF1bHRcIiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgbWFyZ2luLWJvdHRvbS1zbVwiPlxuICAgICAgICA8UmVhY3RCb290c3RyYXAuTWVudUl0ZW0gZXZlbnRLZXk9XCIxXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgICAgICA8bGFiZWw+U2VhcmNoIFRpdGxlPC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiB2YWx1ZT17dGhpcy5zdGF0ZS5jb25maWd1cmF0aW9uTmFtZX0gdHlwZT1cInRleHRcIiBvbkNoYW5nZT17dGhpcy5fb25DaGFuZ2UuYmluZCh0aGlzKX0gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXt0aGlzLl9vbkNsaWNrLmJpbmQodGhpcyl9PlNhdmU8L2J1dHRvbj5cbiAgICAgICAgPC9SZWFjdEJvb3RzdHJhcC5NZW51SXRlbT5cbiAgICAgIDwvUmVhY3RCb290c3RyYXAuRHJvcGRvd25CdXR0b24+XG4gICAgKTtcbiAgfVxufVxuIiwiaW1wb3J0IHtTYXZlZFNlYXJjaGVzTGlzdEl0ZW19IGZyb20gJy4vU2F2ZWRTZWFyY2hlc0xpc3RJdGVtLnJlYWN0JztcblxuZXhwb3J0IGNsYXNzIFNhdmVkU2VhcmNoZXNMaXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnN0YXRlID0gdGhpcy5nZXRTdGF0ZUZyb21TdG9yZXMoKTtcbiAgICB0aGlzLnByb3BzLmZpbHRlckJhclN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlLmJpbmQodGhpcykpO1xuICB9XG5cbiAgZ2V0U3RhdGVGcm9tU3RvcmVzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBzYXZlZFNlYXJjaGVzOiB0aGlzLnByb3BzLmZpbHRlckJhckFjdG9yLmdldFNhdmVkU2VhcmNoZXMoKVxuICAgIH1cbiAgfVxuXG4gIF9vbkNoYW5nZSgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0U3RhdGVGcm9tU3RvcmVzKCkpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHZhciBidXR0b25DbGFzcyA9ICdidG4gYnRuLWRlZmF1bHQgZHJvcGRvd24tdG9nZ2xlJztcblxuICAgIGlmICh0aGlzLnN0YXRlLnNhdmVkU2VhcmNoZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBidXR0b25DbGFzcyArPSAnIGRpc2FibGVkJ1xuICAgIH1cblxuICAgIHZhciBzYXZlZFNlYXJjaGVzID0gdGhpcy5zdGF0ZS5zYXZlZFNlYXJjaGVzLm1hcChmdW5jdGlvbihzYXZlZFNlYXJjaCwgaW5kZXgpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxTYXZlZFNlYXJjaGVzTGlzdEl0ZW1cbiAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgIHNlYXJjaElkPXtpbmRleH1cbiAgICAgICAgICBuYW1lPXtzYXZlZFNlYXJjaC5uYW1lfVxuICAgICAgICAgIGZpbHRlckJhckFjdG9yPXt0aGlzLnByb3BzLmZpbHRlckJhckFjdG9yfVxuICAgICAgICAvPlxuICAgICAgKVxuICAgIH0sIHRoaXMpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIG1hcmdpbi1ib3R0b20tc21cIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXBcIj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT17YnV0dG9uQ2xhc3N9IGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+XG4gICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJpY29uIGljb24tc2F2ZVwiIC8+XG4gICAgICAgICAgICBTYXZlZCBTZWFyY2hlc1xuICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiaWNvbiBpY29uLWNoZXZyb24tZG93blwiIC8+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImRyb3Bkb3duLW1lbnVcIiByb2xlPVwibWVudVwiPlxuICAgICAgICAgICAge3NhdmVkU2VhcmNoZXN9XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tZGFuZ2VyXCI+XG4gICAgICAgICAgPGkgY2xhc3NOYW1lPVwiaWNvbiBpY29uLWRlbGV0ZVwiIC8+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSIsImV4cG9ydCBjbGFzcyBTYXZlZFNlYXJjaGVzTGlzdEl0ZW0gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgfVxuXG4gIF9vbkNsaWNrKCkge1xuICAgIHRoaXMucHJvcHMuZmlsdGVyQmFyQWN0b3IubG9hZFNhdmVkU2VhcmNoKHRoaXMucHJvcHMuc2VhcmNoSWQpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybihcbiAgICAgIDxsaT5cbiAgICAgICAgPGEgY2xhc3NOYW1lPVwiZHluYW1pYy10ZXh0LWZpbHRlclwiIG9uQ2xpY2s9e3RoaXMuX29uQ2xpY2suYmluZCh0aGlzKX0+XG4gICAgICAgICAge3RoaXMucHJvcHMubmFtZX1cbiAgICAgICAgPC9hPlxuICAgICAgPC9saT5cbiAgICApO1xuICB9XG59XG4iLCJpbXBvcnQge0ZpbHRlckJhckFjdG9yfSBmcm9tICcuLi9hY3RvcnMvRmlsdGVyQmFyQWN0b3InO1xuaW1wb3J0IHtUYWJsZUFjdG9yfSBmcm9tICcuLi9hY3RvcnMvVGFibGVBY3Rvcic7XG5cbmltcG9ydCB7RmlsdGVyQmFyU3RvcmV9IGZyb20gJy4uL3N0b3Jlcy9GaWx0ZXJCYXJTdG9yZSc7XG5pbXBvcnQge1RhYmxlU3RvcmV9IGZyb20gJy4uL3N0b3Jlcy9UYWJsZVN0b3JlJztcblxuaW1wb3J0IHtGaWx0ZXJCYXJ9IGZyb20gJy4vRmlsdGVyQmFyL0ZpbHRlckJhci5yZWFjdCc7XG5pbXBvcnQge1RhYmxlfSAgZnJvbSAnLi9UYWJsZS9UYWJsZS5yZWFjdCc7XG5cbmV4cG9ydCBjbGFzcyBGaWx0ZXJhYmxlVGFibGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmlkID0gcHJvcHMuZmlsdGVyYWJsZVRhYmxlSWQ7XG5cbiAgICB0aGlzLmZpbHRlckJhclN0b3JlID0gbmV3IEZpbHRlckJhclN0b3JlKHByb3BzLmZpbHRlcmJhcik7XG4gICAgdGhpcy50YWJsZVN0b3JlID0gbmV3IFRhYmxlU3RvcmUocHJvcHMudGFibGUpO1xuXG4gICAgdGhpcy50YWJsZUFjdG9yID0gbmV3IFRhYmxlQWN0b3IodGhpcy5maWx0ZXJCYXJTdG9yZSwgdGhpcy50YWJsZVN0b3JlKTtcbiAgICB0aGlzLmZpbHRlckJhckFjdG9yID0gbmV3IEZpbHRlckJhckFjdG9yKHRoaXMuZmlsdGVyQmFyU3RvcmUsIHRoaXMudGFibGVTdG9yZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYga2V5PXt0aGlzLmlkfT5cbiAgICAgICAgPEZpbHRlckJhclxuICAgICAgICAgIGZpbHRlckJhckFjdG9yPXt0aGlzLmZpbHRlckJhckFjdG9yfVxuICAgICAgICAgIGZpbHRlckJhclN0b3JlPXt0aGlzLmZpbHRlckJhclN0b3JlfVxuICAgICAgICAvPlxuICAgICAgICA8VGFibGVcbiAgICAgICAgICB0YWJsZUFjdG9yPXt0aGlzLnRhYmxlQWN0b3J9XG4gICAgICAgICAgdGFibGVTdG9yZT17dGhpcy50YWJsZVN0b3JlfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuIiwiaW1wb3J0IHtUYWJsZUhlYWRpbmdDZWxsfSBmcm9tICcuL1RhYmxlSGVhZGluZ0NlbGwucmVhY3QnO1xuXG5leHBvcnQgY2xhc3MgVGFibGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMudGFibGVBY3RvciA9IHByb3BzLnRhYmxlQWN0b3I7XG4gICAgdGhpcy50YWJsZVN0b3JlID0gcHJvcHMudGFibGVTdG9yZTtcblxuICAgIHRoaXMuc3RhdGUgPSB0aGlzLmdldFN0YXRlRnJvbVN0b3JlcygpO1xuICAgIHRoaXMudGFibGVTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIF9vbkNoYW5nZSgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0U3RhdGVGcm9tU3RvcmVzKCkpO1xuICB9XG5cbiAgX29uQ2xpY2soZXZlbnQpIHtcbiAgICB0aGlzLnRhYmxlQWN0b3IuZmV0Y2hQYWdlZERhdGEoZXZlbnQudGFyZ2V0LmlubmVySFRNTCk7XG4gIH1cblxuICBnZXRTdGF0ZUZyb21TdG9yZXMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbHVtbkhlYWRpbmdzOiB0aGlzLnRhYmxlQWN0b3IuZ2V0Q29sdW1uSGVhZGluZ3MoKSxcbiAgICAgIHJvd3M6IHRoaXMudGFibGVBY3Rvci5nZXRSb3dzKCksXG4gICAgICBjdXJyZW50UGFnZTogdGhpcy50YWJsZUFjdG9yLmdldEN1cnJlbnRQYWdlKCksXG4gICAgICB0b3RhbFBhZ2VzOiB0aGlzLnRhYmxlQWN0b3IuZ2V0VG90YWxQYWdlcygpXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHZhciBjb2x1bW5zID0gT2JqZWN0LmtleXModGhpcy5zdGF0ZS5jb2x1bW5IZWFkaW5ncykubWFwKGZ1bmN0aW9uKGNvbHVtbklkKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8VGFibGVIZWFkaW5nQ2VsbCBrZXk9e2NvbHVtbklkfSBoZWFkaW5nPXt0aGlzLnN0YXRlLmNvbHVtbkhlYWRpbmdzW2NvbHVtbklkXS5oZWFkaW5nfSAvPlxuICAgICAgKTtcbiAgICB9LHRoaXMpO1xuXG4gICAgaWYgKHRoaXMuc3RhdGUudG90YWxQYWdlcyA+IDEpIHtcbiAgICAgIHZhciBwYWdlcyA9IEFycmF5LmFwcGx5KG51bGwsIEFycmF5KHRoaXMuc3RhdGUudG90YWxQYWdlcykpLm1hcChmdW5jdGlvbihfLGkpIHtyZXR1cm4gaSArIDF9KTtcbiAgICAgIHZhciBwYWdpbmF0aW9uID0gcGFnZXMubWFwKGZ1bmN0aW9uKHBhZ2VOdW1iZXIpIHtcbiAgICAgICAgdmFyIGNsYXNzZXMgPSAnJztcbiAgICAgICAgaWYgKHBhZ2VOdW1iZXIgPT09IHRoaXMuc3RhdGUuY3VycmVudFBhZ2UpIHtcbiAgICAgICAgICBjbGFzc2VzID0gJ2FjdGl2ZSc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8bGkga2V5PXtwYWdlTnVtYmVyfSBjbGFzc05hbWU9e2NsYXNzZXN9PlxuICAgICAgICAgICAgPGEgb25DbGljaz17dGhpcy5fb25DbGljay5iaW5kKHRoaXMpfT57cGFnZU51bWJlcn08L2E+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgKVxuICAgICAgfSx0aGlzKTtcbiAgICB9XG5cbiAgICB2YXIgcm93cyA9IHRoaXMuc3RhdGUucm93cy5tYXAoZnVuY3Rpb24ocm93KSB7XG4gICAgICB2YXIgY29sdW1ucyA9IE9iamVjdC5rZXlzKHJvdykubWFwKGZ1bmN0aW9uKGNvbHVtbklkKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPHRkPlxuICAgICAgICAgICAge3Jvd1tjb2x1bW5JZF19XG4gICAgICAgICAgPC90ZD5cbiAgICAgICAgKTtcbiAgICAgIH0sdGhpcyk7XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDx0cj5cbiAgICAgICAgICB7Y29sdW1uc31cbiAgICAgICAgPC90cj5cbiAgICAgICk7XG4gICAgfSx0aGlzKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0ncGFuZWwgcGFuZWwtcmVzcG9uc2l2ZSc+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSd0YWJsZS1yZXNwb25zaXZlJz5cbiAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPSd0YWJsZSB0YWJsZS1ob3ZlciB0YWJsZS1zdHJpcGVkJz5cbiAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgIHtjb2x1bW5zfVxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAge3Jvd3N9XG4gICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgPG5hdj5cbiAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9J3BhZ2luYXRpb24nPlxuICAgICAgICAgICAgICB7cGFnaW5hdGlvbn1cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgPC9uYXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFRhYmxlSGVhZGluZ0NlbGwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmhlYWRpbmcgPSBwcm9wcy5oZWFkaW5nO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8dGg+XG4gICAgICAgIHt0aGlzLmhlYWRpbmd9XG4gICAgICA8L3RoPlxuICAgICk7XG4gIH1cbn1cbiIsInZhciBTaGFyZWRVdGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzL1NoYXJlZFV0aWxzJyk7XG5cbmV4cG9ydCBjbGFzcyBGaWx0ZXJCYXJTdG9yZSB7XG4gIGNvbnN0cnVjdG9yKGNvbmZpZ3VyYXRpb24pIHtcbiAgICB0aGlzLkNIQU5HRV9FVkVOVCA9ICdjaGFuZ2UnO1xuICAgIHRoaXMuZXZlbnRFbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgdGhpcy5pZCA9IGNvbmZpZ3VyYXRpb24uaWQ7XG4gICAgdGhpcy5wZXJzaXN0ZW50ID0gY29uZmlndXJhdGlvbi5wZXJzaXN0ZW50O1xuICAgIHRoaXMudXJsID0gY29uZmlndXJhdGlvbi5zZWFyY2hVcmw7XG4gICAgdGhpcy5zZWFyY2hVcmwgPSBjb25maWd1cmF0aW9uLnNlYXJjaFVybDtcbiAgICB0aGlzLnNhdmVTZWFyY2hVcmwgPSBjb25maWd1cmF0aW9uLnNhdmVTZWFyY2hVcmw7XG4gICAgdGhpcy5zYXZlZFNlYXJjaFVybCA9IGNvbmZpZ3VyYXRpb24uc2F2ZWRTZWFyY2hVcmw7XG4gICAgdGhpcy5leHBvcnRSZXN1bHRzVXJsID0gY29uZmlndXJhdGlvbi5leHBvcnRSZXN1bHRzVXJsO1xuICAgIHRoaXMuZmlsdGVycyA9IGNvbmZpZ3VyYXRpb24uZmlsdGVycztcblxuICAgIHZhciBmaWx0ZXIsIGZpbHRlclVpZDtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgT2JqZWN0LmtleXModGhpcy5maWx0ZXJzKS5sZW5ndGg7IGkrKykge1xuICAgICAgZmlsdGVyVWlkID0gT2JqZWN0LmtleXModGhpcy5maWx0ZXJzKVtpXTtcbiAgICAgIGZpbHRlciA9IHRoaXMuZmlsdGVyc1tmaWx0ZXJVaWRdO1xuXG4gICAgICBpZiAoZmlsdGVyLnVybCkge1xuICAgICAgICBTaGFyZWRVdGlscy5hamF4R2V0KGZpbHRlci51cmwsICdqc29uJywgZnVuY3Rpb24oZmlsdGVyVWlkKSB7IHJldHVybiBmdW5jdGlvbihyZXNwb25zZSkgeyB0aGlzLnVwZGF0ZUZpbHRlcihmaWx0ZXJVaWQsICdvcHRpb25zJywgcmVzcG9uc2UpIH0gfShmaWx0ZXJVaWQpLmJpbmQodGhpcykpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMucmVjZWlldmVTYXZlZFNlYXJjaGVzKCk7XG4gIH1cblxuICBnZXRJZCgpIHtcbiAgICByZXR1cm4gdGhpcy5pZDtcbiAgfVxuXG4gIGdldFNlYXJjaFVybCgpIHtcbiAgICByZXR1cm4gdGhpcy5zZWFyY2hVcmw7XG4gIH1cblxuICBnZXRTYXZlU2VhcmNoVXJsKCkge1xuICAgIHJldHVybiB0aGlzLnNhdmVTZWFyY2hVcmw7XG4gIH1cblxuICBnZXRTYXZlZFNlYXJjaGVzKCkge1xuICAgIHJldHVybiB0aGlzLnNhdmVkU2VhcmNoZXM7XG4gIH1cblxuICBnZXRTYXZlZFNlYXJjaChzZWFyY2hJZCkge1xuICAgIHJldHVybiB0aGlzLnNhdmVkU2VhcmNoZXNbc2VhcmNoSWRdO1xuICB9XG5cbiAgZ2V0RmlsdGVyKGZpbHRlclVpZCkge1xuICAgIHJldHVybiB0aGlzLmZpbHRlcnNbZmlsdGVyVWlkXVxuICB9XG5cbiAgZ2V0RGlzYWJsZWQoKSB7XG4gICAgdmFyIGRpc2FibGVkRmlsdGVycyA9IHt9O1xuICAgIGZvciAodmFyIGZpbHRlclVpZCBpbiB0aGlzLmZpbHRlcnMpIHtcbiAgICAgIGlmICh0aGlzLmZpbHRlcnNbZmlsdGVyVWlkXS5lbmFibGVkID09PSBmYWxzZSkge1xuICAgICAgICBkaXNhYmxlZEZpbHRlcnNbZmlsdGVyVWlkXSA9IHRoaXMuZmlsdGVyc1tmaWx0ZXJVaWRdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGlzYWJsZWRGaWx0ZXJzO1xuICB9XG5cbiAgZ2V0RW5hYmxlZCgpIHtcbiAgICB2YXIgZW5hYmxlZEZpbHRlcnMgPSB7fTtcbiAgICBmb3IgKHZhciBmaWx0ZXJVaWQgaW4gdGhpcy5maWx0ZXJzKSB7XG4gICAgICBpZiAodGhpcy5maWx0ZXJzW2ZpbHRlclVpZF0uZW5hYmxlZCA9PT0gdHJ1ZSkge1xuICAgICAgICBlbmFibGVkRmlsdGVyc1tmaWx0ZXJVaWRdID0gdGhpcy5maWx0ZXJzW2ZpbHRlclVpZF07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlbmFibGVkRmlsdGVycztcbiAgfVxuXG4gIGdldFF1ZXJ5KCkge1xuICAgIHZhciBlbmFibGVkRmlsdGVycyA9IE9iamVjdC5rZXlzKHRoaXMuZ2V0RW5hYmxlZCgpKS5tYXAoZnVuY3Rpb24oZmlsdGVyVWlkKSB7XG4gICAgICB2YXIgZmlsdGVyID0gdGhpcy5nZXRGaWx0ZXIoZmlsdGVyVWlkKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHVpZDogZmlsdGVyVWlkLFxuICAgICAgICB0eXBlOiBmaWx0ZXIudHlwZSxcbiAgICAgICAgZmllbGQ6IGZpbHRlci5maWVsZCxcbiAgICAgICAgdmFsdWU6IGZpbHRlci52YWx1ZVxuICAgICAgfVxuICAgIH0sdGhpcyk7XG4gICAgcmV0dXJuIGVuYWJsZWRGaWx0ZXJzLmxlbmd0aCA+IDAgPyBKU09OLnN0cmluZ2lmeShlbmFibGVkRmlsdGVycykgOiAnJztcbiAgfVxuXG4gIC8qIE11dGF0aW9uIE1ldGhvZHMgKi9cbiAgcmVjZWlldmVTYXZlZFNlYXJjaGVzKCkge1xuICAgIFNoYXJlZFV0aWxzLmFqYXhHZXQodGhpcy5zYXZlZFNlYXJjaFVybCwgJ2pzb24nLCBmdW5jdGlvbihyZXNwb25zZSkgeyB0aGlzLnNhdmVkU2VhcmNoZXMgPSByZXNwb25zZTsgdGhpcy5lbWl0Q2hhbmdlKCkgfS5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIGRpc2FibGVBbGxGaWx0ZXJzKCkge1xuICAgIHZhciBlbmFibGVkRmlsdGVycyA9IHRoaXMuZ2V0RW5hYmxlZCgpO1xuXG4gICAgZm9yICh2YXIgZmlsdGVyVWlkIGluIGVuYWJsZWRGaWx0ZXJzKSB7XG4gICAgICB0aGlzLmRpc2FibGVGaWx0ZXIoZmlsdGVyVWlkKTtcbiAgICB9XG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICBkaXNhYmxlRmlsdGVyKGZpbHRlclVpZCkge1xuICAgIHRoaXMuZmlsdGVyc1tmaWx0ZXJVaWRdLmVuYWJsZWQgPSBmYWxzZTtcbiAgICB0aGlzLmZpbHRlcnNbZmlsdGVyVWlkXS52YWx1ZSA9ICcnO1xuICAgIHRoaXMuZW1pdENoYW5nZSgpO1xuICB9XG5cbiAgZW5hYmxlRmlsdGVyKGZpbHRlclVpZCwgdmFsdWUpIHtcbiAgICB0aGlzLmZpbHRlcnNbZmlsdGVyVWlkXS5lbmFibGVkID0gdHJ1ZTtcbiAgICB0aGlzLmZpbHRlcnNbZmlsdGVyVWlkXS52YWx1ZSA9IHZhbHVlIHx8ICcnO1xuICAgIHRoaXMuZW1pdENoYW5nZSgpO1xuICB9XG5cbiAgdXBkYXRlRmlsdGVyKGZpbHRlclVpZCwgcHJvcEtleSwgcHJvcFZhbHVlKSB7XG4gICAgdGhpcy5maWx0ZXJzW2ZpbHRlclVpZF1bcHJvcEtleV0gPSBwcm9wVmFsdWU7XG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICBlbWl0Q2hhbmdlKCkge1xuICAgIHRoaXMuZXZlbnRFbWl0dGVyLmVtaXQodGhpcy5DSEFOR0VfRVZFTlQpO1xuICB9XG5cbiAgYWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLmV2ZW50RW1pdHRlci5vbih0aGlzLkNIQU5HRV9FVkVOVCwgY2FsbGJhY2spO1xuICB9XG5cbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLmV2ZW50RW1pdHRlci5yZW1vdmVMaXN0ZW5lcih0aGlzLkNIQU5HRV9FVkVOVCwgY2FsbGJhY2spO1xuICB9XG59XG4iLCJpbXBvcnQgKiBhcyBTZWFyY2hVdGlscyBmcm9tICcuLi91dGlscy9TZWFyY2hVdGlscyc7XG5cbmV4cG9ydCBjbGFzcyBUYWJsZVN0b3JlIHtcbiAgY29uc3RydWN0b3IoY29uZmlndXJhdGlvbikge1xuICAgIHRoaXMuQ0hBTkdFX0VWRU5UID0gJ2NoYW5nZSc7XG4gICAgdGhpcy5ldmVudEVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICB0aGlzLmlkID0gY29uZmlndXJhdGlvbi5pZDtcbiAgICB0aGlzLnJvd3MgPSBbXTtcbiAgICB0aGlzLmN1cnJlbnRQYWdlID0gY29uZmlndXJhdGlvbi5wYWdlIHx8IDE7XG4gICAgdGhpcy50b3RhbFBhZ2VzID0gMTtcblxuICAgIHRoaXMuY29sdW1uSGVhZGluZ3MgPSBjb25maWd1cmF0aW9uLmNvbHVtbnM7XG4gICAgdGhpcy51cmwgPSBjb25maWd1cmF0aW9uLmRhdGFVcmw7XG4gICAgdGhpcy5mZXRjaERhdGEoKTtcbiAgfVxuXG4gIGdldElkKCkge1xuICAgIHJldHVybiB0aGlzLmlkO1xuICB9XG5cbiAgc2V0VXJsKHVybCkge1xuICAgIHRoaXMudXJsID0gdXJsO1xuICB9XG5cbiAgZ2V0VXJsKCkge1xuICAgIHJldHVybiB0aGlzLnVybDtcbiAgfVxuXG4gIGZldGNoRGF0YSgpIHtcbiAgICBTZWFyY2hVdGlscy5zZWFyY2goXG4gICAgICB0aGlzLnVybCArIGAmcGFnZT0ke3RoaXMuY3VycmVudFBhZ2V9YCxcbiAgICAgIHRoaXMuc2V0RGF0YS5iaW5kKHRoaXMpXG4gICAgKTtcbiAgfVxuXG4gIHNldERhdGEocmVzcG9uc2UpIHtcbiAgICB0aGlzLnJvd3MgPSByZXNwb25zZS5yZXN1bHRzO1xuICAgIHRoaXMuY3VycmVudFBhZ2UgPSByZXNwb25zZS5jdXJyZW50X3BhZ2U7XG4gICAgdGhpcy50b3RhbFBhZ2VzID0gcmVzcG9uc2UudG90YWxfcGFnZXM7XG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICBnZXRDb2x1bW5IZWFkaW5ncygpIHtcbiAgICByZXR1cm4gdGhpcy5jb2x1bW5IZWFkaW5ncztcbiAgfVxuXG4gIGdldFJvd3MoKSB7XG4gICAgcmV0dXJuIHRoaXMucm93cztcbiAgfVxuXG4gIGdldEN1cnJlbnRQYWdlKCkge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRQYWdlO1xuICB9XG5cbiAgZ2V0VG90YWxQYWdlcygpIHtcbiAgICByZXR1cm4gdGhpcy50b3RhbFBhZ2VzO1xuICB9XG5cbiAgc2V0Q3VycmVudFBhZ2UocGFnZSkge1xuICAgIHRoaXMuY3VycmVudFBhZ2UgPSBwYWdlO1xuICB9XG5cbiAgZW1pdENoYW5nZSgpIHtcbiAgICB0aGlzLmV2ZW50RW1pdHRlci5lbWl0KHRoaXMuQ0hBTkdFX0VWRU5UKTtcbiAgfVxuXG4gIGFkZENoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5ldmVudEVtaXR0ZXIub24odGhpcy5DSEFOR0VfRVZFTlQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHJlbW92ZUNoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5ldmVudEVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIodGhpcy5DSEFOR0VfRVZFTlQsIGNhbGxiYWNrKTtcbiAgfVxufVxuIiwiaW1wb3J0IHthamF4R2V0fSBmcm9tICcuL1NoYXJlZFV0aWxzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHNlYXJjaCh1cmwsIHN1Y2Nlc3MpIHtcbiAgYWpheEdldCh1cmwsICdqc29uJywgc3VjY2Vzcyk7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gc2VyaWFsaXplKG9iaiwgcHJlZml4KSB7XG4gIHZhciBzdHIgPSBbXTtcbiAgZm9yKHZhciBwIGluIG9iaikge1xuICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkocCkpIHtcbiAgICAgIHZhciBrID0gcHJlZml4ID8gcHJlZml4ICsgXCJbXCIgKyBwICsgXCJdXCIgOiBwLCB2ID0gb2JqW3BdO1xuICAgICAgc3RyLnB1c2godHlwZW9mIHYgPT0gXCJvYmplY3RcIiA/XG4gICAgICAgIHRoaXMuc2VyaWFsaXplKHYsIGspIDpcbiAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KGspICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQodikpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyLmpvaW4oXCImXCIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWpheEdldCh1cmwsIHR5cGUsIHN1Y2Nlc3MsIGVycm9yKSB7XG4gIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgeGhyLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gIHhoci5yZXNwb25zZVR5cGUgPSB0eXBlO1xuICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtVHlwZVwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQWNjZXB0XCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJYLVJlcXVlc3RlZC1XaXRoXCIsIFwiWE1MSHR0cFJlcXVlc3RcIik7XG4gIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgc3RhdHVzID0geGhyLnN0YXR1cztcbiAgICB2YXIgcmVzcG9uc2UgPSB4aHIucmVzcG9uc2U7XG4gICAgaWYgKHN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICByZXR1cm4gc3VjY2VzcyhyZXNwb25zZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBlcnJvcihyZXNwb25zZSk7XG4gICAgfVxuICB9O1xuICB4aHIuc2VuZCgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWpheFBvc3QodXJsLCB0eXBlLCBkYXRhLCBzdWNjZXNzLCBlcnJvcikge1xuICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gIHhoci5vcGVuKCdQT1NUJywgdXJsLCB0cnVlKTtcbiAgeGhyLnJlc3BvbnNlVHlwZSA9IHR5cGU7XG4gIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJBY2NlcHRcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIlgtUmVxdWVzdGVkLVdpdGhcIiwgXCJYTUxIdHRwUmVxdWVzdFwiKTtcbiAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJYX0NTUkZfVE9LRU5cIiwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPWNzcmYtdG9rZW5dJykuZ2V0QXR0cmlidXRlKCdjb250ZW50JykpO1xuICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHN0YXR1cyA9IHhoci5zdGF0dXM7XG4gICAgdmFyIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlO1xuICB9O1xuICB4aHIuc2VuZChKU09OLnN0cmluZ2lmeShkYXRhKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVVcmwocHJvcEtleSwgcHJvcFZhbHVlKSB7XG4gIHZhciBzZWFyY2hPYmplY3QgPSBwYXJzZVVybFNlYXJjaFN0cmluZygpO1xuXG4gIHNlYXJjaE9iamVjdFtwcm9wS2V5XSA9IHByb3BWYWx1ZTtcblxuICB2YXIgbmV3U2VhcmNoU3RyaW5nID0gJz8nICsgY3JlYXRlVXJsU2VhcmNoU3RyaW5nKHNlYXJjaE9iamVjdCk7XG5cbiAgaGlzdG9yeS5wdXNoU3RhdGUoe30sIFwiXCIsIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyBuZXdTZWFyY2hTdHJpbmcpO1xuICBsb2NhbFN0b3JhZ2Vbd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcLy9nLCcnKV0gPSBuZXdTZWFyY2hTdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUZpbHRlckJhckNvbmZpZ3VyYXRpb24oZmlsdGVyQmFyQ29uZmlndXJhdGlvbiwgaWQpIHtcbiAgdmFyIHBhcnNlZEZpbHRlckJhckNvbmZpZ3VyYXRpb24gPSB7fSxcbiAgICAgIHJhd0ZpbHRlcixcbiAgICAgIHJhd0ZpbHRlcnMsXG4gICAgICBwYXJzZWRGaWx0ZXJzID0ge307XG5cbiAgcmF3RmlsdGVycyA9IGZpbHRlckJhckNvbmZpZ3VyYXRpb24ucXVlcnlTZWxlY3RvcignZGwuZmlsdGVycycpLnF1ZXJ5U2VsZWN0b3JBbGwoJ2R0LmZpbHRlcicpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcmF3RmlsdGVycy5sZW5ndGg7IGkrKykge1xuICAgIHJhd0ZpbHRlciA9IHJhd0ZpbHRlcnNbaV07XG4gICAgcGFyc2VkRmlsdGVyc1tyYXdGaWx0ZXIuZ2V0QXR0cmlidXRlKCdkYXRhLXVpZCcpXSA9IHtcbiAgICAgIGxhYmVsOiByYXdGaWx0ZXIuZ2V0QXR0cmlidXRlKCdkYXRhLWxhYmVsJyksXG4gICAgICB0eXBlOiByYXdGaWx0ZXIuZ2V0QXR0cmlidXRlKCdkYXRhLXR5cGUnKSxcbiAgICAgIGZpZWxkOiByYXdGaWx0ZXIuZ2V0QXR0cmlidXRlKCdkYXRhLWZpZWxkJyksXG4gICAgICB1cmw6IHJhd0ZpbHRlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtdXJsJyksXG4gICAgICB2YWx1ZTogJycsXG4gICAgICBlbmFibGVkOiBmYWxzZVxuICAgIH07XG4gIH1cblxuICBwYXJzZWRGaWx0ZXJCYXJDb25maWd1cmF0aW9uLmlkID0gaWQ7XG4gIHBhcnNlZEZpbHRlckJhckNvbmZpZ3VyYXRpb24ucGVyc2lzdGVudCA9IGZpbHRlckJhckNvbmZpZ3VyYXRpb24ucXVlcnlTZWxlY3RvcignZHQucGVyc2lzdGVudCcpLmdldEF0dHJpYnV0ZSgnZGF0YS1wZXJzaXN0ZW50Jyk7XG4gIHBhcnNlZEZpbHRlckJhckNvbmZpZ3VyYXRpb24uc2VhcmNoVXJsID0gZmlsdGVyQmFyQ29uZmlndXJhdGlvbi5xdWVyeVNlbGVjdG9yKCdkdC5zZWFyY2gtdXJsJykuZ2V0QXR0cmlidXRlKCdkYXRhLXVybCcpO1xuICBwYXJzZWRGaWx0ZXJCYXJDb25maWd1cmF0aW9uLnNhdmVTZWFyY2hVcmwgPSBmaWx0ZXJCYXJDb25maWd1cmF0aW9uLnF1ZXJ5U2VsZWN0b3IoJ2R0LnNhdmUtc2VhcmNoLXVybCcpLmdldEF0dHJpYnV0ZSgnZGF0YS11cmwnKTtcbiAgcGFyc2VkRmlsdGVyQmFyQ29uZmlndXJhdGlvbi5zYXZlZFNlYXJjaFVybCA9IGZpbHRlckJhckNvbmZpZ3VyYXRpb24ucXVlcnlTZWxlY3RvcignZHQuc2F2ZWQtc2VhcmNoLXVybCcpLmdldEF0dHJpYnV0ZSgnZGF0YS11cmwnKTtcbiAgcGFyc2VkRmlsdGVyQmFyQ29uZmlndXJhdGlvbi5leHBvcnRSZXN1bHRzVXJsID0gZmlsdGVyQmFyQ29uZmlndXJhdGlvbi5xdWVyeVNlbGVjdG9yKCdkdC5leHBvcnQtcmVzdWx0cy11cmwnKS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdXJsJyk7XG4gIHBhcnNlZEZpbHRlckJhckNvbmZpZ3VyYXRpb24uZmlsdGVycyA9IHBhcnNlZEZpbHRlcnM7XG5cbiAgcmV0dXJuIHBhcnNlZEZpbHRlckJhckNvbmZpZ3VyYXRpb247XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVRhYmxlQ29uZmlndXJhdGlvbih0YWJsZUNvbmZpZ3VyYXRpb24sIGlkKSB7XG4gIHZhciBwYXJzZWRUYWJsZUNvbmZpZ3VyYXRpb24gPSB7fSxcbiAgICAgIHJhd0NvbHVtbnMsXG4gICAgICByYXdDb2x1bW4sXG4gICAgICBwYXJzZWRDb2x1bW5zID0ge307XG5cbiAgcmF3Q29sdW1ucyA9IHRhYmxlQ29uZmlndXJhdGlvbi5xdWVyeVNlbGVjdG9yKCdkbC5jb2x1bW5zJykucXVlcnlTZWxlY3RvckFsbCgnZHQuY29sdW1uJyk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCByYXdDb2x1bW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgcmF3Q29sdW1uID0gcmF3Q29sdW1uc1tpXTtcbiAgICBwYXJzZWRDb2x1bW5zW3Jhd0NvbHVtbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtZmllbGQnKV0gPSB7XG4gICAgICBoZWFkaW5nOiByYXdDb2x1bW4uZ2V0QXR0cmlidXRlKCdkYXRhLWhlYWRpbmcnKSxcbiAgICAgIHR5cGU6IHJhd0NvbHVtbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtdHlwZScpXG4gICAgfTtcbiAgfVxuXG4gIHBhcnNlZFRhYmxlQ29uZmlndXJhdGlvbi5pZCA9IGlkO1xuICBwYXJzZWRUYWJsZUNvbmZpZ3VyYXRpb24uZGF0YVVybCA9IHRhYmxlQ29uZmlndXJhdGlvbi5xdWVyeVNlbGVjdG9yKCdkdC5kYXRhLXVybCcpLmdldEF0dHJpYnV0ZSgnZGF0YS11cmwnKTtcbiAgcGFyc2VkVGFibGVDb25maWd1cmF0aW9uLmNvbHVtbnMgPSBwYXJzZWRDb2x1bW5zO1xuXG4gIHJldHVybiBwYXJzZWRUYWJsZUNvbmZpZ3VyYXRpb247XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVVybFNlYXJjaFN0cmluZygpIHtcbiAgLy8gdGFrZW4gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vc2luZHJlc29yaHVzL3F1ZXJ5LXN0cmluZy9ibG9iL21hc3Rlci9xdWVyeS1zdHJpbmcuanNcblxuICB2YXIgc3RyID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcblxuICBpZiAodHlwZW9mIHN0ciAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBzdHIgPSBzdHIudHJpbSgpLnJlcGxhY2UoL14oXFw/fCMpLywgJycpO1xuXG4gIGlmICghc3RyKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgcmV0dXJuIHN0ci50cmltKCkuc3BsaXQoJyYnKS5yZWR1Y2UoZnVuY3Rpb24gKHJldCwgcGFyYW0pIHtcbiAgICB2YXIgcGFydHMgPSBwYXJhbS5yZXBsYWNlKC9cXCsvZywgJyAnKS5zcGxpdCgnPScpO1xuICAgIHZhciBrZXkgPSBwYXJ0c1swXTtcbiAgICB2YXIgdmFsID0gcGFydHNbMV07XG5cbiAgICBrZXkgPSBkZWNvZGVVUklDb21wb25lbnQoa2V5KTtcbiAgICAvLyBtaXNzaW5nIGA9YCBzaG91bGQgYmUgYG51bGxgOlxuICAgIC8vIGh0dHA6Ly93My5vcmcvVFIvMjAxMi9XRC11cmwtMjAxMjA1MjQvI2NvbGxlY3QtdXJsLXBhcmFtZXRlcnNcbiAgICB2YWwgPSB2YWwgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBkZWNvZGVVUklDb21wb25lbnQodmFsKTtcblxuICAgIGlmICghcmV0Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIHJldFtrZXldID0gdmFsO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShyZXRba2V5XSkpIHtcbiAgICAgIHJldFtrZXldLnB1c2godmFsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0W2tleV0gPSBbcmV0W2tleV0sIHZhbF07XG4gICAgfVxuXG4gICAgcmV0dXJuIHJldDtcbiAgfSwge30pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVXJsU2VhcmNoU3RyaW5nKG9iaikge1xuICAvLyB0YWtlbiBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9zaW5kcmVzb3JodXMvcXVlcnktc3RyaW5nL2Jsb2IvbWFzdGVyL3F1ZXJ5LXN0cmluZy5qc1xuICByZXR1cm4gb2JqID8gT2JqZWN0LmtleXMob2JqKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciB2YWwgPSBvYmpba2V5XTtcblxuICAgIGlmIChBcnJheS5pc0FycmF5KHZhbCkpIHtcbiAgICAgIHJldHVybiB2YWwubWFwKGZ1bmN0aW9uICh2YWwyKSB7XG4gICAgICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQoa2V5KSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2YWwyKTtcbiAgICAgIH0pLmpvaW4oJyYnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsKTtcbiAgfSkuam9pbignJicpIDogJyc7XG59XG4iXX0=

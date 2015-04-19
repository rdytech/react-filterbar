(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var FilterableTable = require("./components/FilterableTable.react").FilterableTable;

document.addEventListener("DOMContentLoaded", function () {
  var filterableTables = document.getElementsByClassName("react-filterable-table");

  var filterableTableNode, filterBarConfiguration, tableConfiguration;

  for (var i = 0; i < filterableTables.length; i++) {
    filterableTableNode = filterableTables[i];
    filterBarConfiguration = filterableTableNode.querySelector("dl.filterBarConfiguration");
    parseFilterBarConfiguration(filterBarConfiguration);
    tableConfiguration = filterableTableNode.querySelector("dl.tableConfiguration");
    parseTableConfiguration(tableConfiguration);

    React.render(React.createElement(FilterableTable, {
      filterableTableId: filterableTableNode.getAttribute("id"),
      filterbar: {
        configuration: filterBarConfiguration
      },
      table: {
        configuration: tableConfiguration
      }
    }), filterableTableNode);
  }
});

var parseFilterBarConfiguration = function parseFilterBarConfiguration(filterBarConfiguration) {
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
      value: "",
      enabled: false
    };
  }

  parsedFilterBarConfiguration.searchUrl = filterBarConfiguration.querySelector("dt.search-url").getAttribute("data-url");
  parsedFilterBarConfiguration.saveSearchUrl = filterBarConfiguration.querySelector("dt.save-search-url").getAttribute("data-url");
  parsedFilterBarConfiguration.savedSearchUrl = filterBarConfiguration.querySelector("dt.saved-search-url").getAttribute("data-url");
  parsedFilterBarConfiguration.exportResultsUrl = filterBarConfiguration.querySelector("dt.export-results-url").getAttribute("data-url");
  parsedFilterBarConfiguration.filters = parsedFilters;

  console.log(parsedFilterBarConfiguration);
};

var parseTableConfiguration = function parseTableConfiguration(tableConfiguration) {
  var parsedTableConfiguration = {};

  console.log(parsedTableConfiguration);
};

},{"./components/FilterableTable.react":14}],2:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var FilterBarActor = exports.FilterBarActor = (function () {
  function FilterBarActor(filterBarStore, tableStore) {
    _classCallCheck(this, FilterBarActor);

    this.filterBarStore = filterBarStore;
    this.tableStore = tableStore;
  }

  _createClass(FilterBarActor, {
    getFilter: {
      value: function getFilter(filterUid) {
        return this.filterBarStore.getFilter(filterUid);
      }
    },
    enableFilter: {
      value: function enableFilter(filterUid) {
        this.filterBarStore.enableFilter(filterUid);
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
      value: function updateFilter(filterUid, value) {
        this.filterBarStore.updateFilter(filterUid, value);
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
        var searchUrl = this.filterBarStore.getSearchUrl();
        var query = this.filterBarStore.getQuery();
        var newUrl = searchUrl + "?" + query;

        history.pushState({}, "", newUrl);
        localStorage[window.location.pathname.replace(/\//g, "")] = window.location.search;

        this.tableStore.setUrl(newUrl);
        this.tableStore.fetchData();
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
      }
    }
  });

  return FilterBarActor;
})();

},{}],3:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var TableActor = exports.TableActor = (function () {
  function TableActor(tableStore) {
    _classCallCheck(this, TableActor);

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
        var currentUrl = this.tableStore.getUrl();
        var newUrl = currentUrl + "page=" + page + "&";

        history.pushState({}, "", newUrl);
        localStorage[window.location.pathname.replace(/\//g, "")] = window.location.search;

        this.tableStore.setCurrentPage(page);
        this.tableStore.fetchData();
      }
    }
  });

  return TableActor;
})();

},{}],4:[function(require,module,exports){
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

var LoadFiltersList = require("./LoadFiltersList/LoadFiltersList.react").LoadFiltersList;

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
              React.createElement(LoadFiltersList, null)
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

},{"./ApplyFiltersButton.react":4,"./ClearFiltersButton.react":5,"./FilterDisplay/FilterDisplay.react":7,"./FilterList/FilterList.react":10,"./LoadFiltersList/LoadFiltersList.react":12,"./SaveFiltersButton.react":13}],7:[function(require,module,exports){
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

var FilterInput = exports.FilterInput = (function (_React$Component) {
  function FilterInput(props) {
    _classCallCheck(this, FilterInput);

    _get(Object.getPrototypeOf(FilterInput.prototype), "constructor", this).call(this, props);

    this.filterBarActor = props.filterBarActor;
    this.filterUid = props.filterUid;
    this.filterKey = props.filterKey;
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
        /*
          inputFactory: function() {
            var type = this.props.filter.type;
            if (type == 'text' || type == 'id') {
              return (
                <TextInput
                  filterBarId={this.props.filterBarId}
                  filterUid={this.props.filterUid}
                />
              );
            } else if (type == 'date') {
              return (
                <DateInput
                  filterBarId={this.props.filterBarId}
                  filterUid={this.props.filterUid}
                />
              );
            } else if (type == 'select') {
              return (
                <SelectInput
                  filterBarId={this.props.filterBarId}
                  filterUid={this.props.filterUid}
                />
              );
            } else if (type == 'age_select') {
              return (
                <AgeSelectInput
                  filterBarId={this.props.filterBarId}
                  filterUid={this.props.filterUid}
                />
              );
            } else {
              console.error("Not implemented yet!");
            }
        */
        return React.createElement(TextInput, {
          filterBarActor: this.filterBarActor,
          filterUid: this.filterUid
        });
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

},{"./Inputs/TextInput.react":9}],9:[function(require,module,exports){
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
        this.filterBarActor.updateFilter(this.filterUid, event.target.value);
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

},{}],10:[function(require,module,exports){
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

},{"./FilterListOption.react":11}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var LoadFiltersList = exports.LoadFiltersList = (function (_React$Component) {
  function LoadFiltersList(props) {
    _classCallCheck(this, LoadFiltersList);

    _get(Object.getPrototypeOf(LoadFiltersList.prototype), "constructor", this).call(this, props);
  }

  _inherits(LoadFiltersList, _React$Component);

  _createClass(LoadFiltersList, {
    getStateFromStores: {
      value: function getStateFromStores() {
        return {};
      }
    },
    render: {
      value: function render() {
        var loadFiltersListItems = [];
        var buttonClass = "btn btn-default dropdown-toggle";
        if (loadFiltersListItems.length === 0) {
          buttonClass += " disabled";
        }
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
              loadFiltersListItems
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

  return LoadFiltersList;
})(React.Component);

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

    this.tableActor = new TableActor(this.tableStore);
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

},{"../actors/FilterBarActor":2,"../actors/TableActor":3,"../stores/FilterBarStore":17,"../stores/TableStore":18,"./FilterBar/FilterBar.react":6,"./Table/Table.react":15}],15:[function(require,module,exports){
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
              { className: classes },
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

},{"./TableHeadingCell.react":16}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});
var SharedUtils = require("../utils/SharedUtils");

var FilterBarStore = exports.FilterBarStore = (function () {
  function FilterBarStore(filterBarOptions) {
    _classCallCheck(this, FilterBarStore);

    this.CHANGE_EVENT = "change";
    this.eventEmitter = new EventEmitter();

    // this.searchUrl        = parseSearchUrl();
    // this.saveSearchUrl    = parseSaveSearchUrl();
    // this.savedSearchUrl   = parseSavedSearchUrl();
    // this.exportResultsUrl = parseexportResultsUrl();
    // this.filters          = parseFilters();

    this.filters = this.parseRawFilterList(filterBarOptions.configuration.querySelector("dl.filters").querySelectorAll("dt.filter"));

    this.url = filterBarOptions.configuration.querySelector("dt.search-url").getAttribute("data-url");
    this.searchUrl = filterBarOptions.configuration.querySelector("dt.search-url").getAttribute("data-url");

    if (window.location.search != "") {
      var queries = window.location.search.split("?")[1].split("&"),
          enabledFilters,
          query;
      for (var i = 0; i < queries.length; i++) {
        query = queries[i];
        if (query.match(/^q=/)) {
          enabledFilters = JSON.parse(decodeURI(query).substring(2, query.length));
        }
      }
      var filter;
      for (var i = 0; i < enabledFilters.length; i++) {
        filter = enabledFilters[i];
        this.enableFilter(filter.uid, filter.value);
      }
    }
  }

  _createClass(FilterBarStore, {
    getSearchUrl: {
      value: function getSearchUrl() {
        return this.searchUrl;
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
        return enabledFilters.length > 0 ? "q=" + JSON.stringify(enabledFilters) + "&" : "";
      }
    },
    getBase64Query: {
      value: function getBase64Query() {
        var enabledFilters = Object.keys(this.getEnabled()).map(function (filterUid) {
          var filter = this.getFilter(filterUid);
          return {
            uid: filterUid,
            type: filter.type,
            field: filter.field,
            value: filter.value
          };
        }, this);
        enabledFilters = enabledFilters.length > 0 ? btoa(JSON.stringify(enabledFilters)) : "";
        console.log(enabledFilters);
        return enabledFilters;
      }
    },
    getQueryString: {
      value: function getQueryString() {
        var enabledFilters = this.getEnabled();
        var filter,
            prefix,
            query_object,
            query_string = "";

        for (var filterUid in enabledFilters) {
          filter = enabledFilters[filterUid];
          prefix = "";
          prefix += "q";
          prefix += "[" + filter.type + "]";
          query_object = {};
          query_object[filter.field] = filter.value;

          query_string += SharedUtils.serialize(query_object, prefix) + "&";
        }
        return query_string;
      }
    },
    parseRawFilterList: {
      value: function parseRawFilterList(rawFilterList) {
        var rawFilter,
            parsedFilterList = {};

        for (var i = 0; i < rawFilterList.length; i++) {
          rawFilter = rawFilterList[i];
          parsedFilterList[rawFilter.getAttribute("data-uid")] = {
            label: rawFilter.getAttribute("data-label"),
            type: rawFilter.getAttribute("data-type"),
            field: rawFilter.getAttribute("data-field"),
            value: "",
            enabled: false
          };
        }
        return parsedFilterList;
      }
    },
    disableAllFilters: {

      /* Mutation Methods */

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
      value: function updateFilter(filterUid, value) {
        this.filters[filterUid].value = value;
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

},{"../utils/SharedUtils":20}],18:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var SearchUtils = _interopRequireWildcard(require("../utils/SearchUtils"));

var TableStore = exports.TableStore = (function () {
  function TableStore(tableOptions) {
    _classCallCheck(this, TableStore);

    this.CHANGE_EVENT = "change";
    this.eventEmitter = new EventEmitter();

    this.rows = [];
    this.currentPage = 1;
    this.totalPages = 1;

    this.columnHeadings = this.parseRawColumnHeadingList(tableOptions.configuration.querySelector("dl.columns").querySelectorAll("dt.column"));

    this.baseUrl = this.parseDataUrl(tableOptions.configuration.querySelector("dt.data-url").getAttribute("data-url"));
    this.url = window.location.href;
    this.fetchData();
  }

  _createClass(TableStore, {
    parseDataUrl: {
      value: function parseDataUrl(rawUrl) {
        var parsedUrl = "";
        if (rawUrl.indexOf("?") == -1) {
          parsedUrl = rawUrl + "?";
        } else {
          return rawUrl;
        }

        return parsedUrl;
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
    getBaseUrl: {
      value: function getBaseUrl() {
        return this.baseUrl;
      }
    },
    fetchData: {
      value: function fetchData() {
        SearchUtils.search(this.url + ("page=" + this.currentPage), this.setData.bind(this));
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
    parseRawColumnHeadingList: {
      value: function parseRawColumnHeadingList(rawColumnHeadingList) {
        var rawColumnHeadingList,
            rawColumn,
            parsedColumnList = {};

        for (var i = 0; i < rawColumnHeadingList.length; i++) {
          rawColumn = rawColumnHeadingList[i];
          parsedColumnList[rawColumn.getAttribute("data-field")] = {
            heading: rawColumn.getAttribute("data-heading")
          };
        }
        return parsedColumnList;
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

},{"../utils/SearchUtils":19}],19:[function(require,module,exports){
"use strict";

exports.search = search;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var SharedUtils = require("./SharedUtils");

function search(url, success) {
  SharedUtils.ajaxGet(url, "json", success);
}

},{"./SharedUtils":20}],20:[function(require,module,exports){
"use strict";

module.exports = {
  ajaxGet: function ajaxGet(url, type, success, error) {
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
  },
  serialize: function serialize(obj, prefix) {
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
};

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9qL2RldmVsb3BtZW50L2pybmV3L3JlYWN0LWZpbHRlcmJhci9zcmMvYXBwLmpzIiwiL2hvbWUvai9kZXZlbG9wbWVudC9qcm5ldy9yZWFjdC1maWx0ZXJiYXIvc3JjL2FjdG9ycy9GaWx0ZXJCYXJBY3Rvci5qcyIsIi9ob21lL2ovZGV2ZWxvcG1lbnQvanJuZXcvcmVhY3QtZmlsdGVyYmFyL3NyYy9hY3RvcnMvVGFibGVBY3Rvci5qcyIsIi9ob21lL2ovZGV2ZWxvcG1lbnQvanJuZXcvcmVhY3QtZmlsdGVyYmFyL3NyYy9jb21wb25lbnRzL0ZpbHRlckJhci9BcHBseUZpbHRlcnNCdXR0b24ucmVhY3QuanMiLCIvaG9tZS9qL2RldmVsb3BtZW50L2pybmV3L3JlYWN0LWZpbHRlcmJhci9zcmMvY29tcG9uZW50cy9GaWx0ZXJCYXIvQ2xlYXJGaWx0ZXJzQnV0dG9uLnJlYWN0LmpzIiwiL2hvbWUvai9kZXZlbG9wbWVudC9qcm5ldy9yZWFjdC1maWx0ZXJiYXIvc3JjL2NvbXBvbmVudHMvRmlsdGVyQmFyL0ZpbHRlckJhci5yZWFjdC5qcyIsIi9ob21lL2ovZGV2ZWxvcG1lbnQvanJuZXcvcmVhY3QtZmlsdGVyYmFyL3NyYy9jb21wb25lbnRzL0ZpbHRlckJhci9GaWx0ZXJEaXNwbGF5L0ZpbHRlckRpc3BsYXkucmVhY3QuanMiLCIvaG9tZS9qL2RldmVsb3BtZW50L2pybmV3L3JlYWN0LWZpbHRlcmJhci9zcmMvY29tcG9uZW50cy9GaWx0ZXJCYXIvRmlsdGVyRGlzcGxheS9GaWx0ZXJJbnB1dC5yZWFjdC5qcyIsIi9ob21lL2ovZGV2ZWxvcG1lbnQvanJuZXcvcmVhY3QtZmlsdGVyYmFyL3NyYy9jb21wb25lbnRzL0ZpbHRlckJhci9GaWx0ZXJEaXNwbGF5L0lucHV0cy9UZXh0SW5wdXQucmVhY3QuanMiLCIvaG9tZS9qL2RldmVsb3BtZW50L2pybmV3L3JlYWN0LWZpbHRlcmJhci9zcmMvY29tcG9uZW50cy9GaWx0ZXJCYXIvRmlsdGVyTGlzdC9GaWx0ZXJMaXN0LnJlYWN0LmpzIiwiL2hvbWUvai9kZXZlbG9wbWVudC9qcm5ldy9yZWFjdC1maWx0ZXJiYXIvc3JjL2NvbXBvbmVudHMvRmlsdGVyQmFyL0ZpbHRlckxpc3QvRmlsdGVyTGlzdE9wdGlvbi5yZWFjdC5qcyIsIi9ob21lL2ovZGV2ZWxvcG1lbnQvanJuZXcvcmVhY3QtZmlsdGVyYmFyL3NyYy9jb21wb25lbnRzL0ZpbHRlckJhci9Mb2FkRmlsdGVyc0xpc3QvTG9hZEZpbHRlcnNMaXN0LnJlYWN0LmpzIiwiL2hvbWUvai9kZXZlbG9wbWVudC9qcm5ldy9yZWFjdC1maWx0ZXJiYXIvc3JjL2NvbXBvbmVudHMvRmlsdGVyQmFyL1NhdmVGaWx0ZXJzQnV0dG9uLnJlYWN0LmpzIiwiL2hvbWUvai9kZXZlbG9wbWVudC9qcm5ldy9yZWFjdC1maWx0ZXJiYXIvc3JjL2NvbXBvbmVudHMvRmlsdGVyYWJsZVRhYmxlLnJlYWN0LmpzIiwiL2hvbWUvai9kZXZlbG9wbWVudC9qcm5ldy9yZWFjdC1maWx0ZXJiYXIvc3JjL2NvbXBvbmVudHMvVGFibGUvVGFibGUucmVhY3QuanMiLCIvaG9tZS9qL2RldmVsb3BtZW50L2pybmV3L3JlYWN0LWZpbHRlcmJhci9zcmMvY29tcG9uZW50cy9UYWJsZS9UYWJsZUhlYWRpbmdDZWxsLnJlYWN0LmpzIiwiL2hvbWUvai9kZXZlbG9wbWVudC9qcm5ldy9yZWFjdC1maWx0ZXJiYXIvc3JjL3N0b3Jlcy9GaWx0ZXJCYXJTdG9yZS5qcyIsIi9ob21lL2ovZGV2ZWxvcG1lbnQvanJuZXcvcmVhY3QtZmlsdGVyYmFyL3NyYy9zdG9yZXMvVGFibGVTdG9yZS5qcyIsIi9ob21lL2ovZGV2ZWxvcG1lbnQvanJuZXcvcmVhY3QtZmlsdGVyYmFyL3NyYy91dGlscy9TZWFyY2hVdGlscy5qcyIsIi9ob21lL2ovZGV2ZWxvcG1lbnQvanJuZXcvcmVhY3QtZmls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biBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtGaWx0ZXJhYmxlVGFibGV9IGZyb20gJy4vY29tcG9uZW50cy9GaWx0ZXJhYmxlVGFibGUucmVhY3QnO1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24oKXtcbiAgdmFyIGZpbHRlcmFibGVUYWJsZXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdyZWFjdC1maWx0ZXJhYmxlLXRhYmxlJyk7XG5cbiAgdmFyIGZpbHRlcmFibGVUYWJsZU5vZGUsXG4gICAgICBmaWx0ZXJCYXJDb25maWd1cmF0aW9uLFxuICAgICAgdGFibGVDb25maWd1cmF0aW9uO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZmlsdGVyYWJsZVRhYmxlcy5sZW5ndGg7IGkrKykge1xuICAgIGZpbHRlcmFibGVUYWJsZU5vZGUgPSBmaWx0ZXJhYmxlVGFibGVzW2ldO1xuICAgIGZpbHRlckJhckNvbmZpZ3VyYXRpb24gPSBmaWx0ZXJhYmxlVGFibGVOb2RlLnF1ZXJ5U2VsZWN0b3IoJ2RsLmZpbHRlckJhckNvbmZpZ3VyYXRpb24nKTtcbiAgICBwYXJzZUZpbHRlckJhckNvbmZpZ3VyYXRpb24oZmlsdGVyQmFyQ29uZmlndXJhdGlvbik7XG4gICAgdGFibGVDb25maWd1cmF0aW9uID0gZmlsdGVyYWJsZVRhYmxlTm9kZS5xdWVyeVNlbGVjdG9yKCdkbC50YWJsZUNvbmZpZ3VyYXRpb24nKTtcbiAgICBwYXJzZVRhYmxlQ29uZmlndXJhdGlvbih0YWJsZUNvbmZpZ3VyYXRpb24pO1xuXG4gICAgUmVhY3QucmVuZGVyKFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgRmlsdGVyYWJsZVRhYmxlLFxuICAgICAgICB7XG4gICAgICAgICAgZmlsdGVyYWJsZVRhYmxlSWQ6IGZpbHRlcmFibGVUYWJsZU5vZGUuZ2V0QXR0cmlidXRlKCdpZCcpLFxuICAgICAgICAgIGZpbHRlcmJhcjoge1xuICAgICAgICAgICAgY29uZmlndXJhdGlvbjogZmlsdGVyQmFyQ29uZmlndXJhdGlvblxuICAgICAgICAgIH0sXG4gICAgICAgICAgdGFibGU6IHtcbiAgICAgICAgICAgIGNvbmZpZ3VyYXRpb246IHRhYmxlQ29uZmlndXJhdGlvblxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKSxcbiAgICAgIGZpbHRlcmFibGVUYWJsZU5vZGVcbiAgICApO1xuICB9XG59KTtcblxudmFyIHBhcnNlRmlsdGVyQmFyQ29uZmlndXJhdGlvbiA9IGZ1bmN0aW9uKGZpbHRlckJhckNvbmZpZ3VyYXRpb24pIHtcbiAgdmFyIHBhcnNlZEZpbHRlckJhckNvbmZpZ3VyYXRpb24gPSB7fSxcbiAgICAgIHJhd0ZpbHRlcixcbiAgICAgIHJhd0ZpbHRlcnMsXG4gICAgICBwYXJzZWRGaWx0ZXJzID0ge307XG5cbiAgcmF3RmlsdGVycyA9IGZpbHRlckJhckNvbmZpZ3VyYXRpb24ucXVlcnlTZWxlY3RvcignZGwuZmlsdGVycycpLnF1ZXJ5U2VsZWN0b3JBbGwoJ2R0LmZpbHRlcicpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcmF3RmlsdGVycy5sZW5ndGg7IGkrKykge1xuICAgIHJhd0ZpbHRlciA9IHJhd0ZpbHRlcnNbaV07XG4gICAgcGFyc2VkRmlsdGVyc1tyYXdGaWx0ZXIuZ2V0QXR0cmlidXRlKCdkYXRhLXVpZCcpXSA9IHtcbiAgICAgIGxhYmVsOiByYXdGaWx0ZXIuZ2V0QXR0cmlidXRlKCdkYXRhLWxhYmVsJyksXG4gICAgICB0eXBlOiByYXdGaWx0ZXIuZ2V0QXR0cmlidXRlKCdkYXRhLXR5cGUnKSxcbiAgICAgIGZpZWxkOiByYXdGaWx0ZXIuZ2V0QXR0cmlidXRlKCdkYXRhLWZpZWxkJyksXG4gICAgICB2YWx1ZTogJycsXG4gICAgICBlbmFibGVkOiBmYWxzZVxuICAgIH07XG4gIH1cblxuICBwYXJzZWRGaWx0ZXJCYXJDb25maWd1cmF0aW9uLnNlYXJjaFVybCA9IGZpbHRlckJhckNvbmZpZ3VyYXRpb24ucXVlcnlTZWxlY3RvcignZHQuc2VhcmNoLXVybCcpLmdldEF0dHJpYnV0ZSgnZGF0YS11cmwnKTtcbiAgcGFyc2VkRmlsdGVyQmFyQ29uZmlndXJhdGlvbi5zYXZlU2VhcmNoVXJsID0gZmlsdGVyQmFyQ29uZmlndXJhdGlvbi5xdWVyeVNlbGVjdG9yKCdkdC5zYXZlLXNlYXJjaC11cmwnKS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdXJsJyk7XG4gIHBhcnNlZEZpbHRlckJhckNvbmZpZ3VyYXRpb24uc2F2ZWRTZWFyY2hVcmwgPSBmaWx0ZXJCYXJDb25maWd1cmF0aW9uLnF1ZXJ5U2VsZWN0b3IoJ2R0LnNhdmVkLXNlYXJjaC11cmwnKS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdXJsJyk7XG4gIHBhcnNlZEZpbHRlckJhckNvbmZpZ3VyYXRpb24uZXhwb3J0UmVzdWx0c1VybCA9IGZpbHRlckJhckNvbmZpZ3VyYXRpb24ucXVlcnlTZWxlY3RvcignZHQuZXhwb3J0LXJlc3VsdHMtdXJsJykuZ2V0QXR0cmlidXRlKCdkYXRhLXVybCcpO1xuICBwYXJzZWRGaWx0ZXJCYXJDb25maWd1cmF0aW9uLmZpbHRlcnMgPSBwYXJzZWRGaWx0ZXJzO1xuXG4gIGNvbnNvbGUubG9nKHBhcnNlZEZpbHRlckJhckNvbmZpZ3VyYXRpb24pO1xufVxuXG52YXIgcGFyc2VUYWJsZUNvbmZpZ3VyYXRpb24gPSBmdW5jdGlvbih0YWJsZUNvbmZpZ3VyYXRpb24pIHtcbiAgdmFyIHBhcnNlZFRhYmxlQ29uZmlndXJhdGlvbiA9IHt9O1xuXG4gIGNvbnNvbGUubG9nKHBhcnNlZFRhYmxlQ29uZmlndXJhdGlvbik7XG59XG4iLCJleHBvcnQgY2xhc3MgRmlsdGVyQmFyQWN0b3Ige1xuICBjb25zdHJ1Y3RvcihmaWx0ZXJCYXJTdG9yZSwgdGFibGVTdG9yZSkge1xuICAgIHRoaXMuZmlsdGVyQmFyU3RvcmUgPSBmaWx0ZXJCYXJTdG9yZTtcbiAgICB0aGlzLnRhYmxlU3RvcmUgPSB0YWJsZVN0b3JlO1xuICB9XG5cbiAgZ2V0RmlsdGVyKGZpbHRlclVpZCkge1xuICAgIHJldHVybiB0aGlzLmZpbHRlckJhclN0b3JlLmdldEZpbHRlcihmaWx0ZXJVaWQpXG4gIH1cblxuICBlbmFibGVGaWx0ZXIoZmlsdGVyVWlkKSB7XG4gICAgdGhpcy5maWx0ZXJCYXJTdG9yZS5lbmFibGVGaWx0ZXIoZmlsdGVyVWlkKTtcbiAgfVxuXG4gIGRpc2FibGVGaWx0ZXIoZmlsdGVyVWlkKSB7XG4gICAgdGhpcy5maWx0ZXJCYXJTdG9yZS5kaXNhYmxlRmlsdGVyKGZpbHRlclVpZCk7XG4gIH1cblxuICBkaXNhYmxlQWxsRmlsdGVycygpIHtcbiAgICB0aGlzLmZpbHRlckJhclN0b3JlLmRpc2FibGVBbGxGaWx0ZXJzKCk7XG4gICAgdGhpcy5hcHBseUZpbHRlcnMoKTtcbiAgfVxuXG4gIHVwZGF0ZUZpbHRlcihmaWx0ZXJVaWQsIHZhbHVlKSB7XG4gICAgdGhpcy5maWx0ZXJCYXJTdG9yZS51cGRhdGVGaWx0ZXIoZmlsdGVyVWlkLCB2YWx1ZSlcbiAgfVxuXG4gIGdldEVuYWJsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyQmFyU3RvcmUuZ2V0RW5hYmxlZCgpO1xuICB9XG5cbiAgZ2V0RGlzYWJsZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyQmFyU3RvcmUuZ2V0RGlzYWJsZWQoKTtcbiAgfVxuXG4gIGFwcGx5RmlsdGVycygpIHtcbiAgICB2YXIgc2VhcmNoVXJsID0gdGhpcy5maWx0ZXJCYXJTdG9yZS5nZXRTZWFyY2hVcmwoKTtcbiAgICB2YXIgcXVlcnkgPSB0aGlzLmZpbHRlckJhclN0b3JlLmdldFF1ZXJ5KCk7XG4gICAgdmFyIG5ld1VybCA9IHNlYXJjaFVybCArIFwiP1wiICsgcXVlcnk7XG5cbiAgICBoaXN0b3J5LnB1c2hTdGF0ZSh7fSwgXCJcIiwgbmV3VXJsKTtcbiAgICBsb2NhbFN0b3JhZ2Vbd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcLy9nLCcnKV0gPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoO1xuXG4gICAgdGhpcy50YWJsZVN0b3JlLnNldFVybChuZXdVcmwpO1xuICAgIHRoaXMudGFibGVTdG9yZS5mZXRjaERhdGEoKTtcbiAgfVxuXG4gIHNhdmVGaWx0ZXJzKG5hbWUpIHtcbiAgICB2YXIgZW5hYmxlZEZpbHRlcnMgPSB0aGlzLmZpbHRlckJhclN0b3JlLmdldEVuYWJsZWQoKSxcbiAgICAgICAgc2F2ZWRGaWx0ZXJzUGFja2V0ID0ge307XG4gICAgc2F2ZWRGaWx0ZXJzUGFja2V0LnNlYXJjaF90aXRsZSA9IG5hbWU7XG4gICAgc2F2ZWRGaWx0ZXJzUGFja2V0LmZpbHRlcnMgPSB7fVxuICAgIGZvciAodmFyIGZpbHRlclVpZCBpbiBlbmFibGVkRmlsdGVycykge1xuICAgICAgc2F2ZWRGaWx0ZXJzUGFja2V0LmZpbHRlcnNbZmlsdGVyVWlkXSA9IGVuYWJsZWRGaWx0ZXJzW2ZpbHRlclVpZF0udmFsdWU7XG4gICAgfVxuICB9XG59IiwiZXhwb3J0IGNsYXNzIFRhYmxlQWN0b3Ige1xuICBjb25zdHJ1Y3Rvcih0YWJsZVN0b3JlKSB7XG4gICAgdGhpcy50YWJsZVN0b3JlID0gdGFibGVTdG9yZTtcbiAgfVxuXG4gIGdldENvbHVtbkhlYWRpbmdzKCkge1xuICAgIHJldHVybiB0aGlzLnRhYmxlU3RvcmUuZ2V0Q29sdW1uSGVhZGluZ3MoKTtcbiAgfVxuXG4gIGdldFJvd3MoKSB7XG4gICAgcmV0dXJuIHRoaXMudGFibGVTdG9yZS5nZXRSb3dzKCk7XG4gIH1cblxuICBnZXRDdXJyZW50UGFnZSgpIHtcbiAgICByZXR1cm4gdGhpcy50YWJsZVN0b3JlLmdldEN1cnJlbnRQYWdlKCk7XG4gIH1cblxuICBnZXRUb3RhbFBhZ2VzKCkge1xuICAgIHJldHVybiB0aGlzLnRhYmxlU3RvcmUuZ2V0VG90YWxQYWdlcygpO1xuICB9XG5cbiAgZmV0Y2hQYWdlZERhdGEocGFnZSkge1xuICAgIHZhciBjdXJyZW50VXJsID0gdGhpcy50YWJsZVN0b3JlLmdldFVybCgpO1xuICAgIHZhciBuZXdVcmwgPSBjdXJyZW50VXJsICsgJ3BhZ2U9JyArIHBhZ2UgKyAnJic7XG5cbiAgICBoaXN0b3J5LnB1c2hTdGF0ZSh7fSwgXCJcIiwgbmV3VXJsKTtcbiAgICBsb2NhbFN0b3JhZ2Vbd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcLy9nLCcnKV0gPSB3aW5kb3cubG9jYXRpb24uc2VhcmNoO1xuXG4gICAgdGhpcy50YWJsZVN0b3JlLnNldEN1cnJlbnRQYWdlKHBhZ2UpO1xuICAgIHRoaXMudGFibGVTdG9yZS5mZXRjaERhdGEoKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIEFwcGx5RmlsdGVyc0J1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICB9XG5cbiAgX29uQ2xpY2soKSB7XG4gICAgdGhpcy5wcm9wcy5maWx0ZXJCYXJBY3Rvci5hcHBseUZpbHRlcnMoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIiBvbkNsaWNrPXt0aGlzLl9vbkNsaWNrLmJpbmQodGhpcyl9PlxuICAgICAgICA8aSBjbGFzc05hbWU9XCJpY29uIGljb24tdGlja1wiIC8+XG4gICAgICAgIEFwcGx5XG4gICAgICA8L2J1dHRvbj5cbiAgICApO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgQ2xlYXJGaWx0ZXJzQnV0dG9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gIH1cblxuICBfb25DbGljaygpIHtcbiAgICB0aGlzLnByb3BzLmZpbHRlckJhckFjdG9yLmRpc2FibGVBbGxGaWx0ZXJzKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi13YXJuaW5nXCIgb25DbGljaz17dGhpcy5fb25DbGljay5iaW5kKHRoaXMpfT5cbiAgICAgICAgPGkgY2xhc3NOYW1lPVwiaWNvbiBpY29uLWRlbGV0ZVwiIC8+XG4gICAgICAgIENsZWFyXG4gICAgICA8L2J1dHRvbj5cbiAgICApO1xuICB9XG59XG4iLCJpbXBvcnQge0ZpbHRlckxpc3R9IGZyb20gJy4vRmlsdGVyTGlzdC9GaWx0ZXJMaXN0LnJlYWN0JztcbmltcG9ydCB7RmlsdGVyRGlzcGxheX0gZnJvbSAnLi9GaWx0ZXJEaXNwbGF5L0ZpbHRlckRpc3BsYXkucmVhY3QnO1xuaW1wb3J0IHtBcHBseUZpbHRlcnNCdXR0b259IGZyb20gJy4vQXBwbHlGaWx0ZXJzQnV0dG9uLnJlYWN0JztcbmltcG9ydCB7Q2xlYXJGaWx0ZXJzQnV0dG9ufSBmcm9tICcuL0NsZWFyRmlsdGVyc0J1dHRvbi5yZWFjdCc7XG5pbXBvcnQge1NhdmVGaWx0ZXJzQnV0dG9ufSBmcm9tICcuL1NhdmVGaWx0ZXJzQnV0dG9uLnJlYWN0JztcbmltcG9ydCB7TG9hZEZpbHRlcnNMaXN0fSBmcm9tICcuL0xvYWRGaWx0ZXJzTGlzdC9Mb2FkRmlsdGVyc0xpc3QucmVhY3QnO1xuXG5leHBvcnQgY2xhc3MgRmlsdGVyQmFyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5maWx0ZXJCYXJBY3RvciA9IHByb3BzLmZpbHRlckJhckFjdG9yO1xuICAgIHRoaXMuZmlsdGVyQmFyU3RvcmUgPSBwcm9wcy5maWx0ZXJCYXJTdG9yZTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdj5cbiAgICAgICAgPGRpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBtYXJnaW4tYm90dG9tLXNtXCI+XG4gICAgICAgICAgICA8RmlsdGVyTGlzdFxuICAgICAgICAgICAgICBmaWx0ZXJCYXJBY3Rvcj17dGhpcy5maWx0ZXJCYXJBY3Rvcn1cbiAgICAgICAgICAgICAgZmlsdGVyQmFyU3RvcmU9e3RoaXMuZmlsdGVyQmFyU3RvcmV9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0IGRpc2FibGVkXCI+PGkgY2xhc3NOYW1lPVwiaWNvbiBpY29uLWRvd25sb2FkXCI+PC9pPkV4cG9ydCBDU1Y8L2J1dHRvbj5cbiAgICAgICAgICAgIDxBcHBseUZpbHRlcnNCdXR0b25cbiAgICAgICAgICAgICAgZmlsdGVyQmFyQWN0b3I9e3RoaXMuZmlsdGVyQmFyQWN0b3J9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPENsZWFyRmlsdGVyc0J1dHRvblxuICAgICAgICAgICAgICBmaWx0ZXJCYXJBY3Rvcj17dGhpcy5maWx0ZXJCYXJBY3Rvcn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8U2F2ZUZpbHRlcnNCdXR0b25cbiAgICAgICAgICAgICAgZmlsdGVyQmFyQWN0b3I9e3RoaXMuZmlsdGVyQmFyQWN0b3J9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPExvYWRGaWx0ZXJzTGlzdFxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8RmlsdGVyRGlzcGxheVxuICAgICAgICAgICAgZmlsdGVyQmFyQWN0b3I9e3RoaXMuZmlsdGVyQmFyQWN0b3J9XG4gICAgICAgICAgICBmaWx0ZXJCYXJTdG9yZT17dGhpcy5maWx0ZXJCYXJTdG9yZX1cbiAgICAgICAgICAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiIsImltcG9ydCB7RmlsdGVySW5wdXR9IGZyb20gJy4vRmlsdGVySW5wdXQucmVhY3QnO1xuXG5leHBvcnQgY2xhc3MgRmlsdGVyRGlzcGxheSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuZmlsdGVyQmFyQWN0b3IgPSBwcm9wcy5maWx0ZXJCYXJBY3RvcjtcbiAgICB0aGlzLmZpbHRlckJhclN0b3JlID0gcHJvcHMuZmlsdGVyQmFyU3RvcmU7XG4gICAgdGhpcy5zdGF0ZSA9IHRoaXMuZ2V0U3RhdGVGcm9tU3RvcmVzKCk7XG5cbiAgICB0aGlzLmZpbHRlckJhclN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlLmJpbmQodGhpcykpO1xuICB9XG5cbiAgX29uQ2hhbmdlKCkge1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5nZXRTdGF0ZUZyb21TdG9yZXMoKSk7XG4gIH1cblxuICBnZXRTdGF0ZUZyb21TdG9yZXMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbHRlcnM6IHRoaXMuZmlsdGVyQmFyQWN0b3IuZ2V0RW5hYmxlZCgpXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHZhciBmaWx0ZXJzID0gT2JqZWN0LmtleXModGhpcy5zdGF0ZS5maWx0ZXJzKS5tYXAoZnVuY3Rpb24oZmlsdGVyVWlkKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RmlsdGVySW5wdXRcbiAgICAgICAgICBrZXk9e2ZpbHRlclVpZH1cbiAgICAgICAgICBmaWx0ZXJVaWQ9e2ZpbHRlclVpZH1cbiAgICAgICAgICBmaWx0ZXI9e3RoaXMuc3RhdGUuZmlsdGVyc1tmaWx0ZXJVaWRdfVxuICAgICAgICAgIGZpbHRlckJhckFjdG9yPXt0aGlzLmZpbHRlckJhckFjdG9yfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9LHRoaXMpO1xuXG4gICAgaWYgKGZpbHRlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICBmaWx0ZXJzID0gKDxkaXY+Tm8gRmlsdGVycyBFbmFibGVkITwvZGl2Pik7XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPSduYXZiYXIgZmlsdGVyYmFyJz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9J3BhbmVsIHBhbmVsLWRlZmF1bHQnPlxuICAgICAgICAgIHtmaWx0ZXJzfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiIsImltcG9ydCB7VGV4dElucHV0fSBmcm9tICcuL0lucHV0cy9UZXh0SW5wdXQucmVhY3QnO1xuXG5leHBvcnQgY2xhc3MgRmlsdGVySW5wdXQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuZmlsdGVyQmFyQWN0b3IgPSBwcm9wcy5maWx0ZXJCYXJBY3RvcjtcbiAgICB0aGlzLmZpbHRlclVpZCA9IHByb3BzLmZpbHRlclVpZDtcbiAgICB0aGlzLmZpbHRlcktleSA9IHByb3BzLmZpbHRlcktleTtcbiAgfVxuXG4gIF9vbkNsaWNrKCkge1xuICAgIHRoaXMuZmlsdGVyQmFyQWN0b3IuZGlzYWJsZUZpbHRlcih0aGlzLmZpbHRlclVpZCk7XG4gIH1cblxuICBpbnB1dEZhY3RvcnkoKSB7XG4gICAgLypcbiAgICAgIGlucHV0RmFjdG9yeTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB0eXBlID0gdGhpcy5wcm9wcy5maWx0ZXIudHlwZTtcbiAgICAgICAgaWYgKHR5cGUgPT0gJ3RleHQnIHx8IHR5cGUgPT0gJ2lkJykge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8VGV4dElucHV0XG4gICAgICAgICAgICAgIGZpbHRlckJhcklkPXt0aGlzLnByb3BzLmZpbHRlckJhcklkfVxuICAgICAgICAgICAgICBmaWx0ZXJVaWQ9e3RoaXMucHJvcHMuZmlsdGVyVWlkfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJ2RhdGUnKSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxEYXRlSW5wdXRcbiAgICAgICAgICAgICAgZmlsdGVyQmFySWQ9e3RoaXMucHJvcHMuZmlsdGVyQmFySWR9XG4gICAgICAgICAgICAgIGZpbHRlclVpZD17dGhpcy5wcm9wcy5maWx0ZXJVaWR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSAnc2VsZWN0Jykge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8U2VsZWN0SW5wdXRcbiAgICAgICAgICAgICAgZmlsdGVyQmFySWQ9e3RoaXMucHJvcHMuZmlsdGVyQmFySWR9XG4gICAgICAgICAgICAgIGZpbHRlclVpZD17dGhpcy5wcm9wcy5maWx0ZXJVaWR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSAnYWdlX3NlbGVjdCcpIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPEFnZVNlbGVjdElucHV0XG4gICAgICAgICAgICAgIGZpbHRlckJhcklkPXt0aGlzLnByb3BzLmZpbHRlckJhcklkfVxuICAgICAgICAgICAgICBmaWx0ZXJVaWQ9e3RoaXMucHJvcHMuZmlsdGVyVWlkfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJOb3QgaW1wbGVtZW50ZWQgeWV0IVwiKTtcbiAgICAgICAgfVxuICAgICovXG4gICAgcmV0dXJuIChcbiAgICAgIDxUZXh0SW5wdXRcbiAgICAgICAgZmlsdGVyQmFyQWN0b3I9e3RoaXMuZmlsdGVyQmFyQWN0b3J9XG4gICAgICAgIGZpbHRlclVpZD17dGhpcy5maWx0ZXJVaWR9XG4gICAgICAvPlxuICAgICk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdmFyIGlucHV0cyA9IHRoaXMuaW5wdXRGYWN0b3J5KCk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29sLWxnLTMgY29sLW1kLTQgY29sLXNtLTYgY29sLXhzLTEyIGZpbHRlclwiPlxuICAgICAgICA8dWwgY2xhc3NOYW1lPXt0aGlzLmZpbHRlcktleX0+XG4gICAgICAgICAgPGxpPlxuICAgICAgICAgICAgPGkgb25DbGljaz17dGhpcy5fb25DbGljay5iaW5kKHRoaXMpfSBjbGFzc05hbWU9XCJidG4gYnRuLWNpcmNsZS1wcmltYXJ5IGJ0bi14cyBpY29uIGljb24tY2xvc2UgcmVtb3ZlLWZpbHRlclwiIC8+XG4gICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgIHt0aGlzLnByb3BzLmZpbHRlci5sYWJlbH1cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgICB7aW5wdXRzfVxuICAgICAgICA8L3VsPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFRleHRJbnB1dCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuZmlsdGVyQmFyQWN0b3IgPSBwcm9wcy5maWx0ZXJCYXJBY3RvcjtcbiAgICB0aGlzLmZpbHRlclVpZCA9IHByb3BzLmZpbHRlclVpZDtcblxuICAgIHRoaXMuc3RhdGUgPSB7dmFsdWU6IHRoaXMuZmlsdGVyQmFyQWN0b3IuZ2V0RmlsdGVyKHRoaXMuZmlsdGVyVWlkKS52YWx1ZX07XG4gIH1cblxuICBfb25DaGFuZ2UoZXZlbnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHt2YWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlfSk7XG4gICAgdGhpcy5maWx0ZXJCYXJBY3Rvci51cGRhdGVGaWx0ZXIodGhpcy5maWx0ZXJVaWQsIGV2ZW50LnRhcmdldC52YWx1ZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxsaT5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUudmFsdWV9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMuX29uQ2hhbmdlLmJpbmQodGhpcyl9XG4gICAgICAgIC8+XG4gICAgICA8L2xpPlxuICAgICk7XG4gIH1cbn1cbiIsImltcG9ydCB7RmlsdGVyTGlzdE9wdGlvbn0gZnJvbSAnLi9GaWx0ZXJMaXN0T3B0aW9uLnJlYWN0JztcblxuZXhwb3J0IGNsYXNzIEZpbHRlckxpc3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmZpbHRlckJhckFjdG9yID0gcHJvcHMuZmlsdGVyQmFyQWN0b3I7XG4gICAgdGhpcy5maWx0ZXJCYXJTdG9yZSA9IHByb3BzLmZpbHRlckJhclN0b3JlO1xuXG4gICAgdGhpcy5maWx0ZXJCYXJTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgICB0aGlzLnN0YXRlID0gdGhpcy5nZXRTdGF0ZUZyb21TdG9yZXMoKTtcbiAgfVxuXG4gIF9vbkNoYW5nZSgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0U3RhdGVGcm9tU3RvcmVzKCkpO1xuICB9XG5cbiAgZ2V0U3RhdGVGcm9tU3RvcmVzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBmaWx0ZXJzOiB0aGlzLmZpbHRlckJhckFjdG9yLmdldERpc2FibGVkKClcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdmFyIGZpbHRlciA9IHt9O1xuICAgIHZhciBvcHRpb25LZXkgPSBcIlwiO1xuICAgIHZhciBmaWx0ZXJPcHRpb25zID0gT2JqZWN0LmtleXModGhpcy5zdGF0ZS5maWx0ZXJzKS5tYXAoZnVuY3Rpb24oZmlsdGVyVWlkKSB7XG4gICAgICBvcHRpb25LZXkgPSBcIm9wdGlvbi1cIitmaWx0ZXJVaWQ7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RmlsdGVyTGlzdE9wdGlvblxuICAgICAgICAgIGtleT17b3B0aW9uS2V5fVxuICAgICAgICAgIGZpbHRlclVpZD17ZmlsdGVyVWlkfVxuICAgICAgICAgIGZpbHRlckJhckFjdG9yPXt0aGlzLmZpbHRlckJhckFjdG9yfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9LHRoaXMpO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cFwiPlxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgdHlwZT1cImJ1dHRvblwiPlxuICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImljb24gaWNvbi1hZGRcIiAvPlxuICAgICAgICAgIEFkZCBGaWx0ZXJcbiAgICAgICAgICA8aSBjbGFzc05hbWU9XCJpY29uIGljb24tY2hldnJvbi1kb3duXCIgLz5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDx1bCBjbGFzc05hbWU9XCJkcm9wZG93bi1tZW51XCIgcm9sZT1cIm1lbnVcIj5cbiAgICAgICAgICB7ZmlsdGVyT3B0aW9uc31cbiAgICAgICAgPC91bD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBGaWx0ZXJMaXN0T3B0aW9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5maWx0ZXJCYXJBY3RvciA9IHByb3BzLmZpbHRlckJhckFjdG9yO1xuICAgIHRoaXMuZmlsdGVyVWlkID0gcHJvcHMuZmlsdGVyVWlkO1xuICB9XG5cbiAgX29uQ2xpY2soKSB7XG4gICAgdGhpcy5maWx0ZXJCYXJBY3Rvci5lbmFibGVGaWx0ZXIodGhpcy5maWx0ZXJVaWQpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8bGk+XG4gICAgICAgIDxhIG9uQ2xpY2s9e3RoaXMuX29uQ2xpY2suYmluZCh0aGlzKX0+XG4gICAgICAgICAge3RoaXMuZmlsdGVyQmFyQWN0b3IuZ2V0RmlsdGVyKHRoaXMuZmlsdGVyVWlkKS5sYWJlbH1cbiAgICAgICAgPC9hPlxuICAgICAgPC9saT5cbiAgICApO1xuICB9XG59IiwiZXhwb3J0IGNsYXNzIExvYWRGaWx0ZXJzTGlzdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICB9XG5cbiAgZ2V0U3RhdGVGcm9tU3RvcmVzKCkge1xuICAgIHJldHVybiB7XG4gICAgfTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICB2YXIgbG9hZEZpbHRlcnNMaXN0SXRlbXMgPSBbXTtcbiAgICB2YXIgYnV0dG9uQ2xhc3MgPSAnYnRuIGJ0bi1kZWZhdWx0IGRyb3Bkb3duLXRvZ2dsZSc7XG4gICAgaWYgKGxvYWRGaWx0ZXJzTGlzdEl0ZW1zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgYnV0dG9uQ2xhc3MgKz0gJyBkaXNhYmxlZCdcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIG1hcmdpbi1ib3R0b20tc21cIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXBcIj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT17YnV0dG9uQ2xhc3N9IGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+XG4gICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJpY29uIGljb24tc2F2ZVwiIC8+XG4gICAgICAgICAgICBTYXZlZCBTZWFyY2hlc1xuICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiaWNvbiBpY29uLWNoZXZyb24tZG93blwiIC8+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImRyb3Bkb3duLW1lbnVcIiByb2xlPVwibWVudVwiPlxuICAgICAgICAgICAge2xvYWRGaWx0ZXJzTGlzdEl0ZW1zfVxuICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLWRhbmdlclwiPlxuICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImljb24gaWNvbi1kZWxldGVcIiAvPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn0iLCJleHBvcnQgY2xhc3MgU2F2ZUZpbHRlcnNCdXR0b24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0ge2NvbmZpZ3VyYXRpb25OYW1lOiAnJ307XG4gIH1cblxuICBfb25DbGljaygpIHtcbiAgICB0aGlzLnByb3BzLmZpbHRlckJhckFjdG9yLnNhdmVGaWx0ZXJzKHRoaXMuc3RhdGUuY29uZmlndXJhdGlvbk5hbWUpO1xuICB9XG5cbiAgX29uQ2hhbmdlKGV2ZW50KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7Y29uZmlndXJhdGlvbk5hbWU6IGV2ZW50LnRhcmdldC52YWx1ZX0pO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8UmVhY3RCb290c3RyYXAuRHJvcGRvd25CdXR0b24gdGl0bGU9XCJTYXZlIFNlYXJjaFwiIHR5cGU9XCJidXR0b25cIiBic1N0eWxlPVwiZGVmYXVsdFwiIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBtYXJnaW4tYm90dG9tLXNtXCI+XG4gICAgICAgIDxSZWFjdEJvb3RzdHJhcC5NZW51SXRlbSBldmVudEtleT1cIjFcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICAgIDxsYWJlbD5TZWFyY2ggVGl0bGU8L2xhYmVsPlxuICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIHZhbHVlPXt0aGlzLnN0YXRlLmNvbmZpZ3VyYXRpb25OYW1lfSB0eXBlPVwidGV4dFwiIG9uQ2hhbmdlPXt0aGlzLl9vbkNoYW5nZS5iaW5kKHRoaXMpfSAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCIgdHlwZT1cImJ1dHRvblwiIG9uQ2xpY2s9e3RoaXMuX29uQ2xpY2suYmluZCh0aGlzKX0+U2F2ZTwvYnV0dG9uPlxuICAgICAgICA8L1JlYWN0Qm9vdHN0cmFwLk1lbnVJdGVtPlxuICAgICAgPC9SZWFjdEJvb3RzdHJhcC5Ecm9wZG93bkJ1dHRvbj5cbiAgICApO1xuICB9XG59XG4iLCJpbXBvcnQge0ZpbHRlckJhckFjdG9yfSBmcm9tICcuLi9hY3RvcnMvRmlsdGVyQmFyQWN0b3InO1xuaW1wb3J0IHtUYWJsZUFjdG9yfSBmcm9tICcuLi9hY3RvcnMvVGFibGVBY3Rvcic7XG5cbmltcG9ydCB7RmlsdGVyQmFyU3RvcmV9IGZyb20gJy4uL3N0b3Jlcy9GaWx0ZXJCYXJTdG9yZSc7XG5pbXBvcnQge1RhYmxlU3RvcmV9IGZyb20gJy4uL3N0b3Jlcy9UYWJsZVN0b3JlJztcblxuaW1wb3J0IHtGaWx0ZXJCYXJ9IGZyb20gJy4vRmlsdGVyQmFyL0ZpbHRlckJhci5yZWFjdCc7XG5pbXBvcnQge1RhYmxlfSAgZnJvbSAnLi9UYWJsZS9UYWJsZS5yZWFjdCc7XG5cbmV4cG9ydCBjbGFzcyBGaWx0ZXJhYmxlVGFibGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmlkID0gcHJvcHMuZmlsdGVyYWJsZVRhYmxlSWQ7XG5cbiAgICB0aGlzLmZpbHRlckJhclN0b3JlID0gbmV3IEZpbHRlckJhclN0b3JlKHByb3BzLmZpbHRlcmJhcik7XG4gICAgdGhpcy50YWJsZVN0b3JlID0gbmV3IFRhYmxlU3RvcmUocHJvcHMudGFibGUpO1xuXG4gICAgdGhpcy50YWJsZUFjdG9yID0gbmV3IFRhYmxlQWN0b3IodGhpcy50YWJsZVN0b3JlKTtcbiAgICB0aGlzLmZpbHRlckJhckFjdG9yID0gbmV3IEZpbHRlckJhckFjdG9yKHRoaXMuZmlsdGVyQmFyU3RvcmUsIHRoaXMudGFibGVTdG9yZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYga2V5PXt0aGlzLmlkfT5cbiAgICAgICAgPEZpbHRlckJhclxuICAgICAgICAgIGZpbHRlckJhckFjdG9yPXt0aGlzLmZpbHRlckJhckFjdG9yfVxuICAgICAgICAgIGZpbHRlckJhclN0b3JlPXt0aGlzLmZpbHRlckJhclN0b3JlfVxuICAgICAgICAvPlxuICAgICAgICA8VGFibGVcbiAgICAgICAgICB0YWJsZUFjdG9yPXt0aGlzLnRhYmxlQWN0b3J9XG4gICAgICAgICAgdGFibGVTdG9yZT17dGhpcy50YWJsZVN0b3JlfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuIiwiaW1wb3J0IHtUYWJsZUhlYWRpbmdDZWxsfSBmcm9tICcuL1RhYmxlSGVhZGluZ0NlbGwucmVhY3QnO1xuXG5leHBvcnQgY2xhc3MgVGFibGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMudGFibGVBY3RvciA9IHByb3BzLnRhYmxlQWN0b3I7XG4gICAgdGhpcy50YWJsZVN0b3JlID0gcHJvcHMudGFibGVTdG9yZTtcblxuICAgIHRoaXMuc3RhdGUgPSB0aGlzLmdldFN0YXRlRnJvbVN0b3JlcygpO1xuICAgIHRoaXMudGFibGVTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIF9vbkNoYW5nZSgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0U3RhdGVGcm9tU3RvcmVzKCkpO1xuICB9XG5cbiAgX29uQ2xpY2soZXZlbnQpIHtcbiAgICB0aGlzLnRhYmxlQWN0b3IuZmV0Y2hQYWdlZERhdGEoZXZlbnQudGFyZ2V0LmlubmVySFRNTCk7XG4gIH1cblxuICBnZXRTdGF0ZUZyb21TdG9yZXMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbHVtbkhlYWRpbmdzOiB0aGlzLnRhYmxlQWN0b3IuZ2V0Q29sdW1uSGVhZGluZ3MoKSxcbiAgICAgIHJvd3M6IHRoaXMudGFibGVBY3Rvci5nZXRSb3dzKCksXG4gICAgICBjdXJyZW50UGFnZTogdGhpcy50YWJsZUFjdG9yLmdldEN1cnJlbnRQYWdlKCksXG4gICAgICB0b3RhbFBhZ2VzOiB0aGlzLnRhYmxlQWN0b3IuZ2V0VG90YWxQYWdlcygpXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHZhciBjb2x1bW5zID0gT2JqZWN0LmtleXModGhpcy5zdGF0ZS5jb2x1bW5IZWFkaW5ncykubWFwKGZ1bmN0aW9uKGNvbHVtbklkKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8VGFibGVIZWFkaW5nQ2VsbCBrZXk9e2NvbHVtbklkfSBoZWFkaW5nPXt0aGlzLnN0YXRlLmNvbHVtbkhlYWRpbmdzW2NvbHVtbklkXS5oZWFkaW5nfSAvPlxuICAgICAgKTtcbiAgICB9LHRoaXMpO1xuXG4gICAgaWYgKHRoaXMuc3RhdGUudG90YWxQYWdlcyA+IDEpIHtcbiAgICAgIHZhciBwYWdlcyA9IEFycmF5LmFwcGx5KG51bGwsIEFycmF5KHRoaXMuc3RhdGUudG90YWxQYWdlcykpLm1hcChmdW5jdGlvbihfLGkpIHtyZXR1cm4gaSArIDF9KTtcbiAgICAgIHZhciBwYWdpbmF0aW9uID0gcGFnZXMubWFwKGZ1bmN0aW9uKHBhZ2VOdW1iZXIpIHtcbiAgICAgICAgdmFyIGNsYXNzZXMgPSAnJztcbiAgICAgICAgaWYgKHBhZ2VOdW1iZXIgPT09IHRoaXMuc3RhdGUuY3VycmVudFBhZ2UpIHtcbiAgICAgICAgICBjbGFzc2VzID0gJ2FjdGl2ZSc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8bGkgY2xhc3NOYW1lPXtjbGFzc2VzfT5cbiAgICAgICAgICAgIDxhIG9uQ2xpY2s9e3RoaXMuX29uQ2xpY2suYmluZCh0aGlzKX0+e3BhZ2VOdW1iZXJ9PC9hPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgIClcbiAgICAgIH0sdGhpcyk7XG4gICAgfVxuXG4gICAgdmFyIHJvd3MgPSB0aGlzLnN0YXRlLnJvd3MubWFwKGZ1bmN0aW9uKHJvdykge1xuICAgICAgdmFyIGNvbHVtbnMgPSBPYmplY3Qua2V5cyhyb3cpLm1hcChmdW5jdGlvbihjb2x1bW5JZCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgIHtyb3dbY29sdW1uSWRdfVxuICAgICAgICAgIDwvdGQ+XG4gICAgICAgICk7XG4gICAgICB9LHRoaXMpO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8dHI+XG4gICAgICAgICAge2NvbHVtbnN9XG4gICAgICAgIDwvdHI+XG4gICAgICApO1xuICAgIH0sdGhpcyk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9J3BhbmVsIHBhbmVsLXJlc3BvbnNpdmUnPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ndGFibGUtcmVzcG9uc2l2ZSc+XG4gICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT0ndGFibGUgdGFibGUtaG92ZXIgdGFibGUtc3RyaXBlZCc+XG4gICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICB7Y29sdW1uc31cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgIHtyb3dzfVxuICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgIDxuYXY+XG4gICAgICAgICAgICA8dWwgY2xhc3NOYW1lPSdwYWdpbmF0aW9uJz5cbiAgICAgICAgICAgICAge3BhZ2luYXRpb259XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgIDwvbmF2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBUYWJsZUhlYWRpbmdDZWxsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5oZWFkaW5nID0gcHJvcHMuaGVhZGluZztcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHRoPlxuICAgICAgICB7dGhpcy5oZWFkaW5nfVxuICAgICAgPC90aD5cbiAgICApO1xuICB9XG59XG4iLCJ2YXIgU2hhcmVkVXRpbHMgPSByZXF1aXJlKCcuLi91dGlscy9TaGFyZWRVdGlscycpO1xuXG5leHBvcnQgY2xhc3MgRmlsdGVyQmFyU3RvcmUge1xuICBjb25zdHJ1Y3RvcihmaWx0ZXJCYXJPcHRpb25zKSB7XG4gICAgdGhpcy5DSEFOR0VfRVZFTlQgPSAnY2hhbmdlJztcbiAgICB0aGlzLmV2ZW50RW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIC8vIHRoaXMuc2VhcmNoVXJsICAgICAgICA9IHBhcnNlU2VhcmNoVXJsKCk7XG4gICAgLy8gdGhpcy5zYXZlU2VhcmNoVXJsICAgID0gcGFyc2VTYXZlU2VhcmNoVXJsKCk7XG4gICAgLy8gdGhpcy5zYXZlZFNlYXJjaFVybCAgID0gcGFyc2VTYXZlZFNlYXJjaFVybCgpO1xuICAgIC8vIHRoaXMuZXhwb3J0UmVzdWx0c1VybCA9IHBhcnNlZXhwb3J0UmVzdWx0c1VybCgpO1xuICAgIC8vIHRoaXMuZmlsdGVycyAgICAgICAgICA9IHBhcnNlRmlsdGVycygpO1xuXG4gICAgdGhpcy5maWx0ZXJzID0gdGhpcy5wYXJzZVJhd0ZpbHRlckxpc3QoXG4gICAgICBmaWx0ZXJCYXJPcHRpb25zLmNvbmZpZ3VyYXRpb24ucXVlcnlTZWxlY3RvcignZGwuZmlsdGVycycpLnF1ZXJ5U2VsZWN0b3JBbGwoJ2R0LmZpbHRlcicpXG4gICAgKTtcblxuICAgIHRoaXMudXJsID0gZmlsdGVyQmFyT3B0aW9ucy5jb25maWd1cmF0aW9uLnF1ZXJ5U2VsZWN0b3IoJ2R0LnNlYXJjaC11cmwnKS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdXJsJyk7XG4gICAgdGhpcy5zZWFyY2hVcmwgPSBmaWx0ZXJCYXJPcHRpb25zLmNvbmZpZ3VyYXRpb24ucXVlcnlTZWxlY3RvcignZHQuc2VhcmNoLXVybCcpLmdldEF0dHJpYnV0ZSgnZGF0YS11cmwnKTtcblxuICAgIGlmICh3aW5kb3cubG9jYXRpb24uc2VhcmNoICE9ICcnKSB7XG4gICAgICB2YXIgcXVlcmllcyA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc3BsaXQoJz8nKVsxXS5zcGxpdCgnJicpLFxuICAgICAgICAgIGVuYWJsZWRGaWx0ZXJzLFxuICAgICAgICAgIHF1ZXJ5O1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWVyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHF1ZXJ5ID0gcXVlcmllc1tpXTtcbiAgICAgICAgaWYgKHF1ZXJ5Lm1hdGNoKC9ecT0vKSkge1xuICAgICAgICAgIGVuYWJsZWRGaWx0ZXJzID0gSlNPTi5wYXJzZShkZWNvZGVVUkkocXVlcnkpLnN1YnN0cmluZygyLHF1ZXJ5Lmxlbmd0aCkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB2YXIgZmlsdGVyO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbmFibGVkRmlsdGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICBmaWx0ZXIgPSBlbmFibGVkRmlsdGVyc1tpXTtcbiAgICAgICAgdGhpcy5lbmFibGVGaWx0ZXIoZmlsdGVyLnVpZCwgZmlsdGVyLnZhbHVlKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldFNlYXJjaFVybCgpIHtcbiAgICByZXR1cm4gdGhpcy5zZWFyY2hVcmw7XG4gIH1cblxuICBnZXRGaWx0ZXIoZmlsdGVyVWlkKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyc1tmaWx0ZXJVaWRdXG4gIH1cblxuICBnZXREaXNhYmxlZCgpIHtcbiAgICB2YXIgZGlzYWJsZWRGaWx0ZXJzID0ge307XG4gICAgZm9yICh2YXIgZmlsdGVyVWlkIGluIHRoaXMuZmlsdGVycykge1xuICAgICAgaWYgKHRoaXMuZmlsdGVyc1tmaWx0ZXJVaWRdLmVuYWJsZWQgPT09IGZhbHNlKSB7XG4gICAgICAgIGRpc2FibGVkRmlsdGVyc1tmaWx0ZXJVaWRdID0gdGhpcy5maWx0ZXJzW2ZpbHRlclVpZF07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkaXNhYmxlZEZpbHRlcnM7XG4gIH1cblxuICBnZXRFbmFibGVkKCkge1xuICAgIHZhciBlbmFibGVkRmlsdGVycyA9IHt9O1xuICAgIGZvciAodmFyIGZpbHRlclVpZCBpbiB0aGlzLmZpbHRlcnMpIHtcbiAgICAgIGlmICh0aGlzLmZpbHRlcnNbZmlsdGVyVWlkXS5lbmFibGVkID09PSB0cnVlKSB7XG4gICAgICAgIGVuYWJsZWRGaWx0ZXJzW2ZpbHRlclVpZF0gPSB0aGlzLmZpbHRlcnNbZmlsdGVyVWlkXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVuYWJsZWRGaWx0ZXJzO1xuICB9XG5cbiAgZ2V0UXVlcnkoKSB7XG4gICAgdmFyIGVuYWJsZWRGaWx0ZXJzID0gT2JqZWN0LmtleXModGhpcy5nZXRFbmFibGVkKCkpLm1hcChmdW5jdGlvbihmaWx0ZXJVaWQpIHtcbiAgICAgIHZhciBmaWx0ZXIgPSB0aGlzLmdldEZpbHRlcihmaWx0ZXJVaWQpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdWlkOiBmaWx0ZXJVaWQsXG4gICAgICAgIHR5cGU6IGZpbHRlci50eXBlLFxuICAgICAgICBmaWVsZDogZmlsdGVyLmZpZWxkLFxuICAgICAgICB2YWx1ZTogZmlsdGVyLnZhbHVlXG4gICAgICB9XG4gICAgfSx0aGlzKTtcbiAgICByZXR1cm4gZW5hYmxlZEZpbHRlcnMubGVuZ3RoID4gMCA/ICdxPScgKyBKU09OLnN0cmluZ2lmeShlbmFibGVkRmlsdGVycykgKyAnJicgOiAnJztcbiAgfVxuXG4gIGdldEJhc2U2NFF1ZXJ5KCkge1xuICAgIHZhciBlbmFibGVkRmlsdGVycyA9IE9iamVjdC5rZXlzKHRoaXMuZ2V0RW5hYmxlZCgpKS5tYXAoZnVuY3Rpb24oZmlsdGVyVWlkKSB7XG4gICAgICB2YXIgZmlsdGVyID0gdGhpcy5nZXRGaWx0ZXIoZmlsdGVyVWlkKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHVpZDogZmlsdGVyVWlkLFxuICAgICAgICB0eXBlOiBmaWx0ZXIudHlwZSxcbiAgICAgICAgZmllbGQ6IGZpbHRlci5maWVsZCxcbiAgICAgICAgdmFsdWU6IGZpbHRlci52YWx1ZVxuICAgICAgfVxuICAgIH0sdGhpcyk7XG4gICAgZW5hYmxlZEZpbHRlcnMgPSBlbmFibGVkRmlsdGVycy5sZW5ndGggPiAwID8gYnRvYShKU09OLnN0cmluZ2lmeShlbmFibGVkRmlsdGVycykpOiAnJztcbiAgICBjb25zb2xlLmxvZyhlbmFibGVkRmlsdGVycyk7XG4gICAgcmV0dXJuIGVuYWJsZWRGaWx0ZXJzO1xuICB9XG5cbiAgZ2V0UXVlcnlTdHJpbmcoKSB7XG4gICAgdmFyIGVuYWJsZWRGaWx0ZXJzID0gdGhpcy5nZXRFbmFibGVkKCk7XG4gICAgdmFyIGZpbHRlcixcbiAgICAgICAgcHJlZml4LFxuICAgICAgICBxdWVyeV9vYmplY3QsXG4gICAgICAgIHF1ZXJ5X3N0cmluZyA9ICcnO1xuXG4gICAgZm9yICh2YXIgZmlsdGVyVWlkIGluIGVuYWJsZWRGaWx0ZXJzKSB7XG4gICAgICBmaWx0ZXIgPSBlbmFibGVkRmlsdGVyc1tmaWx0ZXJVaWRdO1xuICAgICAgcHJlZml4ID0gJyc7XG4gICAgICBwcmVmaXggKz0gJ3EnO1xuICAgICAgcHJlZml4ICs9ICdbJyArIGZpbHRlci50eXBlICsgJ10nO1xuICAgICAgcXVlcnlfb2JqZWN0ID0ge307XG4gICAgICBxdWVyeV9vYmplY3RbZmlsdGVyLmZpZWxkXSA9IGZpbHRlci52YWx1ZTtcblxuICAgICAgcXVlcnlfc3RyaW5nICs9IFNoYXJlZFV0aWxzLnNlcmlhbGl6ZShxdWVyeV9vYmplY3QsIHByZWZpeCkgKyAnJic7XG4gICAgfVxuICAgIHJldHVybiBxdWVyeV9zdHJpbmc7XG4gIH1cblxuICBwYXJzZVJhd0ZpbHRlckxpc3QocmF3RmlsdGVyTGlzdCkge1xuICAgIHZhciByYXdGaWx0ZXIsXG4gICAgICAgIHBhcnNlZEZpbHRlckxpc3QgPSB7fTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmF3RmlsdGVyTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgcmF3RmlsdGVyID0gcmF3RmlsdGVyTGlzdFtpXTtcbiAgICAgIHBhcnNlZEZpbHRlckxpc3RbcmF3RmlsdGVyLmdldEF0dHJpYnV0ZSgnZGF0YS11aWQnKV0gPSB7XG4gICAgICAgIGxhYmVsOiByYXdGaWx0ZXIuZ2V0QXR0cmlidXRlKCdkYXRhLWxhYmVsJyksXG4gICAgICAgIHR5cGU6IHJhd0ZpbHRlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtdHlwZScpLFxuICAgICAgICBmaWVsZDogcmF3RmlsdGVyLmdldEF0dHJpYnV0ZSgnZGF0YS1maWVsZCcpLFxuICAgICAgICB2YWx1ZTogJycsXG4gICAgICAgIGVuYWJsZWQ6IGZhbHNlXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gcGFyc2VkRmlsdGVyTGlzdDtcbiAgfVxuXG4gIC8qIE11dGF0aW9uIE1ldGhvZHMgKi9cbiAgZGlzYWJsZUFsbEZpbHRlcnMoKSB7XG4gICAgdmFyIGVuYWJsZWRGaWx0ZXJzID0gdGhpcy5nZXRFbmFibGVkKCk7XG5cbiAgICBmb3IgKHZhciBmaWx0ZXJVaWQgaW4gZW5hYmxlZEZpbHRlcnMpIHtcbiAgICAgIHRoaXMuZGlzYWJsZUZpbHRlcihmaWx0ZXJVaWQpO1xuICAgIH1cbiAgICB0aGlzLmVtaXRDaGFuZ2UoKTtcbiAgfVxuXG4gIGRpc2FibGVGaWx0ZXIoZmlsdGVyVWlkKSB7XG4gICAgdGhpcy5maWx0ZXJzW2ZpbHRlclVpZF0uZW5hYmxlZCA9IGZhbHNlO1xuICAgIHRoaXMuZmlsdGVyc1tmaWx0ZXJVaWRdLnZhbHVlID0gJyc7XG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICBlbmFibGVGaWx0ZXIoZmlsdGVyVWlkLCB2YWx1ZSkge1xuICAgIHRoaXMuZmlsdGVyc1tmaWx0ZXJVaWRdLmVuYWJsZWQgPSB0cnVlO1xuICAgIHRoaXMuZmlsdGVyc1tmaWx0ZXJVaWRdLnZhbHVlID0gdmFsdWUgfHwgJyc7XG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICB1cGRhdGVGaWx0ZXIoZmlsdGVyVWlkLCB2YWx1ZSkge1xuICAgIHRoaXMuZmlsdGVyc1tmaWx0ZXJVaWRdLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICBlbWl0Q2hhbmdlKCkge1xuICAgIHRoaXMuZXZlbnRFbWl0dGVyLmVtaXQodGhpcy5DSEFOR0VfRVZFTlQpO1xuICB9XG5cbiAgYWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLmV2ZW50RW1pdHRlci5vbih0aGlzLkNIQU5HRV9FVkVOVCwgY2FsbGJhY2spO1xuICB9XG5cbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLmV2ZW50RW1pdHRlci5yZW1vdmVMaXN0ZW5lcih0aGlzLkNIQU5HRV9FVkVOVCwgY2FsbGJhY2spO1xuICB9XG59XG4iLCJpbXBvcnQgKiBhcyBTZWFyY2hVdGlscyBmcm9tICcuLi91dGlscy9TZWFyY2hVdGlscyc7XG5cbmV4cG9ydCBjbGFzcyBUYWJsZVN0b3JlIHtcbiAgY29uc3RydWN0b3IodGFibGVPcHRpb25zKSB7XG4gICAgdGhpcy5DSEFOR0VfRVZFTlQgPSAnY2hhbmdlJztcbiAgICB0aGlzLmV2ZW50RW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIHRoaXMucm93cyA9IFtdO1xuICAgIHRoaXMuY3VycmVudFBhZ2UgPSAxO1xuICAgIHRoaXMudG90YWxQYWdlcyA9IDE7XG5cbiAgICB0aGlzLmNvbHVtbkhlYWRpbmdzID0gdGhpcy5wYXJzZVJhd0NvbHVtbkhlYWRpbmdMaXN0KFxuICAgICAgdGFibGVPcHRpb25zLmNvbmZpZ3VyYXRpb24ucXVlcnlTZWxlY3RvcignZGwuY29sdW1ucycpLnF1ZXJ5U2VsZWN0b3JBbGwoJ2R0LmNvbHVtbicpXG4gICAgKVxuXG4gICAgdGhpcy5iYXNlVXJsID0gdGhpcy5wYXJzZURhdGFVcmwodGFibGVPcHRpb25zLmNvbmZpZ3VyYXRpb24ucXVlcnlTZWxlY3RvcignZHQuZGF0YS11cmwnKS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdXJsJykpO1xuICAgIHRoaXMudXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgdGhpcy5mZXRjaERhdGEoKTtcbiAgfVxuXG4gIHBhcnNlRGF0YVVybChyYXdVcmwpIHtcbiAgICB2YXIgcGFyc2VkVXJsID0gJyc7XG4gICAgaWYgKHJhd1VybC5pbmRleE9mKCc/JykgPT0gLTEpIHtcbiAgICAgIHBhcnNlZFVybCA9IHJhd1VybCArICc/JztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHJhd1VybDtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFyc2VkVXJsO1xuICB9XG5cbiAgc2V0VXJsKHVybCkge1xuICAgIHRoaXMudXJsID0gdXJsO1xuICB9XG5cbiAgZ2V0VXJsKCkge1xuICAgIHJldHVybiB0aGlzLnVybDtcbiAgfVxuXG4gIGdldEJhc2VVcmwoKSB7XG4gICAgcmV0dXJuIHRoaXMuYmFzZVVybDtcbiAgfVxuXG4gIGZldGNoRGF0YSgpIHtcbiAgICBTZWFyY2hVdGlscy5zZWFyY2goXG4gICAgICB0aGlzLnVybCArIGBwYWdlPSR7dGhpcy5jdXJyZW50UGFnZX1gLFxuICAgICAgdGhpcy5zZXREYXRhLmJpbmQodGhpcylcbiAgICApO1xuICB9XG5cbiAgc2V0RGF0YShyZXNwb25zZSkge1xuICAgIHRoaXMucm93cyA9IHJlc3BvbnNlLnJlc3VsdHM7XG4gICAgdGhpcy5jdXJyZW50UGFnZSA9IHJlc3BvbnNlLmN1cnJlbnRfcGFnZTtcbiAgICB0aGlzLnRvdGFsUGFnZXMgPSByZXNwb25zZS50b3RhbF9wYWdlcztcbiAgICB0aGlzLmVtaXRDaGFuZ2UoKTtcbiAgfVxuXG4gIHBhcnNlUmF3Q29sdW1uSGVhZGluZ0xpc3QocmF3Q29sdW1uSGVhZGluZ0xpc3QpIHtcbiAgICB2YXIgcmF3Q29sdW1uSGVhZGluZ0xpc3QsXG4gICAgICAgIHJhd0NvbHVtbixcbiAgICAgICAgcGFyc2VkQ29sdW1uTGlzdCA9IHt9O1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByYXdDb2x1bW5IZWFkaW5nTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgcmF3Q29sdW1uID0gcmF3Q29sdW1uSGVhZGluZ0xpc3RbaV07XG4gICAgICBwYXJzZWRDb2x1bW5MaXN0W3Jhd0NvbHVtbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtZmllbGQnKV0gPSB7XG4gICAgICAgIGhlYWRpbmc6IHJhd0NvbHVtbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtaGVhZGluZycpXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gcGFyc2VkQ29sdW1uTGlzdDtcbiAgfVxuXG4gIGdldENvbHVtbkhlYWRpbmdzKCkge1xuICAgIHJldHVybiB0aGlzLmNvbHVtbkhlYWRpbmdzO1xuICB9XG5cbiAgZ2V0Um93cygpIHtcbiAgICByZXR1cm4gdGhpcy5yb3dzO1xuICB9XG5cbiAgZ2V0Q3VycmVudFBhZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFBhZ2U7XG4gIH1cblxuICBnZXRUb3RhbFBhZ2VzKCkge1xuICAgIHJldHVybiB0aGlzLnRvdGFsUGFnZXM7XG4gIH1cblxuICBzZXRDdXJyZW50UGFnZShwYWdlKSB7XG4gICAgdGhpcy5jdXJyZW50UGFnZSA9IHBhZ2U7XG4gIH1cblxuICBlbWl0Q2hhbmdlKCkge1xuICAgIHRoaXMuZXZlbnRFbWl0dGVyLmVtaXQodGhpcy5DSEFOR0VfRVZFTlQpO1xuICB9XG5cbiAgYWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLmV2ZW50RW1pdHRlci5vbih0aGlzLkNIQU5HRV9FVkVOVCwgY2FsbGJhY2spO1xuICB9XG5cbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLmV2ZW50RW1pdHRlci5yZW1vdmVMaXN0ZW5lcih0aGlzLkNIQU5HRV9FVkVOVCwgY2FsbGJhY2spO1xuICB9XG59XG4iLCJ2YXIgU2hhcmVkVXRpbHMgPSByZXF1aXJlKCcuL1NoYXJlZFV0aWxzJyk7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZWFyY2godXJsLCBzdWNjZXNzKSB7XG4gIFNoYXJlZFV0aWxzLmFqYXhHZXQodXJsLCAnanNvbicsIHN1Y2Nlc3MpO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIGFqYXhHZXQ6IGZ1bmN0aW9uKHVybCwgdHlwZSwgc3VjY2VzcywgZXJyb3IpIHtcbiAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gICAgeGhyLnJlc3BvbnNlVHlwZSA9IHR5cGU7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQWNjZXB0XCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIlgtUmVxdWVzdGVkLVdpdGhcIiwgXCJYTUxIdHRwUmVxdWVzdFwiKTtcbiAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc3RhdHVzID0geGhyLnN0YXR1cztcbiAgICAgIHZhciByZXNwb25zZSA9IHhoci5yZXNwb25zZTtcbiAgICAgIGlmIChzdGF0dXMgPT09IDIwMCkge1xuICAgICAgICByZXR1cm4gc3VjY2VzcyhyZXNwb25zZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZXJyb3IocmVzcG9uc2UpO1xuICAgICAgfVxuICAgIH07XG4gICAgeGhyLnNlbmQoKTtcbiAgfSxcbiAgc2VyaWFsaXplOiBmdW5jdGlvbihvYmosIHByZWZpeCkge1xuICAgIHZhciBzdHIgPSBbXTtcbiAgICBmb3IodmFyIHAgaW4gb2JqKSB7XG4gICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KHApKSB7XG4gICAgICAgIHZhciBrID0gcHJlZml4ID8gcHJlZml4ICsgXCJbXCIgKyBwICsgXCJdXCIgOiBwLCB2ID0gb2JqW3BdO1xuICAgICAgICBzdHIucHVzaCh0eXBlb2YgdiA9PSBcIm9iamVjdFwiID9cbiAgICAgICAgICB0aGlzLnNlcmlhbGl6ZSh2LCBrKSA6XG4gICAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KGspICsgXCI9XCIgKyBlbmNvZGVVUklDb21wb25lbnQodikpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3RyLmpvaW4oXCImXCIpO1xuICB9XG59O1xuIl19

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
      searchString = "?",
      filterbar,
      table,
      page,
      filters,
      a;

  for (var i = 0; i < filterableTables.length; i++) {
    filterableTableNode = filterableTables[i];
    filterBarConfiguration = filterableTableNode.querySelector("dl.filterBarConfiguration");
    tableConfiguration = filterableTableNode.querySelector("dl.tableConfiguration");
    filterableTableId = filterableTableNode.getAttribute("id");

    filterbar = SharedUtils.parseFilterBarConfiguration(filterBarConfiguration, filterableTableId);
    table = SharedUtils.parseTableConfiguration(tableConfiguration, filterableTableId);

    //if (searchObject.hasOwnProperty(filterableTableId)) {
    //      a = JSON.parse(searchObject[filterableTableId]);
    //} else {
    //  a = {};
    //}

    //    if (a.hasOwnProperty('page')) {
    //      table.page = a.page;
    //    }
    //
    //    if (a.hasOwnProperty('filters')) {
    //      if (a.filters != '') {
    //        for (var filter of JSON.parse(a.filters)) {
    //          filterbar.filters[filter.uid].enabled = true;
    //          filterbar.filters[filter.uid].value = filter.value;
    //        }
    //      }
    //    }

    React.render(React.createElement(FilterableTable, {
      filterableTableId: filterableTableId,
      filterbar: filterbar,
      table: table
    }), filterableTableNode);
  }
});

},{"./components/FilterableTable.react":14,"./utils/SharedUtils":20}],2:[function(require,module,exports){
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
        var id = this.filterBarStore.getId();
        var searchUrl = this.filterBarStore.getSearchUrl();
        var queryObject = this.filterBarStore.getQuery();
        var newUrl = searchUrl + "?q=" + queryObject + "&";

        SharedUtils.updateUrl(id, "filters", queryObject);

        this.tableStore.setUrl(newUrl);
        this.tableStore.setCurrentPage(1);
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
        console.log(savedFiltersPacket);
        this.applyFilters();
      }
    }
  });

  return FilterBarActor;
})();

},{"../utils/SharedUtils":20}],3:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var SharedUtils = _interopRequireWildcard(require("../utils/SharedUtils"));

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
        var id = this.tableStore.getId();
        var currentUrl = this.tableStore.getUrl();
        var newUrl = currentUrl + "page=" + page + "&";

        SharedUtils.updateUrl(id, "page", page);

        this.tableStore.setCurrentPage(page);
        this.tableStore.fetchData();
      }
    }
  });

  return TableActor;
})();

},{"../utils/SharedUtils":20}],4:[function(require,module,exports){
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
    this.props.filterBarActor.applyFilters();

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
  function FilterBarStore(configuration) {
    _classCallCheck(this, FilterBarStore);

    this.CHANGE_EVENT = "change";
    this.eventEmitter = new EventEmitter();

    this.id = configuration.id;
    this.url = configuration.searchUrl;
    this.searchUrl = configuration.searchUrl;
    this.saveSearchUrl = configuration.saveSearchUrl;
    this.savedSearchUrl = configuration.savedSearchUrl;
    this.exportResultsUrl = configuration.exportResultsUrl;
    this.filters = configuration.filters;
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
  function TableStore(configuration) {
    _classCallCheck(this, TableStore);

    this.CHANGE_EVENT = "change";
    this.eventEmitter = new EventEmitter();

    this.id = configuration.id;
    this.rows = [];
    this.currentPage = configuration.page || 1;
    this.totalPages = 1;

    this.columnHeadings = configuration.columns;
    this.url = configuration.dataUrl + "?";
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

var ajaxGet = require("./SharedUtils").ajaxGet;

function search(url, success) {
  ajaxGet(url, "json", success);
}

},{"./SharedUtils":20}],20:[function(require,module,exports){
"use strict";

exports.serialize = serialize;
exports.ajaxGet = ajaxGet;
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

function updateUrl(id, propKey, propValue) {
  var searchObject = parseUrlSearchString(),
      queryObject = {};

  if (searchObject.hasOwnProperty(id)) {
    queryObject = JSON.parse(searchObject[id]);
  }

  queryObject[propKey] = propValue;
  searchObject[id] = JSON.stringify(queryObject);

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
      value: "",
      enabled: false
    };
  }

  parsedFilterBarConfiguration.id = id;
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
      heading: rawColumn.getAttribute("data-heading")
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvamFjb2JiMS9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2FwcC5qcyIsIi9Vc2Vycy9qYWNvYmIxL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvYWN0b3JzL0ZpbHRlckJhckFjdG9yLmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9hY3RvcnMvVGFibGVBY3Rvci5qcyIsIi9Vc2Vycy9qYWNvYmIxL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvY29tcG9uZW50cy9GaWx0ZXJCYXIvQXBwbHlGaWx0ZXJzQnV0dG9uLnJlYWN0LmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9jb21wb25lbnRzL0ZpbHRlckJhci9DbGVhckZpbHRlcnNCdXR0b24ucmVhY3QuanMiLCIvVXNlcnMvamFjb2JiMS9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2NvbXBvbmVudHMvRmlsdGVyQmFyL0ZpbHRlckJhci5yZWFjdC5qcyIsIi9Vc2Vycy9qYWNvYmIxL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvY29tcG9uZW50cy9GaWx0ZXJCYXIvRmlsdGVyRGlzcGxheS9GaWx0ZXJEaXNwbGF5LnJlYWN0LmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9jb21wb25lbnRzL0ZpbHRlckJhci9GaWx0ZXJEaXNwbGF5L0ZpbHRlcklucHV0LnJlYWN0LmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9jb21wb25lbnRzL0ZpbHRlckJhci9GaWx0ZXJEaXNwbGF5L0lucHV0cy9UZXh0SW5wdXQucmVhY3QuanMiLCIvVXNlcnMvamFjb2JiMS9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2NvbXBvbmVudHMvRmlsdGVyQmFyL0ZpbHRlckxpc3QvRmlsdGVyTGlzdC5yZWFjdC5qcyIsIi9Vc2Vycy9qYWNvYmIxL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvY29tcG9uZW50cy9GaWx0ZXJCYXIvRmlsdGVyTGlzdC9GaWx0ZXJMaXN0T3B0aW9uLnJlYWN0LmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9jb21wb25lbnRzL0ZpbHRlckJhci9Mb2FkRmlsdGVyc0xpc3QvTG9hZEZpbHRlcnNMaXN0LnJlYWN0LmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9jb21wb25lbnRzL0ZpbHRlckJhci9TYXZlRmlsdGVyc0J1dHRvbi5yZWFjdC5qcyIsIi9Vc2Vycy9qYWNvYmIxL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvY29tcG9uZW50cy9GaWx0ZXJhYmxlVGFibGUucmVhY3QuanMiLCIvVXNlcnMvamFjb2JiMS9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2NvbXBvbmVudHMvVGFibGUvVGFibGUucmVhY3QuanMiLCIvVXNlcnMvamFjb2JiMS9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2NvbXBvbmVudHMvVGFibGUvVGFibGVIZWFkaW5nQ2VsbC5yZWFjdC5qcyIsIi9Vc2Vycy9qYWNvYmIxL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvc3RvcmVzL0ZpbHRlckJhclN0b3JlLmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9zdG9yZXMvVGFibGVTdG9yZS5qcyIsIi9Vc2Vycy9qYWNvYmIxL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvdXRpbHMvU2VhcmNoVXRpbHMuanMiLCIvVXNlcnMvamFjb2JiMS9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL3V0aWxzL1NoYXJlZFV0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7OztJQ0FRLGVBQWUsV0FBTyxvQ0FBb0MsRUFBMUQsZUFBZTs7SUFFWCxXQUFXLG1DQUFNLHFCQUFxQjs7QUFFbEQsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLFlBQVU7QUFDdEQsTUFBSSxZQUFZLEdBQUcsV0FBVyxDQUFDLG9CQUFvQixFQUFFO01BQ2pELGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyx3QkFBd0IsQ0FBQztNQUM1RSxtQkFBbUI7TUFDbkIsc0JBQXNCO01BQ3RCLGtCQUFrQjtNQUNsQixpQkFBaUI7TUFDakIsWUFBWSxHQUFHLEdBQUc7TUFDbEIsU0FBUztNQUNULEtBQUs7TUFDTCxJQUFJO01BQ0osT0FBTztNQUNQLENBQUMsQ0FBQzs7QUFFTixPQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2hELHVCQUFtQixHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFDLDBCQUFzQixHQUFHLG1CQUFtQixDQUFDLGFBQWEsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQ3hGLHNCQUFrQixHQUFHLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQ2hGLHFCQUFpQixHQUFHLG1CQUFtQixDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFM0QsYUFBUyxHQUFHLFdBQVcsQ0FBQywyQkFBMkIsQ0FBQyxzQkFBc0IsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0FBQy9GLFNBQUssR0FBRyxXQUFXLENBQUMsdUJBQXVCLENBQUMsa0JBQWtCLEVBQUUsaUJBQWlCLENBQUMs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LEdBQUcsR0FBRyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUNqRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ2Q7O0FBRUQsV0FBTyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUM7R0FDaEUsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7Q0FDbkIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IHtGaWx0ZXJhYmxlVGFibGV9IGZyb20gJy4vY29tcG9uZW50cy9GaWx0ZXJhYmxlVGFibGUucmVhY3QnO1xuXG5pbXBvcnQgKiBhcyBTaGFyZWRVdGlscyBmcm9tICcuL3V0aWxzL1NoYXJlZFV0aWxzJztcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCl7XG4gIHZhciBzZWFyY2hPYmplY3QgPSBTaGFyZWRVdGlscy5wYXJzZVVybFNlYXJjaFN0cmluZygpLFxuICAgICAgZmlsdGVyYWJsZVRhYmxlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3JlYWN0LWZpbHRlcmFibGUtdGFibGUnKSxcbiAgICAgIGZpbHRlcmFibGVUYWJsZU5vZGUsXG4gICAgICBmaWx0ZXJCYXJDb25maWd1cmF0aW9uLFxuICAgICAgdGFibGVDb25maWd1cmF0aW9uLFxuICAgICAgZmlsdGVyYWJsZVRhYmxlSWQsXG4gICAgICBzZWFyY2hTdHJpbmcgPSAnPycsXG4gICAgICBmaWx0ZXJiYXIsXG4gICAgICB0YWJsZSxcbiAgICAgIHBhZ2UsXG4gICAgICBmaWx0ZXJzLFxuICAgICAgYTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbHRlcmFibGVUYWJsZXMubGVuZ3RoOyBpKyspIHtcbiAgICBmaWx0ZXJhYmxlVGFibGVOb2RlID0gZmlsdGVyYWJsZVRhYmxlc1tpXTtcbiAgICBmaWx0ZXJCYXJDb25maWd1cmF0aW9uID0gZmlsdGVyYWJsZVRhYmxlTm9kZS5xdWVyeVNlbGVjdG9yKCdkbC5maWx0ZXJCYXJDb25maWd1cmF0aW9uJyk7XG4gICAgdGFibGVDb25maWd1cmF0aW9uID0gZmlsdGVyYWJsZVRhYmxlTm9kZS5xdWVyeVNlbGVjdG9yKCdkbC50YWJsZUNvbmZpZ3VyYXRpb24nKTtcbiAgICBmaWx0ZXJhYmxlVGFibGVJZCA9IGZpbHRlcmFibGVUYWJsZU5vZGUuZ2V0QXR0cmlidXRlKCdpZCcpO1xuXG4gICAgZmlsdGVyYmFyID0gU2hhcmVkVXRpbHMucGFyc2VGaWx0ZXJCYXJDb25maWd1cmF0aW9uKGZpbHRlckJhckNvbmZpZ3VyYXRpb24sIGZpbHRlcmFibGVUYWJsZUlkKTtcbiAgICB0YWJsZSA9IFNoYXJlZFV0aWxzLnBhcnNlVGFibGVDb25maWd1cmF0aW9uKHRhYmxlQ29uZmlndXJhdGlvbiwgZmlsdGVyYWJsZVRhYmxlSWQpO1xuXG4gICAgLy9pZiAoc2VhcmNoT2JqZWN0Lmhhc093blByb3BlcnR5KGZpbHRlcmFibGVUYWJsZUlkKSkge1xuLy8gICAgICBhID0gSlNPTi5wYXJzZShzZWFyY2hPYmplY3RbZmlsdGVyYWJsZVRhYmxlSWRdKTtcbiAgICAvL30gZWxzZSB7XG4gICAgLy8gIGEgPSB7fTtcbiAgICAvL31cblxuLy8gICAgaWYgKGEuaGFzT3duUHJvcGVydHkoJ3BhZ2UnKSkge1xuLy8gICAgICB0YWJsZS5wYWdlID0gYS5wYWdlO1xuLy8gICAgfVxuLy9cbi8vICAgIGlmIChhLmhhc093blByb3BlcnR5KCdmaWx0ZXJzJykpIHtcbi8vICAgICAgaWYgKGEuZmlsdGVycyAhPSAnJykge1xuLy8gICAgICAgIGZvciAodmFyIGZpbHRlciBvZiBKU09OLnBhcnNlKGEuZmlsdGVycykpIHtcbi8vICAgICAgICAgIGZpbHRlcmJhci5maWx0ZXJzW2ZpbHRlci51aWRdLmVuYWJsZWQgPSB0cnVlO1xuLy8gICAgICAgICAgZmlsdGVyYmFyLmZpbHRlcnNbZmlsdGVyLnVpZF0udmFsdWUgPSBmaWx0ZXIudmFsdWU7XG4vLyAgICAgICAgfVxuLy8gICAgICB9XG4vLyAgICB9XG5cblxuICAgIFJlYWN0LnJlbmRlcihcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgIEZpbHRlcmFibGVUYWJsZSxcbiAgICAgICAge1xuICAgICAgICAgIGZpbHRlcmFibGVUYWJsZUlkOiBmaWx0ZXJhYmxlVGFibGVJZCxcbiAgICAgICAgICBmaWx0ZXJiYXI6IGZpbHRlcmJhcixcbiAgICAgICAgICB0YWJsZTogdGFibGVcbiAgICAgICAgfVxuICAgICAgKSxcbiAgICAgIGZpbHRlcmFibGVUYWJsZU5vZGVcbiAgICApO1xuICB9XG59KTtcbiIsImltcG9ydCAqIGFzIFNoYXJlZFV0aWxzIGZyb20gJy4uL3V0aWxzL1NoYXJlZFV0aWxzJztcblxuZXhwb3J0IGNsYXNzIEZpbHRlckJhckFjdG9yIHtcbiAgY29uc3RydWN0b3IoZmlsdGVyQmFyU3RvcmUsIHRhYmxlU3RvcmUpIHtcbiAgICB0aGlzLmZpbHRlckJhclN0b3JlID0gZmlsdGVyQmFyU3RvcmU7XG4gICAgdGhpcy50YWJsZVN0b3JlID0gdGFibGVTdG9yZTtcbiAgfVxuXG4gIGdldEZpbHRlcihmaWx0ZXJVaWQpIHtcbiAgICByZXR1cm4gdGhpcy5maWx0ZXJCYXJTdG9yZS5nZXRGaWx0ZXIoZmlsdGVyVWlkKVxuICB9XG5cbiAgZW5hYmxlRmlsdGVyKGZpbHRlclVpZCkge1xuICAgIHRoaXMuZmlsdGVyQmFyU3RvcmUuZW5hYmxlRmlsdGVyKGZpbHRlclVpZCk7XG4gIH1cblxuICBkaXNhYmxlRmlsdGVyKGZpbHRlclVpZCkge1xuICAgIHRoaXMuZmlsdGVyQmFyU3RvcmUuZGlzYWJsZUZpbHRlcihmaWx0ZXJVaWQpO1xuICB9XG5cbiAgZGlzYWJsZUFsbEZpbHRlcnMoKSB7XG4gICAgdGhpcy5maWx0ZXJCYXJTdG9yZS5kaXNhYmxlQWxsRmlsdGVycygpO1xuICAgIHRoaXMuYXBwbHlGaWx0ZXJzKCk7XG4gIH1cblxuICB1cGRhdGVGaWx0ZXIoZmlsdGVyVWlkLCB2YWx1ZSkge1xuICAgIHRoaXMuZmlsdGVyQmFyU3RvcmUudXBkYXRlRmlsdGVyKGZpbHRlclVpZCwgdmFsdWUpXG4gIH1cblxuICBnZXRFbmFibGVkKCkge1xuICAgIHJldHVybiB0aGlzLmZpbHRlckJhclN0b3JlLmdldEVuYWJsZWQoKTtcbiAgfVxuXG4gIGdldERpc2FibGVkKCkge1xuICAgIHJldHVybiB0aGlzLmZpbHRlckJhclN0b3JlLmdldERpc2FibGVkKCk7XG4gIH1cblxuICBhcHBseUZpbHRlcnMoKSB7XG4gICAgdmFyIGlkID0gdGhpcy5maWx0ZXJCYXJTdG9yZS5nZXRJZCgpO1xuICAgIHZhciBzZWFyY2hVcmwgPSB0aGlzLmZpbHRlckJhclN0b3JlLmdldFNlYXJjaFVybCgpO1xuICAgIHZhciBxdWVyeU9iamVjdCA9IHRoaXMuZmlsdGVyQmFyU3RvcmUuZ2V0UXVlcnkoKTtcbiAgICB2YXIgbmV3VXJsID0gc2VhcmNoVXJsICsgXCI/cT1cIiArIHF1ZXJ5T2JqZWN0ICsgJyYnO1xuXG4gICAgU2hhcmVkVXRpbHMudXBkYXRlVXJsKGlkLCAnZmlsdGVycycsIHF1ZXJ5T2JqZWN0KTtcblxuICAgIHRoaXMudGFibGVTdG9yZS5zZXRVcmwobmV3VXJsKTtcbiAgICB0aGlzLnRhYmxlU3RvcmUuc2V0Q3VycmVudFBhZ2UoMSk7XG4gICAgdGhpcy50YWJsZVN0b3JlLmZldGNoRGF0YSgpO1xuICB9XG5cbiAgc2F2ZUZpbHRlcnMobmFtZSkge1xuICAgIHZhciBlbmFibGVkRmlsdGVycyA9IHRoaXMuZmlsdGVyQmFyU3RvcmUuZ2V0RW5hYmxlZCgpLFxuICAgICAgICBzYXZlZEZpbHRlcnNQYWNrZXQgPSB7fTtcbiAgICBzYXZlZEZpbHRlcnNQYWNrZXQuc2VhcmNoX3RpdGxlID0gbmFtZTtcbiAgICBzYXZlZEZpbHRlcnNQYWNrZXQuZmlsdGVycyA9IHt9XG4gICAgZm9yICh2YXIgZmlsdGVyVWlkIGluIGVuYWJsZWRGaWx0ZXJzKSB7XG4gICAgICBzYXZlZEZpbHRlcnNQYWNrZXQuZmlsdGVyc1tmaWx0ZXJVaWRdID0gZW5hYmxlZEZpbHRlcnNbZmlsdGVyVWlkXS52YWx1ZTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coc2F2ZWRGaWx0ZXJzUGFja2V0KTtcbiAgICB0aGlzLmFwcGx5RmlsdGVycygpO1xuICB9XG59IiwiaW1wb3J0ICogYXMgU2hhcmVkVXRpbHMgZnJvbSAnLi4vdXRpbHMvU2hhcmVkVXRpbHMnO1xuXG5leHBvcnQgY2xhc3MgVGFibGVBY3RvciB7XG4gIGNvbnN0cnVjdG9yKHRhYmxlU3RvcmUpIHtcbiAgICB0aGlzLnRhYmxlU3RvcmUgPSB0YWJsZVN0b3JlO1xuICB9XG5cbiAgZ2V0Q29sdW1uSGVhZGluZ3MoKSB7XG4gICAgcmV0dXJuIHRoaXMudGFibGVTdG9yZS5nZXRDb2x1bW5IZWFkaW5ncygpO1xuICB9XG5cbiAgZ2V0Um93cygpIHtcbiAgICByZXR1cm4gdGhpcy50YWJsZVN0b3JlLmdldFJvd3MoKTtcbiAgfVxuXG4gIGdldEN1cnJlbnRQYWdlKCkge1xuICAgIHJldHVybiB0aGlzLnRhYmxlU3RvcmUuZ2V0Q3VycmVudFBhZ2UoKTtcbiAgfVxuXG4gIGdldFRvdGFsUGFnZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMudGFibGVTdG9yZS5nZXRUb3RhbFBhZ2VzKCk7XG4gIH1cblxuICBmZXRjaFBhZ2VkRGF0YShwYWdlKSB7XG4gICAgdmFyIGlkID0gdGhpcy50YWJsZVN0b3JlLmdldElkKCk7XG4gICAgdmFyIGN1cnJlbnRVcmwgPSB0aGlzLnRhYmxlU3RvcmUuZ2V0VXJsKCk7XG4gICAgdmFyIG5ld1VybCA9IGN1cnJlbnRVcmwgKyAncGFnZT0nICsgcGFnZSArICcmJztcblxuICAgIFNoYXJlZFV0aWxzLnVwZGF0ZVVybChpZCwgJ3BhZ2UnLCBwYWdlKTtcblxuICAgIHRoaXMudGFibGVTdG9yZS5zZXRDdXJyZW50UGFnZShwYWdlKTtcbiAgICB0aGlzLnRhYmxlU3RvcmUuZmV0Y2hEYXRhKCk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBBcHBseUZpbHRlcnNCdXR0b24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgfVxuXG4gIF9vbkNsaWNrKCkge1xuICAgIHRoaXMucHJvcHMuZmlsdGVyQmFyQWN0b3IuYXBwbHlGaWx0ZXJzKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCIgb25DbGljaz17dGhpcy5fb25DbGljay5iaW5kKHRoaXMpfT5cbiAgICAgICAgPGkgY2xhc3NOYW1lPVwiaWNvbiBpY29uLXRpY2tcIiAvPlxuICAgICAgICBBcHBseVxuICAgICAgPC9idXR0b24+XG4gICAgKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIENsZWFyRmlsdGVyc0J1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICB9XG5cbiAgX29uQ2xpY2soKSB7XG4gICAgdGhpcy5wcm9wcy5maWx0ZXJCYXJBY3Rvci5kaXNhYmxlQWxsRmlsdGVycygpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4td2FybmluZ1wiIG9uQ2xpY2s9e3RoaXMuX29uQ2xpY2suYmluZCh0aGlzKX0+XG4gICAgICAgIDxpIGNsYXNzTmFtZT1cImljb24gaWNvbi1kZWxldGVcIiAvPlxuICAgICAgICBDbGVhclxuICAgICAgPC9idXR0b24+XG4gICAgKTtcbiAgfVxufVxuIiwiaW1wb3J0IHtGaWx0ZXJMaXN0fSBmcm9tICcuL0ZpbHRlckxpc3QvRmlsdGVyTGlzdC5yZWFjdCc7XG5pbXBvcnQge0ZpbHRlckRpc3BsYXl9IGZyb20gJy4vRmlsdGVyRGlzcGxheS9GaWx0ZXJEaXNwbGF5LnJlYWN0JztcbmltcG9ydCB7QXBwbHlGaWx0ZXJzQnV0dG9ufSBmcm9tICcuL0FwcGx5RmlsdGVyc0J1dHRvbi5yZWFjdCc7XG5pbXBvcnQge0NsZWFyRmlsdGVyc0J1dHRvbn0gZnJvbSAnLi9DbGVhckZpbHRlcnNCdXR0b24ucmVhY3QnO1xuaW1wb3J0IHtTYXZlRmlsdGVyc0J1dHRvbn0gZnJvbSAnLi9TYXZlRmlsdGVyc0J1dHRvbi5yZWFjdCc7XG5pbXBvcnQge0xvYWRGaWx0ZXJzTGlzdH0gZnJvbSAnLi9Mb2FkRmlsdGVyc0xpc3QvTG9hZEZpbHRlcnNMaXN0LnJlYWN0JztcblxuZXhwb3J0IGNsYXNzIEZpbHRlckJhciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMucHJvcHMuZmlsdGVyQmFyQWN0b3IuYXBwbHlGaWx0ZXJzKCk7XG5cbiAgICB0aGlzLmZpbHRlckJhckFjdG9yID0gcHJvcHMuZmlsdGVyQmFyQWN0b3I7XG4gICAgdGhpcy5maWx0ZXJCYXJTdG9yZSA9IHByb3BzLmZpbHRlckJhclN0b3JlO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8ZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIG1hcmdpbi1ib3R0b20tc21cIj5cbiAgICAgICAgICAgIDxGaWx0ZXJMaXN0XG4gICAgICAgICAgICAgIGZpbHRlckJhckFjdG9yPXt0aGlzLmZpbHRlckJhckFjdG9yfVxuICAgICAgICAgICAgICBmaWx0ZXJCYXJTdG9yZT17dGhpcy5maWx0ZXJCYXJTdG9yZX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgZGlzYWJsZWRcIj48aSBjbGFzc05hbWU9XCJpY29uIGljb24tZG93bmxvYWRcIj48L2k+RXhwb3J0IENTVjwvYnV0dG9uPlxuICAgICAgICAgICAgPEFwcGx5RmlsdGVyc0J1dHRvblxuICAgICAgICAgICAgICBmaWx0ZXJCYXJBY3Rvcj17dGhpcy5maWx0ZXJCYXJBY3Rvcn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8Q2xlYXJGaWx0ZXJzQnV0dG9uXG4gICAgICAgICAgICAgIGZpbHRlckJhckFjdG9yPXt0aGlzLmZpbHRlckJhckFjdG9yfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxTYXZlRmlsdGVyc0J1dHRvblxuICAgICAgICAgICAgICBmaWx0ZXJCYXJBY3Rvcj17dGhpcy5maWx0ZXJCYXJBY3Rvcn1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8TG9hZEZpbHRlcnNMaXN0XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxGaWx0ZXJEaXNwbGF5XG4gICAgICAgICAgICBmaWx0ZXJCYXJBY3Rvcj17dGhpcy5maWx0ZXJCYXJBY3Rvcn1cbiAgICAgICAgICAgIGZpbHRlckJhclN0b3JlPXt0aGlzLmZpbHRlckJhclN0b3JlfVxuICAgICAgICAgIC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuIiwiaW1wb3J0IHtGaWx0ZXJJbnB1dH0gZnJvbSAnLi9GaWx0ZXJJbnB1dC5yZWFjdCc7XG5cbmV4cG9ydCBjbGFzcyBGaWx0ZXJEaXNwbGF5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5maWx0ZXJCYXJBY3RvciA9IHByb3BzLmZpbHRlckJhckFjdG9yO1xuICAgIHRoaXMuZmlsdGVyQmFyU3RvcmUgPSBwcm9wcy5maWx0ZXJCYXJTdG9yZTtcbiAgICB0aGlzLnN0YXRlID0gdGhpcy5nZXRTdGF0ZUZyb21TdG9yZXMoKTtcblxuICAgIHRoaXMuZmlsdGVyQmFyU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UuYmluZCh0aGlzKSk7XG4gIH1cblxuICBfb25DaGFuZ2UoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldFN0YXRlRnJvbVN0b3JlcygpKTtcbiAgfVxuXG4gIGdldFN0YXRlRnJvbVN0b3JlcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZmlsdGVyczogdGhpcy5maWx0ZXJCYXJBY3Rvci5nZXRFbmFibGVkKClcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdmFyIGZpbHRlcnMgPSBPYmplY3Qua2V5cyh0aGlzLnN0YXRlLmZpbHRlcnMpLm1hcChmdW5jdGlvbihmaWx0ZXJVaWQpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxGaWx0ZXJJbnB1dFxuICAgICAgICAgIGtleT17ZmlsdGVyVWlkfVxuICAgICAgICAgIGZpbHRlclVpZD17ZmlsdGVyVWlkfVxuICAgICAgICAgIGZpbHRlcj17dGhpcy5zdGF0ZS5maWx0ZXJzW2ZpbHRlclVpZF19XG4gICAgICAgICAgZmlsdGVyQmFyQWN0b3I9e3RoaXMuZmlsdGVyQmFyQWN0b3J9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0sdGhpcyk7XG5cbiAgICBpZiAoZmlsdGVycy5sZW5ndGggPT09IDApIHtcbiAgICAgIGZpbHRlcnMgPSAoPGRpdj5ObyBGaWx0ZXJzIEVuYWJsZWQhPC9kaXY+KTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9J25hdmJhciBmaWx0ZXJiYXInPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ncGFuZWwgcGFuZWwtZGVmYXVsdCc+XG4gICAgICAgICAge2ZpbHRlcnN9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuIiwiaW1wb3J0IHtUZXh0SW5wdXR9IGZyb20gJy4vSW5wdXRzL1RleHRJbnB1dC5yZWFjdCc7XG5cbmV4cG9ydCBjbGFzcyBGaWx0ZXJJbnB1dCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5maWx0ZXJCYXJBY3RvciA9IHByb3BzLmZpbHRlckJhckFjdG9yO1xuICAgIHRoaXMuZmlsdGVyVWlkID0gcHJvcHMuZmlsdGVyVWlkO1xuICAgIHRoaXMuZmlsdGVyS2V5ID0gcHJvcHMuZmlsdGVyS2V5O1xuICB9XG5cbiAgX29uQ2xpY2soKSB7XG4gICAgdGhpcy5maWx0ZXJCYXJBY3Rvci5kaXNhYmxlRmlsdGVyKHRoaXMuZmlsdGVyVWlkKTtcbiAgfVxuXG4gIGlucHV0RmFjdG9yeSgpIHtcbiAgICAvKlxuICAgICAgaW5wdXRGYWN0b3J5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHR5cGUgPSB0aGlzLnByb3BzLmZpbHRlci50eXBlO1xuICAgICAgICBpZiAodHlwZSA9PSAndGV4dCcgfHwgdHlwZSA9PSAnaWQnKSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxUZXh0SW5wdXRcbiAgICAgICAgICAgICAgZmlsdGVyQmFySWQ9e3RoaXMucHJvcHMuZmlsdGVyQmFySWR9XG4gICAgICAgICAgICAgIGZpbHRlclVpZD17dGhpcy5wcm9wcy5maWx0ZXJVaWR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSAnZGF0ZScpIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPERhdGVJbnB1dFxuICAgICAgICAgICAgICBmaWx0ZXJCYXJJZD17dGhpcy5wcm9wcy5maWx0ZXJCYXJJZH1cbiAgICAgICAgICAgICAgZmlsdGVyVWlkPXt0aGlzLnByb3BzLmZpbHRlclVpZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09ICdzZWxlY3QnKSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxTZWxlY3RJbnB1dFxuICAgICAgICAgICAgICBmaWx0ZXJCYXJJZD17dGhpcy5wcm9wcy5maWx0ZXJCYXJJZH1cbiAgICAgICAgICAgICAgZmlsdGVyVWlkPXt0aGlzLnByb3BzLmZpbHRlclVpZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09ICdhZ2Vfc2VsZWN0Jykge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8QWdlU2VsZWN0SW5wdXRcbiAgICAgICAgICAgICAgZmlsdGVyQmFySWQ9e3RoaXMucHJvcHMuZmlsdGVyQmFySWR9XG4gICAgICAgICAgICAgIGZpbHRlclVpZD17dGhpcy5wcm9wcy5maWx0ZXJVaWR9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXQhXCIpO1xuICAgICAgICB9XG4gICAgKi9cbiAgICByZXR1cm4gKFxuICAgICAgPFRleHRJbnB1dFxuICAgICAgICBmaWx0ZXJCYXJBY3Rvcj17dGhpcy5maWx0ZXJCYXJBY3Rvcn1cbiAgICAgICAgZmlsdGVyVWlkPXt0aGlzLmZpbHRlclVpZH1cbiAgICAgIC8+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICB2YXIgaW5wdXRzID0gdGhpcy5pbnB1dEZhY3RvcnkoKTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctMyBjb2wtbWQtNCBjb2wtc20tNiBjb2wteHMtMTIgZmlsdGVyXCI+XG4gICAgICAgIDx1bCBjbGFzc05hbWU9e3RoaXMuZmlsdGVyS2V5fT5cbiAgICAgICAgICA8bGk+XG4gICAgICAgICAgICA8aSBvbkNsaWNrPXt0aGlzLl9vbkNsaWNrLmJpbmQodGhpcyl9IGNsYXNzTmFtZT1cImJ0biBidG4tY2lyY2xlLXByaW1hcnkgYnRuLXhzIGljb24gaWNvbi1jbG9zZSByZW1vdmUtZmlsdGVyXCIgLz5cbiAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAge3RoaXMucHJvcHMuZmlsdGVyLmxhYmVsfVxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICAgIHtpbnB1dHN9XG4gICAgICAgIDwvdWw+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgVGV4dElucHV0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5maWx0ZXJCYXJBY3RvciA9IHByb3BzLmZpbHRlckJhckFjdG9yO1xuICAgIHRoaXMuZmlsdGVyVWlkID0gcHJvcHMuZmlsdGVyVWlkO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHt2YWx1ZTogdGhpcy5maWx0ZXJCYXJBY3Rvci5nZXRGaWx0ZXIodGhpcy5maWx0ZXJVaWQpLnZhbHVlfTtcbiAgfVxuXG4gIF9vbkNoYW5nZShldmVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe3ZhbHVlOiBldmVudC50YXJnZXQudmFsdWV9KTtcbiAgICB0aGlzLmZpbHRlckJhckFjdG9yLnVwZGF0ZUZpbHRlcih0aGlzLmZpbHRlclVpZCwgZXZlbnQudGFyZ2V0LnZhbHVlKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGxpPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS52YWx1ZX1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5fb25DaGFuZ2UuYmluZCh0aGlzKX1cbiAgICAgICAgLz5cbiAgICAgIDwvbGk+XG4gICAgKTtcbiAgfVxufVxuIiwiaW1wb3J0IHtGaWx0ZXJMaXN0T3B0aW9ufSBmcm9tICcuL0ZpbHRlckxpc3RPcHRpb24ucmVhY3QnO1xuXG5leHBvcnQgY2xhc3MgRmlsdGVyTGlzdCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuZmlsdGVyQmFyQWN0b3IgPSBwcm9wcy5maWx0ZXJCYXJBY3RvcjtcbiAgICB0aGlzLmZpbHRlckJhclN0b3JlID0gcHJvcHMuZmlsdGVyQmFyU3RvcmU7XG5cbiAgICB0aGlzLmZpbHRlckJhclN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlLmJpbmQodGhpcykpO1xuICAgIHRoaXMuc3RhdGUgPSB0aGlzLmdldFN0YXRlRnJvbVN0b3JlcygpO1xuICB9XG5cbiAgX29uQ2hhbmdlKCkge1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5nZXRTdGF0ZUZyb21TdG9yZXMoKSk7XG4gIH1cblxuICBnZXRTdGF0ZUZyb21TdG9yZXMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbHRlcnM6IHRoaXMuZmlsdGVyQmFyQWN0b3IuZ2V0RGlzYWJsZWQoKVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICB2YXIgZmlsdGVyID0ge307XG4gICAgdmFyIG9wdGlvbktleSA9IFwiXCI7XG4gICAgdmFyIGZpbHRlck9wdGlvbnMgPSBPYmplY3Qua2V5cyh0aGlzLnN0YXRlLmZpbHRlcnMpLm1hcChmdW5jdGlvbihmaWx0ZXJVaWQpIHtcbiAgICAgIG9wdGlvbktleSA9IFwib3B0aW9uLVwiK2ZpbHRlclVpZDtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxGaWx0ZXJMaXN0T3B0aW9uXG4gICAgICAgICAga2V5PXtvcHRpb25LZXl9XG4gICAgICAgICAgZmlsdGVyVWlkPXtmaWx0ZXJVaWR9XG4gICAgICAgICAgZmlsdGVyQmFyQWN0b3I9e3RoaXMuZmlsdGVyQmFyQWN0b3J9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0sdGhpcyk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwXCI+XG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0IGRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiB0eXBlPVwiYnV0dG9uXCI+XG4gICAgICAgICAgPGkgY2xhc3NOYW1lPVwiaWNvbiBpY29uLWFkZFwiIC8+XG4gICAgICAgICAgQWRkIEZpbHRlclxuICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImljb24gaWNvbi1jaGV2cm9uLWRvd25cIiAvPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPHVsIGNsYXNzTmFtZT1cImRyb3Bkb3duLW1lbnVcIiByb2xlPVwibWVudVwiPlxuICAgICAgICAgIHtmaWx0ZXJPcHRpb25zfVxuICAgICAgICA8L3VsPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIEZpbHRlckxpc3RPcHRpb24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmZpbHRlckJhckFjdG9yID0gcHJvcHMuZmlsdGVyQmFyQWN0b3I7XG4gICAgdGhpcy5maWx0ZXJVaWQgPSBwcm9wcy5maWx0ZXJVaWQ7XG4gIH1cblxuICBfb25DbGljaygpIHtcbiAgICB0aGlzLmZpbHRlckJhckFjdG9yLmVuYWJsZUZpbHRlcih0aGlzLmZpbHRlclVpZCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxsaT5cbiAgICAgICAgPGEgb25DbGljaz17dGhpcy5fb25DbGljay5iaW5kKHRoaXMpfT5cbiAgICAgICAgICB7dGhpcy5maWx0ZXJCYXJBY3Rvci5nZXRGaWx0ZXIodGhpcy5maWx0ZXJVaWQpLmxhYmVsfVxuICAgICAgICA8L2E+XG4gICAgICA8L2xpPlxuICAgICk7XG4gIH1cbn0iLCJleHBvcnQgY2xhc3MgTG9hZEZpbHRlcnNMaXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gIH1cblxuICBnZXRTdGF0ZUZyb21TdG9yZXMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICB9O1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHZhciBsb2FkRmlsdGVyc0xpc3RJdGVtcyA9IFtdO1xuICAgIHZhciBidXR0b25DbGFzcyA9ICdidG4gYnRuLWRlZmF1bHQgZHJvcGRvd24tdG9nZ2xlJztcbiAgICBpZiAobG9hZEZpbHRlcnNMaXN0SXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICBidXR0b25DbGFzcyArPSAnIGRpc2FibGVkJ1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgbWFyZ2luLWJvdHRvbS1zbVwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cFwiPlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPXtidXR0b25DbGFzc30gZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIHR5cGU9XCJidXR0b25cIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj5cbiAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImljb24gaWNvbi1zYXZlXCIgLz5cbiAgICAgICAgICAgIFNhdmVkIFNlYXJjaGVzXG4gICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJpY29uIGljb24tY2hldnJvbi1kb3duXCIgLz5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwiZHJvcGRvd24tbWVudVwiIHJvbGU9XCJtZW51XCI+XG4gICAgICAgICAgICB7bG9hZEZpbHRlcnNMaXN0SXRlbXN9XG4gICAgICAgICAgPC91bD5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tZGFuZ2VyXCI+XG4gICAgICAgICAgPGkgY2xhc3NOYW1lPVwiaWNvbiBpY29uLWRlbGV0ZVwiIC8+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSIsImV4cG9ydCBjbGFzcyBTYXZlRmlsdGVyc0J1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuc3RhdGUgPSB7Y29uZmlndXJhdGlvbk5hbWU6ICcnfTtcbiAgfVxuXG4gIF9vbkNsaWNrKCkge1xuICAgIHRoaXMucHJvcHMuZmlsdGVyQmFyQWN0b3Iuc2F2ZUZpbHRlcnModGhpcy5zdGF0ZS5jb25maWd1cmF0aW9uTmFtZSk7XG4gIH1cblxuICBfb25DaGFuZ2UoZXZlbnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtjb25maWd1cmF0aW9uTmFtZTogZXZlbnQudGFyZ2V0LnZhbHVlfSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxSZWFjdEJvb3RzdHJhcC5Ecm9wZG93bkJ1dHRvbiB0aXRsZT1cIlNhdmUgU2VhcmNoXCIgdHlwZT1cImJ1dHRvblwiIGJzU3R5bGU9XCJkZWZhdWx0XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0IG1hcmdpbi1ib3R0b20tc21cIj5cbiAgICAgICAgPFJlYWN0Qm9vdHN0cmFwLk1lbnVJdGVtIGV2ZW50S2V5PVwiMVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgPGxhYmVsPlNlYXJjaCBUaXRsZTwvbGFiZWw+XG4gICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgdmFsdWU9e3RoaXMuc3RhdGUuY29uZmlndXJhdGlvbk5hbWV9IHR5cGU9XCJ0ZXh0XCIgb25DaGFuZ2U9e3RoaXMuX29uQ2hhbmdlLmJpbmQodGhpcyl9IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17dGhpcy5fb25DbGljay5iaW5kKHRoaXMpfT5TYXZlPC9idXR0b24+XG4gICAgICAgIDwvUmVhY3RCb290c3RyYXAuTWVudUl0ZW0+XG4gICAgICA8L1JlYWN0Qm9vdHN0cmFwLkRyb3Bkb3duQnV0dG9uPlxuICAgICk7XG4gIH1cbn1cbiIsImltcG9ydCB7RmlsdGVyQmFyQWN0b3J9IGZyb20gJy4uL2FjdG9ycy9GaWx0ZXJCYXJBY3Rvcic7XG5pbXBvcnQge1RhYmxlQWN0b3J9IGZyb20gJy4uL2FjdG9ycy9UYWJsZUFjdG9yJztcblxuaW1wb3J0IHtGaWx0ZXJCYXJTdG9yZX0gZnJvbSAnLi4vc3RvcmVzL0ZpbHRlckJhclN0b3JlJztcbmltcG9ydCB7VGFibGVTdG9yZX0gZnJvbSAnLi4vc3RvcmVzL1RhYmxlU3RvcmUnO1xuXG5pbXBvcnQge0ZpbHRlckJhcn0gZnJvbSAnLi9GaWx0ZXJCYXIvRmlsdGVyQmFyLnJlYWN0JztcbmltcG9ydCB7VGFibGV9ICBmcm9tICcuL1RhYmxlL1RhYmxlLnJlYWN0JztcblxuZXhwb3J0IGNsYXNzIEZpbHRlcmFibGVUYWJsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuaWQgPSBwcm9wcy5maWx0ZXJhYmxlVGFibGVJZDtcblxuICAgIHRoaXMuZmlsdGVyQmFyU3RvcmUgPSBuZXcgRmlsdGVyQmFyU3RvcmUocHJvcHMuZmlsdGVyYmFyKTtcbiAgICB0aGlzLnRhYmxlU3RvcmUgPSBuZXcgVGFibGVTdG9yZShwcm9wcy50YWJsZSk7XG5cbiAgICB0aGlzLnRhYmxlQWN0b3IgPSBuZXcgVGFibGVBY3Rvcih0aGlzLnRhYmxlU3RvcmUpO1xuICAgIHRoaXMuZmlsdGVyQmFyQWN0b3IgPSBuZXcgRmlsdGVyQmFyQWN0b3IodGhpcy5maWx0ZXJCYXJTdG9yZSwgdGhpcy50YWJsZVN0b3JlKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBrZXk9e3RoaXMuaWR9PlxuICAgICAgICA8RmlsdGVyQmFyXG4gICAgICAgICAgZmlsdGVyQmFyQWN0b3I9e3RoaXMuZmlsdGVyQmFyQWN0b3J9XG4gICAgICAgICAgZmlsdGVyQmFyU3RvcmU9e3RoaXMuZmlsdGVyQmFyU3RvcmV9XG4gICAgICAgIC8+XG4gICAgICAgIDxUYWJsZVxuICAgICAgICAgIHRhYmxlQWN0b3I9e3RoaXMudGFibGVBY3Rvcn1cbiAgICAgICAgICB0YWJsZVN0b3JlPXt0aGlzLnRhYmxlU3RvcmV9XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG4iLCJpbXBvcnQge1RhYmxlSGVhZGluZ0NlbGx9IGZyb20gJy4vVGFibGVIZWFkaW5nQ2VsbC5yZWFjdCc7XG5cbmV4cG9ydCBjbGFzcyBUYWJsZSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy50YWJsZUFjdG9yID0gcHJvcHMudGFibGVBY3RvcjtcbiAgICB0aGlzLnRhYmxlU3RvcmUgPSBwcm9wcy50YWJsZVN0b3JlO1xuXG4gICAgdGhpcy5zdGF0ZSA9IHRoaXMuZ2V0U3RhdGVGcm9tU3RvcmVzKCk7XG4gICAgdGhpcy50YWJsZVN0b3JlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMuX29uQ2hhbmdlLmJpbmQodGhpcykpO1xuICB9XG5cbiAgX29uQ2hhbmdlKCkge1xuICAgIHRoaXMuc2V0U3RhdGUodGhpcy5nZXRTdGF0ZUZyb21TdG9yZXMoKSk7XG4gIH1cblxuICBfb25DbGljayhldmVudCkge1xuICAgIHRoaXMudGFibGVBY3Rvci5mZXRjaFBhZ2VkRGF0YShldmVudC50YXJnZXQuaW5uZXJIVE1MKTtcbiAgfVxuXG4gIGdldFN0YXRlRnJvbVN0b3JlcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY29sdW1uSGVhZGluZ3M6IHRoaXMudGFibGVBY3Rvci5nZXRDb2x1bW5IZWFkaW5ncygpLFxuICAgICAgcm93czogdGhpcy50YWJsZUFjdG9yLmdldFJvd3MoKSxcbiAgICAgIGN1cnJlbnRQYWdlOiB0aGlzLnRhYmxlQWN0b3IuZ2V0Q3VycmVudFBhZ2UoKSxcbiAgICAgIHRvdGFsUGFnZXM6IHRoaXMudGFibGVBY3Rvci5nZXRUb3RhbFBhZ2VzKClcbiAgICB9XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdmFyIGNvbHVtbnMgPSBPYmplY3Qua2V5cyh0aGlzLnN0YXRlLmNvbHVtbkhlYWRpbmdzKS5tYXAoZnVuY3Rpb24oY29sdW1uSWQpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxUYWJsZUhlYWRpbmdDZWxsIGtleT17Y29sdW1uSWR9IGhlYWRpbmc9e3RoaXMuc3RhdGUuY29sdW1uSGVhZGluZ3NbY29sdW1uSWRdLmhlYWRpbmd9IC8+XG4gICAgICApO1xuICAgIH0sdGhpcyk7XG5cbiAgICBpZiAodGhpcy5zdGF0ZS50b3RhbFBhZ2VzID4gMSkge1xuICAgICAgdmFyIHBhZ2VzID0gQXJyYXkuYXBwbHkobnVsbCwgQXJyYXkodGhpcy5zdGF0ZS50b3RhbFBhZ2VzKSkubWFwKGZ1bmN0aW9uKF8saSkge3JldHVybiBpICsgMX0pO1xuICAgICAgdmFyIHBhZ2luYXRpb24gPSBwYWdlcy5tYXAoZnVuY3Rpb24ocGFnZU51bWJlcikge1xuICAgICAgICB2YXIgY2xhc3NlcyA9ICcnO1xuICAgICAgICBpZiAocGFnZU51bWJlciA9PT0gdGhpcy5zdGF0ZS5jdXJyZW50UGFnZSkge1xuICAgICAgICAgIGNsYXNzZXMgPSAnYWN0aXZlJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxsaSBjbGFzc05hbWU9e2NsYXNzZXN9PlxuICAgICAgICAgICAgPGEgb25DbGljaz17dGhpcy5fb25DbGljay5iaW5kKHRoaXMpfT57cGFnZU51bWJlcn08L2E+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgKVxuICAgICAgfSx0aGlzKTtcbiAgICB9XG5cbiAgICB2YXIgcm93cyA9IHRoaXMuc3RhdGUucm93cy5tYXAoZnVuY3Rpb24ocm93KSB7XG4gICAgICB2YXIgY29sdW1ucyA9IE9iamVjdC5rZXlzKHJvdykubWFwKGZ1bmN0aW9uKGNvbHVtbklkKSB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPHRkPlxuICAgICAgICAgICAge3Jvd1tjb2x1bW5JZF19XG4gICAgICAgICAgPC90ZD5cbiAgICAgICAgKTtcbiAgICAgIH0sdGhpcyk7XG5cbiAgICAgIHJldHVybiAoXG4gICAgICAgIDx0cj5cbiAgICAgICAgICB7Y29sdW1uc31cbiAgICAgICAgPC90cj5cbiAgICAgICk7XG4gICAgfSx0aGlzKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0ncGFuZWwgcGFuZWwtcmVzcG9uc2l2ZSc+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSd0YWJsZS1yZXNwb25zaXZlJz5cbiAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPSd0YWJsZSB0YWJsZS1ob3ZlciB0YWJsZS1zdHJpcGVkJz5cbiAgICAgICAgICAgIDx0aGVhZD5cbiAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgIHtjb2x1bW5zfVxuICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgPC90aGVhZD5cbiAgICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgICAge3Jvd3N9XG4gICAgICAgICAgICA8L3Rib2R5PlxuICAgICAgICAgIDwvdGFibGU+XG4gICAgICAgICAgPG5hdj5cbiAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9J3BhZ2luYXRpb24nPlxuICAgICAgICAgICAgICB7cGFnaW5hdGlvbn1cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgPC9uYXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFRhYmxlSGVhZGluZ0NlbGwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmhlYWRpbmcgPSBwcm9wcy5oZWFkaW5nO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8dGg+XG4gICAgICAgIHt0aGlzLmhlYWRpbmd9XG4gICAgICA8L3RoPlxuICAgICk7XG4gIH1cbn1cbiIsInZhciBTaGFyZWRVdGlscyA9IHJlcXVpcmUoJy4uL3V0aWxzL1NoYXJlZFV0aWxzJyk7XG5cbmV4cG9ydCBjbGFzcyBGaWx0ZXJCYXJTdG9yZSB7XG4gIGNvbnN0cnVjdG9yKGNvbmZpZ3VyYXRpb24pIHtcbiAgICB0aGlzLkNIQU5HRV9FVkVOVCA9ICdjaGFuZ2UnO1xuICAgIHRoaXMuZXZlbnRFbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgdGhpcy5pZCA9IGNvbmZpZ3VyYXRpb24uaWQ7XG4gICAgdGhpcy51cmwgPSBjb25maWd1cmF0aW9uLnNlYXJjaFVybDtcbiAgICB0aGlzLnNlYXJjaFVybCA9IGNvbmZpZ3VyYXRpb24uc2VhcmNoVXJsO1xuICAgIHRoaXMuc2F2ZVNlYXJjaFVybCA9IGNvbmZpZ3VyYXRpb24uc2F2ZVNlYXJjaFVybDtcbiAgICB0aGlzLnNhdmVkU2VhcmNoVXJsID0gY29uZmlndXJhdGlvbi5zYXZlZFNlYXJjaFVybDtcbiAgICB0aGlzLmV4cG9ydFJlc3VsdHNVcmwgPSBjb25maWd1cmF0aW9uLmV4cG9ydFJlc3VsdHNVcmw7XG4gICAgdGhpcy5maWx0ZXJzID0gY29uZmlndXJhdGlvbi5maWx0ZXJzO1xuICB9XG5cbiAgZ2V0SWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuaWQ7XG4gIH1cblxuICBnZXRTZWFyY2hVcmwoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2VhcmNoVXJsO1xuICB9XG5cbiAgZ2V0RmlsdGVyKGZpbHRlclVpZCkge1xuICAgIHJldHVybiB0aGlzLmZpbHRlcnNbZmlsdGVyVWlkXVxuICB9XG5cbiAgZ2V0RGlzYWJsZWQoKSB7XG4gICAgdmFyIGRpc2FibGVkRmlsdGVycyA9IHt9O1xuICAgIGZvciAodmFyIGZpbHRlclVpZCBpbiB0aGlzLmZpbHRlcnMpIHtcbiAgICAgIGlmICh0aGlzLmZpbHRlcnNbZmlsdGVyVWlkXS5lbmFibGVkID09PSBmYWxzZSkge1xuICAgICAgICBkaXNhYmxlZEZpbHRlcnNbZmlsdGVyVWlkXSA9IHRoaXMuZmlsdGVyc1tmaWx0ZXJVaWRdO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGlzYWJsZWRGaWx0ZXJzO1xuICB9XG5cbiAgZ2V0RW5hYmxlZCgpIHtcbiAgICB2YXIgZW5hYmxlZEZpbHRlcnMgPSB7fTtcbiAgICBmb3IgKHZhciBmaWx0ZXJVaWQgaW4gdGhpcy5maWx0ZXJzKSB7XG4gICAgICBpZiAodGhpcy5maWx0ZXJzW2ZpbHRlclVpZF0uZW5hYmxlZCA9PT0gdHJ1ZSkge1xuICAgICAgICBlbmFibGVkRmlsdGVyc1tmaWx0ZXJVaWRdID0gdGhpcy5maWx0ZXJzW2ZpbHRlclVpZF07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBlbmFibGVkRmlsdGVycztcbiAgfVxuXG4gIGdldFF1ZXJ5KCkge1xuICAgIHZhciBlbmFibGVkRmlsdGVycyA9IE9iamVjdC5rZXlzKHRoaXMuZ2V0RW5hYmxlZCgpKS5tYXAoZnVuY3Rpb24oZmlsdGVyVWlkKSB7XG4gICAgICB2YXIgZmlsdGVyID0gdGhpcy5nZXRGaWx0ZXIoZmlsdGVyVWlkKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHVpZDogZmlsdGVyVWlkLFxuICAgICAgICB0eXBlOiBmaWx0ZXIudHlwZSxcbiAgICAgICAgZmllbGQ6IGZpbHRlci5maWVsZCxcbiAgICAgICAgdmFsdWU6IGZpbHRlci52YWx1ZVxuICAgICAgfVxuICAgIH0sdGhpcyk7XG4gICAgcmV0dXJuIGVuYWJsZWRGaWx0ZXJzLmxlbmd0aCA+IDAgPyBKU09OLnN0cmluZ2lmeShlbmFibGVkRmlsdGVycykgOiAnJztcbiAgfVxuXG4gIC8qIE11dGF0aW9uIE1ldGhvZHMgKi9cbiAgZGlzYWJsZUFsbEZpbHRlcnMoKSB7XG4gICAgdmFyIGVuYWJsZWRGaWx0ZXJzID0gdGhpcy5nZXRFbmFibGVkKCk7XG5cbiAgICBmb3IgKHZhciBmaWx0ZXJVaWQgaW4gZW5hYmxlZEZpbHRlcnMpIHtcbiAgICAgIHRoaXMuZGlzYWJsZUZpbHRlcihmaWx0ZXJVaWQpO1xuICAgIH1cbiAgICB0aGlzLmVtaXRDaGFuZ2UoKTtcbiAgfVxuXG4gIGRpc2FibGVGaWx0ZXIoZmlsdGVyVWlkKSB7XG4gICAgdGhpcy5maWx0ZXJzW2ZpbHRlclVpZF0uZW5hYmxlZCA9IGZhbHNlO1xuICAgIHRoaXMuZmlsdGVyc1tmaWx0ZXJVaWRdLnZhbHVlID0gJyc7XG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICBlbmFibGVGaWx0ZXIoZmlsdGVyVWlkLCB2YWx1ZSkge1xuICAgIHRoaXMuZmlsdGVyc1tmaWx0ZXJVaWRdLmVuYWJsZWQgPSB0cnVlO1xuICAgIHRoaXMuZmlsdGVyc1tmaWx0ZXJVaWRdLnZhbHVlID0gdmFsdWUgfHwgJyc7XG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICB1cGRhdGVGaWx0ZXIoZmlsdGVyVWlkLCB2YWx1ZSkge1xuICAgIHRoaXMuZmlsdGVyc1tmaWx0ZXJVaWRdLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICBlbWl0Q2hhbmdlKCkge1xuICAgIHRoaXMuZXZlbnRFbWl0dGVyLmVtaXQodGhpcy5DSEFOR0VfRVZFTlQpO1xuICB9XG5cbiAgYWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLmV2ZW50RW1pdHRlci5vbih0aGlzLkNIQU5HRV9FVkVOVCwgY2FsbGJhY2spO1xuICB9XG5cbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLmV2ZW50RW1pdHRlci5yZW1vdmVMaXN0ZW5lcih0aGlzLkNIQU5HRV9FVkVOVCwgY2FsbGJhY2spO1xuICB9XG59XG4iLCJpbXBvcnQgKiBhcyBTZWFyY2hVdGlscyBmcm9tICcuLi91dGlscy9TZWFyY2hVdGlscyc7XG5cbmV4cG9ydCBjbGFzcyBUYWJsZVN0b3JlIHtcbiAgY29uc3RydWN0b3IoY29uZmlndXJhdGlvbikge1xuICAgIHRoaXMuQ0hBTkdFX0VWRU5UID0gJ2NoYW5nZSc7XG4gICAgdGhpcy5ldmVudEVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICB0aGlzLmlkID0gY29uZmlndXJhdGlvbi5pZDtcbiAgICB0aGlzLnJvd3MgPSBbXTtcbiAgICB0aGlzLmN1cnJlbnRQYWdlID0gY29uZmlndXJhdGlvbi5wYWdlIHx8IDE7XG4gICAgdGhpcy50b3RhbFBhZ2VzID0gMTtcblxuICAgIHRoaXMuY29sdW1uSGVhZGluZ3MgPSBjb25maWd1cmF0aW9uLmNvbHVtbnM7XG4gICAgdGhpcy51cmwgPSBjb25maWd1cmF0aW9uLmRhdGFVcmwgKyAnPyc7XG4gICAgdGhpcy5mZXRjaERhdGEoKTtcbiAgfVxuXG4gIGdldElkKCkge1xuICAgIHJldHVybiB0aGlzLmlkO1xuICB9XG5cbiAgc2V0VXJsKHVybCkge1xuICAgIHRoaXMudXJsID0gdXJsO1xuICB9XG5cbiAgZ2V0VXJsKCkge1xuICAgIHJldHVybiB0aGlzLnVybDtcbiAgfVxuXG4gIGZldGNoRGF0YSgpIHtcbiAgICBTZWFyY2hVdGlscy5zZWFyY2goXG4gICAgICB0aGlzLnVybCArIGBwYWdlPSR7dGhpcy5jdXJyZW50UGFnZX1gLFxuICAgICAgdGhpcy5zZXREYXRhLmJpbmQodGhpcylcbiAgICApO1xuICB9XG5cbiAgc2V0RGF0YShyZXNwb25zZSkge1xuICAgIHRoaXMucm93cyA9IHJlc3BvbnNlLnJlc3VsdHM7XG4gICAgdGhpcy5jdXJyZW50UGFnZSA9IHJlc3BvbnNlLmN1cnJlbnRfcGFnZTtcbiAgICB0aGlzLnRvdGFsUGFnZXMgPSByZXNwb25zZS50b3RhbF9wYWdlcztcbiAgICB0aGlzLmVtaXRDaGFuZ2UoKTtcbiAgfVxuXG4gIGdldENvbHVtbkhlYWRpbmdzKCkge1xuICAgIHJldHVybiB0aGlzLmNvbHVtbkhlYWRpbmdzO1xuICB9XG5cbiAgZ2V0Um93cygpIHtcbiAgICByZXR1cm4gdGhpcy5yb3dzO1xuICB9XG5cbiAgZ2V0Q3VycmVudFBhZ2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFBhZ2U7XG4gIH1cblxuICBnZXRUb3RhbFBhZ2VzKCkge1xuICAgIHJldHVybiB0aGlzLnRvdGFsUGFnZXM7XG4gIH1cblxuICBzZXRDdXJyZW50UGFnZShwYWdlKSB7XG4gICAgdGhpcy5jdXJyZW50UGFnZSA9IHBhZ2U7XG4gIH1cblxuICBlbWl0Q2hhbmdlKCkge1xuICAgIHRoaXMuZXZlbnRFbWl0dGVyLmVtaXQodGhpcy5DSEFOR0VfRVZFTlQpO1xuICB9XG5cbiAgYWRkQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLmV2ZW50RW1pdHRlci5vbih0aGlzLkNIQU5HRV9FVkVOVCwgY2FsbGJhY2spO1xuICB9XG5cbiAgcmVtb3ZlQ2hhbmdlTGlzdGVuZXIoY2FsbGJhY2spIHtcbiAgICB0aGlzLmV2ZW50RW1pdHRlci5yZW1vdmVMaXN0ZW5lcih0aGlzLkNIQU5HRV9FVkVOVCwgY2FsbGJhY2spO1xuICB9XG59XG4iLCJpbXBvcnQge2FqYXhHZXR9IGZyb20gJy4vU2hhcmVkVXRpbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gc2VhcmNoKHVybCwgc3VjY2Vzcykge1xuICBhamF4R2V0KHVybCwgJ2pzb24nLCBzdWNjZXNzKTtcbn1cbiIsImV4cG9ydCBmdW5jdGlvbiBzZXJpYWxpemUob2JqLCBwcmVmaXgpIHtcbiAgdmFyIHN0ciA9IFtdO1xuICBmb3IodmFyIHAgaW4gb2JqKSB7XG4gICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwKSkge1xuICAgICAgdmFyIGsgPSBwcmVmaXggPyBwcmVmaXggKyBcIltcIiArIHAgKyBcIl1cIiA6IHAsIHYgPSBvYmpbcF07XG4gICAgICBzdHIucHVzaCh0eXBlb2YgdiA9PSBcIm9iamVjdFwiID9cbiAgICAgICAgdGhpcy5zZXJpYWxpemUodiwgaykgOlxuICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoaykgKyBcIj1cIiArIGVuY29kZVVSSUNvbXBvbmVudCh2KSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdHIuam9pbihcIiZcIik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhamF4R2V0KHVybCwgdHlwZSwgc3VjY2VzcywgZXJyb3IpIHtcbiAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICB4aHIub3BlbignR0VUJywgdXJsLCB0cnVlKTtcbiAgeGhyLnJlc3BvbnNlVHlwZSA9IHR5cGU7XG4gIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJBY2NlcHRcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xuICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIlgtUmVxdWVzdGVkLVdpdGhcIiwgXCJYTUxIdHRwUmVxdWVzdFwiKTtcbiAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzdGF0dXMgPSB4aHIuc3RhdHVzO1xuICAgIHZhciByZXNwb25zZSA9IHhoci5yZXNwb25zZTtcbiAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcbiAgICAgIHJldHVybiBzdWNjZXNzKHJlc3BvbnNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGVycm9yKHJlc3BvbnNlKTtcbiAgICB9XG4gIH07XG4gIHhoci5zZW5kKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVVcmwoaWQsIHByb3BLZXksIHByb3BWYWx1ZSkge1xuICB2YXIgc2VhcmNoT2JqZWN0ID0gcGFyc2VVcmxTZWFyY2hTdHJpbmcoKSxcbiAgICAgIHF1ZXJ5T2JqZWN0ID0ge307XG5cbiAgaWYgKHNlYXJjaE9iamVjdC5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcbiAgICBxdWVyeU9iamVjdCA9IEpTT04ucGFyc2Uoc2VhcmNoT2JqZWN0W2lkXSk7XG4gIH1cblxuICBxdWVyeU9iamVjdFtwcm9wS2V5XSA9IHByb3BWYWx1ZTtcbiAgc2VhcmNoT2JqZWN0W2lkXSA9IEpTT04uc3RyaW5naWZ5KHF1ZXJ5T2JqZWN0KTtcblxuICB2YXIgbmV3U2VhcmNoU3RyaW5nID0gJz8nICsgY3JlYXRlVXJsU2VhcmNoU3RyaW5nKHNlYXJjaE9iamVjdCk7XG5cbiAgaGlzdG9yeS5wdXNoU3RhdGUoe30sIFwiXCIsIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyBuZXdTZWFyY2hTdHJpbmcpO1xuICBsb2NhbFN0b3JhZ2Vbd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcLy9nLCcnKV0gPSBuZXdTZWFyY2hTdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUZpbHRlckJhckNvbmZpZ3VyYXRpb24oZmlsdGVyQmFyQ29uZmlndXJhdGlvbiwgaWQpIHtcbiAgdmFyIHBhcnNlZEZpbHRlckJhckNvbmZpZ3VyYXRpb24gPSB7fSxcbiAgICAgIHJhd0ZpbHRlcixcbiAgICAgIHJhd0ZpbHRlcnMsXG4gICAgICBwYXJzZWRGaWx0ZXJzID0ge307XG5cbiAgcmF3RmlsdGVycyA9IGZpbHRlckJhckNvbmZpZ3VyYXRpb24ucXVlcnlTZWxlY3RvcignZGwuZmlsdGVycycpLnF1ZXJ5U2VsZWN0b3JBbGwoJ2R0LmZpbHRlcicpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcmF3RmlsdGVycy5sZW5ndGg7IGkrKykge1xuICAgIHJhd0ZpbHRlciA9IHJhd0ZpbHRlcnNbaV07XG4gICAgcGFyc2VkRmlsdGVyc1tyYXdGaWx0ZXIuZ2V0QXR0cmlidXRlKCdkYXRhLXVpZCcpXSA9IHtcbiAgICAgIGxhYmVsOiByYXdGaWx0ZXIuZ2V0QXR0cmlidXRlKCdkYXRhLWxhYmVsJyksXG4gICAgICB0eXBlOiByYXdGaWx0ZXIuZ2V0QXR0cmlidXRlKCdkYXRhLXR5cGUnKSxcbiAgICAgIGZpZWxkOiByYXdGaWx0ZXIuZ2V0QXR0cmlidXRlKCdkYXRhLWZpZWxkJyksXG4gICAgICB2YWx1ZTogJycsXG4gICAgICBlbmFibGVkOiBmYWxzZVxuICAgIH07XG4gIH1cblxuICBwYXJzZWRGaWx0ZXJCYXJDb25maWd1cmF0aW9uLmlkID0gaWQ7XG4gIHBhcnNlZEZpbHRlckJhckNvbmZpZ3VyYXRpb24uc2VhcmNoVXJsID0gZmlsdGVyQmFyQ29uZmlndXJhdGlvbi5xdWVyeVNlbGVjdG9yKCdkdC5zZWFyY2gtdXJsJykuZ2V0QXR0cmlidXRlKCdkYXRhLXVybCcpO1xuICBwYXJzZWRGaWx0ZXJCYXJDb25maWd1cmF0aW9uLnNhdmVTZWFyY2hVcmwgPSBmaWx0ZXJCYXJDb25maWd1cmF0aW9uLnF1ZXJ5U2VsZWN0b3IoJ2R0LnNhdmUtc2VhcmNoLXVybCcpLmdldEF0dHJpYnV0ZSgnZGF0YS11cmwnKTtcbiAgcGFyc2VkRmlsdGVyQmFyQ29uZmlndXJhdGlvbi5zYXZlZFNlYXJjaFVybCA9IGZpbHRlckJhckNvbmZpZ3VyYXRpb24ucXVlcnlTZWxlY3RvcignZHQuc2F2ZWQtc2VhcmNoLXVybCcpLmdldEF0dHJpYnV0ZSgnZGF0YS11cmwnKTtcbiAgcGFyc2VkRmlsdGVyQmFyQ29uZmlndXJhdGlvbi5leHBvcnRSZXN1bHRzVXJsID0gZmlsdGVyQmFyQ29uZmlndXJhdGlvbi5xdWVyeVNlbGVjdG9yKCdkdC5leHBvcnQtcmVzdWx0cy11cmwnKS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdXJsJyk7XG4gIHBhcnNlZEZpbHRlckJhckNvbmZpZ3VyYXRpb24uZmlsdGVycyA9IHBhcnNlZEZpbHRlcnM7XG5cbiAgcmV0dXJuIHBhcnNlZEZpbHRlckJhckNvbmZpZ3VyYXRpb247XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVRhYmxlQ29uZmlndXJhdGlvbih0YWJsZUNvbmZpZ3VyYXRpb24sIGlkKSB7XG4gIHZhciBwYXJzZWRUYWJsZUNvbmZpZ3VyYXRpb24gPSB7fSxcbiAgICAgIHJhd0NvbHVtbnMsXG4gICAgICByYXdDb2x1bW4sXG4gICAgICBwYXJzZWRDb2x1bW5zID0ge307XG5cbiAgcmF3Q29sdW1ucyA9IHRhYmxlQ29uZmlndXJhdGlvbi5xdWVyeVNlbGVjdG9yKCdkbC5jb2x1bW5zJykucXVlcnlTZWxlY3RvckFsbCgnZHQuY29sdW1uJyk7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCByYXdDb2x1bW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgcmF3Q29sdW1uID0gcmF3Q29sdW1uc1tpXTtcbiAgICBwYXJzZWRDb2x1bW5zW3Jhd0NvbHVtbi5nZXRBdHRyaWJ1dGUoJ2RhdGEtZmllbGQnKV0gPSB7XG4gICAgICBoZWFkaW5nOiByYXdDb2x1bW4uZ2V0QXR0cmlidXRlKCdkYXRhLWhlYWRpbmcnKVxuICAgIH07XG4gIH1cblxuICBwYXJzZWRUYWJsZUNvbmZpZ3VyYXRpb24uaWQgPSBpZDtcbiAgcGFyc2VkVGFibGVDb25maWd1cmF0aW9uLmRhdGFVcmwgPSB0YWJsZUNvbmZpZ3VyYXRpb24ucXVlcnlTZWxlY3RvcignZHQuZGF0YS11cmwnKS5nZXRBdHRyaWJ1dGUoJ2RhdGEtdXJsJyk7XG4gIHBhcnNlZFRhYmxlQ29uZmlndXJhdGlvbi5jb2x1bW5zID0gcGFyc2VkQ29sdW1ucztcblxuICByZXR1cm4gcGFyc2VkVGFibGVDb25maWd1cmF0aW9uO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VVcmxTZWFyY2hTdHJpbmcoKSB7XG4gIC8vIHRha2VuIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL3NpbmRyZXNvcmh1cy9xdWVyeS1zdHJpbmcvYmxvYi9tYXN0ZXIvcXVlcnktc3RyaW5nLmpzXG5cbiAgdmFyIHN0ciA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2g7XG5cbiAgaWYgKHR5cGVvZiBzdHIgIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgc3RyID0gc3RyLnRyaW0oKS5yZXBsYWNlKC9eKFxcP3wjKS8sICcnKTtcblxuICBpZiAoIXN0cikge1xuICAgIHJldHVybiB7fTtcbiAgfVxuXG4gIHJldHVybiBzdHIudHJpbSgpLnNwbGl0KCcmJykucmVkdWNlKGZ1bmN0aW9uIChyZXQsIHBhcmFtKSB7XG4gICAgdmFyIHBhcnRzID0gcGFyYW0ucmVwbGFjZSgvXFwrL2csICcgJykuc3BsaXQoJz0nKTtcbiAgICB2YXIga2V5ID0gcGFydHNbMF07XG4gICAgdmFyIHZhbCA9IHBhcnRzWzFdO1xuXG4gICAga2V5ID0gZGVjb2RlVVJJQ29tcG9uZW50KGtleSk7XG4gICAgLy8gbWlzc2luZyBgPWAgc2hvdWxkIGJlIGBudWxsYDpcbiAgICAvLyBodHRwOi8vdzMub3JnL1RSLzIwMTIvV0QtdXJsLTIwMTIwNTI0LyNjb2xsZWN0LXVybC1wYXJhbWV0ZXJzXG4gICAgdmFsID0gdmFsID09PSB1bmRlZmluZWQgPyBudWxsIDogZGVjb2RlVVJJQ29tcG9uZW50KHZhbCk7XG5cbiAgICBpZiAoIXJldC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICByZXRba2V5XSA9IHZhbDtcbiAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkocmV0W2tleV0pKSB7XG4gICAgICByZXRba2V5XS5wdXNoKHZhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldFtrZXldID0gW3JldFtrZXldLCB2YWxdO1xuICAgIH1cblxuICAgIHJldHVybiByZXQ7XG4gIH0sIHt9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVVybFNlYXJjaFN0cmluZyhvYmopIHtcbiAgLy8gdGFrZW4gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vc2luZHJlc29yaHVzL3F1ZXJ5LXN0cmluZy9ibG9iL21hc3Rlci9xdWVyeS1zdHJpbmcuanNcbiAgcmV0dXJuIG9iaiA/IE9iamVjdC5rZXlzKG9iaikubWFwKGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgdmFsID0gb2JqW2tleV07XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWwpKSB7XG4gICAgICByZXR1cm4gdmFsLm1hcChmdW5jdGlvbiAodmFsMikge1xuICAgICAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsMik7XG4gICAgICB9KS5qb2luKCcmJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbCk7XG4gIH0pLmpvaW4oJyYnKSA6ICcnO1xufVxuIl19

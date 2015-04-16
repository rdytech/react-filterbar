(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var FilterableTable = require("./components/FilterableTable.react").FilterableTable;

document.addEventListener("DOMContentLoaded", function () {
  var filterableTables = document.getElementsByClassName("react-filterable-table");

  var filterableTableNode, filterBarConfiguration, tableConfiguration;

  for (var i = 0; i < filterableTables.length; i++) {
    filterableTableNode = filterableTables[i];
    filterBarConfiguration = filterableTableNode.querySelector("dl.filterBarConfiguration");
    tableConfiguration = filterableTableNode.querySelector("dl.tableConfiguration");

    React.render(React.createElement(FilterableTable, {
      filterableTableId: i,
      filterbar: {
        filterBarId: i,
        configuration: filterBarConfiguration
      },
      table: {
        tableId: i,
        configuration: tableConfiguration
      }
    }), filterableTableNode);
  }
});

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
        var base64Query = this.filterBarStore.getBase64Query();
        var tableBaseUrl = this.tableStore.getBaseUrl();
        var newUrl = tableBaseUrl + "?q=" + base64Query + "&";

        localStorage[window.location.pathname.replace(/\//, "")] = base64Query;
        history.pushState({}, "", newUrl);

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
        this.tableStore.fetchData(page);
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

    this.tableStore = new TableStore(props.table);
    this.tableActor = new TableActor(this.tableStore);

    this.filterBarStore = new FilterBarStore(props.filterbar);
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

},{"../actors/FilterBarActor":2,"../actors/TableActor":3,"../stores/FilterBarStore":19,"../stores/TableStore":20,"./FilterBar/FilterBar.react":6,"./Table/Table.react":15}],15:[function(require,module,exports){
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

Object.defineProperty(exports, "__esModule", {
  value: true
});
var FilterBarConstants = {
  ActionTypes: {
    ENABLE_FILTER: "ENABLE_FILTER",
    DISABLE_FILTER: "DISABLE_FILTER",
    UPDATE_FILTER: "UPDATE_FILTER",
    APPLY_FILTERS: "APPLY_FILTERS"
  }
};
exports.FilterBarConstants = FilterBarConstants;

},{}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var TableConstants = {
  ActionTypes: {}
};
exports.TableConstants = TableConstants;

},{}],19:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var FilterBarConstants = require("../constants/FilterBarConstants").FilterBarConstants;

var SharedUtils = require("../utils/SharedUtils");

var FilterBarStore = exports.FilterBarStore = (function () {
  function FilterBarStore(filterBarOptions) {
    _classCallCheck(this, FilterBarStore);

    this.CHANGE_EVENT = "change";
    this.eventEmitter = new EventEmitter();
    this.constants = FilterBarConstants;

    this.filters = this.parseRawFilterList(filterBarOptions.configuration.querySelector("dl.filters").querySelectorAll("dt.filter"));
    this.url = filterBarOptions.configuration.querySelector("dt.search-url").getAttribute("data-url");

    if (window.location.search != "") {
      var queries = window.location.search.split("?")[1].split("&"),
          enabledFilters,
          query;
      for (var i = 0; i < queries.length; i++) {
        query = queries[i];
        if (query.match(/^q=/)) {
          enabledFilters = JSON.parse(atob(query.substring(2, query.length)));
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

},{"../constants/FilterBarConstants":17,"../utils/SharedUtils":22}],20:[function(require,module,exports){
"use strict";

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { "default": obj }; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var TableConstants = require("../constants/TableConstants").TableConstants;

var SearchUtils = _interopRequireWildcard(require("../utils/SearchUtils"));

var TableStore = exports.TableStore = (function () {
  function TableStore(tableOptions) {
    _classCallCheck(this, TableStore);

    this.CHANGE_EVENT = "change";
    this.eventEmitter = new EventEmitter();
    this.constants = TableConstants;

    this.rows = [];
    this.currentPage = 1;
    this.totalPages = 1;

    this.columnHeadings = this.parseRawColumnHeadingList(tableOptions.configuration.querySelector("dl.columns").querySelectorAll("dt.column"));
    this.baseUrl = tableOptions.configuration.querySelector("dt.data-url").getAttribute("data-url");
    this.url = window.location;
    this.fetchData();
  }

  _createClass(TableStore, {
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
      value: function fetchData(page) {
        var url = this.url;
        if (page != null) {
          url += "&page=" + page;
        }
        SearchUtils.search(url, this.setData.bind(this));
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

},{"../constants/TableConstants":18,"../utils/SearchUtils":21}],21:[function(require,module,exports){
"use strict";

exports.search = search;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var SharedUtils = require("./SharedUtils");

function search(url, success) {
  SharedUtils.ajaxGet(url, "json", success);
}

},{"./SharedUtils":22}],22:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvamFjb2JiMS9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2FwcC5qcyIsIi9Vc2Vycy9qYWNvYmIxL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvYWN0b3JzL0ZpbHRlckJhckFjdG9yLmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9hY3RvcnMvVGFibGVBY3Rvci5qcyIsIi9Vc2Vycy9qYWNvYmIxL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvY29tcG9uZW50cy9GaWx0ZXJCYXIvQXBwbHlGaWx0ZXJzQnV0dG9uLnJlYWN0LmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9jb21wb25lbnRzL0ZpbHRlckJhci9DbGVhckZpbHRlcnNCdXR0b24ucmVhY3QuanMiLCIvVXNlcnMvamFjb2JiMS9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2NvbXBvbmVudHMvRmlsdGVyQmFyL0ZpbHRlckJhci5yZWFjdC5qcyIsIi9Vc2Vycy9qYWNvYmIxL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvY29tcG9uZW50cy9GaWx0ZXJCYXIvRmlsdGVyRGlzcGxheS9GaWx0ZXJEaXNwbGF5LnJlYWN0LmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9jb21wb25lbnRzL0ZpbHRlckJhci9GaWx0ZXJEaXNwbGF5L0ZpbHRlcklucHV0LnJlYWN0LmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9jb21wb25lbnRzL0ZpbHRlckJhci9GaWx0ZXJEaXNwbGF5L0lucHV0cy9UZXh0SW5wdXQucmVhY3QuanMiLCIvVXNlcnMvamFjb2JiMS9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2NvbXBvbmVudHMvRmlsdGVyQmFyL0ZpbHRlckxpc3QvRmlsdGVyTGlzdC5yZWFjdC5qcyIsIi9Vc2Vycy9qYWNvYmIxL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvY29tcG9uZW50cy9GaWx0ZXJCYXIvRmlsdGVyTGlzdC9GaWx0ZXJMaXN0T3B0aW9uLnJlYWN0LmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9jb21wb25lbnRzL0ZpbHRlckJhci9Mb2FkRmlsdGVyc0xpc3QvTG9hZEZpbHRlcnNMaXN0LnJlYWN0LmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9jb21wb25lbnRzL0ZpbHRlckJhci9TYXZlRmlsdGVyc0J1dHRvbi5yZWFjdC5qcyIsIi9Vc2Vycy9qYWNvYmIxL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvY29tcG9uZW50cy9GaWx0ZXJhYmxlVGFibGUucmVhY3QuanMiLCIvVXNlcnMvamFjb2JiMS9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2NvbXBvbmVudHMvVGFibGUvVGFibGUucmVhY3QuanMiLCIvVXNlcnMvamFjb2JiMS9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2NvbXBvbmVudHMvVGFibGUvVGFibGVIZWFkaW5nQ2VsbC5yZWFjdC5qcyIsIi9Vc2Vycy9qYWNvYmIxL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvY29uc3RhbnRzL0ZpbHRlckJhckNvbnN0YW50cy5qcyIsIi9Vc2Vycy9qYWNvYmIxL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvY29uc3RhbnRzL1RhYmxlQ29uc3RhbnRzLmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9zdG9yZXMvRmlsdGVyQmFyU3RvcmUuanMiLCIvVXNlcnMvamFjb2JiMS9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL3N0b3Jlcy9UYWJsZVN0b3JlLmpzIiwiL1VzZXJzL2phY29iYjEvZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy91dGlscy9TZWFyY2hVdGlscy5qcyIsIi9Vc2Vycy9qYWNvYmIxL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvdXRpbHMvU2hhcmVkVXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztJQ0FRLGVBQWUsV0FBTyxvQ0FBb0MsRUFBMUQsZUFBZTs7QUFFdkIsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLFlBQVU7QUFDdEQsTUFBSSxnQkFBZ0IsR0FBRyxRQUFRLENBQUMsc0JBQXNCLENBQUMsd0JBQXdCLENBQUMsQ0FBQzs7QUFFakYsTUFBSSxtQkFBbUIsRUFDbkIsc0JBQXNCLEVBQ3RCLGtCQUFrQixDQUFDOztBQUV2QixPQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ2hELHVCQUFtQixHQUFHLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFDLDBCQUFzQixHQUFHLG1CQUFtQixDQUFDLGFBQWEsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQ3hGLHNCQUFrQixHQUFHLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDOztBQUVoRixTQUFLLENBQUMsTUFBTSxDQUNWLEtBQUssQ0FBQyxhQUFhLENBQ2pCLGVBQWUsRUFDZjtBQUNFLHVCQUFpQixFQUFFLENBQUM7QUFDcEIsZUFBUyxFQUFFO0FBQ1QsbUJBQVcsRUFBRSxDQUFDO0FBQ2QscUJBQWEsRUFBRSxzQkFBc0I7T0FDdEM7QUFDRCxXQUFLLEVB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Y2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB7RmlsdGVyYWJsZVRhYmxlfSBmcm9tICcuL2NvbXBvbmVudHMvRmlsdGVyYWJsZVRhYmxlLnJlYWN0JztcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCl7XG4gIHZhciBmaWx0ZXJhYmxlVGFibGVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncmVhY3QtZmlsdGVyYWJsZS10YWJsZScpO1xuXG4gIHZhciBmaWx0ZXJhYmxlVGFibGVOb2RlLFxuICAgICAgZmlsdGVyQmFyQ29uZmlndXJhdGlvbixcbiAgICAgIHRhYmxlQ29uZmlndXJhdGlvbjtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGZpbHRlcmFibGVUYWJsZXMubGVuZ3RoOyBpKyspIHtcbiAgICBmaWx0ZXJhYmxlVGFibGVOb2RlID0gZmlsdGVyYWJsZVRhYmxlc1tpXTtcbiAgICBmaWx0ZXJCYXJDb25maWd1cmF0aW9uID0gZmlsdGVyYWJsZVRhYmxlTm9kZS5xdWVyeVNlbGVjdG9yKCdkbC5maWx0ZXJCYXJDb25maWd1cmF0aW9uJyk7XG4gICAgdGFibGVDb25maWd1cmF0aW9uID0gZmlsdGVyYWJsZVRhYmxlTm9kZS5xdWVyeVNlbGVjdG9yKCdkbC50YWJsZUNvbmZpZ3VyYXRpb24nKTtcblxuICAgIFJlYWN0LnJlbmRlcihcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgIEZpbHRlcmFibGVUYWJsZSxcbiAgICAgICAge1xuICAgICAgICAgIGZpbHRlcmFibGVUYWJsZUlkOiBpLFxuICAgICAgICAgIGZpbHRlcmJhcjoge1xuICAgICAgICAgICAgZmlsdGVyQmFySWQ6IGksXG4gICAgICAgICAgICBjb25maWd1cmF0aW9uOiBmaWx0ZXJCYXJDb25maWd1cmF0aW9uXG4gICAgICAgICAgfSxcbiAgICAgICAgICB0YWJsZToge1xuICAgICAgICAgICAgdGFibGVJZDogaSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYXRpb246IHRhYmxlQ29uZmlndXJhdGlvblxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgKSxcbiAgICAgIGZpbHRlcmFibGVUYWJsZU5vZGVcbiAgICApO1xuICB9XG59KTtcbiIsImV4cG9ydCBjbGFzcyBGaWx0ZXJCYXJBY3RvciB7XG4gIGNvbnN0cnVjdG9yKGZpbHRlckJhclN0b3JlLCB0YWJsZVN0b3JlKSB7XG4gICAgdGhpcy5maWx0ZXJCYXJTdG9yZSA9IGZpbHRlckJhclN0b3JlO1xuICAgIHRoaXMudGFibGVTdG9yZSA9IHRhYmxlU3RvcmU7XG4gIH1cblxuICBnZXRGaWx0ZXIoZmlsdGVyVWlkKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyQmFyU3RvcmUuZ2V0RmlsdGVyKGZpbHRlclVpZClcbiAgfVxuXG4gIGVuYWJsZUZpbHRlcihmaWx0ZXJVaWQpIHtcbiAgICB0aGlzLmZpbHRlckJhclN0b3JlLmVuYWJsZUZpbHRlcihmaWx0ZXJVaWQpO1xuICB9XG5cbiAgZGlzYWJsZUZpbHRlcihmaWx0ZXJVaWQpIHtcbiAgICB0aGlzLmZpbHRlckJhclN0b3JlLmRpc2FibGVGaWx0ZXIoZmlsdGVyVWlkKTtcbiAgfVxuXG4gIGRpc2FibGVBbGxGaWx0ZXJzKCkge1xuICAgIHRoaXMuZmlsdGVyQmFyU3RvcmUuZGlzYWJsZUFsbEZpbHRlcnMoKTtcbiAgICB0aGlzLmFwcGx5RmlsdGVycygpO1xuICB9XG5cbiAgdXBkYXRlRmlsdGVyKGZpbHRlclVpZCwgdmFsdWUpIHtcbiAgICB0aGlzLmZpbHRlckJhclN0b3JlLnVwZGF0ZUZpbHRlcihmaWx0ZXJVaWQsIHZhbHVlKVxuICB9XG5cbiAgZ2V0RW5hYmxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5maWx0ZXJCYXJTdG9yZS5nZXRFbmFibGVkKCk7XG4gIH1cblxuICBnZXREaXNhYmxlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5maWx0ZXJCYXJTdG9yZS5nZXREaXNhYmxlZCgpO1xuICB9XG5cbiAgYXBwbHlGaWx0ZXJzKCkge1xuICAgIHZhciBiYXNlNjRRdWVyeSA9IHRoaXMuZmlsdGVyQmFyU3RvcmUuZ2V0QmFzZTY0UXVlcnkoKTtcbiAgICB2YXIgdGFibGVCYXNlVXJsID0gdGhpcy50YWJsZVN0b3JlLmdldEJhc2VVcmwoKTtcbiAgICB2YXIgbmV3VXJsID0gdGFibGVCYXNlVXJsICsgXCI/cT1cIiArIGJhc2U2NFF1ZXJ5ICsgXCImXCI7XG5cbiAgICBsb2NhbFN0b3JhZ2Vbd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcLy8sJycpXSA9IGJhc2U2NFF1ZXJ5O1xuICAgIGhpc3RvcnkucHVzaFN0YXRlKHt9LCBcIlwiLCBuZXdVcmwpO1xuXG4gICAgdGhpcy50YWJsZVN0b3JlLnNldFVybChuZXdVcmwpO1xuICAgIHRoaXMudGFibGVTdG9yZS5mZXRjaERhdGEoKTtcbiAgfVxuXG4gIHNhdmVGaWx0ZXJzKG5hbWUpIHtcbiAgICB2YXIgZW5hYmxlZEZpbHRlcnMgPSB0aGlzLmZpbHRlckJhclN0b3JlLmdldEVuYWJsZWQoKSxcbiAgICAgICAgc2F2ZWRGaWx0ZXJzUGFja2V0ID0ge307XG4gICAgc2F2ZWRGaWx0ZXJzUGFja2V0LnNlYXJjaF90aXRsZSA9IG5hbWU7XG4gICAgc2F2ZWRGaWx0ZXJzUGFja2V0LmZpbHRlcnMgPSB7fVxuICAgIGZvciAodmFyIGZpbHRlclVpZCBpbiBlbmFibGVkRmlsdGVycykge1xuICAgICAgc2F2ZWRGaWx0ZXJzUGFja2V0LmZpbHRlcnNbZmlsdGVyVWlkXSA9IGVuYWJsZWRGaWx0ZXJzW2ZpbHRlclVpZF0udmFsdWU7XG4gICAgfVxuICB9XG59IiwiZXhwb3J0IGNsYXNzIFRhYmxlQWN0b3Ige1xuICBjb25zdHJ1Y3Rvcih0YWJsZVN0b3JlKSB7XG4gICAgdGhpcy50YWJsZVN0b3JlID0gdGFibGVTdG9yZTtcbiAgfVxuXG4gIGdldENvbHVtbkhlYWRpbmdzKCkge1xuICAgIHJldHVybiB0aGlzLnRhYmxlU3RvcmUuZ2V0Q29sdW1uSGVhZGluZ3MoKTtcbiAgfVxuXG4gIGdldFJvd3MoKSB7XG4gICAgcmV0dXJuIHRoaXMudGFibGVTdG9yZS5nZXRSb3dzKCk7XG4gIH1cblxuICBnZXRDdXJyZW50UGFnZSgpIHtcbiAgICByZXR1cm4gdGhpcy50YWJsZVN0b3JlLmdldEN1cnJlbnRQYWdlKCk7XG4gIH1cblxuICBnZXRUb3RhbFBhZ2VzKCkge1xuICAgIHJldHVybiB0aGlzLnRhYmxlU3RvcmUuZ2V0VG90YWxQYWdlcygpO1xuICB9XG5cbiAgZmV0Y2hQYWdlZERhdGEocGFnZSkge1xuICAgIHRoaXMudGFibGVTdG9yZS5mZXRjaERhdGEocGFnZSk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBBcHBseUZpbHRlcnNCdXR0b24gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgfVxuXG4gIF9vbkNsaWNrKCkge1xuICAgIHRoaXMucHJvcHMuZmlsdGVyQmFyQWN0b3IuYXBwbHlGaWx0ZXJzKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCIgb25DbGljaz17dGhpcy5fb25DbGljay5iaW5kKHRoaXMpfT5cbiAgICAgICAgPGkgY2xhc3NOYW1lPVwiaWNvbiBpY29uLXRpY2tcIiAvPlxuICAgICAgICBBcHBseVxuICAgICAgPC9idXR0b24+XG4gICAgKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIENsZWFyRmlsdGVyc0J1dHRvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICB9XG5cbiAgX29uQ2xpY2soKSB7XG4gICAgdGhpcy5wcm9wcy5maWx0ZXJCYXJBY3Rvci5kaXNhYmxlQWxsRmlsdGVycygpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4td2FybmluZ1wiIG9uQ2xpY2s9e3RoaXMuX29uQ2xpY2suYmluZCh0aGlzKX0+XG4gICAgICAgIDxpIGNsYXNzTmFtZT1cImljb24gaWNvbi1kZWxldGVcIiAvPlxuICAgICAgICBDbGVhclxuICAgICAgPC9idXR0b24+XG4gICAgKTtcbiAgfVxufVxuIiwiaW1wb3J0IHtGaWx0ZXJMaXN0fSBmcm9tICcuL0ZpbHRlckxpc3QvRmlsdGVyTGlzdC5yZWFjdCc7XG5pbXBvcnQge0ZpbHRlckRpc3BsYXl9IGZyb20gJy4vRmlsdGVyRGlzcGxheS9GaWx0ZXJEaXNwbGF5LnJlYWN0JztcbmltcG9ydCB7QXBwbHlGaWx0ZXJzQnV0dG9ufSBmcm9tICcuL0FwcGx5RmlsdGVyc0J1dHRvbi5yZWFjdCc7XG5pbXBvcnQge0NsZWFyRmlsdGVyc0J1dHRvbn0gZnJvbSAnLi9DbGVhckZpbHRlcnNCdXR0b24ucmVhY3QnO1xuaW1wb3J0IHtTYXZlRmlsdGVyc0J1dHRvbn0gZnJvbSAnLi9TYXZlRmlsdGVyc0J1dHRvbi5yZWFjdCc7XG5pbXBvcnQge0xvYWRGaWx0ZXJzTGlzdH0gZnJvbSAnLi9Mb2FkRmlsdGVyc0xpc3QvTG9hZEZpbHRlcnNMaXN0LnJlYWN0JztcblxuZXhwb3J0IGNsYXNzIEZpbHRlckJhciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuZmlsdGVyQmFyQWN0b3IgPSBwcm9wcy5maWx0ZXJCYXJBY3RvcjtcbiAgICB0aGlzLmZpbHRlckJhclN0b3JlID0gcHJvcHMuZmlsdGVyQmFyU3RvcmU7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgbWFyZ2luLWJvdHRvbS1zbVwiPlxuICAgICAgICAgICAgPEZpbHRlckxpc3RcbiAgICAgICAgICAgICAgZmlsdGVyQmFyQWN0b3I9e3RoaXMuZmlsdGVyQmFyQWN0b3J9XG4gICAgICAgICAgICAgIGZpbHRlckJhclN0b3JlPXt0aGlzLmZpbHRlckJhclN0b3JlfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBkaXNhYmxlZFwiPjxpIGNsYXNzTmFtZT1cImljb24gaWNvbi1kb3dubG9hZFwiPjwvaT5FeHBvcnQgQ1NWPC9idXR0b24+XG4gICAgICAgICAgICA8QXBwbHlGaWx0ZXJzQnV0dG9uXG4gICAgICAgICAgICAgIGZpbHRlckJhckFjdG9yPXt0aGlzLmZpbHRlckJhckFjdG9yfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxDbGVhckZpbHRlcnNCdXR0b25cbiAgICAgICAgICAgICAgZmlsdGVyQmFyQWN0b3I9e3RoaXMuZmlsdGVyQmFyQWN0b3J9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPFNhdmVGaWx0ZXJzQnV0dG9uXG4gICAgICAgICAgICAgIGZpbHRlckJhckFjdG9yPXt0aGlzLmZpbHRlckJhckFjdG9yfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICAgIDxMb2FkRmlsdGVyc0xpc3RcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPEZpbHRlckRpc3BsYXlcbiAgICAgICAgICAgIGZpbHRlckJhckFjdG9yPXt0aGlzLmZpbHRlckJhckFjdG9yfVxuICAgICAgICAgICAgZmlsdGVyQmFyU3RvcmU9e3RoaXMuZmlsdGVyQmFyU3RvcmV9XG4gICAgICAgICAgLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG4iLCJpbXBvcnQge0ZpbHRlcklucHV0fSBmcm9tICcuL0ZpbHRlcklucHV0LnJlYWN0JztcblxuZXhwb3J0IGNsYXNzIEZpbHRlckRpc3BsYXkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmZpbHRlckJhckFjdG9yID0gcHJvcHMuZmlsdGVyQmFyQWN0b3I7XG4gICAgdGhpcy5maWx0ZXJCYXJTdG9yZSA9IHByb3BzLmZpbHRlckJhclN0b3JlO1xuICAgIHRoaXMuc3RhdGUgPSB0aGlzLmdldFN0YXRlRnJvbVN0b3JlcygpO1xuXG4gICAgdGhpcy5maWx0ZXJCYXJTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIF9vbkNoYW5nZSgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0U3RhdGVGcm9tU3RvcmVzKCkpO1xuICB9XG5cbiAgZ2V0U3RhdGVGcm9tU3RvcmVzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBmaWx0ZXJzOiB0aGlzLmZpbHRlckJhckFjdG9yLmdldEVuYWJsZWQoKVxuICAgIH1cbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICB2YXIgZmlsdGVycyA9IE9iamVjdC5rZXlzKHRoaXMuc3RhdGUuZmlsdGVycykubWFwKGZ1bmN0aW9uKGZpbHRlclVpZCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPEZpbHRlcklucHV0XG4gICAgICAgICAga2V5PXtmaWx0ZXJVaWR9XG4gICAgICAgICAgZmlsdGVyVWlkPXtmaWx0ZXJVaWR9XG4gICAgICAgICAgZmlsdGVyPXt0aGlzLnN0YXRlLmZpbHRlcnNbZmlsdGVyVWlkXX1cbiAgICAgICAgICBmaWx0ZXJCYXJBY3Rvcj17dGhpcy5maWx0ZXJCYXJBY3Rvcn1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfSx0aGlzKTtcblxuICAgIGlmIChmaWx0ZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZmlsdGVycyA9ICg8ZGl2Pk5vIEZpbHRlcnMgRW5hYmxlZCE8L2Rpdj4pO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT0nbmF2YmFyIGZpbHRlcmJhcic+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPSdwYW5lbCBwYW5lbC1kZWZhdWx0Jz5cbiAgICAgICAgICB7ZmlsdGVyc31cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG4iLCJpbXBvcnQge1RleHRJbnB1dH0gZnJvbSAnLi9JbnB1dHMvVGV4dElucHV0LnJlYWN0JztcblxuZXhwb3J0IGNsYXNzIEZpbHRlcklucHV0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLmZpbHRlckJhckFjdG9yID0gcHJvcHMuZmlsdGVyQmFyQWN0b3I7XG4gICAgdGhpcy5maWx0ZXJVaWQgPSBwcm9wcy5maWx0ZXJVaWQ7XG4gICAgdGhpcy5maWx0ZXJLZXkgPSBwcm9wcy5maWx0ZXJLZXk7XG4gIH1cblxuICBfb25DbGljaygpIHtcbiAgICB0aGlzLmZpbHRlckJhckFjdG9yLmRpc2FibGVGaWx0ZXIodGhpcy5maWx0ZXJVaWQpO1xuICB9XG5cbiAgaW5wdXRGYWN0b3J5KCkge1xuICAgIC8qXG4gICAgICBpbnB1dEZhY3Rvcnk6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdHlwZSA9IHRoaXMucHJvcHMuZmlsdGVyLnR5cGU7XG4gICAgICAgIGlmICh0eXBlID09ICd0ZXh0JyB8fCB0eXBlID09ICdpZCcpIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFRleHRJbnB1dFxuICAgICAgICAgICAgICBmaWx0ZXJCYXJJZD17dGhpcy5wcm9wcy5maWx0ZXJCYXJJZH1cbiAgICAgICAgICAgICAgZmlsdGVyVWlkPXt0aGlzLnByb3BzLmZpbHRlclVpZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlID09ICdkYXRlJykge1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8RGF0ZUlucHV0XG4gICAgICAgICAgICAgIGZpbHRlckJhcklkPXt0aGlzLnByb3BzLmZpbHRlckJhcklkfVxuICAgICAgICAgICAgICBmaWx0ZXJVaWQ9e3RoaXMucHJvcHMuZmlsdGVyVWlkfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJ3NlbGVjdCcpIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPFNlbGVjdElucHV0XG4gICAgICAgICAgICAgIGZpbHRlckJhcklkPXt0aGlzLnByb3BzLmZpbHRlckJhcklkfVxuICAgICAgICAgICAgICBmaWx0ZXJVaWQ9e3RoaXMucHJvcHMuZmlsdGVyVWlkfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJ2FnZV9zZWxlY3QnKSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxBZ2VTZWxlY3RJbnB1dFxuICAgICAgICAgICAgICBmaWx0ZXJCYXJJZD17dGhpcy5wcm9wcy5maWx0ZXJCYXJJZH1cbiAgICAgICAgICAgICAgZmlsdGVyVWlkPXt0aGlzLnByb3BzLmZpbHRlclVpZH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldCFcIik7XG4gICAgICAgIH1cbiAgICAqL1xuICAgIHJldHVybiAoXG4gICAgICA8VGV4dElucHV0XG4gICAgICAgIGZpbHRlckJhckFjdG9yPXt0aGlzLmZpbHRlckJhckFjdG9yfVxuICAgICAgICBmaWx0ZXJVaWQ9e3RoaXMuZmlsdGVyVWlkfVxuICAgICAgLz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHZhciBpbnB1dHMgPSB0aGlzLmlucHV0RmFjdG9yeSgpO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy0zIGNvbC1tZC00IGNvbC1zbS02IGNvbC14cy0xMiBmaWx0ZXJcIj5cbiAgICAgICAgPHVsIGNsYXNzTmFtZT17dGhpcy5maWx0ZXJLZXl9PlxuICAgICAgICAgIDxsaT5cbiAgICAgICAgICAgIDxpIG9uQ2xpY2s9e3RoaXMuX29uQ2xpY2suYmluZCh0aGlzKX0gY2xhc3NOYW1lPVwiYnRuIGJ0bi1jaXJjbGUtcHJpbWFyeSBidG4teHMgaWNvbiBpY29uLWNsb3NlIHJlbW92ZS1maWx0ZXJcIiAvPlxuICAgICAgICAgICAgPGxhYmVsPlxuICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5maWx0ZXIubGFiZWx9XG4gICAgICAgICAgICA8L2xhYmVsPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgICAge2lucHV0c31cbiAgICAgICAgPC91bD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBUZXh0SW5wdXQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLmZpbHRlckJhckFjdG9yID0gcHJvcHMuZmlsdGVyQmFyQWN0b3I7XG4gICAgdGhpcy5maWx0ZXJVaWQgPSBwcm9wcy5maWx0ZXJVaWQ7XG5cbiAgICB0aGlzLnN0YXRlID0ge3ZhbHVlOiB0aGlzLmZpbHRlckJhckFjdG9yLmdldEZpbHRlcih0aGlzLmZpbHRlclVpZCkudmFsdWV9O1xuICB9XG5cbiAgX29uQ2hhbmdlKGV2ZW50KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7dmFsdWU6IGV2ZW50LnRhcmdldC52YWx1ZX0pO1xuICAgIHRoaXMuZmlsdGVyQmFyQWN0b3IudXBkYXRlRmlsdGVyKHRoaXMuZmlsdGVyVWlkLCBldmVudC50YXJnZXQudmFsdWUpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8bGk+XG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiXG4gICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLl9vbkNoYW5nZS5iaW5kKHRoaXMpfVxuICAgICAgICAvPlxuICAgICAgPC9saT5cbiAgICApO1xuICB9XG59XG4iLCJpbXBvcnQge0ZpbHRlckxpc3RPcHRpb259IGZyb20gJy4vRmlsdGVyTGlzdE9wdGlvbi5yZWFjdCc7XG5cbmV4cG9ydCBjbGFzcyBGaWx0ZXJMaXN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5maWx0ZXJCYXJBY3RvciA9IHByb3BzLmZpbHRlckJhckFjdG9yO1xuICAgIHRoaXMuZmlsdGVyQmFyU3RvcmUgPSBwcm9wcy5maWx0ZXJCYXJTdG9yZTtcblxuICAgIHRoaXMuZmlsdGVyQmFyU3RvcmUuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy5fb25DaGFuZ2UuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5zdGF0ZSA9IHRoaXMuZ2V0U3RhdGVGcm9tU3RvcmVzKCk7XG4gIH1cblxuICBfb25DaGFuZ2UoKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh0aGlzLmdldFN0YXRlRnJvbVN0b3JlcygpKTtcbiAgfVxuXG4gIGdldFN0YXRlRnJvbVN0b3JlcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZmlsdGVyczogdGhpcy5maWx0ZXJCYXJBY3Rvci5nZXREaXNhYmxlZCgpXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHZhciBmaWx0ZXIgPSB7fTtcbiAgICB2YXIgb3B0aW9uS2V5ID0gXCJcIjtcbiAgICB2YXIgZmlsdGVyT3B0aW9ucyA9IE9iamVjdC5rZXlzKHRoaXMuc3RhdGUuZmlsdGVycykubWFwKGZ1bmN0aW9uKGZpbHRlclVpZCkge1xuICAgICAgb3B0aW9uS2V5ID0gXCJvcHRpb24tXCIrZmlsdGVyVWlkO1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPEZpbHRlckxpc3RPcHRpb25cbiAgICAgICAgICBrZXk9e29wdGlvbktleX1cbiAgICAgICAgICBmaWx0ZXJVaWQ9e2ZpbHRlclVpZH1cbiAgICAgICAgICBmaWx0ZXJCYXJBY3Rvcj17dGhpcy5maWx0ZXJCYXJBY3Rvcn1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfSx0aGlzKTtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXBcIj5cbiAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIHR5cGU9XCJidXR0b25cIj5cbiAgICAgICAgICA8aSBjbGFzc05hbWU9XCJpY29uIGljb24tYWRkXCIgLz5cbiAgICAgICAgICBBZGQgRmlsdGVyXG4gICAgICAgICAgPGkgY2xhc3NOYW1lPVwiaWNvbiBpY29uLWNoZXZyb24tZG93blwiIC8+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8dWwgY2xhc3NOYW1lPVwiZHJvcGRvd24tbWVudVwiIHJvbGU9XCJtZW51XCI+XG4gICAgICAgICAge2ZpbHRlck9wdGlvbnN9XG4gICAgICAgIDwvdWw+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgRmlsdGVyTGlzdE9wdGlvbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuICAgIHRoaXMuZmlsdGVyQmFyQWN0b3IgPSBwcm9wcy5maWx0ZXJCYXJBY3RvcjtcbiAgICB0aGlzLmZpbHRlclVpZCA9IHByb3BzLmZpbHRlclVpZDtcbiAgfVxuXG4gIF9vbkNsaWNrKCkge1xuICAgIHRoaXMuZmlsdGVyQmFyQWN0b3IuZW5hYmxlRmlsdGVyKHRoaXMuZmlsdGVyVWlkKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGxpPlxuICAgICAgICA8YSBvbkNsaWNrPXt0aGlzLl9vbkNsaWNrLmJpbmQodGhpcyl9PlxuICAgICAgICAgIHt0aGlzLmZpbHRlckJhckFjdG9yLmdldEZpbHRlcih0aGlzLmZpbHRlclVpZCkubGFiZWx9XG4gICAgICAgIDwvYT5cbiAgICAgIDwvbGk+XG4gICAgKTtcbiAgfVxufSIsImV4cG9ydCBjbGFzcyBMb2FkRmlsdGVyc0xpc3QgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgfVxuXG4gIGdldFN0YXRlRnJvbVN0b3JlcygpIHtcbiAgICByZXR1cm4ge1xuICAgIH07XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdmFyIGxvYWRGaWx0ZXJzTGlzdEl0ZW1zID0gW107XG4gICAgdmFyIGJ1dHRvbkNsYXNzID0gJ2J0biBidG4tZGVmYXVsdCBkcm9wZG93bi10b2dnbGUnO1xuICAgIGlmIChsb2FkRmlsdGVyc0xpc3RJdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGJ1dHRvbkNsYXNzICs9ICcgZGlzYWJsZWQnXG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBtYXJnaW4tYm90dG9tLXNtXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwXCI+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9e2J1dHRvbkNsYXNzfSBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgdHlwZT1cImJ1dHRvblwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiPlxuICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiaWNvbiBpY29uLXNhdmVcIiAvPlxuICAgICAgICAgICAgU2F2ZWQgU2VhcmNoZXNcbiAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImljb24gaWNvbi1jaGV2cm9uLWRvd25cIiAvPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJkcm9wZG93bi1tZW51XCIgcm9sZT1cIm1lbnVcIj5cbiAgICAgICAgICAgIHtsb2FkRmlsdGVyc0xpc3RJdGVtc31cbiAgICAgICAgICA8L3VsPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1kYW5nZXJcIj5cbiAgICAgICAgICA8aSBjbGFzc05hbWU9XCJpY29uIGljb24tZGVsZXRlXCIgLz5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59IiwiZXhwb3J0IGNsYXNzIFNhdmVGaWx0ZXJzQnV0dG9uIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5zdGF0ZSA9IHtjb25maWd1cmF0aW9uTmFtZTogJyd9O1xuICB9XG5cbiAgX29uQ2xpY2soKSB7XG4gICAgdGhpcy5wcm9wcy5maWx0ZXJCYXJBY3Rvci5zYXZlRmlsdGVycyh0aGlzLnN0YXRlLmNvbmZpZ3VyYXRpb25OYW1lKTtcbiAgfVxuXG4gIF9vbkNoYW5nZShldmVudCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe2NvbmZpZ3VyYXRpb25OYW1lOiBldmVudC50YXJnZXQudmFsdWV9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPFJlYWN0Qm9vdHN0cmFwLkRyb3Bkb3duQnV0dG9uIHRpdGxlPVwiU2F2ZSBTZWFyY2hcIiB0eXBlPVwiYnV0dG9uXCIgYnNTdHlsZT1cImRlZmF1bHRcIiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgbWFyZ2luLWJvdHRvbS1zbVwiPlxuICAgICAgICA8UmVhY3RCb290c3RyYXAuTWVudUl0ZW0gZXZlbnRLZXk9XCIxXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XG4gICAgICAgICAgICA8bGFiZWw+U2VhcmNoIFRpdGxlPC9sYWJlbD5cbiAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiB2YWx1ZT17dGhpcy5zdGF0ZS5jb25maWd1cmF0aW9uTmFtZX0gdHlwZT1cInRleHRcIiBvbkNoYW5nZT17dGhpcy5fb25DaGFuZ2UuYmluZCh0aGlzKX0gLz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXt0aGlzLl9vbkNsaWNrLmJpbmQodGhpcyl9PlNhdmU8L2J1dHRvbj5cbiAgICAgICAgPC9SZWFjdEJvb3RzdHJhcC5NZW51SXRlbT5cbiAgICAgIDwvUmVhY3RCb290c3RyYXAuRHJvcGRvd25CdXR0b24+XG4gICAgKTtcbiAgfVxufVxuIiwiaW1wb3J0IHtGaWx0ZXJCYXJBY3Rvcn0gZnJvbSAnLi4vYWN0b3JzL0ZpbHRlckJhckFjdG9yJztcbmltcG9ydCB7VGFibGVBY3Rvcn0gZnJvbSAnLi4vYWN0b3JzL1RhYmxlQWN0b3InO1xuXG5pbXBvcnQge0ZpbHRlckJhclN0b3JlfSBmcm9tICcuLi9zdG9yZXMvRmlsdGVyQmFyU3RvcmUnO1xuaW1wb3J0IHtUYWJsZVN0b3JlfSBmcm9tICcuLi9zdG9yZXMvVGFibGVTdG9yZSc7XG5cbmltcG9ydCB7RmlsdGVyQmFyfSBmcm9tICcuL0ZpbHRlckJhci9GaWx0ZXJCYXIucmVhY3QnO1xuaW1wb3J0IHtUYWJsZX0gIGZyb20gJy4vVGFibGUvVGFibGUucmVhY3QnO1xuXG5leHBvcnQgY2xhc3MgRmlsdGVyYWJsZVRhYmxlIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5pZCA9IHByb3BzLmZpbHRlcmFibGVUYWJsZUlkO1xuXG5cbiAgICB0aGlzLnRhYmxlU3RvcmUgPSBuZXcgVGFibGVTdG9yZShwcm9wcy50YWJsZSk7XG4gICAgdGhpcy50YWJsZUFjdG9yID0gbmV3IFRhYmxlQWN0b3IodGhpcy50YWJsZVN0b3JlKTtcblxuICAgIHRoaXMuZmlsdGVyQmFyU3RvcmUgPSBuZXcgRmlsdGVyQmFyU3RvcmUocHJvcHMuZmlsdGVyYmFyKTtcbiAgICB0aGlzLmZpbHRlckJhckFjdG9yID0gbmV3IEZpbHRlckJhckFjdG9yKHRoaXMuZmlsdGVyQmFyU3RvcmUsIHRoaXMudGFibGVTdG9yZSk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYga2V5PXt0aGlzLmlkfT5cbiAgICAgICAgPEZpbHRlckJhclxuICAgICAgICAgIGZpbHRlckJhckFjdG9yPXt0aGlzLmZpbHRlckJhckFjdG9yfVxuICAgICAgICAgIGZpbHRlckJhclN0b3JlPXt0aGlzLmZpbHRlckJhclN0b3JlfVxuICAgICAgICAvPlxuICAgICAgICA8VGFibGVcbiAgICAgICAgICB0YWJsZUFjdG9yPXt0aGlzLnRhYmxlQWN0b3J9XG4gICAgICAgICAgdGFibGVTdG9yZT17dGhpcy50YWJsZVN0b3JlfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufVxuIiwiaW1wb3J0IHtUYWJsZUhlYWRpbmdDZWxsfSBmcm9tICcuL1RhYmxlSGVhZGluZ0NlbGwucmVhY3QnO1xuXG5leHBvcnQgY2xhc3MgVGFibGUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMudGFibGVBY3RvciA9IHByb3BzLnRhYmxlQWN0b3I7XG4gICAgdGhpcy50YWJsZVN0b3JlID0gcHJvcHMudGFibGVTdG9yZTtcblxuICAgIHRoaXMuc3RhdGUgPSB0aGlzLmdldFN0YXRlRnJvbVN0b3JlcygpO1xuICAgIHRoaXMudGFibGVTdG9yZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLl9vbkNoYW5nZS5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIF9vbkNoYW5nZSgpIHtcbiAgICB0aGlzLnNldFN0YXRlKHRoaXMuZ2V0U3RhdGVGcm9tU3RvcmVzKCkpO1xuICB9XG5cbiAgX29uQ2xpY2soZXZlbnQpIHtcbiAgICB0aGlzLnRhYmxlQWN0b3IuZmV0Y2hQYWdlZERhdGEoZXZlbnQudGFyZ2V0LmlubmVySFRNTCk7XG4gIH1cblxuICBnZXRTdGF0ZUZyb21TdG9yZXMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbHVtbkhlYWRpbmdzOiB0aGlzLnRhYmxlQWN0b3IuZ2V0Q29sdW1uSGVhZGluZ3MoKSxcbiAgICAgIHJvd3M6IHRoaXMudGFibGVBY3Rvci5nZXRSb3dzKCksXG4gICAgICBjdXJyZW50UGFnZTogdGhpcy50YWJsZUFjdG9yLmdldEN1cnJlbnRQYWdlKCksXG4gICAgICB0b3RhbFBhZ2VzOiB0aGlzLnRhYmxlQWN0b3IuZ2V0VG90YWxQYWdlcygpXG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHZhciBjb2x1bW5zID0gT2JqZWN0LmtleXModGhpcy5zdGF0ZS5jb2x1bW5IZWFkaW5ncykubWFwKGZ1bmN0aW9uKGNvbHVtbklkKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8VGFibGVIZWFkaW5nQ2VsbCBrZXk9e2NvbHVtbklkfSBoZWFkaW5nPXt0aGlzLnN0YXRlLmNvbHVtbkhlYWRpbmdzW2NvbHVtbklkXS5oZWFkaW5nfSAvPlxuICAgICAgKTtcbiAgICB9LHRoaXMpO1xuXG4gICAgaWYgKHRoaXMuc3RhdGUudG90YWxQYWdlcyA+IDEpIHtcbiAgICAgIHZhciBwYWdlcyA9IEFycmF5LmFwcGx5KG51bGwsIEFycmF5KHRoaXMuc3RhdGUudG90YWxQYWdlcykpLm1hcChmdW5jdGlvbihfLGkpIHtyZXR1cm4gaSArIDF9KTtcbiAgICAgIHZhciBwYWdpbmF0aW9uID0gcGFnZXMubWFwKGZ1bmN0aW9uKHBhZ2VOdW1iZXIpIHtcbiAgICAgICAgdmFyIGNsYXNzZXMgPSAnJztcbiAgICAgICAgaWYgKHBhZ2VOdW1iZXIgPT09IHRoaXMuc3RhdGUuY3VycmVudFBhZ2UpIHtcbiAgICAgICAgICBjbGFzc2VzID0gJ2FjdGl2ZSc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8bGkgY2xhc3NOYW1lPXtjbGFzc2VzfT5cbiAgICAgICAgICAgIDxhIG9uQ2xpY2s9e3RoaXMuX29uQ2xpY2suYmluZCh0aGlzKX0+e3BhZ2VOdW1iZXJ9PC9hPlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgIClcbiAgICAgIH0sdGhpcyk7XG4gICAgfVxuXG4gICAgdmFyIHJvd3MgPSB0aGlzLnN0YXRlLnJvd3MubWFwKGZ1bmN0aW9uKHJvdykge1xuICAgICAgdmFyIGNvbHVtbnMgPSBPYmplY3Qua2V5cyhyb3cpLm1hcChmdW5jdGlvbihjb2x1bW5JZCkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgIHtyb3dbY29sdW1uSWRdfVxuICAgICAgICAgIDwvdGQ+XG4gICAgICAgICk7XG4gICAgICB9LHRoaXMpO1xuXG4gICAgICByZXR1cm4gKFxuICAgICAgICA8dHI+XG4gICAgICAgICAge2NvbHVtbnN9XG4gICAgICAgIDwvdHI+XG4gICAgICApO1xuICAgIH0sdGhpcyk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9J3BhbmVsIHBhbmVsLXJlc3BvbnNpdmUnPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT0ndGFibGUtcmVzcG9uc2l2ZSc+XG4gICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT0ndGFibGUgdGFibGUtaG92ZXIgdGFibGUtc3RyaXBlZCc+XG4gICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICB7Y29sdW1uc31cbiAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgIDwvdGhlYWQ+XG4gICAgICAgICAgICA8dGJvZHk+XG4gICAgICAgICAgICAgIHtyb3dzfVxuICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICA8L3RhYmxlPlxuICAgICAgICAgIDxuYXY+XG4gICAgICAgICAgICA8dWwgY2xhc3NOYW1lPSdwYWdpbmF0aW9uJz5cbiAgICAgICAgICAgICAge3BhZ2luYXRpb259XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgIDwvbmF2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBUYWJsZUhlYWRpbmdDZWxsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG4gICAgdGhpcy5oZWFkaW5nID0gcHJvcHMuaGVhZGluZztcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPHRoPlxuICAgICAgICB7dGhpcy5oZWFkaW5nfVxuICAgICAgPC90aD5cbiAgICApO1xuICB9XG59XG4iLCJleHBvcnQgY29uc3QgRmlsdGVyQmFyQ29uc3RhbnRzID0ge1xuICBBY3Rpb25UeXBlczoge1xuICAgIEVOQUJMRV9GSUxURVI6ICdFTkFCTEVfRklMVEVSJyxcbiAgICBESVNBQkxFX0ZJTFRFUjogJ0RJU0FCTEVfRklMVEVSJyxcbiAgICBVUERBVEVfRklMVEVSOiAnVVBEQVRFX0ZJTFRFUicsXG4gICAgQVBQTFlfRklMVEVSUzogJ0FQUExZX0ZJTFRFUlMnXG4gIH1cbn1cbiIsImV4cG9ydCBjb25zdCBUYWJsZUNvbnN0YW50cyA9IHtcbiAgQWN0aW9uVHlwZXM6IHtcbiAgfVxufVxuIiwiaW1wb3J0IHtGaWx0ZXJCYXJDb25zdGFudHN9IGZyb20gJy4uL2NvbnN0YW50cy9GaWx0ZXJCYXJDb25zdGFudHMnO1xuXG52YXIgU2hhcmVkVXRpbHMgPSByZXF1aXJlKCcuLi91dGlscy9TaGFyZWRVdGlscycpO1xuXG5leHBvcnQgY2xhc3MgRmlsdGVyQmFyU3RvcmUge1xuICBjb25zdHJ1Y3RvcihmaWx0ZXJCYXJPcHRpb25zKSB7XG4gICAgdGhpcy5DSEFOR0VfRVZFTlQgPSAnY2hhbmdlJztcbiAgICB0aGlzLmV2ZW50RW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICB0aGlzLmNvbnN0YW50cyA9IEZpbHRlckJhckNvbnN0YW50cztcblxuICAgIHRoaXMuZmlsdGVycyA9IHRoaXMucGFyc2VSYXdGaWx0ZXJMaXN0KFxuICAgICAgZmlsdGVyQmFyT3B0aW9ucy5jb25maWd1cmF0aW9uLnF1ZXJ5U2VsZWN0b3IoJ2RsLmZpbHRlcnMnKS5xdWVyeVNlbGVjdG9yQWxsKCdkdC5maWx0ZXInKVxuICAgICk7XG4gICAgdGhpcy51cmwgPSBmaWx0ZXJCYXJPcHRpb25zLmNvbmZpZ3VyYXRpb24ucXVlcnlTZWxlY3RvcignZHQuc2VhcmNoLXVybCcpLmdldEF0dHJpYnV0ZSgnZGF0YS11cmwnKTtcblxuICAgIGlmICh3aW5kb3cubG9jYXRpb24uc2VhcmNoICE9ICcnKSB7XG4gICAgICB2YXIgcXVlcmllcyA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc3BsaXQoJz8nKVsxXS5zcGxpdCgnJicpLFxuICAgICAgICAgIGVuYWJsZWRGaWx0ZXJzLFxuICAgICAgICAgIHF1ZXJ5O1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWVyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHF1ZXJ5ID0gcXVlcmllc1tpXTtcbiAgICAgICAgaWYgKHF1ZXJ5Lm1hdGNoKC9ecT0vKSkge1xuICAgICAgICAgIGVuYWJsZWRGaWx0ZXJzID0gSlNPTi5wYXJzZShhdG9iKHF1ZXJ5LnN1YnN0cmluZygyLHF1ZXJ5Lmxlbmd0aCkpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdmFyIGZpbHRlcjtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZW5hYmxlZEZpbHRlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZmlsdGVyID0gZW5hYmxlZEZpbHRlcnNbaV07XG4gICAgICAgIHRoaXMuZW5hYmxlRmlsdGVyKGZpbHRlci51aWQsIGZpbHRlci52YWx1ZSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRGaWx0ZXIoZmlsdGVyVWlkKSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyc1tmaWx0ZXJVaWRdXG4gIH1cblxuICBnZXREaXNhYmxlZCgpIHtcbiAgICB2YXIgZGlzYWJsZWRGaWx0ZXJzID0ge307XG4gICAgZm9yICh2YXIgZmlsdGVyVWlkIGluIHRoaXMuZmlsdGVycykge1xuICAgICAgaWYgKHRoaXMuZmlsdGVyc1tmaWx0ZXJVaWRdLmVuYWJsZWQgPT09IGZhbHNlKSB7XG4gICAgICAgIGRpc2FibGVkRmlsdGVyc1tmaWx0ZXJVaWRdID0gdGhpcy5maWx0ZXJzW2ZpbHRlclVpZF07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBkaXNhYmxlZEZpbHRlcnM7XG4gIH1cblxuICBnZXRFbmFibGVkKCkge1xuICAgIHZhciBlbmFibGVkRmlsdGVycyA9IHt9O1xuICAgIGZvciAodmFyIGZpbHRlclVpZCBpbiB0aGlzLmZpbHRlcnMpIHtcbiAgICAgIGlmICh0aGlzLmZpbHRlcnNbZmlsdGVyVWlkXS5lbmFibGVkID09PSB0cnVlKSB7XG4gICAgICAgIGVuYWJsZWRGaWx0ZXJzW2ZpbHRlclVpZF0gPSB0aGlzLmZpbHRlcnNbZmlsdGVyVWlkXTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVuYWJsZWRGaWx0ZXJzO1xuICB9XG5cbiAgZ2V0QmFzZTY0UXVlcnkoKSB7XG4gICAgdmFyIGVuYWJsZWRGaWx0ZXJzID0gT2JqZWN0LmtleXModGhpcy5nZXRFbmFibGVkKCkpLm1hcChmdW5jdGlvbihmaWx0ZXJVaWQpIHtcbiAgICAgIHZhciBmaWx0ZXIgPSB0aGlzLmdldEZpbHRlcihmaWx0ZXJVaWQpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdWlkOiBmaWx0ZXJVaWQsXG4gICAgICAgIHR5cGU6IGZpbHRlci50eXBlLFxuICAgICAgICBmaWVsZDogZmlsdGVyLmZpZWxkLFxuICAgICAgICB2YWx1ZTogZmlsdGVyLnZhbHVlXG4gICAgICB9XG4gICAgfSx0aGlzKTtcbiAgICBlbmFibGVkRmlsdGVycyA9IGVuYWJsZWRGaWx0ZXJzLmxlbmd0aCA+IDAgPyBidG9hKEpTT04uc3RyaW5naWZ5KGVuYWJsZWRGaWx0ZXJzKSk6ICcnO1xuICAgIGNvbnNvbGUubG9nKGVuYWJsZWRGaWx0ZXJzKTtcbiAgICByZXR1cm4gZW5hYmxlZEZpbHRlcnM7XG4gIH1cblxuICBnZXRRdWVyeVN0cmluZygpIHtcbiAgICB2YXIgZW5hYmxlZEZpbHRlcnMgPSB0aGlzLmdldEVuYWJsZWQoKTtcbiAgICB2YXIgZmlsdGVyLFxuICAgICAgICBwcmVmaXgsXG4gICAgICAgIHF1ZXJ5X29iamVjdCxcbiAgICAgICAgcXVlcnlfc3RyaW5nID0gJyc7XG5cbiAgICBmb3IgKHZhciBmaWx0ZXJVaWQgaW4gZW5hYmxlZEZpbHRlcnMpIHtcbiAgICAgIGZpbHRlciA9IGVuYWJsZWRGaWx0ZXJzW2ZpbHRlclVpZF07XG4gICAgICBwcmVmaXggPSAnJztcbiAgICAgIHByZWZpeCArPSAncSc7XG4gICAgICBwcmVmaXggKz0gJ1snICsgZmlsdGVyLnR5cGUgKyAnXSc7XG4gICAgICBxdWVyeV9vYmplY3QgPSB7fTtcbiAgICAgIHF1ZXJ5X29iamVjdFtmaWx0ZXIuZmllbGRdID0gZmlsdGVyLnZhbHVlO1xuXG4gICAgICBxdWVyeV9zdHJpbmcgKz0gU2hhcmVkVXRpbHMuc2VyaWFsaXplKHF1ZXJ5X29iamVjdCwgcHJlZml4KSArICcmJztcbiAgICB9XG4gICAgcmV0dXJuIHF1ZXJ5X3N0cmluZztcbiAgfVxuXG4gIHBhcnNlUmF3RmlsdGVyTGlzdChyYXdGaWx0ZXJMaXN0KSB7XG4gICAgdmFyIHJhd0ZpbHRlcixcbiAgICAgICAgcGFyc2VkRmlsdGVyTGlzdCA9IHt9O1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCByYXdGaWx0ZXJMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICByYXdGaWx0ZXIgPSByYXdGaWx0ZXJMaXN0W2ldO1xuICAgICAgcGFyc2VkRmlsdGVyTGlzdFtyYXdGaWx0ZXIuZ2V0QXR0cmlidXRlKCdkYXRhLXVpZCcpXSA9IHtcbiAgICAgICAgbGFiZWw6IHJhd0ZpbHRlci5nZXRBdHRyaWJ1dGUoJ2RhdGEtbGFiZWwnKSxcbiAgICAgICAgdHlwZTogcmF3RmlsdGVyLmdldEF0dHJpYnV0ZSgnZGF0YS10eXBlJyksXG4gICAgICAgIGZpZWxkOiByYXdGaWx0ZXIuZ2V0QXR0cmlidXRlKCdkYXRhLWZpZWxkJyksXG4gICAgICAgIHZhbHVlOiAnJyxcbiAgICAgICAgZW5hYmxlZDogZmFsc2VcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBwYXJzZWRGaWx0ZXJMaXN0O1xuICB9XG5cbiAgLyogTXV0YXRpb24gTWV0aG9kcyAqL1xuICBkaXNhYmxlQWxsRmlsdGVycygpIHtcbiAgICB2YXIgZW5hYmxlZEZpbHRlcnMgPSB0aGlzLmdldEVuYWJsZWQoKTtcblxuICAgIGZvciAodmFyIGZpbHRlclVpZCBpbiBlbmFibGVkRmlsdGVycykge1xuICAgICAgdGhpcy5kaXNhYmxlRmlsdGVyKGZpbHRlclVpZCk7XG4gICAgfVxuICAgIHRoaXMuZW1pdENoYW5nZSgpO1xuICB9XG5cbiAgZGlzYWJsZUZpbHRlcihmaWx0ZXJVaWQpIHtcbiAgICB0aGlzLmZpbHRlcnNbZmlsdGVyVWlkXS5lbmFibGVkID0gZmFsc2U7XG4gICAgdGhpcy5maWx0ZXJzW2ZpbHRlclVpZF0udmFsdWUgPSAnJztcbiAgICB0aGlzLmVtaXRDaGFuZ2UoKTtcbiAgfVxuXG4gIGVuYWJsZUZpbHRlcihmaWx0ZXJVaWQsIHZhbHVlKSB7XG4gICAgdGhpcy5maWx0ZXJzW2ZpbHRlclVpZF0uZW5hYmxlZCA9IHRydWU7XG4gICAgdGhpcy5maWx0ZXJzW2ZpbHRlclVpZF0udmFsdWUgPSB2YWx1ZSB8fCAnJztcbiAgICB0aGlzLmVtaXRDaGFuZ2UoKTtcbiAgfVxuXG4gIHVwZGF0ZUZpbHRlcihmaWx0ZXJVaWQsIHZhbHVlKSB7XG4gICAgdGhpcy5maWx0ZXJzW2ZpbHRlclVpZF0udmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLmVtaXRDaGFuZ2UoKTtcbiAgfVxuXG4gIGVtaXRDaGFuZ2UoKSB7XG4gICAgdGhpcy5ldmVudEVtaXR0ZXIuZW1pdCh0aGlzLkNIQU5HRV9FVkVOVCk7XG4gIH1cblxuICBhZGRDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMuZXZlbnRFbWl0dGVyLm9uKHRoaXMuQ0hBTkdFX0VWRU5ULCBjYWxsYmFjayk7XG4gIH1cblxuICByZW1vdmVDaGFuZ2VMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMuZXZlbnRFbWl0dGVyLnJlbW92ZUxpc3RlbmVyKHRoaXMuQ0hBTkdFX0VWRU5ULCBjYWxsYmFjayk7XG4gIH1cbn1cbiIsImltcG9ydCB7VGFibGVDb25zdGFudHN9IGZyb20gJy4uL2NvbnN0YW50cy9UYWJsZUNvbnN0YW50cyc7XG5cbmltcG9ydCAqIGFzIFNlYXJjaFV0aWxzIGZyb20gJy4uL3V0aWxzL1NlYXJjaFV0aWxzJztcblxuZXhwb3J0IGNsYXNzIFRhYmxlU3RvcmUge1xuICBjb25zdHJ1Y3Rvcih0YWJsZU9wdGlvbnMpIHtcbiAgICB0aGlzLkNIQU5HRV9FVkVOVCA9ICdjaGFuZ2UnO1xuICAgIHRoaXMuZXZlbnRFbWl0dGVyID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgIHRoaXMuY29uc3RhbnRzID0gVGFibGVDb25zdGFudHM7XG5cbiAgICB0aGlzLnJvd3MgPSBbXTtcbiAgICB0aGlzLmN1cnJlbnRQYWdlID0gMTtcbiAgICB0aGlzLnRvdGFsUGFnZXMgPSAxO1xuXG4gICAgdGhpcy5jb2x1bW5IZWFkaW5ncyA9IHRoaXMucGFyc2VSYXdDb2x1bW5IZWFkaW5nTGlzdChcbiAgICAgIHRhYmxlT3B0aW9ucy5jb25maWd1cmF0aW9uLnF1ZXJ5U2VsZWN0b3IoJ2RsLmNvbHVtbnMnKS5xdWVyeVNlbGVjdG9yQWxsKCdkdC5jb2x1bW4nKVxuICAgIClcbiAgICB0aGlzLmJhc2VVcmwgPSB0YWJsZU9wdGlvbnMuY29uZmlndXJhdGlvbi5xdWVyeVNlbGVjdG9yKCdkdC5kYXRhLXVybCcpLmdldEF0dHJpYnV0ZSgnZGF0YS11cmwnKTtcbiAgICB0aGlzLnVybCA9IHdpbmRvdy5sb2NhdGlvbjtcbiAgICB0aGlzLmZldGNoRGF0YSgpO1xuICB9XG5cblxuXG4gIHNldFVybCh1cmwpIHtcbiAgICB0aGlzLnVybCA9IHVybDtcbiAgfVxuXG4gIGdldFVybCgpIHtcbiAgICByZXR1cm4gdGhpcy51cmw7XG4gIH1cblxuICBnZXRCYXNlVXJsKCkge1xuICAgIHJldHVybiB0aGlzLmJhc2VVcmw7XG4gIH1cblxuICBmZXRjaERhdGEocGFnZSkge1xuICAgIHZhciB1cmwgPSB0aGlzLnVybDtcbiAgICBpZihwYWdlICE9IG51bGwpIHtcbiAgICAgIHVybCArPSAnJnBhZ2U9JyArIHBhZ2U7XG4gICAgfVxuICAgIFNlYXJjaFV0aWxzLnNlYXJjaChcbiAgICAgIHVybCxcbiAgICAgIHRoaXMuc2V0RGF0YS5iaW5kKHRoaXMpXG4gICAgKTtcbiAgfVxuXG4gIHNldERhdGEocmVzcG9uc2UpIHtcbiAgICB0aGlzLnJvd3MgPSByZXNwb25zZS5yZXN1bHRzO1xuICAgIHRoaXMuY3VycmVudFBhZ2UgPSByZXNwb25zZS5jdXJyZW50X3BhZ2U7XG4gICAgdGhpcy50b3RhbFBhZ2VzID0gcmVzcG9uc2UudG90YWxfcGFnZXM7XG4gICAgdGhpcy5lbWl0Q2hhbmdlKCk7XG4gIH1cblxuICBwYXJzZVJhd0NvbHVtbkhlYWRpbmdMaXN0KHJhd0NvbHVtbkhlYWRpbmdMaXN0KSB7XG4gICAgdmFyIHJhd0NvbHVtbkhlYWRpbmdMaXN0LFxuICAgICAgICByYXdDb2x1bW4sXG4gICAgICAgIHBhcnNlZENvbHVtbkxpc3QgPSB7fTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmF3Q29sdW1uSGVhZGluZ0xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIHJhd0NvbHVtbiA9IHJhd0NvbHVtbkhlYWRpbmdMaXN0W2ldO1xuICAgICAgcGFyc2VkQ29sdW1uTGlzdFtyYXdDb2x1bW4uZ2V0QXR0cmlidXRlKCdkYXRhLWZpZWxkJyldID0ge1xuICAgICAgICBoZWFkaW5nOiByYXdDb2x1bW4uZ2V0QXR0cmlidXRlKCdkYXRhLWhlYWRpbmcnKVxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlZENvbHVtbkxpc3Q7XG4gIH1cblxuICBnZXRDb2x1bW5IZWFkaW5ncygpIHtcbiAgICByZXR1cm4gdGhpcy5jb2x1bW5IZWFkaW5ncztcbiAgfVxuXG4gIGdldFJvd3MoKSB7XG4gICAgcmV0dXJuIHRoaXMucm93cztcbiAgfVxuXG4gIGdldEN1cnJlbnRQYWdlKCkge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRQYWdlO1xuICB9XG5cbiAgZ2V0VG90YWxQYWdlcygpIHtcbiAgICByZXR1cm4gdGhpcy50b3RhbFBhZ2VzO1xuICB9XG5cbiAgZW1pdENoYW5nZSgpIHtcbiAgICB0aGlzLmV2ZW50RW1pdHRlci5lbWl0KHRoaXMuQ0hBTkdFX0VWRU5UKTtcbiAgfVxuXG4gIGFkZENoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5ldmVudEVtaXR0ZXIub24odGhpcy5DSEFOR0VfRVZFTlQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHJlbW92ZUNoYW5nZUxpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5ldmVudEVtaXR0ZXIucmVtb3ZlTGlzdGVuZXIodGhpcy5DSEFOR0VfRVZFTlQsIGNhbGxiYWNrKTtcbiAgfVxufVxuIiwidmFyIFNoYXJlZFV0aWxzID0gcmVxdWlyZSgnLi9TaGFyZWRVdGlscycpO1xuXG5leHBvcnQgZnVuY3Rpb24gc2VhcmNoKHVybCwgc3VjY2Vzcykge1xuICBTaGFyZWRVdGlscy5hamF4R2V0KHVybCwgJ2pzb24nLCBzdWNjZXNzKTtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBhamF4R2V0OiBmdW5jdGlvbih1cmwsIHR5cGUsIHN1Y2Nlc3MsIGVycm9yKSB7XG4gICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xuICAgIHhoci5yZXNwb25zZVR5cGUgPSB0eXBlO1xuICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQ29udGVudC1UeXBlXCIsIFwiYXBwbGljYXRpb24vanNvblwiKTtcbiAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihcIkFjY2VwdFwiLCBcImFwcGxpY2F0aW9uL2pzb25cIik7XG4gICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJYLVJlcXVlc3RlZC1XaXRoXCIsIFwiWE1MSHR0cFJlcXVlc3RcIik7XG4gICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHN0YXR1cyA9IHhoci5zdGF0dXM7XG4gICAgICB2YXIgcmVzcG9uc2UgPSB4aHIucmVzcG9uc2U7XG4gICAgICBpZiAoc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgcmV0dXJuIHN1Y2Nlc3MocmVzcG9uc2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGVycm9yKHJlc3BvbnNlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHhoci5zZW5kKCk7XG4gIH0sXG4gIHNlcmlhbGl6ZTogZnVuY3Rpb24ob2JqLCBwcmVmaXgpIHtcbiAgICB2YXIgc3RyID0gW107XG4gICAgZm9yKHZhciBwIGluIG9iaikge1xuICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShwKSkge1xuICAgICAgICB2YXIgayA9IHByZWZpeCA/IHByZWZpeCArIFwiW1wiICsgcCArIFwiXVwiIDogcCwgdiA9IG9ialtwXTtcbiAgICAgICAgc3RyLnB1c2godHlwZW9mIHYgPT0gXCJvYmplY3RcIiA/XG4gICAgICAgICAgdGhpcy5zZXJpYWxpemUodiwgaykgOlxuICAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChrKSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHYpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN0ci5qb2luKFwiJlwiKTtcbiAgfVxufTtcbiJdfQ==

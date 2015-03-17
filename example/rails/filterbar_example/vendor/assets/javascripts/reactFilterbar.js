(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var FilterBar = require("./components/filterbar.js.jsx");
window.FilterBar = FilterBar;

},{"./components/filterbar.js.jsx":5}],2:[function(require,module,exports){
"use strict";

var ApplyConfigurationButton = React.createClass({
  displayName: "ApplyConfigurationButton",

  render: function render() {
    return React.createElement(
      "button",
      { className: "btn btn-primary", onClick: this.props.onClick },
      React.createElement("i", { className: "icon icon-tick" }),
      "Apply"
    );
  }
});

module.exports = ApplyConfigurationButton;

},{}],3:[function(require,module,exports){
"use strict";

var ClearConfigurationButton = React.createClass({
  displayName: "ClearConfigurationButton",

  render: function render() {
    return React.createElement(
      "button",
      { className: "btn btn-warning", onClick: this.props.onClick },
      React.createElement("i", { className: "icon icon-delete" }),
      "Clear"
    );
  }
});

module.exports = ClearConfigurationButton;

},{}],4:[function(require,module,exports){
"use strict";

var ConfigurationList = React.createClass({
  displayName: "ConfigurationList",

  render: function render() {
    var configurations = this.props.configurations.map(function (configuration) {
      return React.createElement(ConfigurationList.Configuration, {
        configuration: configuration,
        onClick: this.props.loadConfiguration
      });
    }, this);
    if (configurations.length !== 0) {
      return React.createElement(
        "div",
        { className: "btn-group margin-bottom-sm" },
        React.createElement(
          "div",
          { className: "btn-group" },
          React.createElement(
            "button",
            { className: "btn btn-default dropdown-toggle", "data-toggle": "dropdown", type: "button", "aria-expanded": "false" },
            React.createElement("i", { className: "icon icon-save" }),
            "Saved Searches",
            React.createElement("i", { className: "icon icon-chevron-down" })
          ),
          React.createElement(
            "ul",
            { className: "dropdown-menu", role: "menu" },
            configurations
          )
        ),
        React.createElement(
          "button",
          { type: "button", className: "btn btn-danger" },
          React.createElement("i", { className: "icon icon-delete" })
        )
      );
    } else {
      return React.createElement(
        "div",
        { className: "btn-group margin-bottom-sm" },
        React.createElement(
          "div",
          { className: "btn-group" },
          React.createElement(
            "button",
            { className: "btn btn-default dropdown-toggle disabled", "data-toggle": "dropdown", type: "button", "aria-expanded": "false" },
            React.createElement("i", { className: "icon icon-save" }),
            "Saved Searches",
            React.createElement("i", { className: "icon icon-chevron-down" })
          ),
          React.createElement(
            "ul",
            { className: "dropdown-menu", role: "menu" },
            configurations
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

ConfigurationList.Configuration = React.createClass({
  displayName: "Configuration",

  onClick: function onClick() {
    this.props.onClick(this.props.configuration.configuration);
  },
  render: function render() {
    return React.createElement(
      "li",
      null,
      React.createElement(
        "a",
        { className: "dynamic-text-filter", onClick: this.onClick },
        this.props.configuration.name
      )
    );
  }
});

module.exports = ConfigurationList;

},{}],5:[function(require,module,exports){
"use strict";

var FilterList = require("./filterlist.js.jsx");
var ApplyConfigurationButton = require("./applyconfigurationbutton.js.jsx");
var ClearConfigurationButton = require("./clearconfigurationbutton.js.jsx");
var SaveConfigurationButton = require("./saveconfigurationbutton.js.jsx");
var ConfigurationList = require("./configurationlist.js.jsx");
var FilterDisplay = require("./filterdisplay.js.jsx");

var FilterBar = React.createClass({
  displayName: "FilterBar",

  getInitialState: function getInitialState() {
    return {
      filters: [],
      configurations: [] };
  },
  componentDidMount: function componentDidMount() {
    var filters = window.filterList.map(function (filter) {
      filter.enabled = false;
      filter.query_string = "q[" + filter.type + "][" + filter.field + "]";
      return filter;
    });

    this.loadConfigurations();
    this.setState({ filters: filters });
  },
  loadConfigurations: function loadConfigurations() {
    var configurations = [];

    $.ajax({
      url: this.props.configurations_url,
      type: "GET",
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: (function (data) {
        for (var i in data) {
          var name = data[i].name;
          var configuration = JSON.parse(data[i].configuration);

          configurations.push({ name: name, configuration: configuration });
        }
        this.setState({ configurations: configurations });
      }).bind(this),
      error: (function (_error) {
        var _errorWrapper = function error(_x, _x2, _x3) {
          return _error.apply(this, arguments);
        };

        _errorWrapper.toString = function () {
          return _error.toString();
        };

        return _errorWrapper;
      })(function (xhr, status, error) {
        console.error(xhr);
        console.error(status);
        console.error(error);
      })
    });
  },
  loadConfiguration: function loadConfiguration(configuration) {
    this.clearConfiguration();

    configuration = $.extend(true, [], configuration);
    var filters = this.state.filters.slice(0);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = configuration[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var cFilter = _step.value;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = filters[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var filter = _step2.value;

            if (cFilter.uid === filter.uid) {
              filter.value = cFilter.value;
              this.setState({ filters: filters });
              this.enableFilter(filter);
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
              _iterator2["return"]();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
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

    this.applyConfiguration();
  },
  saveConfiguration: function saveConfiguration(search_title) {
    var filteredArray = this.state.filters.filter(function (filter) {
      return filter.enabled === true && Object.keys(filter.value !== 0);
    });

    var filters = filteredArray.map(function (filter) {
      filterConfig = {};
      filterConfig.uid = filter.uid;
      filterConfig.value = filter.value;
      return filterConfig;
    });

    var payload = { saved_search: { search_title: search_title, filters: filters } };

    $.ajax({
      url: this.props.configurations_url,
      type: "POST",
      contentType: "application/json; charset=utf-8",
      data: JSON.stringify(payload),
      dataType: "script",
      success: (function (data) {
        this.loadConfigurations();
        this.applyConfiguration();
      }).bind(this),
      error: (function (_error) {
        var _errorWrapper = function error(_x, _x2, _x3) {
          return _error.apply(this, arguments);
        };

        _errorWrapper.toString = function () {
          return _error.toString();
        };

        return _errorWrapper;
      })(function (xhr, status, error) {
        console.error(xhr);
        console.error(status);
        console.error(error);
      })
    });
  },
  applyConfiguration: function applyConfiguration() {
    var filteredArray = this.state.filters.filter(function (filter) {
      return filter.enabled === true && Object.keys(filter.value !== 0);
    });

    var payload = filteredArray.map(function (filter) {
      var filterConfig = {};
      filterConfig[filter.query_string] = filter.value;
      var filterParams = $.param(filterConfig);
      return filterParams;
    });

    var result = payload.join("&");

    $.ajax({
      url: this.props.resource_url + "?" + result,
      type: "GET",
      contentType: "application/json; charset=utf-8",
      dataType: "script",
      success: function success(data) {},
      error: (function (_error) {
        var _errorWrapper = function error(_x, _x2, _x3) {
          return _error.apply(this, arguments);
        };

        _errorWrapper.toString = function () {
          return _error.toString();
        };

        return _errorWrapper;
      })(function (xhr, status, error) {
        console.error(xhr);
        console.error(status);
        console.error(error);
      })
    });
  },
  clearConfiguration: function clearConfiguration() {
    var filters = this.state.filters.slice(0);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = filters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var filter = _step.value;

        this.disableFilter(filter);
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

    this.applyConfiguration();
  },
  enableFilter: function enableFilter(filter) {
    var filters = this.state.filters.slice(0);
    for (var i in filters) {
      if (filters[i].uid == filter.uid) {
        filters[i].enabled = true;
        break;
      }
    }

    this.setState({ filters: filters });
  },
  disableFilter: function disableFilter(filter) {
    var filters = this.state.filters.slice(0);
    for (var i in filters) {
      if (filters[i].uid == filter.uid) {
        filters[i].enabled = false;
        filters[i].value = null;
        break;
      }
    }
    this.setState({ filters: filters });
  },
  updateFilter: function updateFilter(filter) {
    var filters = this.state.filters.slice(0);

    for (var i in filters) {
      if (filters[i].uid === filter.uid) {
        filters[i].value = filter.value;
        filters[i].query_string = filter.query_string;
        break;
      }
    }
    this.setState({ filters: filters });
  },
  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "div",
        { className: "btn-group margin-bottom-sm" },
        React.createElement(FilterList, { filters: this.state.filters, enableFilter: this.enableFilter }),
        React.createElement(
          "button",
          { type: "button", className: "btn btn-default disabled" },
          React.createElement("i", { className: "icon icon-download" }),
          "Export CSV"
        ),
        React.createElement(ApplyConfigurationButton, { onClick: this.applyConfiguration }),
        React.createElement(ClearConfigurationButton, { onClick: this.clearConfiguration })
      ),
      React.createElement(SaveConfigurationButton, { onClick: this.saveConfiguration, onChange: this.updateConfigurationName }),
      React.createElement(ConfigurationList, { configurations: this.state.configurations, loadConfiguration: this.loadConfiguration }),
      React.createElement(FilterDisplay, { filters: this.state.filters, disableFilter: this.disableFilter, updateFilter: this.updateFilter })
    );
  }
});

module.exports = FilterBar;

},{"./applyconfigurationbutton.js.jsx":2,"./clearconfigurationbutton.js.jsx":3,"./configurationlist.js.jsx":4,"./filterdisplay.js.jsx":6,"./filterlist.js.jsx":7,"./saveconfigurationbutton.js.jsx":11}],6:[function(require,module,exports){
"use strict";

var TextInput = require("./inputs/textinput.js.jsx");
var DateInput = require("./inputs/dateinput.js.jsx");
var SelectInput = require("./inputs/selectinput.js.jsx");

var FilterDisplay = React.createClass({
  displayName: "FilterDisplay",

  render: function render() {
    var filters = [];
    var filteredArray = this.props.filters.filter(function (filter) {
      return filter.enabled === true;
    });

    if (filteredArray.length !== 0) {
      filters = filteredArray.map(function (filter) {
        if (filter.enabled === true) {
          return React.createElement(FilterDisplay.Filter, {
            filter: filter,
            disableFilter: this.props.disableFilter,
            updateFilter: this.props.updateFilter
          });
        }
      }, this);
    } else {
      filters = React.createElement(
        "div",
        null,
        "No Filters Enabled"
      );
    }

    return React.createElement(
      "div",
      { className: "navbar filterbar" },
      React.createElement(
        "div",
        { className: "panel panel-default", id: "filters" },
        filters
      )
    );
  }
});

FilterDisplay.Filter = React.createClass({
  displayName: "Filter",

  disableFilter: function disableFilter() {
    this.props.disableFilter(this.props.filter);
  },
  render: function render() {
    var inputs = React.createElement(FilterDisplay.Filter.Inputs, {
      filter: this.props.filter,
      updateFilter: this.props.updateFilter
    });
    return React.createElement(
      "div",
      { className: "col-lg-3 col-md-4 col-sm-6 col-xs-12 filter" },
      React.createElement(
        "ul",
        { className: this.props.filter.uid },
        React.createElement(
          "li",
          null,
          React.createElement("i", { onClick: this.disableFilter, className: "btn btn-circle-primary btn-xs icon icon-close remove-filter" }),
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
});

FilterDisplay.Filter.Inputs = React.createClass({
  displayName: "Inputs",

  inputFactory: function inputFactory() {
    var type = this.props.filter.type;
    if (type == "text" || type == "id") {
      return React.createElement(TextInput, {
        filter: this.props.filter,
        onChange: this.props.updateFilter
      });
    } else if (type == "date") {
      return React.createElement(DateInput, {
        filter: this.props.filter,
        onChange: this.props.updateFilter
      });
    } else if (type == "select") {
      return React.createElement(SelectInput, {
        filter: this.props.filter,
        onChange: this.props.updateFilter
      });
    } else if (type == "age_select") {
      return React.createElement(AgeSelectInput, {
        filter: this.props.filter,
        onChange: this.props.updateFilter
      });
    } else {
      console.error("Not implemented yet!");
    }
  },
  render: function render() {
    var inputs = this.inputFactory();
    return inputs;
  }
});

var AgeSelectInput = React.createClass({
  displayName: "AgeSelectInput",

  getInitialState: function getInitialState() {
    return {
      selected: this.props.filter.value || "0,15"
    };
  },
  componentDidMount: function componentDidMount() {
    var filter = $.extend(true, {}, this.props.filter);
    filter.value = this.state.selected;
    this.props.onChange(filter);
  },
  onChange: function onChange(event) {
    var filter = $.extend(true, {}, this.props.filter);
    filter.value = event.target.value;

    this.setState({ selected: event.target.value });
    this.props.onChange(filter);
  },
  render: function render() {
    return React.createElement(
      "li",
      null,
      React.createElement(
        "select",
        {
          className: "form-control",
          selected: this.state.selected,
          onChange: this.onChange
        },
        React.createElement(
          "option",
          { value: "0,15" },
          "15 and under"
        ),
        React.createElement(
          "option",
          { value: "16,24" },
          "16 - 24"
        ),
        React.createElement(
          "option",
          { value: "25,34" },
          "25 - 34"
        ),
        React.createElement(
          "option",
          { value: "35,44" },
          "35 - 44"
        ),
        React.createElement(
          "option",
          { value: "45,54" },
          "45 - 54"
        ),
        React.createElement(
          "option",
          { value: "55,64" },
          "55 - 64"
        ),
        React.createElement(
          "option",
          { value: "65,74" },
          "65 - 74"
        ),
        React.createElement(
          "option",
          { value: "75,100" },
          "75 and over"
        )
      )
    );
  }
});

module.exports = FilterDisplay;

},{"./inputs/dateinput.js.jsx":8,"./inputs/selectinput.js.jsx":9,"./inputs/textinput.js.jsx":10}],7:[function(require,module,exports){
"use strict";

var FilterList = React.createClass({
  displayName: "FilterList",

  render: function render() {
    var filterOptions = this.props.filters.map(function (filter) {
      if (filter.enabled === false) {
        return React.createElement(FilterList.FilterOption, {
          filter: filter,
          onClick: this.props.enableFilter
        });
      }
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
});

FilterList.FilterOption = React.createClass({
  displayName: "FilterOption",

  onClick: function onClick() {
    this.props.onClick(this.props.filter);
  },
  render: function render() {
    return React.createElement(
      "li",
      null,
      React.createElement(
        "a",
        { onClick: this.onClick },
        this.props.filter.label
      )
    );
  } });

module.exports = FilterList;

},{}],8:[function(require,module,exports){
"use strict";

var DateInput = React.createClass({
  displayName: "DateInput",

  getInitialState: function getInitialState() {
    if (this.props.filter.value) {
      return {
        from: this.props.filter.value.from,
        to: this.props.filter.value.to };
    } else {
      return {
        from: "",
        to: "" };
    }
  },
  onChange: function onChange(event) {
    var filter = $.extend(true, {}, this.props.filter);
    var value = filter.value || {};

    var stateObject = this.state;
    var date = event.date.format("DD-MM-YYYY");
    if (event.target.classList.contains("dateRangeFrom")) {
      stateObject.from = date;
      value.from = date;
    } else if (event.target.classList.contains("dateRangeTo")) {
      stateObject.to = date;
      value.to = date;
    }

    filter.value = value;

    this.setState(stateObject);
    this.props.onChange(filter);
  },
  componentDidMount: function componentDidMount() {
    var datePickerFrom = $(React.findDOMNode(this.refs.dateRangeFrom));
    datePickerFrom.datetimepicker({ format: "DD-MM-YYYY" });
    datePickerFrom.datetimepicker().on("dp.change", this.onChange);

    var datePickerTo = $(React.findDOMNode(this.refs.dateRangeTo));
    datePickerTo.datetimepicker({ format: "DD-MM-YYYY" });
    datePickerTo.datetimepicker().on("dp.change", this.onChange);
  },
  render: function render() {
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
          onChange: this.onChange,
          value: this.state.from
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
          onChange: this.onChange,
          value: this.state.to
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
});

module.exports = DateInput;

},{}],9:[function(require,module,exports){
"use strict";

var SelectInput = React.createClass({
  displayName: "SelectInput",

  getInitialState: function getInitialState() {
    return {
      selected: this.props.filter.value || this.props.filter.selections[0][0]
    };
  },
  componentDidMount: function componentDidMount() {
    var filter = $.extend(true, {}, this.props.filter);
    filter.value = this.state.selected;
    this.props.onChange(filter);
  },
  onChange: function onChange(event) {
    var filter = $.extend(true, {}, this.props.filter);
    filter.value = event.target.value;

    this.setState({ selected: event.target.value });
    this.props.onChange(filter);
  },
  render: function render() {
    var options = this.props.filter.selections.map(function (option) {
      return React.createElement(
        "option",
        { value: option[0] },
        option[1]
      );
    });
    return React.createElement(
      "li",
      null,
      React.createElement(
        "select",
        {
          className: "form-control",
          selected: this.state.selected,
          onChange: this.onChange
        },
        options
      )
    );
  }
});

module.exports = SelectInput;

},{}],10:[function(require,module,exports){
"use strict";

var TextInput = React.createClass({
  displayName: "TextInput",

  getInitialState: function getInitialState() {
    return {
      value: this.props.filter.value || ""
    };
  },
  onChange: function onChange(event) {
    var filter = $.extend(true, {}, this.props.filter);
    filter.value = event.target.value;

    this.setState({ value: event.target.value });
    this.props.onChange(filter);
  },
  render: function render() {
    return React.createElement(
      "li",
      null,
      React.createElement("input", {
        className: "form-control",
        type: "text",
        value: this.state.value,
        onChange: this.onChange
      })
    );
  }
});

module.exports = TextInput;

},{}],11:[function(require,module,exports){
"use strict";

var SaveConfigurationButton = React.createClass({
  displayName: "SaveConfigurationButton",

  onClick: function onClick() {
    this.props.onClick(this.state.configurationName);
  },
  onChange: function onChange(event) {
    this.setState({ configurationName: event.target.value });
  },
  getInitialState: function getInitialState() {
    return {
      configurationName: ""
    };
  },
  render: function render() {
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
          React.createElement("input", { className: "form-control", value: this.state.configurationName, type: "text", onChange: this.onChange })
        ),
        React.createElement(
          "button",
          { className: "btn btn-primary", type: "button", onClick: this.onClick },
          "Save"
        )
      )
    );
  }
});

module.exports = SaveConfigurationButton;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9qL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvcmVhY3RGaWx0ZXJiYXIuanMiLCIvaG9tZS9qL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvY29tcG9uZW50cy9hcHBseWNvbmZpZ3VyYXRpb25idXR0b24uanMuanN4IiwiL2hvbWUvai9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2NvbXBvbmVudHMvY2xlYXJjb25maWd1cmF0aW9uYnV0dG9uLmpzLmpzeCIsIi9ob21lL2ovZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9jb21wb25lbnRzL2NvbmZpZ3VyYXRpb25saXN0LmpzLmpzeCIsIi9ob21lL2ovZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9jb21wb25lbnRzL2ZpbHRlcmJhci5qcy5qc3giLCIvaG9tZS9qL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvY29tcG9uZW50cy9maWx0ZXJkaXNwbGF5LmpzLmpzeCIsIi9ob21lL2ovZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9jb21wb25lbnRzL2ZpbHRlcmxpc3QuanMuanN4IiwiL2hvbWUvai9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2NvbXBvbmVudHMvaW5wdXRzL2RhdGVpbnB1dC5qcy5qc3giLCIvaG9tZS9qL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvY29tcG9uZW50cy9pbnB1dHMvc2VsZWN0aW5wdXQuanMuanN4IiwiL2hvbWUvai9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2NvbXBvbmVudHMvaW5wdXRzL3RleHRpbnB1dC5qcy5qc3giLCIvaG9tZS9qL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvY29tcG9uZW50cy9zYXZlY29uZmlndXJhdGlvbmJ1dHRvbi5qcy5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO0FBQ3pELE1BQU0sQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDOzs7OztBQ0Q3QixJQUFJLHdCQUF3QixHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUMvQyxRQUFNLEVBQUUsa0JBQVc7QUFDakIsV0FDRTs7UUFBUSxTQUFTLEVBQUMsaUJBQWlCLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxBQUFDO01BQzlELDJCQUFHLFNBQVMsRUFBQyxnQkFBZ0IsR0FBRzs7S0FFekIsQ0FDVDtHQUNIO0NBQ0YsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsd0JBQXdCLENBQUM7Ozs7O0FDWDFDLElBQUksd0JBQXdCLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7O0FBQy9DLFFBQU0sRUFBRSxrQkFBVztBQUNqQixXQUNFOztRQUFRLFNBQVMsRUFBQyxpQkFBaUIsRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEFBQUM7TUFDOUQsMkJBQUcsU0FBUyxFQUFDLGtCQUFrQixHQUFHOztLQUUzQixDQUNUO0dBQ0g7Q0FDRixDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyx3QkFBd0IsQ0FBQzs7Ozs7QUNYMUMsSUFBSSxpQkFBaUIsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDOzs7QUFDeEMsUUFBTSxFQUFFLGtCQUFXO0FBQ2pCLFFBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxVQUFTLGFBQWEsRUFBRTtBQUN6RSxhQUNFLG9CQUFDLGlCQUFpQixDQUFDLGFBQWE7QUFDOUIscUJBQWEsRUFBRSxhQUFhLEFBQUM7QUFDN0IsZUFB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LEVBQUMsTUFBTSxFQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxBQUFDLEdBQUc7U0FDeEc7UUFDTjs7WUFBUSxTQUFTLEVBQUMsaUJBQWlCLEVBQUMsSUFBSSxFQUFDLFFBQVEsRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQUFBQzs7U0FBYztPQUM5RDtLQUNJLENBQ2xDO0dBQ0g7Q0FDRixDQUFDLENBQUM7O0FBRUgsTUFBTSxDQUFDLE9BQU8sR0FBRyx1QkFBdUIsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgRmlsdGVyQmFyID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2ZpbHRlcmJhci5qcy5qc3gnKTtcbndpbmRvdy5GaWx0ZXJCYXIgPSBGaWx0ZXJCYXI7XG4iLCJ2YXIgQXBwbHlDb25maWd1cmF0aW9uQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiIG9uQ2xpY2s9e3RoaXMucHJvcHMub25DbGlja30+XG4gICAgICAgIDxpIGNsYXNzTmFtZT1cImljb24gaWNvbi10aWNrXCIgLz5cbiAgICAgICAgQXBwbHlcbiAgICAgIDwvYnV0dG9uPlxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFwcGx5Q29uZmlndXJhdGlvbkJ1dHRvbjtcbiIsInZhciBDbGVhckNvbmZpZ3VyYXRpb25CdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi13YXJuaW5nXCIgb25DbGljaz17dGhpcy5wcm9wcy5vbkNsaWNrfT5cbiAgICAgICAgPGkgY2xhc3NOYW1lPVwiaWNvbiBpY29uLWRlbGV0ZVwiIC8+XG4gICAgICAgIENsZWFyXG4gICAgICA8L2J1dHRvbj5cbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBDbGVhckNvbmZpZ3VyYXRpb25CdXR0b247XG4iLCJ2YXIgQ29uZmlndXJhdGlvbkxpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbmZpZ3VyYXRpb25zID0gdGhpcy5wcm9wcy5jb25maWd1cmF0aW9ucy5tYXAoZnVuY3Rpb24oY29uZmlndXJhdGlvbikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPENvbmZpZ3VyYXRpb25MaXN0LkNvbmZpZ3VyYXRpb25cbiAgICAgICAgICBjb25maWd1cmF0aW9uPXtjb25maWd1cmF0aW9ufVxuICAgICAgICAgIG9uQ2xpY2s9e3RoaXMucHJvcHMubG9hZENvbmZpZ3VyYXRpb259XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0sdGhpcyk7XG4gICAgaWYgKGNvbmZpZ3VyYXRpb25zLmxlbmd0aCAhPT0gMCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXAgbWFyZ2luLWJvdHRvbS1zbVwiPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwXCI+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgdHlwZT1cImJ1dHRvblwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiPlxuICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJpY29uIGljb24tc2F2ZVwiIC8+XG4gICAgICAgICAgICAgIFNhdmVkIFNlYXJjaGVzXG4gICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImljb24gaWNvbi1jaGV2cm9uLWRvd25cIiAvPlxuICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwiZHJvcGRvd24tbWVudVwiIHJvbGU9XCJtZW51XCI+XG4gICAgICAgICAgICAgIHtjb25maWd1cmF0aW9uc31cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1kYW5nZXJcIj5cbiAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImljb24gaWNvbi1kZWxldGVcIiAvPlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIG1hcmdpbi1ib3R0b20tc21cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cFwiPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgZHJvcGRvd24tdG9nZ2xlIGRpc2FibGVkXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIHR5cGU9XCJidXR0b25cIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj5cbiAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiaWNvbiBpY29uLXNhdmVcIiAvPlxuICAgICAgICAgICAgICBTYXZlZCBTZWFyY2hlc1xuICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJpY29uIGljb24tY2hldnJvbi1kb3duXCIgLz5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImRyb3Bkb3duLW1lbnVcIiByb2xlPVwibWVudVwiPlxuICAgICAgICAgICAgICB7Y29uZmlndXJhdGlvbnN9XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tZGFuZ2VyXCI+XG4gICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJpY29uIGljb24tZGVsZXRlXCIgLz5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgfVxufSk7XG5cbkNvbmZpZ3VyYXRpb25MaXN0LkNvbmZpZ3VyYXRpb24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIG9uQ2xpY2s6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucHJvcHMub25DbGljayh0aGlzLnByb3BzLmNvbmZpZ3VyYXRpb24uY29uZmlndXJhdGlvbik7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuKFxuICAgICAgPGxpPlxuICAgICAgICA8YSBjbGFzc05hbWU9XCJkeW5hbWljLXRleHQtZmlsdGVyXCIgb25DbGljaz17dGhpcy5vbkNsaWNrfT5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5jb25maWd1cmF0aW9uLm5hbWV9XG4gICAgICAgIDwvYT5cbiAgICAgIDwvbGk+XG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ29uZmlndXJhdGlvbkxpc3Q7XG4iLCJ2YXIgRmlsdGVyTGlzdCA9IHJlcXVpcmUoJy4vZmlsdGVybGlzdC5qcy5qc3gnKTtcbnZhciBBcHBseUNvbmZpZ3VyYXRpb25CdXR0b24gPSByZXF1aXJlKCcuL2FwcGx5Y29uZmlndXJhdGlvbmJ1dHRvbi5qcy5qc3gnKTtcbnZhciBDbGVhckNvbmZpZ3VyYXRpb25CdXR0b24gPSByZXF1aXJlKCcuL2NsZWFyY29uZmlndXJhdGlvbmJ1dHRvbi5qcy5qc3gnKTtcbnZhciBTYXZlQ29uZmlndXJhdGlvbkJ1dHRvbiA9IHJlcXVpcmUoJy4vc2F2ZWNvbmZpZ3VyYXRpb25idXR0b24uanMuanN4Jyk7XG52YXIgQ29uZmlndXJhdGlvbkxpc3QgPSByZXF1aXJlKCcuL2NvbmZpZ3VyYXRpb25saXN0LmpzLmpzeCcpO1xudmFyIEZpbHRlckRpc3BsYXkgPSByZXF1aXJlKCcuL2ZpbHRlcmRpc3BsYXkuanMuanN4Jyk7XG5cbnZhciBGaWx0ZXJCYXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZpbHRlcnM6IFtdLFxuICAgICAgY29uZmlndXJhdGlvbnM6IFtdLFxuICAgIH07XG4gIH0sXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgZmlsdGVycyA9IHdpbmRvdy5maWx0ZXJMaXN0Lm1hcChmdW5jdGlvbihmaWx0ZXIpIHtcbiAgICAgIGZpbHRlci5lbmFibGVkID0gZmFsc2U7XG4gICAgICBmaWx0ZXIucXVlcnlfc3RyaW5nID0gXCJxW1wiK2ZpbHRlci50eXBlK1wiXVtcIitmaWx0ZXIuZmllbGQrXCJdXCI7XG4gICAgICByZXR1cm4gZmlsdGVyO1xuICAgIH0pO1xuXG4gICAgdGhpcy5sb2FkQ29uZmlndXJhdGlvbnMoKTtcbiAgICB0aGlzLnNldFN0YXRlKHtmaWx0ZXJzOiBmaWx0ZXJzfSk7XG4gIH0sXG4gIGxvYWRDb25maWd1cmF0aW9uczogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNvbmZpZ3VyYXRpb25zID0gW107XG5cbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiB0aGlzLnByb3BzLmNvbmZpZ3VyYXRpb25zX3VybCxcbiAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIsXG4gICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIGZvciAodmFyIGkgaW4gZGF0YSkge1xuICAgICAgICAgIHZhciBuYW1lID0gZGF0YVtpXS5uYW1lO1xuICAgICAgICAgIHZhciBjb25maWd1cmF0aW9uID0gSlNPTi5wYXJzZShkYXRhW2ldLmNvbmZpZ3VyYXRpb24pO1xuXG4gICAgICAgICAgY29uZmlndXJhdGlvbnMucHVzaCh7XCJuYW1lXCI6bmFtZSxcImNvbmZpZ3VyYXRpb25cIjpjb25maWd1cmF0aW9ufSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7Y29uZmlndXJhdGlvbnM6IGNvbmZpZ3VyYXRpb25zfSk7XG4gICAgICB9LmJpbmQodGhpcyksXG4gICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLHN0YXR1cyxlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKHhocik7XG4gICAgICAgIGNvbnNvbGUuZXJyb3Ioc3RhdHVzKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIGxvYWRDb25maWd1cmF0aW9uOiBmdW5jdGlvbihjb25maWd1cmF0aW9uKSB7XG4gICAgdGhpcy5jbGVhckNvbmZpZ3VyYXRpb24oKTtcblxuICAgIGNvbmZpZ3VyYXRpb24gPSAkLmV4dGVuZCh0cnVlLFtdLGNvbmZpZ3VyYXRpb24pO1xuICAgIHZhciBmaWx0ZXJzID0gdGhpcy5zdGF0ZS5maWx0ZXJzLnNsaWNlKDApO1xuXG4gICAgZm9yICh2YXIgY0ZpbHRlciBvZiBjb25maWd1cmF0aW9uKSB7XG4gICAgICBmb3IgKHZhciBmaWx0ZXIgb2YgZmlsdGVycykge1xuICAgICAgICBpZiAoY0ZpbHRlci51aWQgPT09IGZpbHRlci51aWQpIHtcbiAgICAgICAgICBmaWx0ZXIudmFsdWUgPSBjRmlsdGVyLnZhbHVlO1xuICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2ZpbHRlcnM6IGZpbHRlcnN9KTtcbiAgICAgICAgICB0aGlzLmVuYWJsZUZpbHRlcihmaWx0ZXIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5hcHBseUNvbmZpZ3VyYXRpb24oKTtcbiAgfSxcbiAgc2F2ZUNvbmZpZ3VyYXRpb246IGZ1bmN0aW9uKHNlYXJjaF90aXRsZSkge1xuICAgIHZhciBmaWx0ZXJlZEFycmF5ID0gdGhpcy5zdGF0ZS5maWx0ZXJzLmZpbHRlcihmdW5jdGlvbihmaWx0ZXIpIHtcbiAgICAgIHJldHVybiAoKGZpbHRlci5lbmFibGVkID09PSB0cnVlKSAmJiAoT2JqZWN0LmtleXMoZmlsdGVyLnZhbHVlICE9PSAwKSkpO1xuICAgIH0pO1xuXG4gICAgdmFyIGZpbHRlcnMgPSBmaWx0ZXJlZEFycmF5Lm1hcChmdW5jdGlvbihmaWx0ZXIpIHtcbiAgICAgIGZpbHRlckNvbmZpZyA9IHt9O1xuICAgICAgZmlsdGVyQ29uZmlnLnVpZCA9IGZpbHRlci51aWQ7XG4gICAgICBmaWx0ZXJDb25maWcudmFsdWU9IGZpbHRlci52YWx1ZTtcbiAgICAgIHJldHVybiBmaWx0ZXJDb25maWc7XG4gICAgfSk7XG5cbiAgICB2YXIgcGF5bG9hZCA9IHtcInNhdmVkX3NlYXJjaFwiOiB7XCJzZWFyY2hfdGl0bGVcIjogc2VhcmNoX3RpdGxlLCBcImZpbHRlcnNcIjogZmlsdGVyc319O1xuXG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogdGhpcy5wcm9wcy5jb25maWd1cmF0aW9uc191cmwsXG4gICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIixcbiAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHBheWxvYWQpLFxuICAgICAgZGF0YVR5cGU6IFwic2NyaXB0XCIsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHRoaXMubG9hZENvbmZpZ3VyYXRpb25zKCk7XG4gICAgICAgIHRoaXMuYXBwbHlDb25maWd1cmF0aW9uKCk7XG4gICAgICB9LmJpbmQodGhpcyksXG4gICAgICBlcnJvcjogZnVuY3Rpb24oeGhyLHN0YXR1cyxlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKHhocik7XG4gICAgICAgIGNvbnNvbGUuZXJyb3Ioc3RhdHVzKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIGFwcGx5Q29uZmlndXJhdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGZpbHRlcmVkQXJyYXkgPSB0aGlzLnN0YXRlLmZpbHRlcnMuZmlsdGVyKGZ1bmN0aW9uKGZpbHRlcikge1xuICAgICAgcmV0dXJuICgoZmlsdGVyLmVuYWJsZWQgPT09IHRydWUpICYmIChPYmplY3Qua2V5cyhmaWx0ZXIudmFsdWUgIT09IDApKSk7XG4gICAgfSk7XG5cbiAgICB2YXIgcGF5bG9hZCA9IGZpbHRlcmVkQXJyYXkubWFwKGZ1bmN0aW9uKGZpbHRlcikge1xuICAgICAgdmFyIGZpbHRlckNvbmZpZyA9IHt9O1xuICAgICAgZmlsdGVyQ29uZmlnW2ZpbHRlci5xdWVyeV9zdHJpbmddID0gZmlsdGVyLnZhbHVlO1xuICAgICAgdmFyIGZpbHRlclBhcmFtcyA9ICQucGFyYW0oZmlsdGVyQ29uZmlnKTtcbiAgICAgIHJldHVybiBmaWx0ZXJQYXJhbXM7XG4gICAgfSk7XG5cbiAgICB2YXIgcmVzdWx0ID0gcGF5bG9hZC5qb2luKFwiJlwiKTtcblxuICAgICQuYWpheCh7XG4gICAgICB1cmw6IHRoaXMucHJvcHMucmVzb3VyY2VfdXJsICsgXCI/XCIgKyByZXN1bHQsXG4gICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiLFxuICAgICAgZGF0YVR5cGU6IFwic2NyaXB0XCIsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICB9LFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhocixzdGF0dXMsZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih4aHIpO1xuICAgICAgICBjb25zb2xlLmVycm9yKHN0YXR1cyk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBjbGVhckNvbmZpZ3VyYXRpb246IGZ1bmN0aW9uKCkge1xuICAgIHZhciBmaWx0ZXJzID0gdGhpcy5zdGF0ZS5maWx0ZXJzLnNsaWNlKDApO1xuICAgIGZvciAodmFyIGZpbHRlciBvZiBmaWx0ZXJzKSB7XG4gICAgICB0aGlzLmRpc2FibGVGaWx0ZXIoZmlsdGVyKTtcbiAgICB9XG4gICAgdGhpcy5hcHBseUNvbmZpZ3VyYXRpb24oKTtcbiAgfSxcbiAgZW5hYmxlRmlsdGVyOiBmdW5jdGlvbihmaWx0ZXIpIHtcbiAgICB2YXIgZmlsdGVycyA9IHRoaXMuc3RhdGUuZmlsdGVycy5zbGljZSgwKTtcbiAgICBmb3IgKHZhciBpIGluIGZpbHRlcnMpIHtcbiAgICAgIGlmIChmaWx0ZXJzW2ldLnVpZCA9PSBmaWx0ZXIudWlkKSB7XG4gICAgICAgIGZpbHRlcnNbaV0uZW5hYmxlZCA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc2V0U3RhdGUoe2ZpbHRlcnM6IGZpbHRlcnN9KTtcbiAgfSxcbiAgZGlzYWJsZUZpbHRlcjogZnVuY3Rpb24oZmlsdGVyKSB7XG4gICAgdmFyIGZpbHRlcnMgPSB0aGlzLnN0YXRlLmZpbHRlcnMuc2xpY2UoMCk7XG4gICAgZm9yICh2YXIgaSBpbiBmaWx0ZXJzKSB7XG4gICAgICBpZiAoZmlsdGVyc1tpXS51aWQgPT0gZmlsdGVyLnVpZCkge1xuICAgICAgICBmaWx0ZXJzW2ldLmVuYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgZmlsdGVyc1tpXS52YWx1ZSA9IG51bGw7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHtmaWx0ZXJzOiBmaWx0ZXJzfSk7XG4gIH0sXG4gIHVwZGF0ZUZpbHRlcjogZnVuY3Rpb24oZmlsdGVyKSB7XG4gICAgdmFyIGZpbHRlcnMgPSB0aGlzLnN0YXRlLmZpbHRlcnMuc2xpY2UoMCk7XG5cbiAgICBmb3IgKHZhciBpIGluIGZpbHRlcnMpIHtcbiAgICAgIGlmIChmaWx0ZXJzW2ldLnVpZCA9PT0gZmlsdGVyLnVpZCkge1xuICAgICAgICBmaWx0ZXJzW2ldLnZhbHVlID0gZmlsdGVyLnZhbHVlO1xuICAgICAgICBmaWx0ZXJzW2ldLnF1ZXJ5X3N0cmluZyA9IGZpbHRlci5xdWVyeV9zdHJpbmc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHtmaWx0ZXJzOiBmaWx0ZXJzfSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIG1hcmdpbi1ib3R0b20tc21cIj5cbiAgICAgICAgICA8RmlsdGVyTGlzdCBmaWx0ZXJzPXt0aGlzLnN0YXRlLmZpbHRlcnN9IGVuYWJsZUZpbHRlcj17dGhpcy5lbmFibGVGaWx0ZXJ9IC8+XG4gICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0IGRpc2FibGVkXCI+PGkgY2xhc3NOYW1lPVwiaWNvbiBpY29uLWRvd25sb2FkXCI+PC9pPkV4cG9ydCBDU1Y8L2J1dHRvbj5cbiAgICAgICAgICA8QXBwbHlDb25maWd1cmF0aW9uQnV0dG9uIG9uQ2xpY2s9e3RoaXMuYXBwbHlDb25maWd1cmF0aW9ufSAvPlxuICAgICAgICAgIDxDbGVhckNvbmZpZ3VyYXRpb25CdXR0b24gb25DbGljaz17dGhpcy5jbGVhckNvbmZpZ3VyYXRpb259IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8U2F2ZUNvbmZpZ3VyYXRpb25CdXR0b24gb25DbGljaz17dGhpcy5zYXZlQ29uZmlndXJhdGlvbn0gb25DaGFuZ2U9e3RoaXMudXBkYXRlQ29uZmlndXJhdGlvbk5hbWV9IC8+XG4gICAgICAgIDxDb25maWd1cmF0aW9uTGlzdCBjb25maWd1cmF0aW9ucz17dGhpcy5zdGF0ZS5jb25maWd1cmF0aW9uc30gbG9hZENvbmZpZ3VyYXRpb249e3RoaXMubG9hZENvbmZpZ3VyYXRpb259IC8+XG4gICAgICAgIDxGaWx0ZXJEaXNwbGF5IGZpbHRlcnM9e3RoaXMuc3RhdGUuZmlsdGVyc30gZGlzYWJsZUZpbHRlcj17dGhpcy5kaXNhYmxlRmlsdGVyfSB1cGRhdGVGaWx0ZXI9e3RoaXMudXBkYXRlRmlsdGVyfSAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRmlsdGVyQmFyO1xuIiwidmFyIFRleHRJbnB1dCA9IHJlcXVpcmUoJy4vaW5wdXRzL3RleHRpbnB1dC5qcy5qc3gnKTtcbnZhciBEYXRlSW5wdXQgPSByZXF1aXJlKCcuL2lucHV0cy9kYXRlaW5wdXQuanMuanN4Jyk7XG52YXIgU2VsZWN0SW5wdXQgPSByZXF1aXJlKCcuL2lucHV0cy9zZWxlY3RpbnB1dC5qcy5qc3gnKTtcblxudmFyIEZpbHRlckRpc3BsYXkgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGZpbHRlcnMgPSBbXTtcbiAgICB2YXIgZmlsdGVyZWRBcnJheSA9IHRoaXMucHJvcHMuZmlsdGVycy5maWx0ZXIoZnVuY3Rpb24oZmlsdGVyKSB7XG4gICAgICByZXR1cm4gKGZpbHRlci5lbmFibGVkID09PSB0cnVlKTtcbiAgICB9KTtcblxuICAgIGlmIChmaWx0ZXJlZEFycmF5Lmxlbmd0aCAhPT0gMCkge1xuICAgICAgZmlsdGVycyA9IGZpbHRlcmVkQXJyYXkubWFwKGZ1bmN0aW9uKGZpbHRlcikge1xuICAgICAgICBpZiAoZmlsdGVyLmVuYWJsZWQgPT09IHRydWUpIHtcbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPEZpbHRlckRpc3BsYXkuRmlsdGVyXG4gICAgICAgICAgICAgIGZpbHRlcj17ZmlsdGVyfVxuICAgICAgICAgICAgICBkaXNhYmxlRmlsdGVyPXt0aGlzLnByb3BzLmRpc2FibGVGaWx0ZXJ9XG4gICAgICAgICAgICAgIHVwZGF0ZUZpbHRlcj17dGhpcy5wcm9wcy51cGRhdGVGaWx0ZXJ9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0sdGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpbHRlcnMgPSAoPGRpdj5ObyBGaWx0ZXJzIEVuYWJsZWQ8L2Rpdj4pO1xuICAgIH1cblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm5hdmJhciBmaWx0ZXJiYXJcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCIgaWQ9XCJmaWx0ZXJzXCI+XG4gICAgICAgICAge2ZpbHRlcnN9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG5cbkZpbHRlckRpc3BsYXkuRmlsdGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBkaXNhYmxlRmlsdGVyOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnByb3BzLmRpc2FibGVGaWx0ZXIodGhpcy5wcm9wcy5maWx0ZXIpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpbnB1dHMgPSA8RmlsdGVyRGlzcGxheS5GaWx0ZXIuSW5wdXRzXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcj17dGhpcy5wcm9wcy5maWx0ZXJ9XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZUZpbHRlcj17dGhpcy5wcm9wcy51cGRhdGVGaWx0ZXJ9XG4gICAgICAgICAgICAgICAgIC8+O1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbC1sZy0zIGNvbC1tZC00IGNvbC1zbS02IGNvbC14cy0xMiBmaWx0ZXJcIj5cbiAgICAgICAgPHVsIGNsYXNzTmFtZT17dGhpcy5wcm9wcy5maWx0ZXIudWlkfT5cbiAgICAgICAgICA8bGk+XG4gICAgICAgICAgICA8aSBvbkNsaWNrPXt0aGlzLmRpc2FibGVGaWx0ZXJ9IGNsYXNzTmFtZT1cImJ0biBidG4tY2lyY2xlLXByaW1hcnkgYnRuLXhzIGljb24gaWNvbi1jbG9zZSByZW1vdmUtZmlsdGVyXCIgLz5cbiAgICAgICAgICAgIDxsYWJlbD5cbiAgICAgICAgICAgICAge3RoaXMucHJvcHMuZmlsdGVyLmxhYmVsfVxuICAgICAgICAgICAgPC9sYWJlbD5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICAgIHtpbnB1dHN9XG4gICAgICAgIDwvdWw+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59KTtcblxuRmlsdGVyRGlzcGxheS5GaWx0ZXIuSW5wdXRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBpbnB1dEZhY3Rvcnk6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0eXBlID0gdGhpcy5wcm9wcy5maWx0ZXIudHlwZTtcbiAgICBpZiAodHlwZSA9PSAndGV4dCcgfHwgdHlwZSA9PSAnaWQnKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8VGV4dElucHV0XG4gICAgICAgICAgZmlsdGVyPXt0aGlzLnByb3BzLmZpbHRlcn1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5wcm9wcy51cGRhdGVGaWx0ZXJ9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PSAnZGF0ZScpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxEYXRlSW5wdXRcbiAgICAgICAgICBmaWx0ZXI9e3RoaXMucHJvcHMuZmlsdGVyfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLnByb3BzLnVwZGF0ZUZpbHRlcn1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09ICdzZWxlY3QnKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8U2VsZWN0SW5wdXRcbiAgICAgICAgICBmaWx0ZXI9e3RoaXMucHJvcHMuZmlsdGVyfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLnByb3BzLnVwZGF0ZUZpbHRlcn1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICh0eXBlID09ICdhZ2Vfc2VsZWN0Jykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPEFnZVNlbGVjdElucHV0XG4gICAgICAgICAgZmlsdGVyPXt0aGlzLnByb3BzLmZpbHRlcn1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5wcm9wcy51cGRhdGVGaWx0ZXJ9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiTm90IGltcGxlbWVudGVkIHlldCFcIik7XG4gICAgfVxuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpbnB1dHMgPSB0aGlzLmlucHV0RmFjdG9yeSgpO1xuICAgIHJldHVybiAoXG4gICAgICBpbnB1dHNcbiAgICApO1xuICB9XG59KTtcblxudmFyIEFnZVNlbGVjdElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBzZWxlY3RlZDogdGhpcy5wcm9wcy5maWx0ZXIudmFsdWUgfHwgXCIwLDE1XCJcbiAgICB9O1xuICB9LFxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGZpbHRlciA9ICQuZXh0ZW5kKHRydWUse30sdGhpcy5wcm9wcy5maWx0ZXIpO1xuICAgIGZpbHRlci52YWx1ZSA9IHRoaXMuc3RhdGUuc2VsZWN0ZWQ7XG4gICAgdGhpcy5wcm9wcy5vbkNoYW5nZShmaWx0ZXIpO1xuICB9LFxuICBvbkNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB2YXIgZmlsdGVyID0gJC5leHRlbmQodHJ1ZSx7fSx0aGlzLnByb3BzLmZpbHRlcik7XG4gICAgZmlsdGVyLnZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7c2VsZWN0ZWQ6IGV2ZW50LnRhcmdldC52YWx1ZX0pO1xuICAgIHRoaXMucHJvcHMub25DaGFuZ2UoZmlsdGVyKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGxpPlxuICAgICAgICA8c2VsZWN0XG4gICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICBzZWxlY3RlZD17dGhpcy5zdGF0ZS5zZWxlY3RlZH1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5vbkNoYW5nZX1cbiAgICAgICAgPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCIwLDE1XCI+MTUgYW5kIHVuZGVyPC9vcHRpb24+XG4gICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIjE2LDI0XCI+MTYgLSAyNDwvb3B0aW9uPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCIyNSwzNFwiPjI1IC0gMzQ8L29wdGlvbj5cbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiMzUsNDRcIj4zNSAtIDQ0PC9vcHRpb24+XG4gICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIjQ1LDU0XCI+NDUgLSA1NDwvb3B0aW9uPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCI1NSw2NFwiPjU1IC0gNjQ8L29wdGlvbj5cbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiNjUsNzRcIj42NSAtIDc0PC9vcHRpb24+XG4gICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIjc1LDEwMFwiPjc1IGFuZCBvdmVyPC9vcHRpb24+XG4gICAgICAgIDwvc2VsZWN0PlxuICAgICAgPC9saT5cbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaWx0ZXJEaXNwbGF5O1xuIiwidmFyIEZpbHRlckxpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGZpbHRlck9wdGlvbnMgPSB0aGlzLnByb3BzLmZpbHRlcnMubWFwKGZ1bmN0aW9uKGZpbHRlcikge1xuICAgICAgaWYgKGZpbHRlci5lbmFibGVkID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxGaWx0ZXJMaXN0LkZpbHRlck9wdGlvblxuICAgICAgICAgICAgZmlsdGVyPXtmaWx0ZXJ9XG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLnByb3BzLmVuYWJsZUZpbHRlcn1cbiAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0sdGhpcyk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwXCI+XG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0IGRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiB0eXBlPVwiYnV0dG9uXCI+XG4gICAgICAgICAgPGkgY2xhc3NOYW1lPVwiaWNvbiBpY29uLWFkZFwiIC8+XG4gICAgICAgICAgQWRkIEZpbHRlclxuICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImljb24gaWNvbi1jaGV2cm9uLWRvd25cIiAvPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPHVsIGNsYXNzTmFtZT1cImRyb3Bkb3duLW1lbnVcIiByb2xlPVwibWVudVwiPlxuICAgICAgICAgIHtmaWx0ZXJPcHRpb25zfVxuICAgICAgICA8L3VsPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG5cbkZpbHRlckxpc3QuRmlsdGVyT3B0aW9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBvbkNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnByb3BzLm9uQ2xpY2sodGhpcy5wcm9wcy5maWx0ZXIpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8bGk+XG4gICAgICAgIDxhIG9uQ2xpY2s9e3RoaXMub25DbGlja30+XG4gICAgICAgICAge3RoaXMucHJvcHMuZmlsdGVyLmxhYmVsfVxuICAgICAgICA8L2E+XG4gICAgICA8L2xpPlxuICAgICk7XG4gIH0sXG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaWx0ZXJMaXN0O1xuIiwidmFyIERhdGVJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5maWx0ZXIudmFsdWUpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGZyb206IHRoaXMucHJvcHMuZmlsdGVyLnZhbHVlLmZyb20sXG4gICAgICAgIHRvOiB0aGlzLnByb3BzLmZpbHRlci52YWx1ZS50byxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGZyb206ICcnLFxuICAgICAgICB0bzogJycsXG4gICAgICB9O1xuICAgIH1cbiAgfSxcbiAgb25DaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIGZpbHRlciA9ICQuZXh0ZW5kKHRydWUse30sdGhpcy5wcm9wcy5maWx0ZXIpO1xuICAgIHZhciB2YWx1ZSA9IGZpbHRlci52YWx1ZSB8fCB7fTtcblxuICAgIHZhciBzdGF0ZU9iamVjdCA9IHRoaXMuc3RhdGU7XG4gICAgdmFyIGRhdGUgPSBldmVudC5kYXRlLmZvcm1hdChcIkRELU1NLVlZWVlcIik7XG4gICAgaWYgKGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2RhdGVSYW5nZUZyb20nKSkge1xuICAgICAgc3RhdGVPYmplY3QuZnJvbSA9IGRhdGU7XG4gICAgICB2YWx1ZS5mcm9tID0gZGF0ZTtcbiAgICB9IGVsc2UgaWYgKGV2ZW50LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2RhdGVSYW5nZVRvJykpIHtcbiAgICAgIHN0YXRlT2JqZWN0LnRvID0gZGF0ZTtcbiAgICAgIHZhbHVlLnRvID0gZGF0ZTtcbiAgICB9XG5cbiAgICBmaWx0ZXIudmFsdWUgPSB2YWx1ZTtcblxuICAgIHRoaXMuc2V0U3RhdGUoc3RhdGVPYmplY3QpO1xuICAgIHRoaXMucHJvcHMub25DaGFuZ2UoZmlsdGVyKTtcbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkYXRlUGlja2VyRnJvbSA9ICQoUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmRhdGVSYW5nZUZyb20pKTtcbiAgICBkYXRlUGlja2VyRnJvbS5kYXRldGltZXBpY2tlcih7Zm9ybWF0OiAnREQtTU0tWVlZWSd9KTtcbiAgICBkYXRlUGlja2VyRnJvbS5kYXRldGltZXBpY2tlcigpLm9uKCdkcC5jaGFuZ2UnLHRoaXMub25DaGFuZ2UpO1xuXG4gICAgdmFyIGRhdGVQaWNrZXJUbyA9ICQoUmVhY3QuZmluZERPTU5vZGUodGhpcy5yZWZzLmRhdGVSYW5nZVRvKSk7XG4gICAgZGF0ZVBpY2tlclRvLmRhdGV0aW1lcGlja2VyKHtmb3JtYXQ6ICdERC1NTS1ZWVlZJ30pO1xuICAgIGRhdGVQaWNrZXJUby5kYXRldGltZXBpY2tlcigpLm9uKCdkcC5jaGFuZ2UnLHRoaXMub25DaGFuZ2UpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8bGk+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAgZGF0ZXBpY2tlciBkYXRlUmFuZ2VGcm9tXCIgcmVmPVwiZGF0ZVJhbmdlRnJvbVwiPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgIGRhdGEtZGF0ZS1mb3JtYXQ9XCJERC9NTS9ZWVlZXCJcbiAgICAgICAgICAgIGFyaWEtcmVxdWlyZWQ9XCJ0cnVlXCJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiZnJvbVwiXG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5vbkNoYW5nZX1cbiAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLmZyb219XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpbnB1dC1ncm91cC1hZGRvblwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbi1jYWxlbmRhciBpY29uXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzci1vbmx5IGljb24gaWNvbi1jYWxlbmRhclwiPlxuICAgICAgICAgICAgICBDYWxlbmRhclxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAgZGF0ZXBpY2tlciBkYXRlUmFuZ2VUb1wiIHJlZj1cImRhdGVSYW5nZVRvXCI+XG4gICAgICAgICAgPGlucHV0XG4gICAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgICAgZGF0YS1kYXRlLWZvcm1hdD1cIkREL01NL1lZWVlcIlxuICAgICAgICAgICAgYXJpYS1yZXF1aXJlZD1cInRydWVcIlxuICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCJ0b1wiXG4gICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5vbkNoYW5nZX1cbiAgICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnRvfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAtYWRkb25cIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24tY2FsZW5kYXIgaWNvblwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3Itb25seSBpY29uIGljb24tY2FsZW5kYXJcIj5cbiAgICAgICAgICAgICAgQ2FsZW5kYXJcbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9saT5cbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBEYXRlSW5wdXQ7XG4iLCJ2YXIgU2VsZWN0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNlbGVjdGVkOiB0aGlzLnByb3BzLmZpbHRlci52YWx1ZSB8fCB0aGlzLnByb3BzLmZpbHRlci5zZWxlY3Rpb25zWzBdWzBdXG4gICAgfTtcbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBmaWx0ZXIgPSAkLmV4dGVuZCh0cnVlLHt9LHRoaXMucHJvcHMuZmlsdGVyKTtcbiAgICBmaWx0ZXIudmFsdWUgPSB0aGlzLnN0YXRlLnNlbGVjdGVkO1xuICAgIHRoaXMucHJvcHMub25DaGFuZ2UoZmlsdGVyKTtcbiAgfSxcbiAgb25DaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIGZpbHRlciA9ICQuZXh0ZW5kKHRydWUse30sdGhpcy5wcm9wcy5maWx0ZXIpO1xuICAgIGZpbHRlci52YWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe3NlbGVjdGVkOiBldmVudC50YXJnZXQudmFsdWV9KTtcbiAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKGZpbHRlcik7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIG9wdGlvbnMgPSB0aGlzLnByb3BzLmZpbHRlci5zZWxlY3Rpb25zLm1hcChmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgIHJldHVybiAoPG9wdGlvbiB2YWx1ZT17b3B0aW9uWzBdfT57b3B0aW9uWzFdfTwvb3B0aW9uPik7XG4gICAgfSk7XG4gICAgcmV0dXJuIChcbiAgICAgIDxsaT5cbiAgICAgICAgPHNlbGVjdFxuICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiXG4gICAgICAgICAgc2VsZWN0ZWQ9e3RoaXMuc3RhdGUuc2VsZWN0ZWR9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMub25DaGFuZ2V9XG4gICAgICAgID5cbiAgICAgICAgICB7b3B0aW9uc31cbiAgICAgICAgPC9zZWxlY3Q+XG4gICAgICA8L2xpPlxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNlbGVjdElucHV0O1xuIiwidmFyIFRleHRJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsdWU6IHRoaXMucHJvcHMuZmlsdGVyLnZhbHVlIHx8ICcnXG4gICAgfTtcbiAgfSxcbiAgb25DaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIGZpbHRlciA9ICQuZXh0ZW5kKHRydWUse30sdGhpcy5wcm9wcy5maWx0ZXIpO1xuICAgIGZpbHRlci52YWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe3ZhbHVlOiBldmVudC50YXJnZXQudmFsdWV9KTtcbiAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKGZpbHRlcik7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxsaT5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgdmFsdWU9e3RoaXMuc3RhdGUudmFsdWV9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMub25DaGFuZ2V9XG4gICAgICAgIC8+XG4gICAgICA8L2xpPlxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRleHRJbnB1dDtcbiIsInZhciBTYXZlQ29uZmlndXJhdGlvbkJ1dHRvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgb25DbGljazogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wcm9wcy5vbkNsaWNrKHRoaXMuc3RhdGUuY29uZmlndXJhdGlvbk5hbWUpO1xuICB9LFxuICBvbkNoYW5nZTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtjb25maWd1cmF0aW9uTmFtZTogZXZlbnQudGFyZ2V0LnZhbHVlfSk7XG4gIH0sXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGNvbmZpZ3VyYXRpb25OYW1lOiAnJ1xuICAgIH07XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgPFJlYWN0Qm9vdHN0cmFwLkRyb3Bkb3duQnV0dG9uIHRpdGxlPVwiU2F2ZSBTZWFyY2hcIiB0eXBlPVwiYnV0dG9uXCIgYnNTdHlsZT1cImRlZmF1bHRcIiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgbWFyZ2luLWJvdHRvbS1zbVwiPlxuICAgICAgICAgIDxSZWFjdEJvb3RzdHJhcC5NZW51SXRlbSBldmVudEtleT1cIjFcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZm9ybS1ncm91cFwiPlxuICAgICAgICAgICAgICA8bGFiZWw+U2VhcmNoIFRpdGxlPC9sYWJlbD5cbiAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIHZhbHVlPXt0aGlzLnN0YXRlLmNvbmZpZ3VyYXRpb25OYW1lfSB0eXBlPVwidGV4dFwiIG9uQ2hhbmdlPXt0aGlzLm9uQ2hhbmdlfSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeVwiIHR5cGU9XCJidXR0b25cIiBvbkNsaWNrPXt0aGlzLm9uQ2xpY2t9PlNhdmU8L2J1dHRvbj5cbiAgICAgICAgICA8L1JlYWN0Qm9vdHN0cmFwLk1lbnVJdGVtPlxuICAgICAgICA8L1JlYWN0Qm9vdHN0cmFwLkRyb3Bkb3duQnV0dG9uPlxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNhdmVDb25maWd1cmF0aW9uQnV0dG9uO1xuIl19

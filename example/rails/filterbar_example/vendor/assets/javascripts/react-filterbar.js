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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS9qL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvcmVhY3QtZmlsdGVyYmFyLmpzIiwiL2hvbWUvai9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2NvbXBvbmVudHMvYXBwbHljb25maWd1cmF0aW9uYnV0dG9uLmpzLmpzeCIsIi9ob21lL2ovZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9jb21wb25lbnRzL2NsZWFyY29uZmlndXJhdGlvbmJ1dHRvbi5qcy5qc3giLCIvaG9tZS9qL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvY29tcG9uZW50cy9jb25maWd1cmF0aW9ubGlzdC5qcy5qc3giLCIvaG9tZS9qL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvY29tcG9uZW50cy9maWx0ZXJiYXIuanMuanN4IiwiL2hvbWUvai9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2NvbXBvbmVudHMvZmlsdGVyZGlzcGxheS5qcy5qc3giLCIvaG9tZS9qL2RldmVsb3BtZW50L2pyL3JlYWN0LWZpbHRlcmJhci9zcmMvY29tcG9uZW50cy9maWx0ZXJsaXN0LmpzLmpzeCIsIi9ob21lL2ovZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9jb21wb25lbnRzL2lucHV0cy9kYXRlaW5wdXQuanMuanN4IiwiL2hvbWUvai9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2NvbXBvbmVudHMvaW5wdXRzL3NlbGVjdGlucHV0LmpzLmpzeCIsIi9ob21lL2ovZGV2ZWxvcG1lbnQvanIvcmVhY3QtZmlsdGVyYmFyL3NyYy9jb21wb25lbnRzL2lucHV0cy90ZXh0aW5wdXQuanMuanN4IiwiL2hvbWUvai9kZXZlbG9wbWVudC9qci9yZWFjdC1maWx0ZXJiYXIvc3JjL2NvbXBvbmVudHMvc2F2ZWNvbmZpZ3VyYXRpb25idXR0b24uanMuanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsK0JBQStCLENBQUMsQ0FBQztBQUN6RCxNQUFNLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQzs7Ozs7QUNEN0IsSUFBSSx3QkFBd0IsR0FBRyxLQUFLLENBQUMsV0FBVyxDQUFDOzs7QUFDL0MsUUFBTSxFQUFFLGtCQUFXO0FBQ2pCLFdBQ0U7O1FBQVEsU0FBUyxFQUFDLGlCQUFpQixFQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQUFBQztNQUM5RCwyQkFBRyxTQUFTLEVBQUMsZ0JBQWdCLEdBQUc7O0tBRXpCLENBQ1Q7R0FDSDtDQUNGLENBQUMsQ0FBQzs7QUFFSCxNQUFNLENBQUMsT0FBTyxHQUFHLHdCQUF3QixDQUFDOzs7OztBQ1gxQyxJQUFJLHdCQUF3QixHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7OztBQUMvQyxRQUFNLEVBQUUsa0JBQVc7QUFDakIsV0FDRTs7UUFBUSxTQUFTLEVBQUMsaUJBQWlCLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxBQUFDO01BQzlELDJCQUFHLFNBQVMsRUFBQyxrQkFBa0IsR0FBRzs7S0FFM0IsQ0FDVDtHQUNIO0NBQ0YsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsd0JBQXdCLENBQUM7Ozs7O0FDWDFDLElBQUksaUJBQWlCLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQzs7O0FBQ3hDLFFBQU0sRUFBRSxrQkFBVztBQUNqQixRQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsVUFBUyxhQUFhLEVBQUU7QUFDekUsYUFDRSxvQkFBQyxpQkFBaUIsQ0FBQyxhQUFhO0FBQzlCLHFCQUFhLEVBQUUsYUFBYSxBQUFDO0FBQzdCLGVB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SSxFQUFDLE1BQU0sRUFBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQUFBQyxHQUFHO1NBQ3hHO1FBQ047O1lBQVEsU0FBUyxFQUFDLGlCQUFpQixFQUFDLElBQUksRUFBQyxRQUFRLEVBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLEFBQUM7O1NBQWM7T0FDOUQ7S0FDSSxDQUNsQztHQUNIO0NBQ0YsQ0FBQyxDQUFDOztBQUVILE1BQU0sQ0FBQyxPQUFPLEdBQUcsdUJBQXVCLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIEZpbHRlckJhciA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9maWx0ZXJiYXIuanMuanN4Jyk7XG53aW5kb3cuRmlsdGVyQmFyID0gRmlsdGVyQmFyO1xuIiwidmFyIEFwcGx5Q29uZmlndXJhdGlvbkJ1dHRvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIiBvbkNsaWNrPXt0aGlzLnByb3BzLm9uQ2xpY2t9PlxuICAgICAgICA8aSBjbGFzc05hbWU9XCJpY29uIGljb24tdGlja1wiIC8+XG4gICAgICAgIEFwcGx5XG4gICAgICA8L2J1dHRvbj5cbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBBcHBseUNvbmZpZ3VyYXRpb25CdXR0b247XG4iLCJ2YXIgQ2xlYXJDb25maWd1cmF0aW9uQnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4td2FybmluZ1wiIG9uQ2xpY2s9e3RoaXMucHJvcHMub25DbGlja30+XG4gICAgICAgIDxpIGNsYXNzTmFtZT1cImljb24gaWNvbi1kZWxldGVcIiAvPlxuICAgICAgICBDbGVhclxuICAgICAgPC9idXR0b24+XG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gQ2xlYXJDb25maWd1cmF0aW9uQnV0dG9uO1xuIiwidmFyIENvbmZpZ3VyYXRpb25MaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb25maWd1cmF0aW9ucyA9IHRoaXMucHJvcHMuY29uZmlndXJhdGlvbnMubWFwKGZ1bmN0aW9uKGNvbmZpZ3VyYXRpb24pIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxDb25maWd1cmF0aW9uTGlzdC5Db25maWd1cmF0aW9uXG4gICAgICAgICAgY29uZmlndXJhdGlvbj17Y29uZmlndXJhdGlvbn1cbiAgICAgICAgICBvbkNsaWNrPXt0aGlzLnByb3BzLmxvYWRDb25maWd1cmF0aW9ufVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9LHRoaXMpO1xuICAgIGlmIChjb25maWd1cmF0aW9ucy5sZW5ndGggIT09IDApIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuLWdyb3VwIG1hcmdpbi1ib3R0b20tc21cIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cFwiPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHQgZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIHR5cGU9XCJidXR0b25cIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj5cbiAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiaWNvbiBpY29uLXNhdmVcIiAvPlxuICAgICAgICAgICAgICBTYXZlZCBTZWFyY2hlc1xuICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJpY29uIGljb24tY2hldnJvbi1kb3duXCIgLz5cbiAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPHVsIGNsYXNzTmFtZT1cImRyb3Bkb3duLW1lbnVcIiByb2xlPVwibWVudVwiPlxuICAgICAgICAgICAgICB7Y29uZmlndXJhdGlvbnN9XG4gICAgICAgICAgICA8L3VsPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tZGFuZ2VyXCI+XG4gICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJpY29uIGljb24tZGVsZXRlXCIgLz5cbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBtYXJnaW4tYm90dG9tLXNtXCI+XG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG4tZ3JvdXBcIj5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0IGRyb3Bkb3duLXRvZ2dsZSBkaXNhYmxlZFwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiB0eXBlPVwiYnV0dG9uXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+XG4gICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImljb24gaWNvbi1zYXZlXCIgLz5cbiAgICAgICAgICAgICAgU2F2ZWQgU2VhcmNoZXNcbiAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiaWNvbiBpY29uLWNoZXZyb24tZG93blwiIC8+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJkcm9wZG93bi1tZW51XCIgcm9sZT1cIm1lbnVcIj5cbiAgICAgICAgICAgICAge2NvbmZpZ3VyYXRpb25zfVxuICAgICAgICAgICAgPC91bD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzc05hbWU9XCJidG4gYnRuLWRhbmdlclwiPlxuICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiaWNvbiBpY29uLWRlbGV0ZVwiIC8+XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDwvZGl2PlxuICAgICAgKTtcbiAgICB9XG4gIH1cbn0pO1xuXG5Db25maWd1cmF0aW9uTGlzdC5Db25maWd1cmF0aW9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBvbkNsaWNrOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnByb3BzLm9uQ2xpY2sodGhpcy5wcm9wcy5jb25maWd1cmF0aW9uLmNvbmZpZ3VyYXRpb24pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybihcbiAgICAgIDxsaT5cbiAgICAgICAgPGEgY2xhc3NOYW1lPVwiZHluYW1pYy10ZXh0LWZpbHRlclwiIG9uQ2xpY2s9e3RoaXMub25DbGlja30+XG4gICAgICAgICAge3RoaXMucHJvcHMuY29uZmlndXJhdGlvbi5uYW1lfVxuICAgICAgICA8L2E+XG4gICAgICA8L2xpPlxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbmZpZ3VyYXRpb25MaXN0O1xuIiwidmFyIEZpbHRlckxpc3QgPSByZXF1aXJlKCcuL2ZpbHRlcmxpc3QuanMuanN4Jyk7XG52YXIgQXBwbHlDb25maWd1cmF0aW9uQnV0dG9uID0gcmVxdWlyZSgnLi9hcHBseWNvbmZpZ3VyYXRpb25idXR0b24uanMuanN4Jyk7XG52YXIgQ2xlYXJDb25maWd1cmF0aW9uQnV0dG9uID0gcmVxdWlyZSgnLi9jbGVhcmNvbmZpZ3VyYXRpb25idXR0b24uanMuanN4Jyk7XG52YXIgU2F2ZUNvbmZpZ3VyYXRpb25CdXR0b24gPSByZXF1aXJlKCcuL3NhdmVjb25maWd1cmF0aW9uYnV0dG9uLmpzLmpzeCcpO1xudmFyIENvbmZpZ3VyYXRpb25MaXN0ID0gcmVxdWlyZSgnLi9jb25maWd1cmF0aW9ubGlzdC5qcy5qc3gnKTtcbnZhciBGaWx0ZXJEaXNwbGF5ID0gcmVxdWlyZSgnLi9maWx0ZXJkaXNwbGF5LmpzLmpzeCcpO1xuXG52YXIgRmlsdGVyQmFyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBmaWx0ZXJzOiBbXSxcbiAgICAgIGNvbmZpZ3VyYXRpb25zOiBbXSxcbiAgICB9O1xuICB9LFxuICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGZpbHRlcnMgPSB3aW5kb3cuZmlsdGVyTGlzdC5tYXAoZnVuY3Rpb24oZmlsdGVyKSB7XG4gICAgICBmaWx0ZXIuZW5hYmxlZCA9IGZhbHNlO1xuICAgICAgZmlsdGVyLnF1ZXJ5X3N0cmluZyA9IFwicVtcIitmaWx0ZXIudHlwZStcIl1bXCIrZmlsdGVyLmZpZWxkK1wiXVwiO1xuICAgICAgcmV0dXJuIGZpbHRlcjtcbiAgICB9KTtcblxuICAgIHRoaXMubG9hZENvbmZpZ3VyYXRpb25zKCk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7ZmlsdGVyczogZmlsdGVyc30pO1xuICB9LFxuICBsb2FkQ29uZmlndXJhdGlvbnM6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjb25maWd1cmF0aW9ucyA9IFtdO1xuXG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogdGhpcy5wcm9wcy5jb25maWd1cmF0aW9uc191cmwsXG4gICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiLFxuICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICBmb3IgKHZhciBpIGluIGRhdGEpIHtcbiAgICAgICAgICB2YXIgbmFtZSA9IGRhdGFbaV0ubmFtZTtcbiAgICAgICAgICB2YXIgY29uZmlndXJhdGlvbiA9IEpTT04ucGFyc2UoZGF0YVtpXS5jb25maWd1cmF0aW9uKTtcblxuICAgICAgICAgIGNvbmZpZ3VyYXRpb25zLnB1c2goe1wibmFtZVwiOm5hbWUsXCJjb25maWd1cmF0aW9uXCI6Y29uZmlndXJhdGlvbn0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2NvbmZpZ3VyYXRpb25zOiBjb25maWd1cmF0aW9uc30pO1xuICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhocixzdGF0dXMsZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih4aHIpO1xuICAgICAgICBjb25zb2xlLmVycm9yKHN0YXR1cyk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBsb2FkQ29uZmlndXJhdGlvbjogZnVuY3Rpb24oY29uZmlndXJhdGlvbikge1xuICAgIHRoaXMuY2xlYXJDb25maWd1cmF0aW9uKCk7XG5cbiAgICBjb25maWd1cmF0aW9uID0gJC5leHRlbmQodHJ1ZSxbXSxjb25maWd1cmF0aW9uKTtcbiAgICB2YXIgZmlsdGVycyA9IHRoaXMuc3RhdGUuZmlsdGVycy5zbGljZSgwKTtcblxuICAgIGZvciAodmFyIGNGaWx0ZXIgb2YgY29uZmlndXJhdGlvbikge1xuICAgICAgZm9yICh2YXIgZmlsdGVyIG9mIGZpbHRlcnMpIHtcbiAgICAgICAgaWYgKGNGaWx0ZXIudWlkID09PSBmaWx0ZXIudWlkKSB7XG4gICAgICAgICAgZmlsdGVyLnZhbHVlID0gY0ZpbHRlci52YWx1ZTtcbiAgICAgICAgICB0aGlzLnNldFN0YXRlKHtmaWx0ZXJzOiBmaWx0ZXJzfSk7XG4gICAgICAgICAgdGhpcy5lbmFibGVGaWx0ZXIoZmlsdGVyKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuYXBwbHlDb25maWd1cmF0aW9uKCk7XG4gIH0sXG4gIHNhdmVDb25maWd1cmF0aW9uOiBmdW5jdGlvbihzZWFyY2hfdGl0bGUpIHtcbiAgICB2YXIgZmlsdGVyZWRBcnJheSA9IHRoaXMuc3RhdGUuZmlsdGVycy5maWx0ZXIoZnVuY3Rpb24oZmlsdGVyKSB7XG4gICAgICByZXR1cm4gKChmaWx0ZXIuZW5hYmxlZCA9PT0gdHJ1ZSkgJiYgKE9iamVjdC5rZXlzKGZpbHRlci52YWx1ZSAhPT0gMCkpKTtcbiAgICB9KTtcblxuICAgIHZhciBmaWx0ZXJzID0gZmlsdGVyZWRBcnJheS5tYXAoZnVuY3Rpb24oZmlsdGVyKSB7XG4gICAgICBmaWx0ZXJDb25maWcgPSB7fTtcbiAgICAgIGZpbHRlckNvbmZpZy51aWQgPSBmaWx0ZXIudWlkO1xuICAgICAgZmlsdGVyQ29uZmlnLnZhbHVlPSBmaWx0ZXIudmFsdWU7XG4gICAgICByZXR1cm4gZmlsdGVyQ29uZmlnO1xuICAgIH0pO1xuXG4gICAgdmFyIHBheWxvYWQgPSB7XCJzYXZlZF9zZWFyY2hcIjoge1wic2VhcmNoX3RpdGxlXCI6IHNlYXJjaF90aXRsZSwgXCJmaWx0ZXJzXCI6IGZpbHRlcnN9fTtcblxuICAgICQuYWpheCh7XG4gICAgICB1cmw6IHRoaXMucHJvcHMuY29uZmlndXJhdGlvbnNfdXJsLFxuICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIsXG4gICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeShwYXlsb2FkKSxcbiAgICAgIGRhdGFUeXBlOiBcInNjcmlwdFwiLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICB0aGlzLmxvYWRDb25maWd1cmF0aW9ucygpO1xuICAgICAgICB0aGlzLmFwcGx5Q29uZmlndXJhdGlvbigpO1xuICAgICAgfS5iaW5kKHRoaXMpLFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKHhocixzdGF0dXMsZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcih4aHIpO1xuICAgICAgICBjb25zb2xlLmVycm9yKHN0YXR1cyk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBhcHBseUNvbmZpZ3VyYXRpb246IGZ1bmN0aW9uKCkge1xuICAgIHZhciBmaWx0ZXJlZEFycmF5ID0gdGhpcy5zdGF0ZS5maWx0ZXJzLmZpbHRlcihmdW5jdGlvbihmaWx0ZXIpIHtcbiAgICAgIHJldHVybiAoKGZpbHRlci5lbmFibGVkID09PSB0cnVlKSAmJiAoT2JqZWN0LmtleXMoZmlsdGVyLnZhbHVlICE9PSAwKSkpO1xuICAgIH0pO1xuXG4gICAgdmFyIHBheWxvYWQgPSBmaWx0ZXJlZEFycmF5Lm1hcChmdW5jdGlvbihmaWx0ZXIpIHtcbiAgICAgIHZhciBmaWx0ZXJDb25maWcgPSB7fTtcbiAgICAgIGZpbHRlckNvbmZpZ1tmaWx0ZXIucXVlcnlfc3RyaW5nXSA9IGZpbHRlci52YWx1ZTtcbiAgICAgIHZhciBmaWx0ZXJQYXJhbXMgPSAkLnBhcmFtKGZpbHRlckNvbmZpZyk7XG4gICAgICByZXR1cm4gZmlsdGVyUGFyYW1zO1xuICAgIH0pO1xuXG4gICAgdmFyIHJlc3VsdCA9IHBheWxvYWQuam9pbihcIiZcIik7XG5cbiAgICAkLmFqYXgoe1xuICAgICAgdXJsOiB0aGlzLnByb3BzLnJlc291cmNlX3VybCArIFwiP1wiICsgcmVzdWx0LFxuICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIixcbiAgICAgIGRhdGFUeXBlOiBcInNjcmlwdFwiLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbih4aHIsc3RhdHVzLGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoeGhyKTtcbiAgICAgICAgY29uc29sZS5lcnJvcihzdGF0dXMpO1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgY2xlYXJDb25maWd1cmF0aW9uOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgZmlsdGVycyA9IHRoaXMuc3RhdGUuZmlsdGVycy5zbGljZSgwKTtcbiAgICBmb3IgKHZhciBmaWx0ZXIgb2YgZmlsdGVycykge1xuICAgICAgdGhpcy5kaXNhYmxlRmlsdGVyKGZpbHRlcik7XG4gICAgfVxuICAgIHRoaXMuYXBwbHlDb25maWd1cmF0aW9uKCk7XG4gIH0sXG4gIGVuYWJsZUZpbHRlcjogZnVuY3Rpb24oZmlsdGVyKSB7XG4gICAgdmFyIGZpbHRlcnMgPSB0aGlzLnN0YXRlLmZpbHRlcnMuc2xpY2UoMCk7XG4gICAgZm9yICh2YXIgaSBpbiBmaWx0ZXJzKSB7XG4gICAgICBpZiAoZmlsdGVyc1tpXS51aWQgPT0gZmlsdGVyLnVpZCkge1xuICAgICAgICBmaWx0ZXJzW2ldLmVuYWJsZWQgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNldFN0YXRlKHtmaWx0ZXJzOiBmaWx0ZXJzfSk7XG4gIH0sXG4gIGRpc2FibGVGaWx0ZXI6IGZ1bmN0aW9uKGZpbHRlcikge1xuICAgIHZhciBmaWx0ZXJzID0gdGhpcy5zdGF0ZS5maWx0ZXJzLnNsaWNlKDApO1xuICAgIGZvciAodmFyIGkgaW4gZmlsdGVycykge1xuICAgICAgaWYgKGZpbHRlcnNbaV0udWlkID09IGZpbHRlci51aWQpIHtcbiAgICAgICAgZmlsdGVyc1tpXS5lbmFibGVkID0gZmFsc2U7XG4gICAgICAgIGZpbHRlcnNbaV0udmFsdWUgPSBudWxsO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7ZmlsdGVyczogZmlsdGVyc30pO1xuICB9LFxuICB1cGRhdGVGaWx0ZXI6IGZ1bmN0aW9uKGZpbHRlcikge1xuICAgIHZhciBmaWx0ZXJzID0gdGhpcy5zdGF0ZS5maWx0ZXJzLnNsaWNlKDApO1xuXG4gICAgZm9yICh2YXIgaSBpbiBmaWx0ZXJzKSB7XG4gICAgICBpZiAoZmlsdGVyc1tpXS51aWQgPT09IGZpbHRlci51aWQpIHtcbiAgICAgICAgZmlsdGVyc1tpXS52YWx1ZSA9IGZpbHRlci52YWx1ZTtcbiAgICAgICAgZmlsdGVyc1tpXS5xdWVyeV9zdHJpbmcgPSBmaWx0ZXIucXVlcnlfc3RyaW5nO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7ZmlsdGVyczogZmlsdGVyc30pO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cCBtYXJnaW4tYm90dG9tLXNtXCI+XG4gICAgICAgICAgPEZpbHRlckxpc3QgZmlsdGVycz17dGhpcy5zdGF0ZS5maWx0ZXJzfSBlbmFibGVGaWx0ZXI9e3RoaXMuZW5hYmxlRmlsdGVyfSAvPlxuICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBkaXNhYmxlZFwiPjxpIGNsYXNzTmFtZT1cImljb24gaWNvbi1kb3dubG9hZFwiPjwvaT5FeHBvcnQgQ1NWPC9idXR0b24+XG4gICAgICAgICAgPEFwcGx5Q29uZmlndXJhdGlvbkJ1dHRvbiBvbkNsaWNrPXt0aGlzLmFwcGx5Q29uZmlndXJhdGlvbn0gLz5cbiAgICAgICAgICA8Q2xlYXJDb25maWd1cmF0aW9uQnV0dG9uIG9uQ2xpY2s9e3RoaXMuY2xlYXJDb25maWd1cmF0aW9ufSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPFNhdmVDb25maWd1cmF0aW9uQnV0dG9uIG9uQ2xpY2s9e3RoaXMuc2F2ZUNvbmZpZ3VyYXRpb259IG9uQ2hhbmdlPXt0aGlzLnVwZGF0ZUNvbmZpZ3VyYXRpb25OYW1lfSAvPlxuICAgICAgICA8Q29uZmlndXJhdGlvbkxpc3QgY29uZmlndXJhdGlvbnM9e3RoaXMuc3RhdGUuY29uZmlndXJhdGlvbnN9IGxvYWRDb25maWd1cmF0aW9uPXt0aGlzLmxvYWRDb25maWd1cmF0aW9ufSAvPlxuICAgICAgICA8RmlsdGVyRGlzcGxheSBmaWx0ZXJzPXt0aGlzLnN0YXRlLmZpbHRlcnN9IGRpc2FibGVGaWx0ZXI9e3RoaXMuZGlzYWJsZUZpbHRlcn0gdXBkYXRlRmlsdGVyPXt0aGlzLnVwZGF0ZUZpbHRlcn0gLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZpbHRlckJhcjtcbiIsInZhciBUZXh0SW5wdXQgPSByZXF1aXJlKCcuL2lucHV0cy90ZXh0aW5wdXQuanMuanN4Jyk7XG52YXIgRGF0ZUlucHV0ID0gcmVxdWlyZSgnLi9pbnB1dHMvZGF0ZWlucHV0LmpzLmpzeCcpO1xudmFyIFNlbGVjdElucHV0ID0gcmVxdWlyZSgnLi9pbnB1dHMvc2VsZWN0aW5wdXQuanMuanN4Jyk7XG5cbnZhciBGaWx0ZXJEaXNwbGF5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBmaWx0ZXJzID0gW107XG4gICAgdmFyIGZpbHRlcmVkQXJyYXkgPSB0aGlzLnByb3BzLmZpbHRlcnMuZmlsdGVyKGZ1bmN0aW9uKGZpbHRlcikge1xuICAgICAgcmV0dXJuIChmaWx0ZXIuZW5hYmxlZCA9PT0gdHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBpZiAoZmlsdGVyZWRBcnJheS5sZW5ndGggIT09IDApIHtcbiAgICAgIGZpbHRlcnMgPSBmaWx0ZXJlZEFycmF5Lm1hcChmdW5jdGlvbihmaWx0ZXIpIHtcbiAgICAgICAgaWYgKGZpbHRlci5lbmFibGVkID09PSB0cnVlKSB7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxGaWx0ZXJEaXNwbGF5LkZpbHRlclxuICAgICAgICAgICAgICBmaWx0ZXI9e2ZpbHRlcn1cbiAgICAgICAgICAgICAgZGlzYWJsZUZpbHRlcj17dGhpcy5wcm9wcy5kaXNhYmxlRmlsdGVyfVxuICAgICAgICAgICAgICB1cGRhdGVGaWx0ZXI9e3RoaXMucHJvcHMudXBkYXRlRmlsdGVyfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9LHRoaXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmaWx0ZXJzID0gKDxkaXY+Tm8gRmlsdGVycyBFbmFibGVkPC9kaXY+KTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJuYXZiYXIgZmlsdGVyYmFyXCI+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiIGlkPVwiZmlsdGVyc1wiPlxuICAgICAgICAgIHtmaWx0ZXJzfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn0pO1xuXG5GaWx0ZXJEaXNwbGF5LkZpbHRlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzYWJsZUZpbHRlcjogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wcm9wcy5kaXNhYmxlRmlsdGVyKHRoaXMucHJvcHMuZmlsdGVyKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgaW5wdXRzID0gPEZpbHRlckRpc3BsYXkuRmlsdGVyLklucHV0c1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXI9e3RoaXMucHJvcHMuZmlsdGVyfVxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVGaWx0ZXI9e3RoaXMucHJvcHMudXBkYXRlRmlsdGVyfVxuICAgICAgICAgICAgICAgICAvPjtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbGctMyBjb2wtbWQtNCBjb2wtc20tNiBjb2wteHMtMTIgZmlsdGVyXCI+XG4gICAgICAgIDx1bCBjbGFzc05hbWU9e3RoaXMucHJvcHMuZmlsdGVyLnVpZH0+XG4gICAgICAgICAgPGxpPlxuICAgICAgICAgICAgPGkgb25DbGljaz17dGhpcy5kaXNhYmxlRmlsdGVyfSBjbGFzc05hbWU9XCJidG4gYnRuLWNpcmNsZS1wcmltYXJ5IGJ0bi14cyBpY29uIGljb24tY2xvc2UgcmVtb3ZlLWZpbHRlclwiIC8+XG4gICAgICAgICAgICA8bGFiZWw+XG4gICAgICAgICAgICAgIHt0aGlzLnByb3BzLmZpbHRlci5sYWJlbH1cbiAgICAgICAgICAgIDwvbGFiZWw+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgICB7aW5wdXRzfVxuICAgICAgICA8L3VsPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG5cbkZpbHRlckRpc3BsYXkuRmlsdGVyLklucHV0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgaW5wdXRGYWN0b3J5OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdHlwZSA9IHRoaXMucHJvcHMuZmlsdGVyLnR5cGU7XG4gICAgaWYgKHR5cGUgPT0gJ3RleHQnIHx8IHR5cGUgPT0gJ2lkJykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFRleHRJbnB1dFxuICAgICAgICAgIGZpbHRlcj17dGhpcy5wcm9wcy5maWx0ZXJ9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMucHJvcHMudXBkYXRlRmlsdGVyfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9IGVsc2UgaWYgKHR5cGUgPT0gJ2RhdGUnKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8RGF0ZUlucHV0XG4gICAgICAgICAgZmlsdGVyPXt0aGlzLnByb3BzLmZpbHRlcn1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5wcm9wcy51cGRhdGVGaWx0ZXJ9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PSAnc2VsZWN0Jykge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFNlbGVjdElucHV0XG4gICAgICAgICAgZmlsdGVyPXt0aGlzLnByb3BzLmZpbHRlcn1cbiAgICAgICAgICBvbkNoYW5nZT17dGhpcy5wcm9wcy51cGRhdGVGaWx0ZXJ9XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH0gZWxzZSBpZiAodHlwZSA9PSAnYWdlX3NlbGVjdCcpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxBZ2VTZWxlY3RJbnB1dFxuICAgICAgICAgIGZpbHRlcj17dGhpcy5wcm9wcy5maWx0ZXJ9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMucHJvcHMudXBkYXRlRmlsdGVyfVxuICAgICAgICAvPlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcihcIk5vdCBpbXBsZW1lbnRlZCB5ZXQhXCIpO1xuICAgIH1cbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgaW5wdXRzID0gdGhpcy5pbnB1dEZhY3RvcnkoKTtcbiAgICByZXR1cm4gKFxuICAgICAgaW5wdXRzXG4gICAgKTtcbiAgfVxufSk7XG5cbnZhciBBZ2VTZWxlY3RJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2VsZWN0ZWQ6IHRoaXMucHJvcHMuZmlsdGVyLnZhbHVlIHx8IFwiMCwxNVwiXG4gICAgfTtcbiAgfSxcbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBmaWx0ZXIgPSAkLmV4dGVuZCh0cnVlLHt9LHRoaXMucHJvcHMuZmlsdGVyKTtcbiAgICBmaWx0ZXIudmFsdWUgPSB0aGlzLnN0YXRlLnNlbGVjdGVkO1xuICAgIHRoaXMucHJvcHMub25DaGFuZ2UoZmlsdGVyKTtcbiAgfSxcbiAgb25DaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdmFyIGZpbHRlciA9ICQuZXh0ZW5kKHRydWUse30sdGhpcy5wcm9wcy5maWx0ZXIpO1xuICAgIGZpbHRlci52YWx1ZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe3NlbGVjdGVkOiBldmVudC50YXJnZXQudmFsdWV9KTtcbiAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKGZpbHRlcik7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxsaT5cbiAgICAgICAgPHNlbGVjdFxuICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiXG4gICAgICAgICAgc2VsZWN0ZWQ9e3RoaXMuc3RhdGUuc2VsZWN0ZWR9XG4gICAgICAgICAgb25DaGFuZ2U9e3RoaXMub25DaGFuZ2V9XG4gICAgICAgID5cbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiMCwxNVwiPjE1IGFuZCB1bmRlcjwvb3B0aW9uPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCIxNiwyNFwiPjE2IC0gMjQ8L29wdGlvbj5cbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiMjUsMzRcIj4yNSAtIDM0PC9vcHRpb24+XG4gICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIjM1LDQ0XCI+MzUgLSA0NDwvb3B0aW9uPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCI0NSw1NFwiPjQ1IC0gNTQ8L29wdGlvbj5cbiAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiNTUsNjRcIj41NSAtIDY0PC9vcHRpb24+XG4gICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIjY1LDc0XCI+NjUgLSA3NDwvb3B0aW9uPlxuICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCI3NSwxMDBcIj43NSBhbmQgb3Zlcjwvb3B0aW9uPlxuICAgICAgICA8L3NlbGVjdD5cbiAgICAgIDwvbGk+XG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRmlsdGVyRGlzcGxheTtcbiIsInZhciBGaWx0ZXJMaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBmaWx0ZXJPcHRpb25zID0gdGhpcy5wcm9wcy5maWx0ZXJzLm1hcChmdW5jdGlvbihmaWx0ZXIpIHtcbiAgICAgIGlmIChmaWx0ZXIuZW5hYmxlZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8RmlsdGVyTGlzdC5GaWx0ZXJPcHRpb25cbiAgICAgICAgICAgIGZpbHRlcj17ZmlsdGVyfVxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5wcm9wcy5lbmFibGVGaWx0ZXJ9XG4gICAgICAgICAgLz5cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9LHRoaXMpO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0bi1ncm91cFwiPlxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdCBkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgdHlwZT1cImJ1dHRvblwiPlxuICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImljb24gaWNvbi1hZGRcIiAvPlxuICAgICAgICAgIEFkZCBGaWx0ZXJcbiAgICAgICAgICA8aSBjbGFzc05hbWU9XCJpY29uIGljb24tY2hldnJvbi1kb3duXCIgLz5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICAgIDx1bCBjbGFzc05hbWU9XCJkcm9wZG93bi1tZW51XCIgcm9sZT1cIm1lbnVcIj5cbiAgICAgICAgICB7ZmlsdGVyT3B0aW9uc31cbiAgICAgICAgPC91bD5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn0pO1xuXG5GaWx0ZXJMaXN0LkZpbHRlck9wdGlvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgb25DbGljazogZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5wcm9wcy5vbkNsaWNrKHRoaXMucHJvcHMuZmlsdGVyKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGxpPlxuICAgICAgICA8YSBvbkNsaWNrPXt0aGlzLm9uQ2xpY2t9PlxuICAgICAgICAgIHt0aGlzLnByb3BzLmZpbHRlci5sYWJlbH1cbiAgICAgICAgPC9hPlxuICAgICAgPC9saT5cbiAgICApO1xuICB9LFxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRmlsdGVyTGlzdDtcbiIsInZhciBEYXRlSW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuZmlsdGVyLnZhbHVlKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBmcm9tOiB0aGlzLnByb3BzLmZpbHRlci52YWx1ZS5mcm9tLFxuICAgICAgICB0bzogdGhpcy5wcm9wcy5maWx0ZXIudmFsdWUudG8sXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBmcm9tOiAnJyxcbiAgICAgICAgdG86ICcnLFxuICAgICAgfTtcbiAgICB9XG4gIH0sXG4gIG9uQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBmaWx0ZXIgPSAkLmV4dGVuZCh0cnVlLHt9LHRoaXMucHJvcHMuZmlsdGVyKTtcbiAgICB2YXIgdmFsdWUgPSBmaWx0ZXIudmFsdWUgfHwge307XG5cbiAgICB2YXIgc3RhdGVPYmplY3QgPSB0aGlzLnN0YXRlO1xuICAgIHZhciBkYXRlID0gZXZlbnQuZGF0ZS5mb3JtYXQoXCJERC1NTS1ZWVlZXCIpO1xuICAgIGlmIChldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdkYXRlUmFuZ2VGcm9tJykpIHtcbiAgICAgIHN0YXRlT2JqZWN0LmZyb20gPSBkYXRlO1xuICAgICAgdmFsdWUuZnJvbSA9IGRhdGU7XG4gICAgfSBlbHNlIGlmIChldmVudC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdkYXRlUmFuZ2VUbycpKSB7XG4gICAgICBzdGF0ZU9iamVjdC50byA9IGRhdGU7XG4gICAgICB2YWx1ZS50byA9IGRhdGU7XG4gICAgfVxuXG4gICAgZmlsdGVyLnZhbHVlID0gdmFsdWU7XG5cbiAgICB0aGlzLnNldFN0YXRlKHN0YXRlT2JqZWN0KTtcbiAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKGZpbHRlcik7XG4gIH0sXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgZGF0ZVBpY2tlckZyb20gPSAkKFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5kYXRlUmFuZ2VGcm9tKSk7XG4gICAgZGF0ZVBpY2tlckZyb20uZGF0ZXRpbWVwaWNrZXIoe2Zvcm1hdDogJ0RELU1NLVlZWVknfSk7XG4gICAgZGF0ZVBpY2tlckZyb20uZGF0ZXRpbWVwaWNrZXIoKS5vbignZHAuY2hhbmdlJyx0aGlzLm9uQ2hhbmdlKTtcblxuICAgIHZhciBkYXRlUGlja2VyVG8gPSAkKFJlYWN0LmZpbmRET01Ob2RlKHRoaXMucmVmcy5kYXRlUmFuZ2VUbykpO1xuICAgIGRhdGVQaWNrZXJUby5kYXRldGltZXBpY2tlcih7Zm9ybWF0OiAnREQtTU0tWVlZWSd9KTtcbiAgICBkYXRlUGlja2VyVG8uZGF0ZXRpbWVwaWNrZXIoKS5vbignZHAuY2hhbmdlJyx0aGlzLm9uQ2hhbmdlKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGxpPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWdyb3VwIGRhdGVwaWNrZXIgZGF0ZVJhbmdlRnJvbVwiIHJlZj1cImRhdGVSYW5nZUZyb21cIj5cbiAgICAgICAgICA8aW5wdXRcbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiXG4gICAgICAgICAgICB0eXBlPVwidGV4dFwiXG4gICAgICAgICAgICBkYXRhLWRhdGUtZm9ybWF0PVwiREQvTU0vWVlZWVwiXG4gICAgICAgICAgICBhcmlhLXJlcXVpcmVkPVwidHJ1ZVwiXG4gICAgICAgICAgICBwbGFjZWhvbGRlcj1cImZyb21cIlxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMub25DaGFuZ2V9XG4gICAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS5mcm9tfVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaW5wdXQtZ3JvdXAtYWRkb25cIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24tY2FsZW5kYXIgaWNvblwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwic3Itb25seSBpY29uIGljb24tY2FsZW5kYXJcIj5cbiAgICAgICAgICAgICAgQ2FsZW5kYXJcbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlucHV0LWdyb3VwIGRhdGVwaWNrZXIgZGF0ZVJhbmdlVG9cIiByZWY9XCJkYXRlUmFuZ2VUb1wiPlxuICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCJcbiAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcbiAgICAgICAgICAgIGRhdGEtZGF0ZS1mb3JtYXQ9XCJERC9NTS9ZWVlZXCJcbiAgICAgICAgICAgIGFyaWEtcmVxdWlyZWQ9XCJ0cnVlXCJcbiAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwidG9cIlxuICAgICAgICAgICAgb25DaGFuZ2U9e3RoaXMub25DaGFuZ2V9XG4gICAgICAgICAgICB2YWx1ZT17dGhpcy5zdGF0ZS50b31cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImlucHV0LWdyb3VwLWFkZG9uXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uLWNhbGVuZGFyIGljb25cIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInNyLW9ubHkgaWNvbiBpY29uLWNhbGVuZGFyXCI+XG4gICAgICAgICAgICAgIENhbGVuZGFyXG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvbGk+XG4gICAgKTtcbiAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGF0ZUlucHV0O1xuIiwidmFyIFNlbGVjdElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBzZWxlY3RlZDogdGhpcy5wcm9wcy5maWx0ZXIudmFsdWUgfHwgdGhpcy5wcm9wcy5maWx0ZXIuc2VsZWN0aW9uc1swXVswXVxuICAgIH07XG4gIH0sXG4gIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgZmlsdGVyID0gJC5leHRlbmQodHJ1ZSx7fSx0aGlzLnByb3BzLmZpbHRlcik7XG4gICAgZmlsdGVyLnZhbHVlID0gdGhpcy5zdGF0ZS5zZWxlY3RlZDtcbiAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKGZpbHRlcik7XG4gIH0sXG4gIG9uQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBmaWx0ZXIgPSAkLmV4dGVuZCh0cnVlLHt9LHRoaXMucHJvcHMuZmlsdGVyKTtcbiAgICBmaWx0ZXIudmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtzZWxlY3RlZDogZXZlbnQudGFyZ2V0LnZhbHVlfSk7XG4gICAgdGhpcy5wcm9wcy5vbkNoYW5nZShmaWx0ZXIpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBvcHRpb25zID0gdGhpcy5wcm9wcy5maWx0ZXIuc2VsZWN0aW9ucy5tYXAoZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICByZXR1cm4gKDxvcHRpb24gdmFsdWU9e29wdGlvblswXX0+e29wdGlvblsxXX08L29wdGlvbj4pO1xuICAgIH0pO1xuICAgIHJldHVybiAoXG4gICAgICA8bGk+XG4gICAgICAgIDxzZWxlY3RcbiAgICAgICAgICBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIlxuICAgICAgICAgIHNlbGVjdGVkPXt0aGlzLnN0YXRlLnNlbGVjdGVkfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLm9uQ2hhbmdlfVxuICAgICAgICA+XG4gICAgICAgICAge29wdGlvbnN9XG4gICAgICAgIDwvc2VsZWN0PlxuICAgICAgPC9saT5cbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBTZWxlY3RJbnB1dDtcbiIsInZhciBUZXh0SW5wdXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbHVlOiB0aGlzLnByb3BzLmZpbHRlci52YWx1ZSB8fCAnJ1xuICAgIH07XG4gIH0sXG4gIG9uQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuICAgIHZhciBmaWx0ZXIgPSAkLmV4dGVuZCh0cnVlLHt9LHRoaXMucHJvcHMuZmlsdGVyKTtcbiAgICBmaWx0ZXIudmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG5cbiAgICB0aGlzLnNldFN0YXRlKHt2YWx1ZTogZXZlbnQudGFyZ2V0LnZhbHVlfSk7XG4gICAgdGhpcy5wcm9wcy5vbkNoYW5nZShmaWx0ZXIpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8bGk+XG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiXG4gICAgICAgICAgdHlwZT1cInRleHRcIlxuICAgICAgICAgIHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfVxuICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLm9uQ2hhbmdlfVxuICAgICAgICAvPlxuICAgICAgPC9saT5cbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0SW5wdXQ7XG4iLCJ2YXIgU2F2ZUNvbmZpZ3VyYXRpb25CdXR0b24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIG9uQ2xpY2s6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucHJvcHMub25DbGljayh0aGlzLnN0YXRlLmNvbmZpZ3VyYXRpb25OYW1lKTtcbiAgfSxcbiAgb25DaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7Y29uZmlndXJhdGlvbk5hbWU6IGV2ZW50LnRhcmdldC52YWx1ZX0pO1xuICB9LFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb25maWd1cmF0aW9uTmFtZTogJydcbiAgICB9O1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgICAgIDxSZWFjdEJvb3RzdHJhcC5Ecm9wZG93bkJ1dHRvbiB0aXRsZT1cIlNhdmUgU2VhcmNoXCIgdHlwZT1cImJ1dHRvblwiIGJzU3R5bGU9XCJkZWZhdWx0XCIgY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0IG1hcmdpbi1ib3R0b20tc21cIj5cbiAgICAgICAgICA8UmVhY3RCb290c3RyYXAuTWVudUl0ZW0gZXZlbnRLZXk9XCIxXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cbiAgICAgICAgICAgICAgPGxhYmVsPlNlYXJjaCBUaXRsZTwvbGFiZWw+XG4gICAgICAgICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJmb3JtLWNvbnRyb2xcIiB2YWx1ZT17dGhpcy5zdGF0ZS5jb25maWd1cmF0aW9uTmFtZX0gdHlwZT1cInRleHRcIiBvbkNoYW5nZT17dGhpcy5vbkNoYW5nZX0gLz5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLXByaW1hcnlcIiB0eXBlPVwiYnV0dG9uXCIgb25DbGljaz17dGhpcy5vbkNsaWNrfT5TYXZlPC9idXR0b24+XG4gICAgICAgICAgPC9SZWFjdEJvb3RzdHJhcC5NZW51SXRlbT5cbiAgICAgICAgPC9SZWFjdEJvb3RzdHJhcC5Ecm9wZG93bkJ1dHRvbj5cbiAgICApO1xuICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBTYXZlQ29uZmlndXJhdGlvbkJ1dHRvbjtcbiJdfQ==

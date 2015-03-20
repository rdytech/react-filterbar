var DateInput = React.createClass({
  getInitialState: function() {
    if (this.props.filter.value) {
      return {
        from: this.props.filter.value.from,
        to: this.props.filter.value.to,
      };
    } else {
      return {
        from: '',
        to: '',
      };
    }
  },
  onChange: function(event) {
    var filter = $.extend(true,{},this.props.filter);
    var value = filter.value || {};

    var stateObject = this.state;
    var date = event.date.format("DD-MM-YYYY");
    if (event.target.classList.contains('dateRangeFrom')) {
      stateObject.from = date;
      value.from = date;
    } else if (event.target.classList.contains('dateRangeTo')) {
      stateObject.to = date;
      value.to = date;
    }

    filter.value = value;

    this.setState(stateObject);
    this.props.onChange(filter);
  },
  componentDidMount: function() {
    var datePickerFrom = $(React.findDOMNode(this.refs.dateRangeFrom));
    datePickerFrom.datetimepicker({format: 'DD-MM-YYYY'});
    datePickerFrom.datetimepicker().on('dp.change',this.onChange);

    var datePickerTo = $(React.findDOMNode(this.refs.dateRangeTo));
    datePickerTo.datetimepicker({format: 'DD-MM-YYYY'});
    datePickerTo.datetimepicker().on('dp.change',this.onChange);
  },
  render: function() {
    return (
      <li>
        <div className="input-group datepicker dateRangeFrom" ref="dateRangeFrom">
          <input
            className="form-control"
            type="text"
            data-date-format="DD/MM/YYYY"
            aria-required="true"
            placeholder="from"
            onChange={this.onChange}
            value={this.state.from}
          />
          <span className="input-group-addon">
            <span className="icon-calendar icon" aria-hidden="true">
            </span>
            <span className="sr-only icon icon-calendar">
              Calendar
            </span>
          </span>
        </div>
        <div className="input-group datepicker dateRangeTo" ref="dateRangeTo">
          <input
            className="form-control"
            type="text"
            data-date-format="DD/MM/YYYY"
            aria-required="true"
            placeholder="to"
            onChange={this.onChange}
            value={this.state.to}
          />
          <span className="input-group-addon">
            <span className="icon-calendar icon" aria-hidden="true">
            </span>
            <span className="sr-only icon icon-calendar">
              Calendar
            </span>
          </span>
        </div>
      </li>
    );
  }
});

module.exports = DateInput;

export class DateTimeInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = { value: this.props.value || { from: null, to: null } };
  }

  onChange(event) {
    var newValue = this.state.value;

    if(event.type === "dp") {
      newValue[event.target.querySelector("input").getAttribute("placeholder")] = event.target.querySelector("input").value;
    } else if (event.type === "input") {
      newValue[event.target.getAttribute("placeholder")] = event.target.value;
    }

    this.setState({value: newValue});
  }

  onBlur() {
    this.context.filterBarActor.updateFilter(this.props.filterUid, "value", this.state.value);
  }

  componentDidMount() {
    var dateTimePickerFrom = $(React.findDOMNode(this.refs.dateTimeRangeFrom));
    if (dateTimePickerFrom.datetimepicker !== undefined) {
      dateTimePickerFrom.datetimepicker({ locale: 'en-au', format: 'LLL', sideBySide: false });
      dateTimePickerFrom.datetimepicker().on("dp.change", this.onChange.bind(this));
    }

    var dateTimePickerTo = $(React.findDOMNode(this.refs.dateTimeRangeTo));
    if (dateTimePickerTo.datetimepicker !== undefined) {
      dateTimePickerTo.datetimepicker({ locale: 'en-au', format: 'LLL', sideBySide: false });
      dateTimePickerTo.datetimepicker().on("dp.change", this.onChange.bind(this));
    }
  }

  render() {
    return (
      <li>
        <div className="input-group datepicker dateTimeRangeFrom" ref="dateTimeRangeFrom">
          <input
            aria-required="true"
            className="form-control"
            data-date-format="DD/MM/YYYY HH:mm"
            onBlur={this.onBlur.bind(this)}
            onChange={this.onChange.bind(this)}
            placeholder="from"
            type="text"
            value={this.state.value.from}
          />
          <span className="input-group-addon">
            <span aria-hidden="true" className="icon-calendar icon" />
            <span className="sr-only icon icon-calendar">
              Calendar
            </span>
          </span>
        </div>
        <div className="input-group datepicker dateTimeRangeTo" ref="dateTimeRangeTo">
          <input
            aria-required="true"
            className="form-control"
            data-date-format="DD/MM/YYYY HH:mm"
            onBlur={this.onBlur.bind(this)}
            onChange={this.onChange.bind(this)}
            placeholder="to"
            type="text"
            value={this.state.value.to}
          />
          <span className="input-group-addon">
            <span aria-hidden="true" className="icon-calendar icon" />
            <span className="sr-only icon icon-calendar">
              Calendar
            </span>
          </span>
        </div>
      </li>
    );
  }
}

DateTimeInput.propTypes = {
  filterUid: React.PropTypes.string.isRequired,
  value: React.PropTypes.node.isRequired
};

DateTimeInput.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};

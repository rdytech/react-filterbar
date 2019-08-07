export class DateInput extends React.Component {
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

  onRelativeChange(event) {
    var optionElement = event.target.childNodes[event.target.selectedIndex];
    var from = moment(parseInt(optionElement.getAttribute('data-from')));
    var to = moment(parseInt(optionElement.getAttribute('data-to')));

    this.setState({value: { from: from.format('l'), to: to.format('l') }});
  }

  onBlur() {
    this.context.filterBarActor.updateFilter(this.props.filterUid, "value", this.state.value);
  }

  componentDidMount() {
    var datePickerFrom = $(React.findDOMNode(this.refs.dateRangeFrom));
    if (datePickerFrom.datetimepicker !== undefined) {
      datePickerFrom.datetimepicker({ locale: 'en-au', format: 'L' });
      datePickerFrom.datetimepicker().on("dp.change", this.onChange.bind(this));
    }

    var datePickerTo = $(React.findDOMNode(this.refs.dateRangeTo));
    if (datePickerTo.datetimepicker !== undefined) {
      datePickerTo.datetimepicker({ locale: 'en-au', format: 'L' });
      datePickerTo.datetimepicker().on("dp.change", this.onChange.bind(this));
    }
  }

  displayOptions() {
    const optionsList = [
      { label: 'Today' , from: moment() , to: moment() },
      { label: 'Last week' , from: moment().subtract(1, 'week').startOf('isoWeek'), to: moment().subtract(1, 'week').endOf('isoWeek') }
      // { label: 'This week' , from: moment().format('l') },
      // { label: 'Next week' , from: moment().format('l') },
    ]

    let options = optionsList.map(function(item) {
      return(
        <option key={item.label} value={item.label} data-from={item.from} data-to={item.to}>
          {item.label}
        </option>
      )
    })

    return(
      {options}
    )
  }

  displayRelativeSelect() {
    var filter = this.context.filterBarStore.getFilter(this.props.filterUid);

    if (filter.includeRelativeDates == 'true') {
      return (
        <select
          className="form-control"
          onChange={this.onRelativeChange.bind(this)}
        >
          {this.displayOptions()}
        </select>
      )
    } else {
      return '';
    }
  }

  render() {
    return (
      <li>
        {this.displayRelativeSelect()}
        <div className="input-group datepicker dateRangeFrom" ref="dateRangeFrom">
          <input
            aria-required="true"
            className="form-control"
            data-date-format="DD/MM/YYYY"
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
        <div className="input-group datepicker dateRangeTo" ref="dateRangeTo">
          <input
            aria-required="true"
            className="form-control"
            data-date-format="DD/MM/YYYY"
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

DateInput.propTypes = {
  filterUid: React.PropTypes.string.isRequired,
  value: React.PropTypes.node.isRequired
};

DateInput.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};

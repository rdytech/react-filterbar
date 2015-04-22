export class DateInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = { value: this.props.filterBarActor.getFilter(this.props.filterUid).value || { from: null, to: null } };
  }

  _onChange(event) {
    var newValue = this.state.value;

    if(event.type === 'dp') {
      newValue[event.target.querySelector('input').getAttribute('placeholder')] = event.target.querySelector('input').value;
    } else if (event.type === 'input') {
      newValue[event.target.getAttribute('placeholder')] = event.target.value;
    }

    this.setState({value: newValue});
    this.props.filterBarActor.updateFilter(this.props.filterUid, 'value', newValue);
  }

  componentDidMount() {
    var datePickerFrom = $(React.findDOMNode(this.refs.dateRangeFrom));
    datePickerFrom.datetimepicker({format: 'DD-MM-YYYY'});
    datePickerFrom.datetimepicker().on('dp.change',this._onChange.bind(this));

    var datePickerTo = $(React.findDOMNode(this.refs.dateRangeTo));
    datePickerTo.datetimepicker({format: 'DD-MM-YYYY'});
    datePickerTo.datetimepicker().on('dp.change',this._onChange.bind(this));
  }

  render() {
    return (
      <li>
        <div className="input-group datepicker dateRangeFrom" ref="dateRangeFrom">
          <input
            className="form-control"
            type="text"
            data-date-format="DD/MM/YYYY"
            aria-required="true"
            placeholder="from"
            onChange={this._onChange.bind(this)}
            value={this.state.value.from}
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
            onChange={this._onChange.bind(this)}
            value={this.state.value.to}
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
}

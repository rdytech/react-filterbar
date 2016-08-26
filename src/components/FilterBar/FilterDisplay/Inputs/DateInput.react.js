import {TextInputBase} from './TextInputBase.react';

export class DateInput extends TextInputBase {
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
    var datePickerFrom = $(React.findDOMNode(this.refs.dateRangeFrom));
    datePickerFrom.datetimepicker({ locale: 'en-au', format: 'L' });
    datePickerFrom.datetimepicker().on("dp.change", this.onChange.bind(this));

    var datePickerTo = $(React.findDOMNode(this.refs.dateRangeTo));
    datePickerTo.datetimepicker({ locale: 'en-au', format: 'L' });
    datePickerTo.datetimepicker().on("dp.change", this.onChange.bind(this));
  }

  render() {
    return (
      <li>
        <div className="input-group datepicker dateRangeFrom" ref="dateRangeFrom">
          <input
            aria-required="true"
            className="form-control"
            data-date-format="DD/MM/YYYY"
            onBlur={this.onBlur.bind(this)}
            onChange={this.onChange.bind(this)}
            onKeyPress={this.onKeyPress.bind(this)}
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
            onKeyPress={this.onKeyPress.bind(this)}
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

import {TextInputBase} from './TextInputBase.react';

export class SingleDateTimeInput extends TextInputBase {
  constructor(props) {
    super(props);

    var newValue = this.props.value || {};

    if (this.props.value === '') {
      newValue[this.props.operator] = null;
    }

    this.state = { value: newValue };
  }

  onChange(event) {
    var newValue = this.state.value;

    if(event.type === "dp") {
      newValue[this.props.operator] = event.target.querySelector("input").value;
    } else if (event.type === "input") {
      newValue[this.props.operator] = event.target.value;
    }

    this.setState({ value: newValue });
  }

  onBlur() {
    this.context.filterBarActor.updateFilter(this.props.filterUid, "value", this.state.value);
  }

  componentDidMount() {
    var dateTimePicker = $(React.findDOMNode(this.refs.singleDateTimeValue));
    dateTimePicker.datetimepicker({ locale: 'en-au' });
    dateTimePicker.datetimepicker().on("dp.change", this.onChange.bind(this));
  }

  render() {
    return (
      <li>
        <div className="input-group datepicker singleDateTimeValue" ref="singleDateTimeValue">
          <input
            aria-required="true"
            className="form-control"
            data-date-format="DD/MM/YYYY hh:mm A"
            onBlur={this.onBlur.bind(this)}
            onChange={this.onChange.bind(this)}
            onKeyPress={this.onKeyPress.bind(this)}
            type="text"
            value={this.state.value[this.props.operator]}
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

SingleDateTimeInput.propTypes = {
  filterUid: React.PropTypes.string.isRequired,
  value: React.PropTypes.node.isRequired
};

SingleDateTimeInput.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};

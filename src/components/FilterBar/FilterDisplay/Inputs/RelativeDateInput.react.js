import {DateInput} from "./DateInput.react";

export class RelativeDateInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.value || { from: null, to: null, value: null } };
  }

  onRelativeChange(event) {
    var selectedOption = $(event.target.childNodes[event.target.selectedIndex]);
    this.applyRelativeDate(selectedOption);
  }

  updateFilter(newValue) {
    this.context.filterBarActor.updateFilter(this.props.filterUid, "value", newValue);
  }

  relativeOptions() {
    var lastWeek = moment().subtract(1, 'week');
    const optionsList = [
      { label: 'Select Period' , value: '',  from: null , to: null },
      { label: 'Today' , from: moment() , to: moment() },
      { label: 'Last week' , from: lastWeek.clone().startOf('isoWeek'), to: lastWeek.clone().endOf('isoWeek') },
      { label: 'This week' , from: moment().startOf('isoWeek'), to: moment().endOf('isoWeek') },
    ]
    return optionsList
  }

  // Ensure current relative dates are used on load of page/saved search
  componentDidMount() {
    var selectedOption = $(React.findDOMNode(this.refs.relativeSelect)).find(":selected");
    this.applyRelativeDate(selectedOption);
  }

  applyRelativeDate(selected) {
    if(selected.val() == '') {
      return;
    }

    var from = moment(parseInt(selected.data('from')));
    var to = moment(parseInt(selected.data('to')));

    var newValue = { value: selected.val(), from: from.format(this.props.dateFormat), to: to.format(this.props.dateFormat) };

    if(newValue.from != this.state.value.from || newValue.to != this.state.value.to) {
      this.updateFilter(newValue);

      if(this.props.autoApply) {
        this.props.autoApply = false;
        this.context.filterBarActor.applyFilters();
      }
    }
  }

  render() {
    return (
      <div>
        <select
          className="form-control"
          onChange={this.onRelativeChange.bind(this)}
          value={this.state.value.value}
          ref="relativeSelect"
        >
          {this.relativeOptions().map(({ label, value, from, to }) => (
            <option
              key={label}
              value={value !== undefined ? value : label}
              data-from={from} data-to={to}
            >
              {label}
            </option>
          ))}
        </select>
        <DateInput value={this.state.value} filterUid={this.props.filterUid} />
      </div>
    )
  }
}

RelativeDateInput.propTypes = {
  filterUid: React.PropTypes.string.isRequired,
  value: React.PropTypes.node.isRequired
};

RelativeDateInput.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};

RelativeDateInput.defaultProps = {
  dateFormat: 'DD/MM/YYYY',
  autoApply: true,
}

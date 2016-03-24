export class SelectInput extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {value: props.value, options: []};
  }

  componentDidMount() {
    var filter = this.context.filterBarStore.getFilter(this.props.filterUid);

    $.get(filter.url, function (data) {
      filter.options = data;
      this.setState({options: options})
    }.bind(this));

    const options = filter.options || [];

    if (filter.default) {
      var defaultValue = filter.default;
    } else if (options.length > 0) {
      var defaultValue = options[0].value;
    } else {
      var defaultValue = null;
    }

    if (!this.state.value && defaultValue) {
      this.setState({value: defaultValue})
      this.context.filterBarActor.updateFilter(this.props.filterUid, "value", defaultValue);
    }
  }

  onSelect(event) {
    this.setState({value: event.target.value});
    this.context.filterBarActor.updateFilter(this.props.filterUid, "value", event.target.value);
  }

  render() {
    const optionList = this.context.filterBarStore.getFilter(this.props.filterUid).options || [];
    let options = optionList.map(function(option) {
      return (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      );
    }, this);

    return (
      <li>
        <select
          className="form-control"
          onChange={this.onSelect.bind(this)}
          selected={this.state.value}
          value={this.state.value}
        >
          {options}
        </select>
      </li>
    );
  }
}

SelectInput.propTypes = {
  filterUid: React.PropTypes.string.isRequired,
  value: React.PropTypes.string.isRequired
};

SelectInput.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};

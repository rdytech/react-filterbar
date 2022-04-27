export class SelectInput extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {value: props.value, options: []};
  }

  componentDidMount() {
    var filter = this.context.filterBarStore.getFilter(this.props.filterUid);

    this.serverRequest = $.get(filter.url, data => {
      var firstOption = (data['options'] || data)[0] || {},
          defaultValue = this.stringValueOf(this.state.value) ||
                         this.stringValueOf(filter.default) ||
                         this.stringValueOf(firstOption.value);

      this.setState({options: data});

      if (defaultValue) {
        this.setState({value: defaultValue});
        filter.value = defaultValue;
      }
    });
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  stringValueOf(value) {
    if (typeof value !== 'undefined' && value !== null) {
      return String(value);
    }

    return null;
  }

  onSelect(event) {
    this.setState({value: event.target.value});
    this.context.filterBarActor.updateFilter(this.props.groupKey, this.props.inputKey, event.target.value);
  }

  displayOption(option) {
    return (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    );
  }

  displayOptGroup(group) {
    let optGroupOptions = group.options.map(option => {
      return this.displayOption(option);
    });

    return (
      <optgroup label={group.group}>
        {optGroupOptions}
      </optgroup>
    );
  }

  render() {
    const optionList = this.state.options || [];

    let options = optionList.map(option => {
      return option.group ? this.displayOptGroup(option) : this.displayOption(option);
    });

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
  value: React.PropTypes.node.isRequired
};

SelectInput.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};

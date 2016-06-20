export class SelectInput extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {value: props.value, options: []};
  }

  componentDidMount() {
    var filter = this.context.filterBarStore.getFilter(this.props.filterUid);

    this.serverRequest = $.get(filter.url, function (data) {
      var defaultValue = this.state.value || filter.default || (data[0] || {}).value || null;

      this.setState({options: data});

      if (defaultValue) {
        this.setState({value: defaultValue});
        filter.value = defaultValue;
      }
    }.bind(this));
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  onSelect(event) {
    this.setState({value: event.target.value});
    this.context.filterBarActor.updateFilter(this.props.filterUid, "value", event.target.value);
  }

  render() {
    const optionList = this.state.options || [];
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
  value: React.PropTypes.node.isRequired
};

SelectInput.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};

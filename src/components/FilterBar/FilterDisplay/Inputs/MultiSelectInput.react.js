export class MultiSelectInput extends React.Component {
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
    } else {
      var defaultValue = [];
    }

    if (!this.state.value && defaultValue) {
      this.setState({ value: defaultValue })
      this.context.filterBarActor.updateFilter(this.props.filterUid, "value", defaultValue);
    }
  }

  componentDidUpdate() {
    var multiSelectInput = $(React.findDOMNode(this.refs.reactMultiSelect));
    multiSelectInput.select2();
    multiSelectInput.on('change', this.onSelect.bind(this));
  }

  onSelect(event) {
    var multiSelectInput = $(React.findDOMNode(this.refs.reactMultiSelect));
    this.setState({value: multiSelectInput.val()});
    this.context.filterBarActor.updateFilter(this.props.filterUid, "value", multiSelectInput.val());
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
          multiple="multiple"
          selected={this.state.value}
          value={this.state.value}
          ref="reactMultiSelect"
        >
          {options}
        </select>
      </li>
    );
  }
}

MultiSelectInput.propTypes = {
  filterUid: React.PropTypes.string.isRequired,
  value: React.PropTypes.node.isRequired
};

MultiSelectInput.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};

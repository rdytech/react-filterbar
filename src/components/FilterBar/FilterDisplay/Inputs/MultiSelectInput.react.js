export class MultiSelectInput extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state =  {
      value: this.props.value === '' ? this.getDefaultValue() : this.props.value,
      options: []
    }
  }

  componentDidMount() {
    let filter = this.getFilterFromFilterBarStore();
    this.serverRequest = $.get(filter.url, data => {
      this.setState({ options: data });
      filter.value = this.state.value;
    });
  }

  getFilterFromFilterBarStore() {
    return(this.context.filterBarStore.getFilter(this.props.filterUid));
  }

  componentDidUpdate() {
    let multiSelectInput = $(React.findDOMNode(this.refs.reactMultiSelect));
    multiSelectInput.select2();
    multiSelectInput.on('change', this.onSelect.bind(this));
  }

  componentWillUnmount() {
    this.serverRequest.abort();
  }

  getDefaultValue() {
    let filter = this.getFilterFromFilterBarStore();
    return([filter.default]);
  }

  onSelect(event) {
    let selectedValues = [];
    let targetOptions = event.target.options
    for (let i = 0; i < targetOptions.length; i++) {
      if (targetOptions[i].selected) {
        selectedValues.push(targetOptions[i].value);
      }
    }
    this.setState({ value: selectedValues });
    this.context.filterBarActor.updateFilter(this.props.filterUid, "value", selectedValues);
  }

  onKeyPress(event) {
    if (event.charCode == 13) { // enter
      this.onSelect(event);
      this.context.filterBarActor.applyFilters();
    }
  }

  render() {
    let optionList = this.state.options;
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
          multiple="multiple"
          onKeyPress={this.onKeyPress.bind(this)}
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

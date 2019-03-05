export class MultiSelectInput extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state =  {
      value: this.props.value === '' ? this.getDefaultValue() : this.props.value,
      options: [],
      operator: this.props.operator,
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
    this.getFilterFromFilterBarStore().value = this.getSelectedValues()
  }

  getSelectedValues() {
    let selectedValues = []
    let targetOptions = React.findDOMNode(this.refs.reactMultiSelect).options

    for (let i = 0; i < targetOptions.length; i++) {
      if (targetOptions[i].selected) {
        selectedValues.push(targetOptions[i].value)
      }
    }

    return selectedValues
  }

  updateOperator(e) {
    this.setState({ operator: e.target.value, value: this.getSelectedValues() })
    this.getFilterFromFilterBarStore().operator = e.target.value
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
          selected={this.state.value}
          value={this.state.value}
          ref="reactMultiSelect"
        >
          {options}
        </select>
        {this.props.operator && (
          <div>
            <label className="radio-inline">
              <input
                type="radio"
                name="operator"
                value="any"
                checked={this.state.operator == "any"}
                onChange={this.updateOperator.bind(this)}
              />
              Any
            </label>
            <label className="radio-inline">
              <input
                type="radio"
                name="operator"
                value="all"
                checked={this.state.operator == "all"}
                onChange={this.updateOperator.bind(this)}
              />
              All
            </label>
          </div>
        )}
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

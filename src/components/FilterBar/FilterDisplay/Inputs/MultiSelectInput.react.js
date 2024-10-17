import t from "../../../../locales/i18n";

export class MultiSelectInput extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state =  {
      value: this.props.value === '' ? this.getDefaultValue() : this.props.value,
      options: [],
      operator: this.props.operator,
      label: this.props.filterUid
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
    let name_label = `operator_${this.state.label}`
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
                name={name_label}
                value="any"
                checked={this.state.operator == "any"}
                onChange={this.updateOperator.bind(this)}
              />
              { t('filterbar.buttons.any_selected') }
            </label>
            <label className="radio-inline">
              <input
                type="radio"
                name={name_label}
                value="all"
                checked={this.state.operator == "all"}
                onChange={this.updateOperator.bind(this)}
              />
              { t('filterbar.buttons.all_selected') }
            </label>
            <label className="radio-inline">
              <input
                type="radio"
                name={name_label}
                value="none"
                checked={this.state.operator == "none"}
                onChange={this.updateOperator.bind(this)}
              />
              { t('filterbar.buttons.missing_any_selected') }
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

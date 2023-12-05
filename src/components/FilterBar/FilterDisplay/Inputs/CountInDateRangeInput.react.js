import { RelativeDateInput } from "./RelativeDateInput.react";
import t from "../../../../locales/i18n";

export class CountInDateRangeInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value || {
        operator: null,
        from: null,
        to: null,
        value: null,
        count: null,
      },
    };
  }

  handleInputChange(event, input) {
    var newValue = this.state.value;
    newValue[input] = event.target.value;
    this.setState({ value: newValue });
    this.updateFilter();
  }

  updateFilter() {
    this.context.filterBarActor.updateFilter(
      this.props.filterUid,
      "value",
      this.state.value,
    );
  }

  render() {
    return (
      <div className="row">
        <div className="col-xs-6">
          <select
            className="form-control"
            onChange={(e) => this.handleInputChange(e, "operator")}
            selected={this.state.value.operator}
            value={this.state.value.operator}
            required
          >
            <option value="" disabled selected hidden>
              {t("filterbar.placeholders.operator")}
            </option>
            {this.props.operatorOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            className="form-control"
            onBlur={(e) => this.handleInputChange(e, "count")}
            type="text"
            defaultValue={this.state.value.count}
            placeholder={t("filterbar.placeholders.count")}
            required
          />
        </div>
        <div className="col-xs-6">
          <RelativeDateInput
            value={this.state.value}
            filterUid={this.props.filterUid}
          />
        </div>
      </div>
    );
  }
}

CountInDateRangeInput.propTypes = {
  filterUid: React.PropTypes.string.isRequired,
  value: React.PropTypes.node.isRequired,
};

CountInDateRangeInput.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired,
};

CountInDateRangeInput.defaultProps = {
  dateFormat: "DD/MM/YYYY",
  operatorOptions: operatorOptions(),
};

function operatorOptions() {
  return [
    { label: t("filterbar.operators.greater_than"), value: ">" },
    { label: t("filterbar.operators.less_than"), value: "<" },
    { label: t("filterbar.operators.equal_to"), value: "==" },
  ];
}

export default CountInDateRangeInput;

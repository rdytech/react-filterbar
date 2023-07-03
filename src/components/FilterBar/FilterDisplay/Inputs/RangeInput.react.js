import t from "../../../../locales/i18n";

export class RangeInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = { value: this.props.value || { from: null, to: null } };
  }

  onChange(event) {
    var newValue = this.state.value;

    if (event.type === "input") {
      newValue[event.target.getAttribute("data-attr")] = event.target.value;
    }

    this.setState({value: newValue});
  }

  onBlur() {
    this.context.filterBarActor.updateFilter(this.props.filterUid, "value", this.state.value);
  }

  render() {
    return (
      <li>
        <div className="row">
          <div className="col-xs-6">
            <input
              className="form-control"
              onBlur={this.onBlur.bind(this)}
              onChange={this.onChange.bind(this)}
              data-attr="from"
              placeholder={ t('filterbar.placeholders.from') }
              value={this.state.value.from}
            />
          </div>
          <div className="col-xs-6">
            <input
              className="form-control"
              onBlur={this.onBlur.bind(this)}
              onChange={this.onChange.bind(this)}
              data-attr="to"
              placeholder={ t('filterbar.placeholders.to') }
              value={this.state.value.to}
            />
          </div>
        </div>
      </li>
    );
  }
}

RangeInput.propTypes = {
  filterUid: React.PropTypes.string.isRequired,
  value: React.PropTypes.node.isRequired
};

RangeInput.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};

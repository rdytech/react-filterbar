export class RangeInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = { value: this.props.value || { from: null, to: null } };
  }

  onChange(event) {
    var newValue = this.state.value;

    if (event.type === "input") {
      newValue[event.target.getAttribute("placeholder")] = event.target.value;
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
              placeholder="from"
              value={this.state.value.from}
            />
          </div>
          <div className="col-xs-6">
            <input
              className="form-control"
              onBlur={this.onBlur.bind(this)}
              onChange={this.onChange.bind(this)}
              placeholder="to"
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
  value: React.PropTypes.string.isRequired
};

RangeInput.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};

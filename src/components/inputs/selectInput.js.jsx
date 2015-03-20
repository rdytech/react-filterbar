var SelectInput = React.createClass({
  getInitialState: function() {
    return {
      selected: this.props.filter.value || this.props.filter.selections[0][0]
    };
  },
  componentDidMount: function() {
    var filter = $.extend(true,{},this.props.filter);
    filter.value = this.state.selected;
    this.props.onChange(filter);
  },
  onChange: function(event) {
    var filter = $.extend(true,{},this.props.filter);
    filter.value = event.target.value;

    this.setState({selected: event.target.value});
    this.props.onChange(filter);
  },
  render: function() {
    var options = this.props.filter.selections.map(function(option) {
      return (<option value={option[0]}>{option[1]}</option>);
    });
    return (
      <li>
        <select
          className="form-control"
          selected={this.state.selected}
          onChange={this.onChange}
        >
          {options}
        </select>
      </li>
    );
  }
});

module.exports = SelectInput;

var TextInput = React.createClass({
  getInitialState: function() {
    return {
      value: this.props.filter.value || ''
    };
  },
  onChange: function(event) {
    var filter = $.extend(true,{},this.props.filter);
    filter.value = event.target.value;

    this.setState({value: event.target.value});
    this.props.onChange(filter);
  },
  render: function() {
    return (
      <li>
        <input
          className="form-control"
          type="text"
          value={this.state.value}
          onChange={this.onChange}
        />
      </li>
    );
  }
});

module.exports = TextInput;

export class SaveFiltersButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {configurationName: ""};
  }

  onClick() {
    this.context.filterBarActor.saveFilters(this.state.configurationName);
  }

  onChange(event) {
    this.setState({configurationName: event.target.value});
  }

  render() {
    return (
      <ReactBootstrap.DropdownButton
        bsStyle="default"
        className="btn btn-default margin-bottom-sm"
        title="Save Search"
        type="button"
      >
        <ReactBootstrap.MenuItem eventKey="1">
          <div className="form-group">
            <label>Search Title</label>
            <input
              className="form-control"
              onChange={this.onChange.bind(this)}
              type="text"
              value={this.state.configurationName}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={this.onClick.bind(this)}
            type="button"
          >
            Save
          </button>
        </ReactBootstrap.MenuItem>
      </ReactBootstrap.DropdownButton>
    );
  }
}

SaveFiltersButton.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired
};

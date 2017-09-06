export class SaveFiltersButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {configurationName: ""};
  }

  onClick() {
    if(this.state.configurationName.trim() === '') {
      $.bootstrapGrowl("Search title can't be blank", { type: "danger" });
      return;
    }
    if(this.context.filterBarActor.saveFilters(this.state.configurationName.trim())) {
      $.bootstrapGrowl("Search saved sucessfully", { type: "success" });
    }
    else{
      $.bootstrapGrowl("No filters enabled, please add filter", { type: "danger" });
    }
  }

  onChange(event) {
    this.setState({configurationName: event.target.value});
  }

  render() {
    return (
      <div className="btn-group">
        <button
          className="btn btn-default dropdown-toggle"
          data-toggle="dropdown"
          type="button"
        >
          Save Search
          <span className="caret" />
        </button>
        <ul className="dropdown-menu" role="menu">
          <li>
            <form style={{margin: `0 16px`}}>
              <label>Search Title</label>
              <input
                className="form-control"
                onChange={this.onChange.bind(this)}
                type="text"
                value={this.state.configurationName}
              />
              <button
                className="btn btn-primary"
                onClick={this.onClick.bind(this)}
                type="button"
              >
                Save
              </button>
            </form>
          </li>
        </ul>
      </div>
    );
  }
}

SaveFiltersButton.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired
};

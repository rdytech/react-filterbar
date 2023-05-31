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
    this.setState({configurationName: ''});
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
          {this.context.filterBarStore?.localizations?.save_search || 'Save Search'}
          <i className="icon icon-chevron-down" />
        </button>
        <ul className="dropdown-menu" role="menu">
          <li>
            <form style={{margin: `0 16px`}}>
              <label>
                {this.context.filterBarStore?.localizations?.search_title || 'Search Title'}
              </label>
              <input
                className="form-control"
                onChange={this.onChange.bind(this)}
                type="text"
                value={this.state.configurationName}
              />
              <button
                className="btn btn-primary"
                style={{marginTop: `5px`}}
                onClick={this.onClick.bind(this)}
                type="button"
              >
                {this.context.filterBarStore?.localizations?.save || 'Save'}
              </button>
            </form>
          </li>
        </ul>
      </div>
    );
  }
}

SaveFiltersButton.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object
};

export class SaveFiltersButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {configurationName: ''};
  }

  _onClick() {
    this.props.filterBarActor.saveFilters(this.state.configurationName);
  }

  _onChange(event) {
    this.setState({configurationName: event.target.value});
  }

  render() {
    return (
      <ReactBootstrap.DropdownButton title="Save Search" type="button" bsStyle="default" className="btn btn-default margin-bottom-sm">
        <ReactBootstrap.MenuItem eventKey="1">
          <div className="form-group">
            <label>Search Title</label>
            <input className="form-control" value={this.state.configurationName} type="text" onChange={this._onChange.bind(this)} />
          </div>
          <button className="btn btn-primary" type="button" onClick={this._onClick.bind(this)}>Save</button>
        </ReactBootstrap.MenuItem>
      </ReactBootstrap.DropdownButton>
    );
  }
}

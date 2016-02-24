export class PanelBodyLeftSide extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="row margin-bottom-md">
        <div className="col-md-12">
          <h4>{ this.props.details.heading }</h4>
          <div dangerouslySetInnerHTML={{__html: (this.props.cells[this.props.details.content] || "")}} />
        </div>
      </div>
    );
  }
}

PanelBodyLeftSide.propTypes = {
  cells: React.PropTypes.object.isRequired,
  details: React.PropTypes.object.isRequired
};

PanelBodyLeftSide.contextTypes = {
  tableStore: React.PropTypes.object.isRequired,
  tableActor: React.PropTypes.object.isRequired
}

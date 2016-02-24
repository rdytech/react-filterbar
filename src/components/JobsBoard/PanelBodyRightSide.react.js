export class PanelBodyRightSide extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="row margin-bottom-md">
        <div className="col-md-12">
          <div dangerouslySetInnerHTML={{__html: (this.props.cells[this.props.details.content] || "")}} />
        </div>
      </div>
    );
  }
}

PanelBodyRightSide.propTypes = {
  cells: React.PropTypes.object.isRequired,
  details: React.PropTypes.object.isRequired
};

PanelBodyRightSide.contextTypes = {
  tableStore: React.PropTypes.object.isRequired,
  tableActor: React.PropTypes.object.isRequired
}

export class PanelHeading extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var spacing = Math.ceil(12 / Object.keys(this.props.header.details).length)

    var detailsClassName = "col-md-" + spacing;

    var details = Object.keys(this.props.header.details).map(function(detail, index) {
      return(
        <div key={index} className={detailsClassName} dangerouslySetInnerHTML={{__html: (this.props.cells[detail] || "")}} />
      );
    }, this);

    return(
      <div className="panel-heading">
        <div className="row">
          <div className="col-md-6">
            <i className="icon icon-interview heading-icon" />
            <span dangerouslySetInnerHTML={{__html: (this.props.cells[this.props.header.title] || "") }} />
          </div>
          <div className="col-md-6">
            {details}
          </div>
        </div>
      </div>
    );
  }
}

PanelHeading.propTypes = {
  cells: React.PropTypes.object.isRequired,
  header: React.PropTypes.object.isRequired
};

PanelHeading.contextTypes = {
  tableStore: React.PropTypes.object.isRequired,
  tableActor: React.PropTypes.object.isRequired
}

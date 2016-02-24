import {PanelHeading} from "./PanelHeading.react";
import {PanelBody} from "./PanelBody.react";

export class JobsBoardPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div className="panel panel-default">
        <PanelHeading cells={this.props.cells} header={this.props.header} />
        <PanelBody cells={this.props.cells} body={this.props.body} />
      </div>
    );
  }
}

JobsBoardPanel.propTypes = {
  cells: React.PropTypes.object.isRequired,
  header: React.PropTypes.object.isRequired,
  body: React.PropTypes.object.isRequired
};

JobsBoardPanel.contextTypes = {
  tableStore: React.PropTypes.object,
  tableActor: React.PropTypes.object
};
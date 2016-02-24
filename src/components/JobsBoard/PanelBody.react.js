import {PanelBodyLeftSide} from "./PanelBodyLeftSide.react";
import {PanelBodyRightSide} from "./PanelBodyRightSide.react";

export class PanelBody extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    var leftSideContent = Object.values(this.props.body.leftSide).map(function(leftSideDetails, index) {
      return(
        <PanelBodyLeftSide cells={this.props.cells} details={leftSideDetails} key={index} />
      );
    }, this);

    var rightSideContent = Object.values(this.props.body.rightSide).map(function(rightSideDetails, index) {
      return(
        <PanelBodyRightSide cells={this.props.cells} details={rightSideDetails} key={index} />
      );
    }, this);

    return(
      <div className="panel-body">
        <div className="row">
          <div className="col-md-9">
            {leftSideContent}
          </div>
          <div className="col-md-3">
            {rightSideContent}
          </div>
        </div>
      </div>
    );
  }
}

PanelBody.propTypes = {
  cells: React.PropTypes.object.isRequired,
  body: React.PropTypes.object.isRequired
};

PanelBody.contextTypes = {
  tableStore: React.PropTypes.object.isRequired,
  tableActor: React.PropTypes.object.isRequired
}
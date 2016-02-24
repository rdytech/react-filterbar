import {JobsBoardPanel} from "./JobsBoardPanel.react";

export class JobsBoardRepeater extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var rows = this.props.rows.map(function(cells, index) {
      return (
        <JobsBoardPanel key={index} cells={cells} header={this.props.header} body={this.props.body} />
      );
    }, this);
    return (
      <div>
        {rows}
      </div>
    );
  }
}

JobsBoardRepeater.propTypes = {
  rows: React.PropTypes.array.isRequired
};

JobsBoardRepeater.contextTypes = {
  tableStore: React.PropTypes.object,
  tableActor: React.PropTypes.object
};

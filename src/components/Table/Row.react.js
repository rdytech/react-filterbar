import {Cell} from "./Cell.react";

export class Row extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var cells = Object.keys(this.props.cells).map(function(cellId) {
      return (
        <Cell
          rowType={this.props.rowType}
          type={this.props.cells[cellId].type}
          value={this.props.cells[cellId].value}
        />
      );
    }, this);
    return (
      <tr>
        {cells}
      </tr>
    );
  }
}

Row.propTypes = {
  cells: React.PropTypes.object.isRequired,
  rowType: React.PropTypes.string.isRequired
};

Row.contextTypes = {
  tableStore: React.PropTypes.object.isRequired,
  tableActor: React.PropTypes.object.isRequired
};

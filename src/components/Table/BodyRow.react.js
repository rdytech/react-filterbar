import {BodyCell} from "./BodyCell.react";

export class BodyRow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var columns = this.context.tableStore.getColumns();

    var cells = Object.keys(columns).map(function(columnId) {
      return (
        <BodyCell
          key={columnId}
          type={columns[columnId].type}
          value={String(this.props.cells[columnId])}
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

BodyRow.propTypes = {
  cells: React.PropTypes.object.isRequired
};

BodyRow.contextTypes = {
  tableStore: React.PropTypes.object.isRequired,
  tableActor: React.PropTypes.object.isRequired
};

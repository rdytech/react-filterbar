import {BodyCell} from "./BodyCell.react";
import {BodySelectable} from "./BodySelectable.react";

export class BodyRow extends React.Component {
  constructor(props) {
    super(props);
  }

  displaySelectableColumn() {
    if (this.context.tableStore.getSelectColumn() !== undefined) {
      var selectValue = this.props.cells[this.context.tableStore.getSelectColumn()];
      var referenceValue = "select" + selectValue;
      return(
        <BodySelectable value={selectValue} index={this.props.key} />
      )
    }
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

    var displaySelectableColumn = this.displaySelectableColumn();

    return (
      <tr>
        {displaySelectableColumn}
        {cells}
      </tr>
    );
  }
}

BodyRow.propTypes = {
  cells: React.PropTypes.object.isRequired,
  displaySelectableColumn: React.PropTypes.object.isRequired
};

BodyRow.contextTypes = {
  tableStore: React.PropTypes.object.isRequired,
  tableActor: React.PropTypes.object.isRequired
};

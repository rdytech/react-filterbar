import {BodyCell} from "./BodyCell.react";
import {BodySelectable} from "./BodySelectable.react";

export class BodyRow extends React.Component {
  constructor(props) {
    super(props);
  }

  displaySelectableColumn() {
    if (this.context.tableStore.getSelectableColumn() !== undefined) {
      var selectValue = this.props.cells[this.context.tableStore.getSelectableColumn()].toString();
      return(
        <BodySelectable
          value={selectValue}
          key={selectValue}
        />
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
  cells: React.PropTypes.object.isRequired
};

BodyRow.contextTypes = {
  tableStore: React.PropTypes.object.isRequired,
  tableActor: React.PropTypes.object.isRequired
};

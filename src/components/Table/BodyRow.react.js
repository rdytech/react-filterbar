import {BodyCell} from "./BodyCell.react";
import {BodySelectable} from "./BodySelectable.react";

export class BodyRow extends React.Component {
  constructor(props) {
    super(props);
  }

  displaySelectableColumn() {
    if (this.context.tableStore.getSelectableColumn() !== undefined) {
      var selectValue = this.props.cells[this.context.tableStore.getSelectableColumn()].toString();
      var selectableStyles;
      if(this.props.displayTable === 'scroll') {
        selectableStyles = {
          position: `relative`,
        };
      }
      return(
        <BodySelectable
          value={selectValue}
          key={selectValue}
          style={selectableStyles}
        />
      )
    }
  }

  displayValueFor(value) {
    return String(value === null ? "" : value);
  }

  render() {
    var columns = this.context.tableStore.getColumns();
    var cellKeys = Object.keys(columns);
    var cells = Object.keys(columns).map(function(columnId, index) {
      var cellStyles;
      if(this.props.displayTable === 'fix' && index == (cellKeys.length -1)) {
        cellStyles = {
          position: `relative`,
          zIndex: 1,
          whiteSpace: `nowrap`
        };
      }
      else if(this.props.displayTable === 'scroll' && index < (cellKeys.length -1)) {
        cellStyles = {
          position: `relative`,
        };
      }
      else if(this.props.displayTable === 'scroll' && index == (cellKeys.length -1)) {
        cellStyles = {
          whiteSpace: `nowrap`
        }
      }
      return (
        <BodyCell
          key={columnId}
          type={columns[columnId].type}
          value={this.displayValueFor(this.props.cells[columnId])}
          style={cellStyles}
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

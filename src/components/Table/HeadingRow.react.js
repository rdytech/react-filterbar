import {HeadingCell} from "./HeadingCell.react";
import {HeadingSelectable} from "./HeadingSelectable.react";

export class HeadingRow extends React.Component {
  constructor(props) {
    super(props);
  }

  displaySelectableColumn() {
    if (this.context.tableStore.getSelectColumn() !== undefined) {
      return(
        <HeadingSelectable />
      )
    }
  }

  render() {
    var cells = Object.keys(this.props.cells).map(function(cellId) {
      return (
        <HeadingCell
          key={cellId}
          type={this.props.cells[cellId].type}
          value={this.props.cells[cellId].heading}
          sortable={this.props.cells[cellId].sortable}
        />
      );
    }, this);

    var displaySelectableColumn = this.displaySelectableColumn();

    return (
      <thead>
        <tr>
          {displaySelectableColumn}
          {cells}
        </tr>
      </thead>
    );
  }
}

HeadingRow.propTypes = {
  cells: React.PropTypes.object.isRequired
};

HeadingRow.contextTypes = {
  tableStore: React.PropTypes.object.isRequired,
  tableActor: React.PropTypes.object.isRequired
};

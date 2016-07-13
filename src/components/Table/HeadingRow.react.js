import {HeadingCell} from "./HeadingCell.react";
import {HeadingSelectable} from "./HeadingSelectable.react";

export class HeadingRow extends React.Component {
  constructor(props) {
    super(props);
  }

  displaySelectableColumn() {
    var selectableColumn = this.context.tableStore.getSelectableColumn();
    if (selectableColumn !== undefined) {
      var selectableKey = 'select_all_' + this.context.tableStore.getCurrentPage();
      return(
        <HeadingSelectable
          index={this.props.key}
          key={selectableKey}
        />
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

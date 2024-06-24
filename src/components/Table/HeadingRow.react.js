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
      var selectableStyles;
      if(this.props.displayTable === 'scroll') {
        selectableStyles = {
          position: `relative`,
        };
      }
      return(
        <HeadingSelectable
          index={this.props.key}
          key={selectableKey}
          style={selectableStyles}
        />
      )
    }
  }

  render() {
    var cellKeys = Object.keys(this.props.cells);

    var cells = cellKeys.map(function(cellId, index) {
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
        <HeadingCell
          key={cellId}
          type={this.props.cells[cellId].type}
          value={this.props.cells[cellId].heading}
          sortable={this.props.cells[cellId].sortable}
          tooltipContent={this.props.cells[cellId].tooltipContent}
          tooltipContentType={this.props.cells[cellId].tooltipContentType}
          style={cellStyles}
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

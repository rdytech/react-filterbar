import {HeadingCell} from "../Shared/HeadingCell.react";

export class HeadingRow extends React.Component {
  constructor(props) {
    super(props);
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
    return (
      <thead>
        <tr>
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

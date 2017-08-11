import {BodyRow} from "./BodyRow.react";

export class Body extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var rows = this.props.rows.map(function(cells, index) {
      return (
        <BodyRow
          cells={cells}
          key={index}
          displayTable = {this.props.displayTable}
        />
      );
    }, this);
    return (
      <tbody>
        {rows}
      </tbody>
    );
  }
}

Body.propTypes = {
  rows: React.PropTypes.array.isRequired
};

Body.contextTypes = {
  tableStore: React.PropTypes.object.isRequired,
  tableActor: React.PropTypes.object.isRequired
};

import {HeadingCell} from "../Shared/HeadingCell.react";

export class SortPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var cells = Object.keys(this.props.cols).map(function(sortableColumn, index) {
      return(
        <HeadingCell
          value={this.props.cols[sortableColumn].heading}
          sortable={this.props.cols[sortableColumn].value}
          key={index}
        />
      );
    }, this);

    return(
      <div className="table-responsive">
        <table className="table table-hover table-striped">
          <thead>
            <th>Sort By:</th>
            {cells}
          </thead>
        </table>
      </div>
    );
  }
}

SortPanel.propTypes = {
  cols: React.PropTypes.object.isRequired
}

SortPanel.contextTypes = {
  tableStore: React.PropTypes.object.isRequired,
  tableActor: React.PropTypes.object.isRequired
}
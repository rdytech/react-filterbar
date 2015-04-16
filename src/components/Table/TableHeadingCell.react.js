export class TableHeadingCell extends React.Component {
  constructor(props) {
    super(props);
    this.heading = props.heading;
  }

  render() {
    return (
      <th>
        {this.heading}
      </th>
    );
  }
}

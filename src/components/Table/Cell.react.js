export class Cell extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var content = this.props.value;

    if (this.props.rowType === "heading") {
      return (
        <th>
          {content}
        </th>
      );
    } else {
      return (
        <td>
          A
        </td>
      );
    }
  }
}

export class TableCaption extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var content = this.props.value;

    if (content) {
      return (
        <caption>{content}</caption>
      );
    }
    else {
      return (
        <caption hidden />
      );
    }
  }
}

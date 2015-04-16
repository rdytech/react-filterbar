export class FilterListOption extends React.Component {
  constructor(props) {
    super(props);
    this.filterBarActor = props.filterBarActor;
    this.filterUid = props.filterUid;
  }

  _onClick() {
    this.filterBarActor.enableFilter(this.filterUid);
  }

  render() {
    return (
      <li>
        <a onClick={this._onClick.bind(this)}>
          {this.filterBarActor.getFilter(this.filterUid).label}
        </a>
      </li>
    );
  }
}
export class QuickFiltersButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      label: this.props.filter.label,
      value: this.props.filter.value,
      filterName: this.props.filter.filter,
    };
  }

  render() {
    return (
      <button className="btn btn-default" type="button">
        {this.state.label}
      </button>
    );
  }
}


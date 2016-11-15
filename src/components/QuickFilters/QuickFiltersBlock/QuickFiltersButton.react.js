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
      <label className="btn btn-primary">
        <input type="radio" autocomplete="off"/> {this.state.label}
      </label>
    );
  }
}


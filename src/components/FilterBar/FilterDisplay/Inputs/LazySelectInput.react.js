export class LazySelectInput extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {value: props.value, options: []};
  }

  componentDidMount() {
    var filter = this.context.filterBarStore.getFilter(this.props.filterUid);
    this.setState({ options: [] });
    filter.value = this.state.value;
  }

  componentDidUpdate() {
    let selectInput = $(React.findDOMNode(this.refs.reactLazySelect));
    let filter = this.context.filterBarStore.getFilter(this.props.filterUid);
    selectInput.select2({
      minimumInputLength: 3,
      ajax: {
        url: filter.url,
        quietMillis: 250,
        dataType: 'json',
        data: function (term, page) {
          return {
            q: term
          };
        },
        results: function (data, params) {
          return {
            results: $.map(data, function (item) {
              return {
                text: item.label,
                id: item.value
              }
            })
          };
        }
      }
    });
    selectInput.on('change', this.onSelect.bind(this));
  }

  componentWillUnmount() {
    if (this.serverRequest !== undefined) {
      this.serverRequest.abort();
    }
  }

  stringValueOf(value) {
    if (typeof value !== 'undefined' && value !== null) {
      return String(value);
    }

    return null;
  }

  onSelect(event) {
    let filter = this.context.filterBarStore.getFilter(this.props.filterUid);
    filter.value = event.target.value.split(",");
  }

  render() {
    return (
      <li>
        <input
          className="form-control"
          selected={this.state.value}
          value={this.state.value}
          ref="reactLazySelect"
        >
        </input>
      </li>
    );
  }
}

LazySelectInput.propTypes = {
  filterUid: React.PropTypes.string.isRequired,
  value: React.PropTypes.node.isRequired
};

LazySelectInput.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};

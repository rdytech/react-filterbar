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
      minimumInputLength: filter.minimumInputLength || 3,
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
      },
      initSelection: function(element, callback) {
        var value = element.attr('value');
        callback({id: value, text: value });
      }
    });
    selectInput.on('change', this.onSelect.bind(this));
  }

  componentWillUnmount() {
    if (this.serverRequest !== undefined) {
      this.serverRequest.abort();
    }
  }

  onSelect(event) {
    let filter = this.context.filterBarStore.getFilter(this.props.filterUid);
    filter.value = event.target.value;
  }

  render() {
    return (
      <li>
        <input
          className="form-control"
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

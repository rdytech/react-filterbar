export class LazyMultiSelectInput extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state =  {
      value: this.props.value === '' ? this.getDefaultValue() : this.props.value,
      options: []
    }
  }

  componentDidMount() {
    let filter = this.getFilterFromFilterBarStore();
    this.setState({ options: [] });
    filter.value = this.state.value;
  }

  getFilterFromFilterBarStore() {
    return(this.context.filterBarStore.getFilter(this.props.filterUid));
  }

  componentDidUpdate() {
    let multiSelectInput = $(React.findDOMNode(this.refs.reactLazyMultiSelect));
    let filter = this.getFilterFromFilterBarStore();
    multiSelectInput.select2({
      minimumInputLength: 3,
      multiple: true,
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
        var data = [];
        element.attr('value').split(',').forEach(function(value) {
          data.push({id: value, text: value })
        });
        callback(data);
      }
    });
    multiSelectInput.on('change', this.onSelect.bind(this));
  }

  componentWillUnmount() {
    if (this.serverRequest !== undefined) {
      this.serverRequest.abort();
    }
  }

  getDefaultValue() {
    let filter = this.getFilterFromFilterBarStore();
    return([filter.default]);
  }

  onSelect(event) {
    let filter = this.getFilterFromFilterBarStore();
    if(event.target.value === '') {
      filter.value = [];
    } else {
      filter.value = event.target.value.split(",");
    }
  }

  render() {
    return (
      <li>
        <input
          className="form-control"
          value={this.state.value}
          ref="reactLazyMultiSelect"
        >
        </input>
      </li>
    );
  }
}

LazyMultiSelectInput.propTypes = {
  filterUid: React.PropTypes.string.isRequired,
  value: React.PropTypes.node.isRequired
};

LazyMultiSelectInput.contextTypes = {
  filterBarActor: React.PropTypes.object.isRequired,
  filterBarStore: React.PropTypes.object.isRequired
};

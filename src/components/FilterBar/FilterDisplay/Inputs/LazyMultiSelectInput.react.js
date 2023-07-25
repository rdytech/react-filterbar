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

  async processSingleRequest(value) {
    let result = { id: value, text: value}
    try {
      const url = this.getFilterFromFilterBarStore().itemUrl + "/" + value
      const response = await fetch(url, {
        credentials: "include",
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest"
        }}
      )
      const data = await response.json()
      if(data.name) {
        data.text = data.name;
      }
      result = data;
    } catch (err) {}
    return result;
  }

  componentDidUpdate() {
    let multiSelectInput = $(React.findDOMNode(this.refs.reactLazyMultiSelect));
    let filter = this.getFilterFromFilterBarStore();
    let that = this;
    multiSelectInput.select2({
      minimumInputLength: filter.minimumInputLength || 3,
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
      initSelection: async function(element, callback) {
        var values = [];
        if(filter.itemUrl) {
          const arr = element.attr('value').split(',').filter(Boolean)
          for (const value of arr) {
            const singleResult = await that.processSingleRequest(value)
            values.push(singleResult);
          }
          callback(values);
        } else {
          element.attr('value').split(',').forEach(value => values.push({id: value, text: value }));
          callback(values);
        }
    }});
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

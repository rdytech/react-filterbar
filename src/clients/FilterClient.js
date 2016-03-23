export function updateFilterOptions(filter) {
  if (filter.url !== "" && filter.url !== undefined) {
    var url = filter.url;

    $.ajax({
      url: url,
      type: "GET",
      cache: false,
      dataType: "json",
      success: function(data) {
        filter.options = data;
        filter.value = filter.value || filter.default || filter.options[0].value;
      }
    });
  }
}

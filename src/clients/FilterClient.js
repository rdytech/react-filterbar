export function updateFilterOptions(filter) {
  if (filter.url !== "") {
    var url = filter.url;

    $.ajax({
      url: url,
      type: "GET",
      dataType: "json",
      success: function(data) {
        filter.options = data;
        filter.value = filter.value || filter.options[0].value;
      }
    });
  }
}

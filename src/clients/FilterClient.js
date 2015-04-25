export function updateFilterOptions(filter) {
  var url = filter.url;

  $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
    success: function(data) {
      filter.options = data;
      filter.value = filter.value || filter.options[0].value;
    },
    error: function(xhr, status, error) {
      console.error(xhr);
      console.error(status);
      console.status(error);
    }
  });
}

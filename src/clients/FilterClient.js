export function updateFilterOptions(filter) {
  var url = filter.url;

  $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
    success: function(data) {
      filter.options = data;
    },
    error: function(xhr, status, error) {
      alert("Something went wrong, please contact support");
      console.error(xhr);
      console.error(status);
      console.status(error);
    }
  });
}

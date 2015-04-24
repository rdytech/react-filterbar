var URI = require('URIjs');
window.URI = URI;

export function search(url, query, page, success) {
  var url = URI(url)
    .addSearch('q', query)
    .addSearch('page', page);


  $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
    success: function(data) {
      success(data);
    },
    error: function(xhr, status, error) {
      alert("Something went wrong, please contact support");
      console.error(xhr);
      console.error(status);
      console.status(error);
    }
  });
}

export function saveSearch() {
  var response = '';

  return response;
}

export function getSavedSearches(url, success) {
  $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
    success: function(data) {
      success(data);
    },
    error: function(xhr, status, error) {
      alert("Something went wrong, please contact support");
      console.error(xhr);
      console.error(status);
      console.status(error);
    }
  });
}

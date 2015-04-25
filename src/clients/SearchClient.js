export function search(url, success) {
  $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
    success: function(data) {
      success(data);
    },
    error: function(xhr, status, error) {
      console.error(xhr);
      console.error(status);
      console.error(error);
    }
  });
}

export function saveSearch(url, payload) {
  $.ajax({
    url: url,
    type: "POST",
    data: payload,
    dataType: "json",
    error: function(xhr, status, error) {
      console.error(xhr);
      console.error(status);
      console.error(error);
    }
  });
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
      console.error(xhr);
      console.error(status);
      console.error(error);
    }
  });
}

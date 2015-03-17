export function search(url, success) {
  $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
    success: function(data) {
      success(data);
    }
  });
}

export function saveSearch(url, payload) {
  $.ajax({
    url: url,
    type: "POST",
    data: payload,
    dataType: "json"
  });
}

export function getSavedSearches(url, success) {
  $.ajax({
    url: url,
    type: "GET",
    dataType: "json",
    success: function(data) {
      success(data);
    }
  });
}

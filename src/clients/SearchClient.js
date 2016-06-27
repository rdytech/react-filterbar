export function search(url, success) {
  $.ajax({
    url: url,
    type: "GET",
    cache: false,
    dataType: "json",
    success: function(data) {
      success(data);
    }
  });
}

export function saveSearch(url, payload, success) {
  $.ajax({
    url: url,
    type: "POST",
    data: payload,
    dataType: "json",
    success: function() {
      success();
    }
  });
}

export function getSavedSearches(url, success) {
  $.ajax({
    url: url,
    type: "GET",
    cache: false,
    dataType: "json",
    success: function(data) {
      success(data);
    }
  });
}

export function deleteSearch(url, success) {
  $.ajax({
    url: url,
    method: "POST",
    data: { '_method': 'DELETE' },
    dataType: "json",
    success: function() {
      success();
    }
  });
}

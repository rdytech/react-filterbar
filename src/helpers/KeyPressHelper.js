export function applyFiltersOnEnterAfterBlur(event, object) {
    if (event.charCode == 13) { // enter
      object.onBlur();
      object.context.filterBarActor.applyFilters();
    }
}

export function applyFiltersOnEnterAfterSelect(event, object) {
    if (event.charCode == 13) { // enter
      object.onSelect(event);
      object.context.filterBarActor.applyFilters();
    }
}

export function tableUpdated() {
  var event = document.createEvent('Event');
  event.initEvent('react-filterbar:table-updated', true, true);
  document.dispatchEvent(event);
}
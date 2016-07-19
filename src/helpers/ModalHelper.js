export function displayModalForData(data) {
  let modalContainer = $("#modal");
  let modal = $(".modal", modalContainer);

  modalContainer.on("ajax:success", ".modal-content form", function (data, status, xhr) {
    modal.modal("hide");
  });

  modal.html(data);
  modal.modal();
}

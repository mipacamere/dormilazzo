function openModal(imageElement) {
  var modal = document.getElementById("imageModal");
  var modalImage = document.getElementById("modalImage");

  modal.style.display = "flex";
  modalImage.src = imageElement.src;
}

function closeModal() {
  var modal = document.getElementById("imageModal");
  modal.style.display = "none";
}

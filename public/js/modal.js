document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("infoModal");

  if (modal) {
    modal.addEventListener("hide.bs.modal", () => {
      if (document.activeElement && modal.contains(document.activeElement)) {
        document.activeElement.blur();
        const focusTarget = document.getElementById("correo") || document.body;
        focusTarget.focus();
      }
    });
  }
});

window.showInfoModal = function(message, type = 'info') {
  const modal = document.getElementById('infoModal');
  const modalTitle = document.getElementById('infoModalTitle');
  const modalBody = document.getElementById('infoModalBody');
  const modalIcon = document.getElementById('infoModalIcon');

  const types = {
    info: { title: 'Información', icon: 'fas fa-info-circle', color: 'text-info' },
    warning: { title: 'Advertencia', icon: 'fas fa-exclamation-triangle', color: 'text-warning' },
    success: { title: 'Éxito', icon: 'fas fa-check-circle', color: 'text-success' },
    error: { title: 'Error', icon: 'fas fa-times-circle', color: 'text-danger' }
  };

  const selected = types[type] || types.info;

  modalTitle.textContent = selected.title;
  modalBody.innerHTML = message;
  modalIcon.className = `${selected.icon} ${selected.color}`;

  const bootstrapModal = new bootstrap.Modal(modal, {
    backdrop: 'static',
    keyboard: false
  });

  bootstrapModal.show();
};

window.closeInfoModal = function () {
  const modalElement = document.getElementById('infoModal');
  const modalInstance = bootstrap.Modal.getInstance(modalElement);
  if (modalInstance) modalInstance.hide();
};

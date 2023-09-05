import Swal from 'sweetalert2';

export const customAlert = (title, text, icon, buttonText, action) => {
  Swal.fire({
    title: title,
    text: text,
    icon: icon,
    customClass: {
      container: 'border-radius-0'
    },
    confirmButtonText: buttonText,
    confirmButtonColor: 'var(--colorSuccess)',
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      action();
      return;
    }
  });
};

export const alertConfirmCancel = (
  title,
  text,
  icon,
  buttonConfirm,
  buttonCancel,
  action,
  actiontwo
) => {
  Swal.fire({
    title: title,
    text: text,
    icon: icon,
    showCancelButton: true,
    cancelButtonText: buttonCancel,
    confirmButtonColor: 'var(--colorSuccess)',
    cancelButtonColor: 'var(--colorPrimary)',
    confirmButtonText: buttonConfirm,
  }).then((result) => {
    if (result.isConfirmed) {
      action();
    } else {
      actiontwo();
    }
  });
};


export const alertTime = (title, icon, background, color) => {
  Swal.fire({
    toast: true,
    icon: icon,
    color: color,
    background: background,
    title: title,
    position: "bottom-start",
    showConfirmButton: false,
    timer: 3000,
  });
};

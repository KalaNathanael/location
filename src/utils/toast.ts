import Swal from "sweetalert2";

export const ToastSuccess = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 5000,
  timerProgressBar: true,
  padding: "0.5rem",
  text: "Opération exécutée avec succès!",
  icon: "success",
});

export const ToastError = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 5000,
  timerProgressBar: true,
  padding: "0.5rem",
  text: "Erreur survenue lors de l'opération!",
  icon: "error",
});

export const ToastErrorFileType = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 5000,
  timerProgressBar: true,
  padding: "0.5rem",
  text: "Mauvais type de fichier!",
  icon: "error",
});

export const ToastGeneric = (
  msg: string,
  type: "success" | "error" | "warning",
  timer: number
) => {
  return Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: timer,
    timerProgressBar: true,
    padding: "0.5rem",
    text: msg,
    icon: type,
  });
};

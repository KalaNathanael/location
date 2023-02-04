import Swal from "sweetalert2";

export const ToastGeneric = (
  msg: string,
  type: "success" | "error" | "warning" | "info",
  timer: number
) => {
  return Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: timer,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
    title: msg,
    icon: type,
  });
};

export const ToastSuccess = ToastGeneric(
  "Opération exécutée avec succès !",
  "success",
  5000
);

export const ToastError = ToastGeneric(
  "Une erreur est survenue!",
  "error",
  5000
);

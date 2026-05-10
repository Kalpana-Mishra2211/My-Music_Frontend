import Swal from "sweetalert2";

export const handleDelete = async ({
  dispatch,
  id,
  action,
  title = "Delete Item?",
  text = "Are you sure you want to delete this item?",
  successText = "Deleted successfully",
}) => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33", 
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, delete it!",
  });

  if (!result.isConfirmed) return;

  Swal.fire({
    title: "Deleting...",
    text: "Please wait",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
      const loader = Swal.getPopup().querySelector(".swal2-loader");
      if (loader) {
        loader.style.borderTopColor = "#7c3aed";
      }
    },
  });

  try {
    await dispatch(action(id)).unwrap();

    Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: successText,
      timer: 1500,
      showConfirmButton: false,
      confirmButtonColor: "#d33",
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: error?.message || "Delete failed",
      confirmButtonColor: "#d33",
    });
  }
};
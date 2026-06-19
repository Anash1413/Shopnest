
import Swal from "sweetalert2";
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect  (() => {
    Swal.fire({
      title: "Really Want to logout 😢😢😢😢?",
      text: "Tussi Ja rahe ho ? Tussi na jao",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "LogOut",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      background: "#0f172a",
      color: "#e2e8f0",
      buttonsStyling: false,
      customClass: {
        popup: "rounded-lg border border-slate-800 p-6",
        confirmButton:
          "ml-3 rounded-lg bg-rose-600 px-4 py-2 text-sm font-bold text-white hover:bg-rose-500",
        cancelButton:
          "rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-bold text-slate-200 hover:bg-slate-800",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      } else {
        navigate("/");
      }
    });
  }, [logout, navigate]);

  return (
    <div className="min-h-screen justify-center items-center flex">
      <NavLink className="absolute rounded-3xl text-white p-5 bg-indigo-400" to={"/"}>
        Go to Home
      </NavLink>
    </div>
  );
}

export default Logout;


"use client";
import { Toaster } from "react-hot-toast";

export const ToastProviderUI = () => {
  return (
    <Toaster
      position="bottom-left"
      toastOptions={{
        style: {
          color: "white",
          backgroundColor: "black",
          border: "2px solid #87cefa",
          width: "fit-content",
          fontFamily: '"Roboto Mono", sans-serif',
          fontWeight: "600",
          fontSize: "15px",
          zIndex: 999999,
        },
      }}
    ></Toaster>
  );
};

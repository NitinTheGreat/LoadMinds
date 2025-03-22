import React from "react"
import { useEffect } from "react"
import type { Toast } from "../types"

interface ToastComponentProps {
  toast: Toast
  onClose: () => void
}

const ToastComponent: React.FC<ToastComponentProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  let backgroundColor = "bg-green-500"
  const textColor = "text-white"

  if (toast.type === "error") {
    backgroundColor = "bg-red-500"
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 ${backgroundColor} ${textColor} py-2 px-4 rounded-md shadow-lg flex items-center`}
    >
      <span className="mr-2">{toast.message}</span>
      <button onClick={onClose} className="focus:outline-none">
        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  )
}

export default ToastComponent


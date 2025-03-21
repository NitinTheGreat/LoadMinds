import React from "react"
import { useEffect } from "react"
import type { Toast } from "../types"

interface ToastProps {
  toast: Toast
  onClose: () => void
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor = toast.type === "success" ? "bg-green-500" : "bg-red-500"

  return (
    <div className={`${bgColor} text-white px-4 py-2 rounded shadow-md flex justify-between items-center`}>
      <span>{toast.message}</span>
      <button onClick={onClose} className="ml-2 text-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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

export default Toast


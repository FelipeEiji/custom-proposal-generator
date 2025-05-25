"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { AlertTriangle, X } from "lucide-react"

interface ConfirmationModalProps {
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive"
  onConfirm?: () => void
  onCancel?: () => void
  trigger?: React.ReactNode
}

export default function ConfirmationModal({
  title = "Are you sure?",
  description = "This action cannot be undone. Please confirm to proceed.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  onConfirm,
  onCancel,
  trigger,
}: ConfirmationModalProps) {
  const [open, setOpen] = useState(false)

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        handleCancel()
      }
    }

    if (open) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [open])

  const handleConfirm = () => {
    onConfirm?.()
    setOpen(false)
  }

  const handleCancel = () => {
    onCancel?.()
    setOpen(false)
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel()
    }
  }

  return (
    <>
      {/* Trigger */}
      <div onClick={() => setOpen(true)}>
        {trigger || (
          <button
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              variant === "destructive"
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-gray-200 text-gray-900 hover:bg-gray-300 border border-gray-300"
            }`}
          >
            Open Modal
          </button>
        )}
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={handleOverlayClick}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-lg shadow-xl transform transition-all duration-200 scale-100 opacity-100"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            {/* Close button */}
            <button
              onClick={handleCancel}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="p-6 pb-4">
              <div className="flex items-center gap-3 mb-2">
                {variant === "destructive" && (
                  <div className="flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                )}
                <h3 id="modal-title" className="text-lg font-semibold text-gray-900 leading-6">
                  {title}
                </h3>
              </div>
              <p id="modal-description" className="text-sm text-gray-600 leading-relaxed">
                {description}
              </p>
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 p-6 pt-4 bg-gray-50 rounded-b-lg">
              <button
                onClick={handleCancel}
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                className={`w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                  variant === "destructive"
                    ? "text-white bg-red-600 hover:bg-red-700 focus:ring-red-500"
                    : "text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                }`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

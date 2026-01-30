'use client'

import { ReactNode, useEffect, useRef } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export function Modal({ isOpen, onClose, children }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = dialogRef.current
    if (isOpen) {
      dialog?.showModal()
      // Блокируем скролл основной страницы при открытой модалке
      document.body.style.overflow = 'hidden'
    } else {
      dialog?.close()
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    const { left, right, top, bottom } = e.currentTarget.getBoundingClientRect()
    const { clientX: x, clientY: y } = e

    if (x < left || x > right || y < top || y > bottom) {
      onClose()
    }
  }
  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="m-auto w-full max-w-2xl rounded-2xl bg-neutral-600 shadow-2xl outline-none backdrop:bg-black/20"
    >
      <div>
        <button
          onClick={onClose}
          className="absolute top-4 right-2 rounded-full p-1 px-2 text-gray-400 transition-colors hover:bg-neutral-600"
        >
          ✕
        </button>
        {children}
      </div>
    </dialog>
  )
}

import { create } from 'zustand'

interface ModalCreatePostState {
  images: File[]
  caption: string
  isOpen: boolean
  setImages: (files: File[]) => void
  setCaption: (caption: string) => void
  open: () => void
  close: () => void
  reset: () => void
}

export const usePostModalCreatePost = create<ModalCreatePostState>((set) => ({
  images: [],
  caption: '',
  isOpen: false,
  setImages: (files) => set({ images: files }),
  setCaption: (caption) => set({ caption }),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  reset: () => set({ images: [], caption: '', isOpen: false })
}))

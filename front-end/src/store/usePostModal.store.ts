import { create } from 'zustand'

interface PostModalState {
  images: File[]
  caption: string
  isOpen: boolean
  setImages: (files: File[]) => void
  setCaption: (caption: string) => void
  open: () => void
  close: () => void
  reset: () => void
}

export const usePostModal = create<PostModalState>((set) => ({
  images: [],
  caption: '',
  isOpen: false,
  setImages: (files) => set({ images: files }),
  setCaption: (caption) => set({ caption }),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  reset: () => set({ images: [], caption: '', isOpen: false })
}))

// stores/useStoryViewerStore.ts
import { create } from 'zustand'

type StoryViewerState = {
  viewerUserIndex: number | null
  storyIndex: number
  open: (userIndex: number) => void
  close: () => void
  nextStory: () => void
  nextUser: (max: number) => void
}

export const useStoryViewerStore = create<StoryViewerState>((set) => ({
  viewerUserIndex: null,
  storyIndex: 0,

  open: (userIndex) =>
    set({
      viewerUserIndex: userIndex,
      storyIndex: 0
    }),

  close: () =>
    set({
      viewerUserIndex: null,
      storyIndex: 0
    }),

  nextStory: () =>
    set((state) => ({
      storyIndex: state.storyIndex + 1
    })),

  nextUser: (max) =>
    set((state) => {
      const nextIndex = state.viewerUserIndex! + 1
      if (nextIndex >= max) return { viewerUserIndex: null }
      return { viewerUserIndex: nextIndex, storyIndex: 0 }
    })
}))

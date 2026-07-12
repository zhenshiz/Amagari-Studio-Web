import { ref } from 'vue'

const isCommunityDialogOpen = ref(false)

const openCommunityDialog = () => {
  isCommunityDialogOpen.value = true
}

export const useCommunityDialog = () => ({
  isCommunityDialogOpen,
  openCommunityDialog,
})

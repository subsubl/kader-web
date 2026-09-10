// Composable: useReservationModal
// Provides global reactive state to open/close the Table Reservation & Takeaway Modal from any component (Header, Hero, Menu cards, Mobile bar)

import { ref } from 'vue'

export type ReservationTab = 'table' | 'takeaway'

export interface PreselectedItem {
  name: string
  price: string
  quantity?: number
}

const isModalOpen = ref(false)
const modalTab = ref<ReservationTab>('table')
const selectedItem = ref<PreselectedItem | null>(null)

export function useReservationModal() {
  const openReservation = (tab: ReservationTab = 'table', item?: { name: string; price: string }) => {
    modalTab.value = tab
    if (item) {
      selectedItem.value = { ...item, quantity: 1 }
    } else {
      selectedItem.value = null
    }
    isModalOpen.value = true
  }

  const closeReservation = () => {
    isModalOpen.value = false
  }

  const setTab = (tab: ReservationTab) => {
    modalTab.value = tab
  }

  return {
    isModalOpen,
    modalTab,
    selectedItem,
    openReservation,
    closeReservation,
    setTab
  }
}

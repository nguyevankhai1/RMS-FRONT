import { defineStore } from 'pinia'

export const useMeStore = defineStore('meStore', () => {
    const me = ref<object>({})

    const setMe = (value: object) => {
        me.value = value
      }
    return {me, setMe}
})

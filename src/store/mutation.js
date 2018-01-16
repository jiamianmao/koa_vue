export const mutations = {
  cartNum (state, num) {
    state.cartNum = num
  },
  count (state, count) {
    state.count += count
  },
  initCount (state, count) {
    state.count = count
  }
}

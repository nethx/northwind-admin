import storage from 'utils/storage'
const user = {
  state: {
    info: null,
  },
  mutations: {
    setUser(state, data) {
      state.info = data
    },
  },
  actions: {
    getUser(context) {
      let userInfo = storage.read('admin_UserInfo')
      if (userInfo) {
        context.commit('setUser', userInfo)
      } else {
        context.commit('setUser', null)
      }
    }
  }
}
export default user

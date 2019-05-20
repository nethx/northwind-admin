const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // sidebar: state => state.app.sidebar,
  // size: state => state.app.size,
  // device: state => state.app.device,
  userName: state => state.user.info ? state.user.info.UserName : '',
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
}
export default getters

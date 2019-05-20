export default {
  write(key, value) {
    if (value) {
      value = JSON.stringify(value)
    }
    localStorage.setItem(key, value)

  },
  read(key) {
    let value = localStorage.getItem(key)
    if (value && value != "undefined" && value != "null") {
      return JSON.parse(value)
    }
    return null
  },
  remove(key) {
    localStorage.removeItem(key)
  },
  clear() {
    localStorage.clear()
  }
}

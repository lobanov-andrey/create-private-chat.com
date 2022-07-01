const pushSearch = (search?: string) => {
  window.history.replaceState({}, document.title, search ? search : '/')
}

export default pushSearch

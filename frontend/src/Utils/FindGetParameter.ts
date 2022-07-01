const findGetParameter = (parameterName: string) => {
  let result = ''
  location.search
    .substr(1)
    .split('&')
    .forEach(function (item: string) {
      const tmp: string[] = item.split('=')
      if (tmp[0] == parameterName) result = decodeURIComponent(tmp[1])
    })
  return result
}

export default findGetParameter

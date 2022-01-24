const GetTime = (date: number): string => {
  const newDate = new Date(date)
  const hours = newDate.getHours()
  const minuts = newDate.getMinutes()
  return `${hours < 10 ? `0${hours}` : hours}:${minuts < 10 ? `0${minuts}` : minuts}`
}
export default GetTime

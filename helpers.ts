export function parseDate(dateString: string) {
  const x = /^(\d{2}).(\d{2}).(\d{4})$/g.exec(dateString) // works for DD.MM.YYYY
  if (x) {
    const y = Number(x[3])
    const m = Number(x[2])
    const d = Number(x[1])
    const res = new Date(y, m - 1, d)
    if (d > 31 || res.getDate() !== d) return null
    return res
  } else return null
}

export function parseTime(timeString: string) {
  const x = /^(\d{2}):(\d{2})$/g.exec(timeString) // works for HH:mm
  if (x) {
    const h = Number(x[1])
    const m = Number(x[2])
    if (h < 0 || h > 23) return null
    if (m < 0 || m > 59) return null

    return [h, m]
  } else return null
}

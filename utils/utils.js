import dateFormat from "dateformat"

const FORMAT = "yyyy/mm/dd "

export function toLocaleString(datestr) {
  return datestr ? dateFormat(new Date(datestr), 'yyyy/m/dd H:MM:ss') : ''
}

export function resolveAvatarUrl(host, url) {
  if (!url) {
    return ''
  }
  return url.match(/^http/) ? url : `https://${host}${url}`
}

import dateFormat from "dateformat"
import util from "util"

const FORMAT = "yyyy/mm/dd "

export function toLocaleString(datestr) {
  return datestr ? dateFormat(new Date(datestr), 'yyyy/m/dd H:MM:ss') : ''
}

/**
 * 日時文字列をdateformatを指定してフォーマットする
 * @param {string} datestr - 日時文字列
 * @param {string} format - 指定のdateformat
 */
export function formatLocaleString(datestr, format) {
  return datestr ? dateFormat(new Date(datestr), format) : ''
}

/**
 * 日時文字列を現在からの相対時間文字列に変換する
 * @param {string} datestr - 日時文字列
 */
export function toRelactiveString(datestr) {
  const sec = (new Date().getTime() - new Date(datestr).getTime()) / 1000;
  if (sec < 60) { return util.format('%d秒前', sec) }
  if (sec < 3600) { return util.format('%d分前',　Math.floor(sec/60)) }
  if (sec < 86400) { return util.format('%d時間前', Math.floor(sec/3600)) }
  if (sec < 86400*365) { return util.format('%d日前', Math.floor(sec/86400)) }
  return util.format('%d年前', Math.floor(sec/86400*365))
}

export function resolveAvatarUrl(host, url) {
  if (!url) {
    return ''
  }
  return url.match(/^http/) ? url : `https://${host}${url}`
}

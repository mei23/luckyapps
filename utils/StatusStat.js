
const dateFormat = require('dateformat');

module.exports = class StatusStat {
  constructor(duration) {
    this.epoch = this.getTimestamp()
    this.lastStart = this.epoch
    this.duration = duration || 300 * 1000

    this.count = 0
    this.byAcct = {}
    this.cacheAcct = {}
    this.activeUsers = []
  }

  pushStatus(sts){
    const ts = this.getTimestamp()
    const currentPeriod = this.getPeriodByTimestamp(ts)
    const lastPeriod = this.getPeriodByTimestamp(this.lastStart)

    let isNewPeriod = false

    if (currentPeriod > lastPeriod) {
      isNewPeriod = true
      const deltaT = ts - this.lastStart
      this._commitStatus(deltaT)
      this.lastStart = ts
      this.count = 0 
      this.byAcct = {}
      this.cacheAcct = {}
    }

    this.count++

    if (! this.cacheAcct[sts.account.acct]) {
      this.cacheAcct[sts.account.acct] = sts.account
      this.byAcct[sts.account.acct] = 1
    }
    else {
      this.byAcct[sts.account.acct]++
    }

    return isNewPeriod
  }

  _commitStatus(deltaT){

    console.log(`${dateFormat(this.lastStart, 'yyyy/m/dd H:MM:ss')} - ${dateFormat(new Date(), 'yyyy/m/dd H:MM:ss')}`)

    const countPT = this.count / deltaT * 1000 * 60
    this.tootPerMin = countPT
    console.log(`${Math.floor(countPT*10)/10} トゥート/分`)

    let orderByCount = Object.keys(this.byAcct)
      .map(key => { return {
        key: key,
        cnt: this.byAcct[key],
        obj: this.cacheAcct[key],
      }})
      .sort((a,b) => b.cnt - a.cnt) // order by count desc
    
    this.activeUsers = Object.keys(this.byAcct).map(key => { return { 
      key: key,
      cnt: this.byAcct[key],
      obj: this.cacheAcct[key],
     }}
    ).sort((a,b) => b.cnt - a.cnt)

    console.log(`アクティブユーザー数: ${orderByCount.length}`)
    console.log('トップ10: ')
    orderByCount.splice(0, 30).forEach(rnk => {
      console.log(`  ${rnk.cnt} ${rnk.obj.display_name} (${rnk.obj.acct}) `)
    })

    console.log()
    
  }

  getTimestamp() {
    return new Date().getTime()
  }

  getPeriodByTimestamp(ms) {
    return Math.floor(ms / this.duration)
  }
}
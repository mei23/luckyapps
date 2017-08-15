
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
    this.periodCommitCount = 0  // period満了commitした回数]
    this.tootPerMin = NaN
  }

  pushStatus(sts){
    const ts = this.getTimestamp()
    const currentPeriod = this.getPeriodByTimestamp(ts)
    const lastPeriod = this.getPeriodByTimestamp(this.lastStart)

    let isNewPeriod = false

    const deltaT = ts - this.lastStart
    
    if (ts - this.lastStart > this.duration) {
    //if (currentPeriod > lastPeriod) {
      isNewPeriod = true
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

    // まだperiod満了を迎えてない場合 流入毎にアクティブ一覧更新
    if (this.periodCommitCount == 0) {
      this._commitActiveUsers(deltaT)
    }

    return isNewPeriod
  }

  _commitCount(deltaT){
    const countPT = this.count / deltaT * 1000 * 60
    this.tootPerMin = countPT
  }

  _commitActiveUsers(deltaT){
    this.activeUsers = Object.keys(this.byAcct).map(key => { return { 
      key: key,
      cnt: this.byAcct[key],
      obj: this.cacheAcct[key],
     }}
    ).sort((a,b) => b.cnt - a.cnt)
    // TODO: たぶん安定ソートでねーからこれてきとうですぅ
  }

  _commitStatus(deltaT){

    this.periodCommitCount++
    //console.log(`${dateFormat(this.lastStart, 'yyyy/m/dd H:MM:ss')} - ${dateFormat(new Date(), 'yyyy/m/dd H:MM:ss')}`)

    this._commitCount(deltaT)
    //console.log(`${Math.floor(countPT*10)/10} トゥート/分`)

    /*
    let orderByCount = Object.keys(this.byAcct)
      .map(key => { return {
        key: key,
        cnt: this.byAcct[key],
        obj: this.cacheAcct[key],
      }})
      .sort((a,b) => b.cnt - a.cnt) // order by count desc
    */

    this._commitActiveUsers(deltaT)

    //console.log(`アクティブユーザー数: ${orderByCount.length}`)
    //console.log('トップ10: ')
    //orderByCount.splice(0, 30).forEach(rnk => {
    //  console.log(`  ${rnk.cnt} ${rnk.obj.display_name} (${rnk.obj.acct}) `)
    //})

    //console.log()
  }



  getTimestamp() {
    return new Date().getTime()
  }

  getPeriodByTimestamp(ms) {
    return Math.floor(ms / this.duration)
  }
}
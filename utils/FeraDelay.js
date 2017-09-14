
module.exports = class FeraDelay {
  constructor(duration) {
    this.epoch = this.getTimestamp()
    this.lastStart = this.epoch
    this.duration = duration || 300 * 1000

    this.isDelaySum = {}
    this.insCount = {}
    this.periodCommitCount = 0  // period満了commitした回数]
    this.tootPerMin = NaN
    this.Stat = []
  }

  pushStatus(sts){
    const ts = this.getTimestamp()
    const currentPeriod = this.getPeriodByTimestamp(ts)
    const lastPeriod = this.getPeriodByTimestamp(this.lastStart)

    let isNewPeriod = false

    const deltaT = ts - this.lastStart
    
    /*
    if (ts - this.lastStart > this.duration) {
      isNewPeriod = true
      this._commitStatus(deltaT)
      this.lastStart = ts
      this.isDelaySum = {}
      this.insCount = {}
    }
    */
    this._commitStatus()

    // ドメイン部分 or ''(local)
    const m1 = sts.account.acct.match(/@(.*)$/)
    const dom = m1 ? m1[1] : '_local'
    
    const statusTime = new Date(sts.created_at).getTime()
    const arriveTime = new Date().getTime()
    const delay = Math.floor(arriveTime - statusTime)
 
    if (! this.isDelaySum[dom]) {
      this.isDelaySum[dom] = delay
      this.insCount[dom] = 1
    }
    else {
      this.isDelaySum[dom] += delay
      this.insCount[dom] += 1
    }

    return isNewPeriod
  }
  _commitStatus(deltaT){
    this.periodCommitCount++

    this.Stat = Object.keys(this.insCount).map(key => { return { 
      key: key,
      cnt: this.insCount[key],
      dly: this.isDelaySum[key],
    }}).sort((a,b) => b.cnt - a.cnt)
  }
  getTimestamp() {
    return new Date().getTime()
  }

  getPeriodByTimestamp(ms) {
    return Math.floor(ms / this.duration)
  }
}
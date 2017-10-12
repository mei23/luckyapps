
module.exports = class FujoMon {
  constructor(duration) {
    this.lastActives = {}
  }

  pushStatus(sts){
    if (! this.lastActives[sts.account.acct]) {
      this.lastActives[sts.account.acct] = new Date()
      return true
    }
    else {
      this.lastActives[sts.account.acct] = new Date()
      return false
    }
  }
}
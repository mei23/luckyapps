const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MastodonAppSchema = new Schema({
  hostname: { type: String, required: true, unique: true },
  id: { type: String, required: true },
  client_id: { type: String, required: true },
  client_secret: { type: String, required: true },
})

module.exports = mongoose.model('MastodonApp', MastodonAppSchema)

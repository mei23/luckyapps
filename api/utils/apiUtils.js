const cleanHostname = (host) => {
  return host != null ? host.replace(/^https?:\/\/|\/$/, '') : null
}

module.exports = { cleanHostname }
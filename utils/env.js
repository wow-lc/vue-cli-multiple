// env detection
let _hasVueCli
exports.hasVueCli = () => {
    if (process.env.VUE_CLI_TEST) {
      return true
    }
    if (_hasVueCli != null) {
      return _hasVueCli
    }
    try {
      execSync('vue-cli -V', { stdio: 'ignore' })
      return (_hasVueCli = true)
    } catch (e) {
      return (_hasVueCli = false)
    }
  }
const fs = require('fs');

function getScriptUrls() {
  const vendor = fs.readFileSync(`${__dirname}/config/vendor.list`, 'utf-8');
  const app = fs.readFileSync(`${__dirname}/config/app.list`, 'utf-8');
  return vendor.split('\n').concat(app.split('\n'))
            .map(s => s.trim().replace('public', ''))
            .filter((s) => !!s);
}

module.exports = {
  getScriptUrls,
}

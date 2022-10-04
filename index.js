const express = require('express')
const CryptoJS = require('crypto-js')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const ejs = require('ejs')
const app = express()
const port = 3000

function getAES(str) {
  let iv = CryptoJS.enc.Utf8.parse("1234567887654321")
  let key = CryptoJS.enc.Utf8.parse("1234567887654321")
  let encrypted = CryptoJS.AES.encrypt(str, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.ZeroPadding,
  }).toString()
  return encodeURIComponent(encrypted)
}

var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.engine('html', ejs.__express);
app.use(express.static('public'))
app.set('view engine', 'html');

app.get('/', (req, res) => {
  res.render('index.html')

})

app.post('/api', urlencodedParser, async (req, res) => {
  let username = req.body.username
  let state = req.body.state
  let type = req.body.type

  let state_ = state
  let title_ = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}${type}${state}`
  let subTitle_ = `学号：${username}`
  let weather_ = null
  let history_ = getAES(username)
  await fetch("https://devapi.qweather.com/v7/weather/3d?location=101180101&key=0f1f828c857b47ba8d98a090f98a5ce7")
    .then(res => {
      return res.json()
    })
    .then(data => {
      const weather = data.daily[1].textDay
      const temperature = data.daily[1].tempMax
      weather_ = `郑州明日天气：${weather} ${temperature}°C`
    })

  res.render('main.html', {
    state_,
    title_,
    subTitle_,
    weather_,
    history_,
    color_: state_ == "成功" ? "#059669" : "#991b1b"
  })
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
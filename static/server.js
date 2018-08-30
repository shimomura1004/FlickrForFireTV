var express = require('express')
var cookieParser = require('cookie-parser')
var url = require('url')
var OAuth = require('oauth-1.0a')
var crypto = require('crypto')
var axios = require('axios')
var qs = require('qs')

const appKey = process.env.APP_KEY
const appSecret = process.env.APP_SECRET
const PORT = process.env.PORT || 8081

const REQUEST_TOKEN_URL = 'http://www.flickr.com/services/oauth/request_token'
const AUTHORIZE_URL = 'http://www.flickr.com/services/oauth/authorize'
const ACCESS_TOKEN_URL = 'http://www.flickr.com/services/oauth/access_token'
const FLICKR_REST_API_URL = 'https://api.flickr.com/services/rest/'

var app = express()
app.use(cookieParser())

var oauth = OAuth({
  consumer: {
    key: appKey,
    secret: appSecret
  },
  signature_method: 'HMAC-SHA1',
  hash_function: function (baseString, key) {
    return crypto.createHmac('sha1', key).update(baseString).digest('base64')
  }
})

function getRequestToken (req, res) {
  var request = {
    url: REQUEST_TOKEN_URL,
    method: 'POST',
    data: {
      oauth_callback: 'http://' + req.headers.host + '/auth'
    }
  }

  axios
    .post(request.url, qs.stringify(oauth.authorize(request)))
    .then(response => {
      var params = url.parse('/?' + response.data, true).query
      res.cookie('oauth_token', params['oauth_token'])
      res.cookie('oauth_token_secret', params['oauth_token_secret'])
      res.writeHead(302, {
        'Location': AUTHORIZE_URL + '?oauth_token=' + params['oauth_token']
      })
      res.end()
    })
}

function getAccessToken (req, res, params) {
  var request = {
    url: ACCESS_TOKEN_URL,
    method: 'POST',
    data: {
      oauth_verifier: params['oauth_verifier']
    }
  }

  var token = {
    key: req.cookies['oauth_token'],
    secret: req.cookies['oauth_token_secret']
  }

  axios
    .post(request.url, qs.stringify(oauth.authorize(request, token)))
    .then(response => {
      console.log('Your access token has been granted')
      res.writeHead(302, {
        'Location': '/'
      })
      res.end()
    })
}

function accessApi (req, res, params) {
  var token = {
    key: req.cookies['oauth_token']
  }

  var request = {
    url: FLICKR_REST_API_URL,
    method: 'POST'
  }

  var form = oauth.authorize(request, token)
  form['format'] = 'json'
  form['nojsoncallback'] = 1
  Object.assign(params, form)

  axios
    .post(request.url, qs.stringify(params))
    .then(response => {
      res.setHeader('Content-Type', 'application/json')
      res.send(response.data)
    })
}

app.get('/service/rest', (req, res) => {
  accessApi(req, res, req.query)
})

app.post('/service/rest', (req, res) => {
  accessApi(req, res, req.query)
})

app.get('/auth', (req, res) => {
  var params = url.parse(req.url, true).query

  if ('oauth_token' in params && 'oauth_verifier' in params) {
    getAccessToken(req, res, params)
  } else {
    getRequestToken(req, res)
  }
})

app.use(express.static(process.env.DIST_DIR))

app.listen(PORT)

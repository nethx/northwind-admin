'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  host: '"http://192.168.1.99/api"',
  chatHost: '"ws://169.254.231.198:4141/chat"'
})

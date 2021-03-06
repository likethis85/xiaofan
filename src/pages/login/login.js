'use strict'

const ff = require('../../utils/fanfou')

Page({
  onLoad () {
    const accounts = this.getAccounts()
    this.setData({accounts})
  },

  // Login action
  login (e) {
    wx.showLoading({
      title: '正在登录',
      mask: true
    })
    ff.authPromise(e.detail.value.username, e.detail.value.password)
      .then(() => {
        wx.reLaunch({url: '/pages/home/home'})
      })
      .catch(() => {
        wx.showToast({
          title: '登录失败',
          image: '/assets/toast_fail.png',
          duration: 900
        })
      })
  },

  // Get accounts from stroage
  getAccounts () {
    return wx.getStorageSync('accounts') || []
  },

  // Tap to switch account
  tapListItem (e) {
    const {id} = e.currentTarget.dataset
    const accounts = this.getAccounts()
    let index = -1
    for (let i = 0; i < accounts.length; i++) {
      if (accounts[i].id === id) {
        index = i
        break
      }
    }
    if (index >= 0) {
      const account = accounts.splice(index, 1)[0]
      accounts.unshift(account)
      getApp().globalData.account = account
      wx.reLaunch({url: '/pages/home/home'})
    }
    wx.setStorageSync('accounts', accounts)
  },
  longpressListItem (e) {
    const page = this
    const accounts = this.getAccounts()
    wx.showActionSheet({
      itemList: ['退出登录'],
      success (res) {
        if (!res.cancel) {
          for (const [i, account] of accounts.entries()) {
            if (account.id === e.currentTarget.dataset.id) {
              accounts.splice(i, 1)
              wx.setStorageSync('accounts', accounts)
              getApp().globalData.account = accounts[0]
              if (accounts.length === 0) {
                wx.reLaunch({url: '/pages/login/login'})
              } else if (i === 0) {
                wx.reLaunch({url: '/pages/home/home'})
              }
              break
            }
          }
          page.setData({accounts})
        }
      }
    })
  }
})

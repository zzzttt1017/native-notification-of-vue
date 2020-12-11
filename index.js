let Notification = window.Notification

const onerror = function (e) {}

const onclick = function (e) {
  e.preventDefault()
  window.focus()
  e.target.close()
}

const onclose = function (e) {}

const onshow = function(e) {}

const defaultEvents = {
  onerror,
  onclick,
  onclose,
  onshow
}

const NativeNotificationOfVue = {
  install: function (Vue, options) {
    options = options || {}
    // 是否页面加载后马上询问通知权限，否则使用时会再询问
    options.requestOnLoad = !!options.requestOnLoad

    // 适配Vue3.x
    let __prototype = Vue.prototype || Vue.config.globalProperties

    __prototype.$nativeNotification = {}

    // 向用户请求通知权限
    let requestPermission = function () {
      return Notification.requestPermission()
    }
    __prototype.$nativeNotification.requestPermission = requestPermission
    options.requestOnLoad && requestPermission()
    // 主体函数
    const push = function (params, e = {}) {
      if (typeof params !== 'object') {
        throw new Error('[nativeNotification]: 参数格式错误')
      }
      // title, // 通知标题
      // body, // 通知内容
      // tag, // 赋予通知一个ID，相同的ID情况下，后面的会覆盖前面的
      // icon // 一个图片的URL，将被用于显示通知的图标
      let { title, body, tag, icon, data } = params
      
      if (!e.onerror) e.onerror = function () { }
      if (!e.onclick) e.onclick = function () { }
      if (!e.onclose) e.onclose = function () { }
      if (!e.onshow) e.onshow = function () { }
      return Promise.resolve()
        .then(function () {
          if (Notification.permission !== 'granted') {
            return requestPermission()
          }

          return Notification.permission
        })
        .then(function (permission) {
          if (permission === 'denied') {
            return new Error('无权发通知')
          }

          const bindError = function (event) {
            'use strict'
            defaultEvents.onerror(event)
            e.onerror(event)
          }

          const bindClick = function (event) {
            'use strict'
            defaultEvents.onclick(event)
            e.onclick(event)
          }

          const bindClose = function (event) {
            'use strict'
            defaultEvents.onclose(event)
            e.onclose(event)
          }

          const bindShow = function (event) {
            'use strict'
            defaultEvents.onshow(event)
            e.onshow(event)
          }

          try {
            let notification = new Notification(title, {body, tag, icon, data})
            notification.onerror = bindError
            notification.onclick = bindClick
            notification.onclose = bindClose
            notification.onshow = bindShow

            return notification
          } catch (e) {
            if (e.name !== 'TypeError') {
              return e
            }

            return navigator.serviceWorker.ready.then(
              function (reg) {
                reg.showNotification(title, {body, tag, icon, data})
              }).then(bindShow, bindError)
          }
        })
    }
    __prototype.$nativeNotification.push = push
  }
}

export default NativeNotificationOfVue
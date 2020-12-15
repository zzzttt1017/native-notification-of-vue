let Notification = window.Notification

const TipText = function (data) {
  return `[nativeNotificationOfVue]: ${data}`
} 

const NativeNotificationOfVue = {
  install: function (Vue, options) {
    if (!Notification) {
      console.error(TipText('Sorry, this browser does not support Notification API'))
      return
    }
    options = options || {}
    const eventList = ['onerror', 'onclick', 'onclose', 'onshow']
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
    const push = function (params, outerEvents = {}) {
      if (typeof params !== 'object') {
        console.error(TipText('Invalid arguments'))
      }
      let { title, body, tag, icon, data } = params
      
      eventList.forEach(v => {
        !outerEvents[v] && (outerEvents[v] = function () {})
      })
      return Promise.resolve()
        .then(function () {
          if (Notification.permission !== 'granted') {
            return requestPermission()
          }

          return Notification.permission
        })
        .then(function (permission) {
          if (permission === 'denied') {
            console.error(TipText('no access'))
          }
          
          const bindEvents = {
            onerror: function (event) { outerEvents.onerror(event) },
            onclick: function (event) {
              event.preventDefault()
              window.focus()
              event.target.close()
              outerEvents.onclick(event)
            },
            onclose: function (event) { outerEvents.onclose(event) },
            onshow: function (event) { outerEvents.onshow(event) }
          }


          try {
            let notification = new Notification(title, {body, tag, icon, data})
            eventList.forEach(v => {
              notification[v] = bindEvents[v]
            })
            return notification
          } catch (e) {
            if (e.name !== 'TypeError') {
              console.error(TipText(e))
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
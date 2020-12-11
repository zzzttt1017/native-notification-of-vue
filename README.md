# native-notification-of-vue

### Description
out of the box with Vue2.x, wraps the HTML5 native Notification API

### Introduction
  MDN say:
``The Notification interface of the Notifications API is used to configure and display desktop notifications to the user. These notifications' appearance and specific functionality vary across platforms but generally they provide a way to asynchronously provide information to the user.``

### Installation

```javascript
npm install --save native-notification-of-vue
```
>When debugging in the development environment,you should open the HTTPS

```javascript
  devServer: {
    https: true,
    // ...
```

### Add

#### Vue2.x
```javascript
import Vue from 'vue'
import NativeNotificationOfVue from 'native-notification-of-vue'

Vue.use(NativeNotificationOfVue, {
  requestOnLoad: true // Whether to ask the user for notification right after the site loads, or ask again when you use it
})
```

#### Vue3.x
```javascript
import { createApp } from 'vue'
import NativeNotificationOfVue from 'native-notification-of-vue'
const app = createApp(App)

app.use(NativeNotificationOfVue, {
  requestOnLoad: true, // Whether to ask the user for notification right after the site loads, or ask again when you use it
})
```
### Usage

#### push

```javascript
  this.$nativeNotification.push({
    title: '🐮🍺',
    body: 'this is awesome!',
    tag: 'message', // Give the notification an ID, and in the case of the same ID, the latter overrides the former
    icon: 'https://www.baidu.com/img/flexible/logo/pc/result.png', // A URL for an image that will be used to display the notification icon
    data: {x: 1} // Custom data
  }, {
    onerror: (e) => {
      console.log(e)
    },
    onclick: (e) => {
      console.log(e)
    },
    onclose: (e) => {
      console.log(e)
    },
    onshow: (e) => {
      console.log(e)
    },
  })
```

#### offered to request notification permission

```javascript
  this.$nativeNotification.requestPermission().then(status => {
    // ...
  })
```


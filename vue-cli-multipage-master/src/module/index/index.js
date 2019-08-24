/**
 * Created by 1 on 2016/11/28.
 */
import Vue from 'vue'
import VueMoment from 'vue-moment'
import VueResource from 'vue-resource'
import $ from 'jquery'
window.$=$
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App.vue'


Vue.use(VueMoment)
Vue.use(VueResource)
Vue.use(ElementUI)


//创建挂载根实力，通过router配置参数注入路由，从而让整个应用都有路由功能

new Vue({
  el: '#app',
  render: h => h(App)
})


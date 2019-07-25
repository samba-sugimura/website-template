/**
 * Vue.jsのテストです。
 * `<div id="app"><sample-button variant="default">{{message}}</sample-button></div>`
 *  or
 * `#app sample-button(variant="default") {{message}}`
 */
import Vue from 'vue';
import SampleButton from './components/SampleButton.vue';
import BlogList from './components/BlogList.vue';

export default function vueTest() {
  const element = document.getElementById('app');

  if (!element) return;

  const app = new Vue({
    components: {
      SampleButton,
      BlogList,
    },
    data: {
      message: 'Hello Vue.js!',
    },
  });

  app.$mount('#app');
}


Vue.component('workoutcounter', {
  props: ['type', 'imgsrc'],
  data: function () {
    return {
      amount: 0,
      plusValue: 5,
      minusValue: 1
    }
  },
  template: ` <div class="counter">
                <h2>{{ type }}</h2>
                <h3>{{ amount }}</h3>
                <div class="stack">
                  <img class="stackUp" v-bind:src="imgsrc" v-on:click="click" >
                </div>
              </div>`,
  methods: {
    click: function (e) {
      let rect = e.target.getBoundingClientRect();
      let sizeX = rect.right - rect.left;
      let x = e.clientX - rect.left; 

      if (x >= sizeX / 2)
        this.amount = this.amount + this.plusValue;
      else
        this.amount = this.amount - this.minusValue;

      this.amount = Math.max(0, this.amount);
    },
  }
})

let app = new Vue({
  el: '#app',

})

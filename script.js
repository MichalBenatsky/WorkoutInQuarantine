var app = new Vue({
    el: '#app',
    data: {
      amount: 0,
      message: 'Hello Vue!',
      type: 'PushUp',
      plusValue: 5,
      minusValue: 1
    },
    methods: {
        addWorkout: function () {
          this.amount = this.amount + this.plusValue;
        },
        subWorkout: function () {
            this.amount = this.amount - this.minusValue;
          },
      }
  })
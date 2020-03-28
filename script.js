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
        click: function (e) {
          let rect = e.target.getBoundingClientRect();
          let sizeX = rect.right - rect.left;
          let x = e.clientX - rect.left; 

          if (x >= sizeX / 2)
            this.amount = this.amount + this.plusValue;
          else
            this.amount = this.amount - this.minusValue;
        },
      }
  })
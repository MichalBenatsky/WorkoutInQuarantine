
function setData(data)
{

  Vue.component('workoutcounter', {
    props: ['id', 'type', 'imgsrc', 'amount'],
    template: ` <div class="counter" v-on:click="click">
                  <h2>{{ type }}</h2>
                  <h3>{{ amount }}</h3>
                  <div class="stack">
                    <img class="stackUp" v-bind:src="imgsrc"  >
                  </div>
                </div>`,
    methods: {
      click: function (e) {
        let rect = e.target.getBoundingClientRect();
        let sizeX = rect.right - rect.left;
        let x = e.clientX - rect.left; 
  
        let dataChange = "sub";
        if (x >= sizeX / 2)
        {
          dataChange = "add";
        }
        //   this.amount = this.amount + this.plusValue;
        // else
        //   this.amount = this.amount - this.minusValue;
  
        // this.amount = Math.max(0, this.amount);
  
        this.$emit('event_child', this.id, dataChange)
      },
    },
    
  });

  let app = new Vue({
    data: {
      workouts: [
        { id:0, type: 'PushUp', imgsrc:'img/pushUp.svg', amount: data.pushUp},
        { id:1, type: 'PullUp', imgsrc:'img/pullUp.svg', amount: data.pullUp},
        { id:2, type: 'Squat', imgsrc:'img/squat.svg', amount: data.squat}
      ],
      plusValue: 5,
      minusValue: 1
    },
    el: '#app',
    methods: {
      eventChild: function(id, change) {
        if (change === "add")
          this.workouts[id].amount = this.workouts[id].amount + this.plusValue;
        else
          this.workouts[id].amount = this.workouts[id].amount - this.minusValue;
      }
    }
  })
}

$( document ).ready(function() {
  let formData = { "person": $("#sportsmen").val()};
  console.log(formData);
  

  // process the form
  $.ajax({
    type : 'POST',
    url  : 'https://script.google.com/macros/s/AKfycbzdld1IiV4CPKCTHR3YqT8U-H7Kc_hpjdFZRWeJp8B5Zea24yQ/exec',
    data : formData,
    dataType : 'json',
    encode : true
  }).done(function(data){
    setData(data);
    console.log(data);
  }).fail(function (data) {
    // for debug
    //let dataSheet = JSON.parse(data.responseText)
    setData(data);
    console.log(data);
    console.log(data.responseText);
    //console.log(data);
  });


});
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

      this.$emit('event_child', this.id, dataChange)
    },
  },
  
});

let app = new Vue({
  data: {
    workouts: [
      { id:0, type: 'pushUp', imgsrc:'img/pushUp.svg', amount: 0},
      { id:1, type: 'pullUp', imgsrc:'img/pullUp.svg', amount: 0},
      { id:2, type: 'squat', imgsrc:'img/squat.svg', amount: 0}
    ],
    plusValue: 5,
    minusValue: 1,
    uploadDataNeeded: false
  },
  el: '#app',
  created: function () {
    setInterval(function () {
      if (this.uploadDataNeeded == true)
      {
        this.uploadData();
        this.uploadDataNeeded = false;
      }
    }.bind(this), 5000); 
  },
  methods: {
    eventChild: function(id, change) 
    {
      if (change === "add")
        this.workouts[id].amount = this.workouts[id].amount + this.plusValue;
      else
        this.workouts[id].amount = this.workouts[id].amount - this.minusValue;

      this.uploadDataNeeded = true;
    },
    setData: function(jsonData)
    {
      let hashMap = [];
      for (let i = 0; i < this.workouts.length; ++i)
        hashMap[this.workouts.type] = this.workouts[i];
      
      for (let i = 0; i < this.workouts.length; ++i)
      {
        this.workouts[i].amount = jsonData[this.workouts[i].type];
      }
    },
    uploadData: function()
    {
      let formData = { "person": $("#sportsmen").val(), "command" : "WRITE"};
      for (let i = 0; i < this.workouts.length; ++i)
        formData[this.workouts[i].type] = this.workouts[i].amount;

      console.log(formData);

      $.ajax({
        type : 'POST',
        url  : 'https://script.google.com/macros/s/AKfycbzdld1IiV4CPKCTHR3YqT8U-H7Kc_hpjdFZRWeJp8B5Zea24yQ/exec',
        data : formData,
        dataType : 'json',
        encode : true
      });
    }
  }
})

function updateData()
{
  let formData = { "person": $("#sportsmen").val(), "command" : "READ"};
  console.log(formData);
  
  // process the form
  $.ajax({
    type : 'POST',
    url  : 'https://script.google.com/macros/s/AKfycbzdld1IiV4CPKCTHR3YqT8U-H7Kc_hpjdFZRWeJp8B5Zea24yQ/exec',
    data : formData,
    dataType : 'json',
    encode : true
  }).done(function(data){
    app.setData(data);
    console.log(data);
  }).fail(function (data) {
    app.setData(data);
    console.log("PROBLEM:");
    console.log(data);
    console.log(data.responseText);
  });
}

$("#sportsmen").change(function()
{
  window.localStorage.setItem("person", $("#sportsmen").val());
  updateData();
});

$( document ).ready(function() {
  if (window.localStorage.getItem("person") != null)
  {
    $("#sportsmen").val(window.localStorage.getItem("person"));
  }

  updateData();
});
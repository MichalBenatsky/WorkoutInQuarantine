Vue.component('workoutcounter', {
  props: ['id', 'type', 'imgsrc', 'amount', 'bestsportsmen', 'bestamount'],
  template: ` <div class="counter" v-on:click="click">
                <h2>{{ type }}</h2>
                <h3>{{ amount }}</h3>
                <div class="stack">
                  <img class="stackUp" v-bind:src="imgsrc"  >
                </div>
                <h4>Best {{bestsportsmen}}:{{bestamount}}</h4>
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
      { id:0, type: 'pushUp', imgsrc:'img/pushUp.svg', amount: 0, bestSportsmen: "", bestAmount: 0},
      { id:1, type: 'pullUp', imgsrc:'img/pullUp.svg', amount: 0, bestSportsmen: "", bestAmount: 0},
      { id:2, type: 'squat', imgsrc:'img/squat.svg', amount: 0, bestSportsmen: "", bestAmount: 0}
    ],
    plusValue: 5,
    minusValue: 1,
    uploadDataNeeded: false,
    dataReady: false,
    state: {},
    currentPerson: ""
  },
  el: '#app',
  created: function () { 
    setInterval(function () {
      if (this.uploadDataNeeded == true)
      {
        this.uploadData();
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
    findBest: function(type)
    {
      let returnData = {name: "zatim nikdo", amount: 0};
      for (let person in this.state) 
      {
        if (this.state[person][type] > returnData.amount)
        {
          returnData.name = person;
          returnData.amount = this.state[person][type];
        }
      }
      return returnData;
    },
    updateVisibleData: function(jsonData)
    {
      if (this.dataReady)
      {
        let workoutData = this.state[this.currentPerson];

        let hashMap = [];
        for (let i = 0; i < this.workouts.length; ++i)
          hashMap[this.workouts.type] = this.workouts[i];
        
        for (let i = 0; i < this.workouts.length; ++i)
        {
          this.workouts[i].amount = workoutData[this.workouts[i].type];
          
          let best = this.findBest(this.workouts[i].type);
          this.workouts[i].bestSportsmen = best.name;
          this.workouts[i].bestAmount = best.amount;
        }
      }
    },
    setPerson: function(person){
      this.currentPerson = person;
      if (this.dataReady)
        this.updateVisibleData();
    },
    setData: function(jsonData)
    {
      if(!this.uploadDataNeeded)
      {
        this.state = jsonData;
        this.dataReady = true;
        this.updateVisibleData();
      }
    },
    uploadData: function()
    {
      let formData = { "person": $("#sportsmen").val(), "command" : "WRITE"};
      for (let i = 0; i < this.workouts.length; ++i)
        formData[this.workouts[i].type] = this.workouts[i].amount;

      $.ajax({
        context: this,
        type : 'POST',
        url  : 'https://script.google.com/macros/s/AKfycbzdld1IiV4CPKCTHR3YqT8U-H7Kc_hpjdFZRWeJp8B5Zea24yQ/exec',
        data : formData,
        dataType : 'json',
        encode : true
      }).always(function()
      {
        this.uploadDataNeeded = false;
        updateData();
      });
    }
  }
})

function updateData()
{
  let formData = { "person": $("#sportsmen").val(), "command" : "READ", "protocol": 2};
  
  // process the form
  $.ajax({
    type : 'POST',
    url  : 'https://script.google.com/macros/s/AKfycbzdld1IiV4CPKCTHR3YqT8U-H7Kc_hpjdFZRWeJp8B5Zea24yQ/exec',
    data : formData,
    dataType : 'json',
    encode : true
  }).done(function(data){
    app.setData(data);
  }).fail(function(data){
  });
}

$("#sportsmen").change(function()
{
  window.localStorage.setItem("person", $("#sportsmen").val());
  app.currentPerson = $("#sportsmen").val();
  app.updateVisibleData();
});

$( document ).ready(function() {
  if (window.localStorage.getItem("person") != null)
  {
    $("#sportsmen").val(window.localStorage.getItem("person"));
  }
  app.setPerson($("#sportsmen").val());

  let focused = true;
  window.onfocus = function() {
      updateData(); 
      focused = true;
  };
  window.onblur = function() {
      focused = false;
  };

  function callUpdate()
  {
    if (focused)
      updateData();

    setTimeout(callUpdate, 20000);
  }
  callUpdate();
});
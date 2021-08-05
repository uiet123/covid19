const express = require("express");
const https = require("https");
const body = require("body-parser");
const alert = require('alert');
const app = express();

app.use(body.urlencoded({ extended: true }));
app.use(express.static('public'))
app.set('view engine', 'ejs');


app.get("/", function (req, res) {
  const url = "https://api.covid19api.com/summary";
  https.get(url, function (response) {

    let virus = '';

    response.on("data", function (data) {
      virus += data;
    });

    response.on("end", function () {
      var corona = JSON.parse(virus);

      for (var i = 1; i < 191; i++) {
        if ("India" == corona.Countries[i].Country) {
          var country = corona.Countries[i].Country;
          var newconfirmed = corona.Countries[i].NewConfirmed;
          var confirmed = corona.Countries[i].TotalConfirmed;
          var recovered = corona.Countries[i].TotalRecovered;
          var newrecovered = corona.Countries[i].NewRecovered;
          var deaths = corona.Countries[i].TotalDeaths;
          var newdeaths = corona.Countries[i].NewDeaths;
        }
      }
      var updatetime = corona.Date;
      var time = updatetime.slice(0, 10);
      res.render('index', {
        countries: country,
        NEWCONFIRMED: newconfirmed,
        TOTALRECOVERED: recovered,
        TOTALCONFIRMED: confirmed,
        NEWRECOVERED: newrecovered,
        TOTALDEATHS: deaths,
        NEWDEATHS: newdeaths,
        Time: time
      })

    });
  });
})


// get request for states-wise data
var states = []
var confirmedcases = []
var lastupdatedtime
var recoveredcases = []
var death = []
var activecases = []


app.get("/list", function (req, res) {
  const url = "https://api.covid19india.org/data.json";
  https.get(url, function (response) {

    let virus = '';

    response.on("data", function (data) {
      virus += data;
    });

    response.on("end", function () {

      var corona = JSON.parse(virus);
      time = corona.statewise[0].lastupdatedtime;
      for (var i = 1; i < corona.statewise.length; i++) {
        state = corona.statewise[i].state;
        confirmed = corona.statewise[i].confirmed;
        active = corona.statewise[i].active;
        recovered = corona.statewise[i].recovered;
        deaths = corona.statewise[i].deaths;

        states.push(state)
        confirmedcases.push(confirmed)
        recoveredcases.push(recovered)
        death.push(deaths)
        activecases.push(active)
      }
      res.render('list', {
        states: states,
        cases: confirmedcases,
        recovered: recoveredcases,
        deaths: death,
        active: activecases
      })

    });
  });
});


// post request for state-wise data
app.post("/state", function (req, res) {
  city = req.body.search;
  const url = "https://api.covid19india.org/data.json";
  https.get(url, function (response) {

    let virus = '';

    response.on("data", function (data) {
      virus += data;
    });

    response.on("end", function () {

      var corona = JSON.parse(virus);
      for (i = 1; i < corona.statewise.length; i++) {
        if (corona.statewise[i].state == city || corona.statewise[i].state.toLowerCase() == city || corona.statewise[i].state.toUpperCase() == city) {
          state = corona.statewise[i].state;
          confirmed = corona.statewise[i].confirmed;
          active = corona.statewise[i].active;
          recovered = corona.statewise[i].recovered;
          deaths = corona.statewise[i].deaths;
        }
      }
      if (city == state || city == state.toLowerCase() || city == state.toUpperCase()) {
        res.render('state', {
          state: state,
          confirmed: confirmed,
          recovered: recovered,
          deaths: deaths,
          active: active
        })
      }
      else {
          alert('Enter correct spelling.')
      res.redirect("/list");
      }
    })
  })
});

// get request for world data
var countries = []
var NEWCONFIRMED = [];
var TOTALCONFIRMED = [];
var NEWDEATHS = [];
var TOTALDEATHS = [];
var NEWRECOVERED = [];
var TOTALRECOVERED = [];

app.get("/global", function (req, res) {

  const url = "https://api.covid19api.com/summary";
  https.get(url, function (response) {

    let virus = '';

    response.on("data", function (data) {
      virus += data;
    });

    response.on("end", function () {

      var corona = JSON.parse(virus);
      var date = corona.Global.Date;
      var str = date.slice(0,10);
      var str1 = str[8]+str[9]+"/"+str[5]+str[6]+"/"+str[0]+str[1]+str[2]+str[3] 
      
      for (var i = 0; i < 191; i++) {
        country = corona.Countries[i].Country;
        newconfirmed = corona.Countries[i].NewConfirmed;
        confirmed = corona.Countries[i].TotalConfirmed;
        recovered = corona.Countries[i].TotalRecovered;
        newrecovered = corona.Countries[i].NewRecovered;
        deaths = corona.Countries[i].TotalDeaths;
        newdeaths = corona.Countries[i].NewDeaths;

        countries.push(country)
        NEWCONFIRMED.push(newconfirmed);
        TOTALCONFIRMED.push(confirmed);
        TOTALRECOVERED.push(recovered);
        NEWRECOVERED.push(newrecovered);
        TOTALDEATHS.push(deaths);
        NEWDEATHS.push(newdeaths);
      }
      res.render('global', {
        date:str1,
        countries: countries,
        NEWCONFIRMED: NEWCONFIRMED,
        TOTALRECOVERED: TOTALRECOVERED,
        TOTALCONFIRMED: TOTALCONFIRMED,
        NEWRECOVERED: NEWRECOVERED,
        TOTALDEATHS: TOTALDEATHS,
        NEWDEATHS: NEWDEATHS,
      })

    });
  });
})


// post request for world data
app.post("/country", function (req, res) {
  c = req.body.country
  const url = "https://api.covid19api.com/summary";
  https.get(url, function (response) {

    let virus = '';

    response.on("data", function (data) {
      virus += data;
    });

    response.on("end", function () {

      var corona = JSON.parse(virus);

      for (var i = 0; i < 191; i++) {
        if (c == corona.Countries[i].Country || c == corona.Countries[i].Country.toLowerCase() || c == corona.Countries[i].Country.toUpperCase()) {
          country = corona.Countries[i].Country;
          newconfirmed = corona.Countries[i].NewConfirmed;
          confirmed = corona.Countries[i].TotalConfirmed;
          recovered = corona.Countries[i].TotalRecovered;
          newrecovered = corona.Countries[i].NewRecovered;
          deaths = corona.Countries[i].TotalDeaths;
          newdeaths = corona.Countries[i].NewDeaths;
        }
      }
      if (c == country || c == country.toLowerCase() || c == country.toUpperCase()) {
        res.render('country', {
          countries: country,
          NEWCONFIRMED: newconfirmed,
          TOTALRECOVERED: recovered,
          TOTALCONFIRMED: confirmed,
          NEWRECOVERED: newrecovered,
          TOTALDEATHS: deaths,
          NEWDEATHS: newdeaths,
        })
      }
      else {
          alert('Oops Spelling mistake ,Enter correct spelling.')
      res.redirect("/global");
      }
     

    });
  });
})
app.get("/vaccination", function(req, res) {
  res.render('vaccination')

})
app.get("/about", function(req,res){
  res.render('about');
})
app.get("/vaccine", function(req, res){
  res.render("vaccine");
})

var names = [];
var vaccinees = [];
var capacitys = [];
var dose1capacitys = [];
var dose2capacitys = [];
var names45 = [];
var vaccinees45 = [];
var capacitys45 = [];
var dose1capacitys45 = [];
var dose2capacitys45 = [];
app.post("/vaccines", function(req, res){
  pincode = req.body.pincode;

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); 
var yyyy = today.getFullYear();

today = dd + '/' + mm + '/' + yyyy;
const url = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode="+ pincode +"&date="+ today +";"
https.get(url, function(response){
  response.on("data", function(data){
    var vaccine = JSON.parse(data);
    if(vaccine.error == "Invalid Pincode"){
      alert("Invalid Pincode");
      res.redirect("/vaccine")
    }
    else{
    if(vaccine.sessions[0] == undefined){
      alert("No data available for this pincode");
      res.redirect("/vaccine");
    }
    else{
      var district = vaccine.sessions[0].district_name;
    var state = vaccine.sessions[0].state_name;
    names.length = 0;
    names45.length = 0;
 vaccinees.length = 0;
 capacitys.length = 0;
 dose1capacitys.length = 0;
 dose2capacitys.length = 0;
 names45.length = 0;
 vaccinees45.length = 0;
 capacitys45.length = 0;
 dose1capacitys45.length = 0;
 dose2capacitys45.length = 0;
    for(var i = 0;i< vaccine.sessions.length; i++)
    {
      var date = vaccine.sessions[i].date;
      if(vaccine.sessions[i].min_age_limit == "18"){
        var name = vaccine.sessions[i].address;
        var vaccinee = vaccine.sessions[i].vaccine;
        var capacity = vaccine.sessions[i].available_capacity;
        var dose1capacity = vaccine.sessions[i].available_capacity_dose1;
        var dose2capacity = vaccine.sessions[i].available_capacity_dose2;
        names.push(name);
        vaccinees.push(vaccinee);
        capacitys.push(capacity);
        dose1capacitys.push(dose1capacity);
        dose2capacitys.push(dose2capacity);
      }
      else{
        var name = vaccine.sessions[i].address;
        var vaccinee = vaccine.sessions[i].vaccine;
        var capacity = vaccine.sessions[i].available_capacity;
        var dose1capacity = vaccine.sessions[i].available_capacity_dose1;
        var dose2capacity = vaccine.sessions[i].available_capacity_dose2;
        names45.push(name);
        vaccinees45.push(vaccinee);
        capacitys45.push(capacity);
        dose1capacitys45.push(dose1capacity);
        dose2capacitys45.push(dose2capacity);
      }
    }
  
  res.render('vaccines', {
    date:date,
    district:district,
    state:state,
    names:names,
    vaccinees:vaccinees,
    capacitys:capacitys,
    dose1capacitys:dose1capacitys,
    dose2capacitys:dose2capacitys,
    names45:names45,
    vaccinees45:vaccinees45,
    capacitys45:capacitys45,
    dose1capacitys45:dose1capacitys45,
    dose2capacitys45:dose2capacitys45

  })
}
    }
})
})
})

app.listen(3000, function () {
  console.log("working");
})
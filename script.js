"use strict";

const APIkey="37e4759a7315eb8510902336494aa503";

const dayEl = document.querySelector(".def_day");
const dateEl = document.querySelector(".def_date");
const btnEl = document.querySelector(".btn_search");
const inputEl = document.querySelector(".input");

const iconsContainer=document.querySelector(".icons");
const dayInfo=document.querySelector(".day_info");
const listContentEl = document.querySelector(".list_content ul");

const days =[
    "Sunday" ,"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", 
];

//display day
const day=new Date();
const dayName=days[day.getDay()];
dayEl.textContent = dayName;

//display date
let month  =day.toLocaleString("default",{month:"long"});
let date=day.getDate();
let year=day.getFullYear();

console.log();
dateEl.textContent=date+" "+month+" "+year;

// add event
btnEl.addEventListener("click",(e)=>{
    e.preventDefault();
if(inputEl.value !=="")
{
    const Search=inputEl.value;
    inputEl.value="";
    findLocation(Search);
}else{
    console.log("Please enter City ");
}
});

async function findLocation(name)
{
    iconsContainer.innerHTML="";
    dayInfo.innerHTML="";
    listContentEl.innerHTML = "";
    try{
        const API_URL =  `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${APIkey}`;
        const data = await fetch(API_URL);
        const result = await data.json();
        console.log(result);

        if(result.cod !=="404")
        
        {
            //display on image
            const imageContent = displayImageContent(result);

            //diaplay the right side content
            const rightContent = displayRightContent(result);

            //forecast function
            diaplayForeCast(result.coord.lat,result.coord.lon);
            setTimeout(() =>{
                iconsContainer.insertAdjacentHTML("afterbegin",imageContent);   
                iconsContainer.classList.add("fadeIn");
            dayInfo.insertAdjacentHTML("afterbegin",rightContent);  
          },1000);

        }else{
           const message= `<h2 class="wea_temp">${result.cod}</h2>
           <br>
           <h3 class="cloudtxt">${result.message}</h3>`;
           iconsContainer.insertAdjacentHTML("afterbegin",message);
        }
        
     
    }catch(error){}
}

//display image content
function displayImageContent(data)
{
   return ` <img src=" https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" style="height: 10rem ;">
        <h2 class="city">${data.name}</h2>
        <h2 class="wea_temp">${Math.round(data.main.temp-273.15)}°C</h2>
        <br>
        <h3 class="cloudtxt">${data.weather[0].description}</h3>`;
}

//diaplay the right side content
function displayRightContent(result) {
    return ` 
    <div class="content">
    <p class="title">City</p>
    <span class="value">${result.name}</span>
</div>

<div class="content">
    <p class="title">Temprature</p>
    <span class="value">${Math.round(result.main.temp-273.15)}°C</span>
</div>

<div class="content">
    <p class="title">Humidity</p>
    <span class="value">${result.main.humidity
    }%</span>
</div>

<div class="content">
    <p class="title">Wind Speed</p>
    <span class="value">${result.wind.speed} Km/h</span>
</div> `;
}

//display list in right content
async function diaplayForeCast(lat, long){
    const ForeCast_API=`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${APIkey}`;
    const data=await fetch(ForeCast_API);
    const result=await data.json();

    //filter forecast
    const uniqeForecastDays = [];
    const daysForecast = result.list.filter((forecast) => {

        const forecastDate = new Date(forecast.dt_txt).getDate();
        if(!uniqeForecastDays.includes(forecastDate)){
            return uniqeForecastDays.push(forecastDate);
        }
    });
    console.log(daysForecast);

    daysForecast.forEach((content,indx) =>{
        
        if(indx <=3)
        {
            listContentEl.insertAdjacentHTML("afterbegin",forecast(content));
        }
    });
}



function forecast(frcontent){

    const day=new Date(frcontent.dt_txt);
    const dayName=days[day.getDay()];
    const splitday=dayName.split("",3);
    const joinDay=splitday.join("");

    return `<li>
    <img src=" https://openweathermap.org/img/wn/${frcontent.weather[0].icon}@2x.png" >
    <span>${joinDay}</span>
    <span class="day_temp">${Math.round(frcontent.main.temp-273.15)}°C</span>
</li>`;
}



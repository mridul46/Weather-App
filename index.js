const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer =document.querySelector(".weather-container");

const grantAccessContainer= document.querySelector(".grant-location-container");
const searchForm= document.querySelector("[data-searchForm]");
const loadingScreen= document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");

const apiErrorImg  = document.querySelector("[data-notfoundimg]")
const apiErrorMessage = document.querySelector("[data-apierrortext]")
const apiErrorContainer = document.querySelector(".api-error-container")
const messageText = document.querySelector("[data-messageText]");

//initially variable required
let currentTab=userTab;
const API_KEY= "759587ab0cb929ae0576c95c25fea9b9";
currentTab.classList.add("current-tab");

//ek kaam onpending hein??
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab != currentTab){
    currentTab.classList.remove("current-tab");
     currentTab=clickedTab;
    currentTab.classList.add("current-tab");
    if(!searchForm.classList.contains("active")){
        //kya search form wala contaoiner is invisiavle if yes then make is visiable
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
    else{
        //main phele search tab par tha ,ab your weather tab visiable karna hein 
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        getfromSessionStorage();
    }
 }
}
userTab.addEventListener("click", ()=>{
    //pass clicked tab as input parameter
    switchTab(userTab);
});
searchTab.addEventListener("click", ()=>{
    //pass clicked tab as input parameter
    switchTab(searchTab);
});
//check local cordinate nahi mile

function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-cordinates");
    if(!localCoordinates){
        //agar local cordinates nahi mile
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
        const {lat,lon}=coordinates;
     //make grantcontainer invisiable
       grantAccessContainer.classList.remove("active");
     //make loader visiable
          loadingScreen.classList.add("active");
     //API CALL

     try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data= await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
     }
     catch(err){
        loadingScreen.classList.remove("active");
        //hw
        apiErrorContainer.classList.add("active");
        apiErrorImg.style.display = "none";
        apiErrorMessage.innerText = `Error: ${err?.message}`;
     }
}
function renderWeatherInfo(weatherInfo){
        //firstly we have to fetch the elements
        const cityName=document.querySelector("[data-cityName]");
        const countryIcon= document.querySelector("[data-countryIcon]");
        const desc= document.querySelector("[data-weatherDesc]");
        const weatherIcon = document.querySelector("[data-weatherIcon]");
        const temp= document.querySelector("[data-temp]");
        const windspeed= document.querySelector("[data-windspeed]");
        const humidity= document.querySelector("[data-humidity]");
        const cloudiness= document.querySelector("[data-cloudiness]");
        //fetch values from weather Info object and put it UI element
       
  cityName.innerText = weatherInfo?.name;
  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = `${weatherInfo?.main?.temp} °C`;
  windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
  humidity.innerText = `${weatherInfo?.main?.humidity}%`;
  cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}
function getLocation() {
   if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition(showPosition, showError);
   } else {
     grantAccessBtn.style.display = "none";
     messageText.innerText = "Geolocation is not supported by this browser.";
   }
 }
 function showError(err) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            messageText.innerText = "You denied the request for Geolocation.";
            break;
          case err.POSITION_UNAVAILABLE:
            messageText.innerText = "Location information is unavailable.";
            break;
          case err.TIMEOUT:
            messageText.innerText = "The request to get user location timed out.";
            break;
          case err.UNKNOWN_ERROR:
            messageText.innerText = "An unknown error occurred.";
            break;
        }
      }

function showPosition(position){
    const userCoordinates= {
        lat:position.coords.latitude,
        lon:position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
const grantAccessButton=document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput= document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName=searchInput.value;
    if(cityName==="")
    return;
    else
    fetchSearchWeatherInfo(cityName);
})
async function  fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    apiErrorContainer.classList.remove("active")
    try{
        const response=await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const data =await response.json();
        // loadingScreen.classList.remove("active");
        // userInfoContainer.classList.add("active");
        // grantAccessContainer.classList.remove("active");
        // renderWeatherInfo(data);
        if (!data.sys) {
            throw data;
        }
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (err){
        loadingScreen.classList.remove("active");
        apiErrorContainer.classList.add("active");
        apiErrorMessage.innerText = `${err?.message}`;
       

    }
}

const fah = document.querySelector('#fah');
const cel = document.querySelector('#cel');
const currentTemp = document.querySelector('#cTemp');
const loader = document.querySelector('.loading');
const backEffect = document.querySelector('#coverEffect');
const backCover = document.querySelector('#cover');
const currentDay = document.querySelector('#currentDay')
const currentDate = document.querySelector('#currentDate')
const currentStatus = document.querySelector('#status')
const currentImg = document.querySelector('#currentImg')
const weekly = document.querySelectorAll('.weekly')
const feelsLike = document.querySelector('#feelsLike')
let fahrenheit = true

const fahrenheitToCelsius = function(temp){
 return Math.ceil((temp -32) * 5/9)
}

const setCurrentDate = function(date){
  const newDate =  new Date(date * 1000)
  currentDay.textContent =  newDate.toLocaleString(window.navigator.language, {weekday:"long"});
  currentDate.textContent =  newDate.toLocaleString(window.navigator.language,{dateStyle:"medium"});
}

const convertDate = function(date){
  const newDate =  new Date(date * 1000)
  return newDate.toLocaleString(window.navigator.language, {weekday:"short"});
}

async function  getWeather (lat,lon){
  const response  = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely&appid=c9ffc90b08bdf6e248201aab264a9ab8`)
  const weatherData = await response.json()
  .finally(()=>{
    loader.style.display = 'none'
    backEffect.remove()
    backCover.remove()
  })
  return weatherData
}

const fetchWeather = function(){
getWeather(30.5335,-92.0815).then(data=>{
  console.log(data);
  const setDay = function(){
    for(let i = 1;i<weekly.length+1;i++){
    const date = data.daily[i].dt
    document.querySelector(`.weekly:nth-child(${i}) h2`).textContent = convertDate(date)
    document.querySelector(`.weekly:nth-child(${i}) img `).src = `http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png`
    const minTemp = Math.ceil(data.daily[i].temp.min)
    const maxTemp = Math.ceil(data.daily[i].temp.max)
    fahrenheit ? 
    document.querySelector(`.weekly:nth-child(${i}) h3`).textContent = `${maxTemp} / ${minTemp}°F`
    :
    document.querySelector(`.weekly:nth-child(${i}) h3`).textContent = `${fahrenheitToCelsius(maxTemp)
      .toFixed(0)} / ${fahrenheitToCelsius(minTemp)
      .toFixed(0)
      .padStart(2,'0')}°C`
    }
  }
  //Setting the current Weather Condition
  const currentStat = data.current.weather[0];

  setCurrentDate(data.current.dt)

  feelsLike.textContent = `Feels Like: ${Math.ceil(data.current.feels_like)}°F`
  currentStatus.textContent = currentStat.main
  currentImg.src = `http://openweathermap.org/img/wn/${currentStat.icon}@2x.png`

  currentTemp.textContent =  Math.ceil(data.current.temp);

  fah.addEventListener('click',()=>{
    currentTemp.textContent =  Math.ceil(data.current.temp);
    fah.classList.add('active')-
    cel.classList.remove('active')
    currentTemp.style.marginLeft = '0rem'
    feelsLike.textContent = `Feels Like: ${Math.ceil(data.current.feels_like)}°F`
    fahrenheit = true
    setDay()
  })

  cel.addEventListener('click',()=>{
    currentTemp.textContent =  fahrenheitToCelsius(data.current.temp).toFixed(0);
    cel.classList.add('active')
    fah.classList.remove('active')
    if(currentTemp.textContent.length<2)currentTemp.style.marginLeft = '2.535rem'
    feelsLike.textContent = `Feels Like: ${fahrenheitToCelsius(Math.ceil(data.current.feels_like))}°C`
    fahrenheit = false
    setDay()
  })
  fahrenheitToCelsius(data.current.temp);
  setDay()
})
}

fetchWeather()

// setInterval(()=>{
//   fetchWeather()
// },600000)
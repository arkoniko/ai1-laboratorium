class WeatherApp {
    constructor() {
      this.apiKey = "7ded80d91f2b280ec979100cc8bbba94";
      this.currentWeatherLink = "https://api.openweathermap.org/data/2.5/weather?q={query}&appid=" + this.apiKey;
      this.forecastLink = "https://api.openweathermap.org/data/2.5/forecast?q={query}&appid=" + this.apiKey;
  
      this.locationInput = document.getElementById("locationInput");
      this.checkButton = document.getElementById("checkButton");
      this.resultsBlock = document.getElementById("weather-results-container");
  
      //Bindowanie metod do obiektu
      this.getCurrentWeather = this.getCurrentWeather.bind(this);
      this.getForecast = this.getForecast.bind(this);
      this.drawWeather = this.drawWeather.bind(this);
      this.createWeatherBlock = this.createWeatherBlock.bind(this);
  
      this.checkButton.addEventListener("click", () => {
        const query = this.locationInput.value;
        this.getCurrentWeather(query);
        this.getForecast(query);
      });
    }
  
    getCurrentWeather(query) {
      let url = this.currentWeatherLink.replace("{query}", query);
      let req = new XMLHttpRequest();
      req.open("GET", url, true);
      req.addEventListener("load", () => {
        this.currentWeather = JSON.parse(req.responseText);
        this.drawWeather();
      });
      req.send();
      console.log("wyslano zadanie current za pomoca XMLHttpRequest");
    }
  
    getForecast(query) {
      let url = this.forecastLink.replace("{query}", query);
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          this.forecast = data.list;
          this.drawWeather();
        });
        console.log("wyslano zadanie forecast za pomoca Fetch");
    }
  
    drawWeather() {
        this.resultsBlock.innerHTML = '';
      
        if (this.currentWeather) {
          const date = new Date(this.currentWeather.dt * 1000);
          const dateTimeString = `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`;
          const temperature = (this.currentWeather.main.temp - 273.15).toFixed(2); // Convert Kelvin to Celsius
          const feelsLikeTemperature = (this.currentWeather.main.feels_like - 273.15).toFixed(2); // Convert Kelvin to Celsius
          const iconName = this.currentWeather.weather[0].icon;
          const description = this.currentWeather.weather[0].description;
          const weatherBlock = this.createWeatherBlock(dateTimeString, temperature, feelsLikeTemperature, iconName, description);
      
          this.resultsBlock.appendChild(weatherBlock);
        }
      
        if (this.forecast && this.forecast.length > 0) {
          for (let i = 0; i < this.forecast.length; i++) {
                let weather = this.forecast[i];
                const date = new Date(weather.dt * 1000);
                const dateTimeString = `${date.toLocaleDateString("pl-PL")} ${date.toLocaleTimeString("pl-PL")}`;
                const temperature = (weather.main.temp - 273.15).toFixed(2); // Convert Kelvin to Celsius
                const feelsLikeTemperature = (weather.main.feels_like - 273.15).toFixed(2); // Convert Kelvin to Celsius
                const iconName = weather.weather[0].icon;
                const description = weather.weather[0].description;
                const weatherBlock = this.createWeatherBlock(dateTimeString, temperature, feelsLikeTemperature, iconName, description);
                this.resultsBlock.appendChild(weatherBlock);
            }
        }
    }      
  
    createWeatherBlock(dateString, temperature, feelsLikeTemperature, iconName, description) {
      let weatherBlock = document.createElement("div");
      weatherBlock.className = "weather-block gradient-border";
  
      let dateBlock = document.createElement("div");
      dateBlock.className = "weather-date";
      dateBlock.innerText = dateString;
      weatherBlock.appendChild(dateBlock);
  
      let temperatureBlock = document.createElement("div");
      temperatureBlock.className = "weather-temperature";
      temperatureBlock.innerHTML = `${temperature} &deg;C`;
      weatherBlock.appendChild(temperatureBlock);
  
      let feelsLikeBlock = document.createElement("div");
      feelsLikeBlock.className = "weather-temperature-feels-like";
      feelsLikeBlock.innerHTML = `odczuwalna: ${feelsLikeTemperature} &deg;C`;
      weatherBlock.appendChild(feelsLikeBlock);
  
      let weatherIcon = document.createElement("img");
      weatherIcon.className = "weather-icon";
      weatherIcon.src = `https://openweathermap.org/img/w/${iconName}.png`;
      weatherBlock.appendChild(weatherIcon);
  
      let weatherDescription = document.createElement("div");
      weatherDescription.className = "weather-description";
      weatherDescription.innerText = description;
      weatherBlock.appendChild(weatherDescription);
  
      return weatherBlock;
    }
  }
  
  // Inicjalizacja aplikacji
  const weatherApp = new WeatherApp();
  
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../WeatherApp.css';

const WeatherApp = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [isCitySelected, setIsCitySelected] = useState(false);
  const [temperatureUnit, setTemperatureUnit] = useState('');

  const API_KEY = '238cfcb5e20c42abb1b91911230506';

  useEffect(() => {
    if (isCitySelected) {
      fetchWeatherData();
    }
  }, [isCitySelected]);

  const fetchWeatherData = () => {
    axios
      .get(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=4`
      )
      .then((response) => {
        setWeatherData(response.data);
        setError(null);
      })
      .catch((error) => {
        setWeatherData(null);
        setError('Error fetching weather data. Please try again.');
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsCitySelected(true);
  };

  const toggleTemperatureUnit = () => {
    setTemperatureUnit((prev) =>
      prev === 'Celsius' ? 'Fahrenheit' : 'Celsius'
    );
  };

  const convertTemperature = (temp) => {
    if (temperatureUnit === 'Celsius') {
      return `${temp}°C`;
    } else {
      const fahrenheit = (temp * 9) / 5 + 32;
      return `${fahrenheit}°F`;
    }
  };
  //alt+0176
  return (
    <div className="weather-app">
      {!isCitySelected ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            autoFocus
          />
          <button type="submit">Get Weather</button>
        </form>
      ) : (
        <>
          {error && <p className="error">{error}</p>}
          {weatherData && (
            <div className="weather-box">
              <h2>Current Weather in {weatherData.location.name}</h2>
              <div className="weather-info">
                <img
                  src={weatherData.current.condition.icon}
                  alt={weatherData.current.condition.text}
                  className="weather-icon"
                />
                <div className="weather-details">
                  <p>
                    Temperature:{' '}
                    {convertTemperature(weatherData.current.temp_c)}
                  </p>
                  <p>Humidity: {weatherData.current.humidity}%</p>
                  <p>Condition: {weatherData.current.condition.text}</p>
                </div>
                <div className="toggle-container">
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={temperatureUnit === 'Fahrenheit'}
                      onChange={toggleTemperatureUnit}
                    />
                    <span className="slider round"></span>
                  </label>
                  <p className="toggle-label">
                    {temperatureUnit === 'Celsius' ? 'C' : 'F'}
                  </p>
                </div>
              </div>
              <div className="forecast">
                <h3>4-Day Forecast</h3>
                <div className="forecast-list">
                  {weatherData.forecast.forecastday.map((day) => {
                    console.log('day', day);
                    return (
                      <>
                        <div className="forecast-item">
                          <p>Date: {day.date}</p>
                          <p>
                            Max Temp: {convertTemperature(day.day.maxtemp_c)}
                          </p>
                          <p>
                            Min Temp: {convertTemperature(day.day.mintemp_c)}
                          </p>
                          <img
                            src={day.day.condition.icon}
                            className="forecast-icon"
                          />
                        </div>
                      </>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default WeatherApp;

import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import WeatherCard from "./components/WeatherCard";

function App() {
  const [coords, setCoords] = useState(); // Aquí se guardan las Coordenadas latitud y longitud
  const [weather, setWeather] = useState(); //
  const [temp, setTemp] = useState(); // Guardamos los grados °C y °F
  const [isLoading, setisLoading] = useState(true);

  const success = (position) => {
    //console.log(position)
    const obj = {
      lat: position.coords.latitude, // Lalitud
      lon: position.coords.longitude, // Longitud
    };
    setCoords(obj); // Guardamos el 'obj' en el estado.
  };

  useEffect(() => {
    setisLoading(true);
    navigator.geolocation.getCurrentPosition(success); // Esta es la API de los navegadores, nos permite acceder a nuestra ubicacion o la ubicacion de quien ha ingresado a nuestra web, una vez que llega la informacion, nos da la ubicacion a travéz del parametro de la funcion Callback (position)
  }, []);

  useEffect(() => {
    // Este useEffect se ejecuta en el 1r render y cada vez que cambia 'coords'.

    if (coords) {
      //Como yo necesito que en el primer renderizado no se ejecute el codigo, hago uso de el IF, para que se ejecute el codigo solo cuando le llegue informacion a coords, ya que en el primer render siempre será undefined 😐

      const APIKEY = "c9784e67a478bea2bf558317127607b7"; //API KEY DE WEATHER APP

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${APIKEY}`;

      axios
        .get(url)
        .then((res) => {
          const celsius = (res.data.main.temp - 273.15).toFixed(1); // el metodo toFixed() nos permite asignar cuantos decimales queremos mostrar.
          const fahrenheit = ((celsius * 9) / 5 + 32).toFixed(1);
          setTemp({ celsius, fahrenheit });
          setWeather(res.data);
        })
        .catch((err) => console.log(err))
        // axios.get(url) es una peticion async y recibe como parametro una url, para darle manejo  JS lo hace por medio de 2 metodos .then y .catch, estos reciben como parametro funciones callbacks.

        .finally(() => setisLoading(false));
    }
  }, [coords]); // ésta es la forma de manejar una peticion que depende de otras peticiones.

  console.log(weather);

  return (
    <div className="app">
      {isLoading ? (
        <span className="app__loader"></span>
      ) : (
        <WeatherCard weather={weather} temp={temp} />
      )}
    </div>
  );
}

export default App;

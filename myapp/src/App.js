
import { useEffect, useState } from 'react';
import { Forecast, Inputs, TemperatureAndDetail, TimeAndLocation, TopButton } from "./components";
import getFormattedWeatherData from './services/weatherService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

function App() {
  const [query, setQuery] = useState({ q: "Seoul" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const message = query.q ? query.q : "current location.";

      toast.info("Fetching weather for " + message);
      await getFormattedWeatherData({ ...query, ...units })
        .then((data) => {
          toast.success(
            `Successfully fetched weather for ${data.name}, ${data.country}.`
          );
          setWeather(data);
        })
    }

    fetchData()
  }, [query, units])

  console.log(weather)

  const formatBackground = () => {
    if (!weather) return "from-cyan-700 to-blue-700";
    const threshold = units === "metric" ? 20 : 60;
    if (weather.temp <= threshold) return "from-cyan-700 to-blue-700";

    return "from-yellow-700 to-orange-700";
  };



  return (
    <div className={`mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-br ${formatBackground()} h-fit shadow-xl shadow-gray-400 `}>
      <TopButton setQuery={setQuery} />
      <Inputs setQuery={setQuery} units={units} setUnits={setUnits} />

      {weather && (
        <>
          <TimeAndLocation weather={weather} />
          <TemperatureAndDetail weather={weather} />

          <Forecast title="Hourly forecast" items={weather.hourly} />
          <Forecast title="Daily forecast" items={weather.daily} />
        </>
      )}
      <ToastContainer autoClose={1000} theme="colored" newestOnTop={true} />
    </div>
  );
}

export default App;

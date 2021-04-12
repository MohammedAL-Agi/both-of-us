import React, { useState, useEffect } from 'react';
import './App.css';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { BoxLoading } from 'react-loadingg';
function App() {
  const [chartData, setChartData] = useState({});
  const [allCountries, setAllCountries] = useState([]);
  const [allIndicators, setAllIndicators] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedIndicator, setSelectedIndicator] = useState('');
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  const handelIndicatorChange = (event) => {
    setSelectedIndicator(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let chosenIndicator = selectedIndicator;
    let chosenCountry = selectedCountry;
    let filteredData = allData.filter(
      (object) =>
        object.country === chosenCountry && object.indicator === chosenIndicator
    );
    let date = filteredData.map((object) => object.date);
    let value = filteredData.map((object) => object.value);
    //NOTICE: THERE ARE SOME OBJECTS DON'T CONTAIN A VALUE OR DATE OR BOTH, AS A RESULT, SOME OF THE DATE WILL APPEAR AS UNDEFINED IN Weekly new ICU admissions per 100k  INDICATOR
    setChartData({
      labels: date,
      datasets: [
        {
          backgroundColor: ['#D9A700'],
          hoverBackgroundColor: ['#333'],
          data: value,
        },
      ],
    });
  };

  const MyChart = async () => {
    let response = await axios.get('/hospital').catch((error) => {
      console.log(error);
      console.error(error);
    });
    setIsLoading(false);

    setAllData(response.data);

    // We get the data from the object & store it separately
    let countries = response.data.map((object) => object.country);
    let indicators = response.data.map((object) => object.indicator);
    let date = response.data.map((object) => object.date);
    let value = response.data.map((object) => object.value);

    // we use the Set to remove all the duplicates
    let uniqueCountries = [...new Set(countries)];
    setAllCountries(uniqueCountries);
    let uniqueIndicators = [...new Set(indicators)];

    // Filter the the sentences that we want
    let filteredIndicators = uniqueIndicators.filter(
      (indicator) => indicator !== 'Weekly new hospital admissions per 100k'
    );
    // filter all the objects that don't have a value or date
    let filteredDate = date.filter((item) => item !== undefined);
    let filteredValues = value.filter((val) => val !== undefined);
    setAllIndicators(filteredIndicators);

    setChartData({
      labels: filteredDate,
      datasets: [
        {
          backgroundColor: '#D9A700',
          hoverBackgroundColor: '#333',
          data: filteredValues,
        },
      ],
    });
  };

  useEffect(() => {
    MyChart();
  }, []);
  if (isLoading) {
    return (
      <>
        <div>
          <BoxLoading size='large' color='#D9A700' />
        </div>
      </>
    );
  }

  return (
    <>
      <nav className='navbar navbar-dark bg-custom'>
        <div>
          <a className='navbar-brand m-5' href='#'>
            Both of us
          </a>
        </div>
      </nav>
      <div className='wrapper'>
        <form onSubmit={handleSubmit}>
          <div>
            <h4>Choose a country</h4>
            <select
              required
              onChange={handleCountryChange}
              value={selectedCountry}
              className=' form-select '
            >
              <option value='' disabled>
                Select a country
              </option>
              {allCountries.map((country, index) => {
                return (
                  <option key={index} value={country}>
                    {country}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <h4>Choose an Indicator </h4>
            <select
              required
              className='form-select'
              onChange={handelIndicatorChange}
              value={selectedIndicator}
            >
              <option value='' disabled>
                Select an indicator
              </option>
              {allIndicators.map((indicator, index) => {
                return (
                  <option key={index} value={indicator}>
                    {indicator}
                  </option>
                );
              })}
            </select>
          </div>
          <button
            className='mt-2 mb-2 btn btn-warning btn-rounded'
            type='submit'
          >
            filter
          </button>
        </form>
        <div className='myChart'>
          <Line
            data={chartData}
            options={{
              plugins: {
                legend: false,
                tooltip: true,
              },
              elements: {
                line: {
                  fill: true,
                  borderColor: '#ffc70d',
                },
                point: {
                  backgroundColor: '#D9A700',
                  hoverBackgroundColor: '#fff',
                  radius: 7,
                  pointStyle: 'react',
                  hoverRadius: 10,
                },
              },
              scales: {
                xAxes: [
                  {
                    gridLines: {
                      display: false,
                    },
                    ticks: {
                      autoSkip: true,
                      maxTicksLimit: 20,
                    },
                  },
                ],
                yAxes: [
                  {
                    ticks: {
                      maxTicksLimit: 30,
                      autoSkip: true,
                      beginAtZero: true,
                    },
                  },
                ],
              },
            }}
          />
        </div>
      </div>
      <footer className='bg-custom-2 text-center text-lg-start'>
        <div className='container p-4'>
          <div className='row'>
            <div className='col-lg-6 mb-md-0'>
              <h5 className='text-uppercase'>Both of us</h5>
              <p>
                If you have a social impact project you would like to
                collaborate on, get in touch! We can chat over a cup of coffee.
                <br />
                3C – communication, compassion & competency. Fall in love with
                different culture & apreciate people.
              </p>
            </div>
          </div>
        </div>

        <div
          className='text-center text-dark p-3'
          style={{ backgroundColor: '#C3E6F1' }}
        >
          © 2021 Copyright:
          <a
            // className='text-dark'
            href='https://www.linkedin.com/in/mohammed-alagi/'
          >
            Mohammed-Alagi
          </a>
        </div>
      </footer>
    </>
  );
}
export default App;

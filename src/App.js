import React, { useEffect, useState } from 'react';
import { MenuItem, FormControl, Select, Card, CardContent } from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import './App.css';
import { sortData, prettyPrintStat } from './util';
import LineGraph from './LineGraph';
import 'leaflet/dist/leaflet.css';
import numeral from 'numeral';
import Footer from './Footer';
import 'animate.css';


// State = how to write variable in React Js
// UseEffect = hooks in react that runs a piece of code based on a given condition.        
// endpoint -> https://disease.sh/v3/covid-19/countries
// async -> send a request, wait for it and do something with it
// [] on useEffect -> means the code inside useEffect will only run once when the component load

function App() {
  const [country, setInputCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState('cases');


  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }));

          let sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };

    getCountriesData();
  }, []);


  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === 'worldwide'
        ? 'https://disease.sh/v3/covid-19/all'
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    //pull information from https://disease.sh/v3/covid-19/all for worldwide or https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data); //pulling all of the data from the country response
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(3);
      });
  };
  console.log('Country info >>> ', countryInfo);


  return (
    <div>
      <div className="app">
        <div className='app__left'>
          {/* Header and Title + Select input dropdown field */}
          <div className="app__header">
            <h1 className='text-color display-5 animate__animated animate__rotateInDownLeft'><span className='font-style'>COVID-19 </span>TRACKER </h1>
            <FormControl className="app__dropdown">
              <Select className='fw-bold'
                variant="outlined"
                onChange={onCountryChange}
                value={country}>

                <MenuItem value="worldwide" >Worldwide</MenuItem>
                {countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className='infoBox'>
            <h3 className='mb-3 fw-bold text-secondary'>HOW MANY CASES TODAY ?</h3>
            <div className="app__stats">
              <InfoBox
                isRed
                onClick={(e) => setCasesType("cases")}
                title="Corona Virus Cases"
                active={casesType === "cases"}
                cases={countryInfo.todayCases}
                total={prettyPrintStat(countryInfo.cases)} />

              <InfoBox
                isGreen
                onClick={(e) => setCasesType("recovered")}
                title="Recovered"
                active={casesType === "recovered"}
                cases={countryInfo.todayRecovered}
                total={prettyPrintStat(countryInfo.recovered)} />

              <InfoBox
                isOrange
                onClick={(e) => setCasesType("deaths")}
                title="Deaths"
                active={casesType === "deaths"}
                cases={countryInfo.todayDeaths}
                total={prettyPrintStat(countryInfo.deaths)} />
            </div>
          </div>

          {/* Map */}
          <Map
            casesType={casesType}
            countries={mapCountries}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>

        <Card className='app__right'>
          <CardContent>
            {/* Table */}
            <h3 className='text-secondary'>Cases by Country :</h3>
            <Table countries={tableData} />


            {/* Graph */}
            <h3 className='app__graphTitle text-secondary text-capitalize'>Worldwide New {casesType}</h3>
            <LineGraph className='app__graph' casesType={casesType} />

          </CardContent>
        </Card>

      </div>
      <Footer />
    </div>
  );
}

export default App;

import { BrowserRouter as Router, Route} from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Snackbar } from '@material-ui/core';
import Mainview from './components/Mainview';
import Favorites from './components/Favorites';
import Info from './components/Info';
import Viewimage from './components/Viewimage';
import Menu from './components/Menu';

function App() {

  const [rawCameraData, setRawCameraData] = useState({});
  const [stationList, setStationList] = useState();
  const [latestInput, setLatestInput] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const snackMessage = useRef();

  const loadFavorites = () => {
    if (localStorage.getItem("favorites")) {
      setFavorites(JSON.parse(localStorage.getItem("favorites")));
    } else {
      setFavorites([]);
    }
  }

  const saveFavorites = () => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  useEffect( () => {
    loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect( () => {
    saveFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favorites]);

  const loadStationDataFromApi = async () => {
    setLoaded(false);

    let headersObj = { headers: { "Digitraffic-User": "chata002Xamk", "User-Agent": "RWC/1.0" } };
    let cameraData;
    let weatherStations;
    let combinedList = [];

    try {
      let conn = await fetch("https://tie.digitraffic.fi/api/v1/data/camera-data", headersObj);
      cameraData = await conn.json();

      let conn2 = await fetch("https://tie.digitraffic.fi/api/v3/metadata/weather-stations", headersObj);
      weatherStations = await conn2.json();

      setRawCameraData(cameraData);

      cameraData.cameraStations.forEach( (cameraData) => {
        weatherStations.features.forEach( (stationData) => {
            if (cameraData.nearestWeatherStationId === stationData.id) {

                let newListItem = { stationId : stationData.id, 
                                    stationName : stationData.properties.names.fi,
                                    cameraId : cameraData.id }

                if (!newListItem.stationName) {
                    newListItem.stationName = stationData.properties.name;
                }

                combinedList = [...combinedList, newListItem];
                
            }
        });
      });

      setLoaded(true);

    } catch (exception) {

      console.log(`Error fetching resources: ${exception}`);

    }
    
    setStationList(combinedList);
  }

  const addFavorite = (stationToAdd) => {

    let newFavArray = [...favorites];

    let currentStation = stationList.filter( (station) => {
      return station.stationId === Number(stationToAdd);
    });

    let duplicates = newFavArray.filter( (entry) => {
      return entry.stationId === Number(stationToAdd);
    });

    if (duplicates.length === 0) {
      newFavArray.push(currentStation[0]);
      setFavorites(newFavArray);

      if (!snackOpen) {
        snackMessage.current = "Favorite added";
        setSnackOpen(true);
      } 
    } else if (duplicates.length > 0) {
      if (!snackOpen) {
        snackMessage.current = "Already in favorites";
        setSnackOpen(true);
      } 
    }
  }

  const deleteFavorite = (stationId) => {

    if (stationId === 1) {
      setFavorites([]);

    } else {
      let newFavArray = favorites.filter( (fav) => {
        return fav.stationId !== stationId;
      });

      setFavorites(newFavArray);

      if (!snackOpen) {
        snackMessage.current = "Favorite removed";
        setSnackOpen(true);
      } 
    }
  }

  const handleSnackClose = () => {
    setSnackOpen(false);
  }

  return (
    <Router>

      <Menu></Menu>

      <Route path="/rwc/search" >
        <Mainview stationList={stationList}
                  latestInput={latestInput} 
                  setLatestInput={setLatestInput}
                  loadStationDataFromApi={loadStationDataFromApi}
                  favorites={favorites}
                  deleteFavorite={deleteFavorite}
                  addFavorite={addFavorite}
                  cameraData={rawCameraData}
                  loaded={loaded}
        ></Mainview>
      </Route>

      <Route path="/rwc/favorites">
        <Favorites stationList={stationList} 
                    loadStationDataFromApi={loadStationDataFromApi}
                    favorites={favorites}
                    cameraData={rawCameraData}
                    deleteFavorite={deleteFavorite}
                    loaded={loaded}
        ></Favorites>
      </Route>

      <Route path="/rwc" exact>
        <Info></Info>
      </Route>

      <Route path="/rwc/viewimage/:stationId/:fromView/">
        <Viewimage cameraData={rawCameraData}
                   latestInput={latestInput} 
                   setLatestInput={setLatestInput}
                   addFavorite={addFavorite}
                   stationList={stationList}
        ></Viewimage>
      </Route>

      <Snackbar open={snackOpen}
                autoHideDuration={Number(2000)}
                onClose={handleSnackClose}
                message={snackMessage.current}
      ></Snackbar>
      
    </Router>
  );
}

export default App;

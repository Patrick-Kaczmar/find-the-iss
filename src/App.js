import React, { useRef, useEffect, useState } from "react"
import mapboxgl from "!mapbox-gl" // eslint-disable-line import/no-webpack-loader-syntax
import distance from "@turf/distance"
mapboxgl.accessToken=process.env.REACT_APP_MAPBOX_TOKEN

function App() {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [barLat, setBarLat] = useState(null)
  const [barLng, setBarLng] = useState(null)
  const [barZoom, setBarZoom] = useState(null)
  const [userLng, setUserLng] = useState(null)
  const [userLat, setUserLat] = useState(null)
  const [issLng, setIssLng] = useState(null)
  const [issLat, setIssLat] = useState(null)
  const [userDistance, setUserDistance] = useState(null)
  const [country, setCountry] = useState(null)
  const [state, setState] = useState(null)
  const [place, setPlace] = useState(null)

  useEffect(() => {
    if (map.current) return // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-100, 40],
      zoom: 3,
      projection: "globe",
    })
  },)

  useEffect(() => {
    if (!map.current) return // wait for map to initialize
    map.current.on("move", () => {
      setBarLng(map.current.getCenter().lng.toFixed(4))
      setBarLat(map.current.getCenter().lat.toFixed(4))
      setBarZoom(map.current.getZoom().toFixed(2))
    })
  })

  useEffect(() => {
    if (!map.current) return // wait for map to initialize
    map.current.on("style.load", () => {
      map.current.setFog({
        range: [0.8, 8],
        color: "#dc9f9f",
        "horizon-blend": 0.5,
        "high-color": "#245bde",
        "space-color": "#000000",
        "star-intensity": 0.35,
      })
    })
  })

  useEffect(() => {
    if (!map.current) return // initialize map only once
    map.current.on("load", async () => {
      // Get the initial location of the International Space Station (ISS).
      const geojson = await getLocation()
      // Add the ISS location as a source.
      map.current.addSource("iss", {
        type: "geojson",
        data: geojson,
      })
      // Add the rocket symbol layer to the map.
      map.current.addLayer({
        id: "iss",
        type: "symbol",
        source: "iss",
        layout: {
          "icon-image": "rocket-15",
        },
      })

      // Update the source from the API every 2 seconds.
      const updateSource = setInterval(async () => {
        const geojson = await getLocation(updateSource)
        map.current.getSource("iss").setData(geojson)
        setIssLat(geojson.features[0].geometry.coordinates[1])
        setIssLng(geojson.features[0].geometry.coordinates[0])
      }, 5000)

      async function getLocation(updateSource) {
        // Make a GET request to the API and return the location of the ISS.
        try {
          const response = await fetch(
            "https://api.wheretheiss.at/v1/satellites/25544",
            { method: "GET" }
          )
          const { latitude, longitude } = await response.json()
          // Return the location of the ISS as GeoJSON.
          return {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [longitude, latitude],
                },
              },
            ],
          }
        } catch (err) {
          // If the updateSource interval is defined, clear the interval to stop updating the source.
          if (updateSource) clearInterval(updateSource)
          throw new Error(err)
        }
      }
    })
  })

  useEffect(() => {
    if (!map.current) return // wait for map to initialize
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true,
      })
    )
  }, [])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setUserLat(position.coords.latitude)
      setUserLng(position.coords.longitude)
    })
  }, [])

  useEffect(() => {
    console.log(`The distance from your location is ${Math.round(distance([userLat, userLng], [issLat, issLng], "miles"))} miles`)
  }, [issLat, issLng, userLat, userLng])

  function findTheIss() {
    map.current.flyTo({
      center: [issLng, issLat],
      zoom: 5,
      speed: 0.5
    })
    updateDistance()
    locationFinder()
  }

  function locationFinder() {
    fetch(`https://api.openweathermap.org/geo/1.0/reverse?lat=${issLat}&lon=${issLng}&appid=${process.env.REACT_APP_OPEN_WEATHER_KEY}`)
    .then(response => response.json())
    .then((data) => {
      console.log(data[0].country)
      setCountry(data[0].country)
      setState(data[0].state)
      setPlace(data[0].name)
    })
  }

  function updateDistance() {
    setUserDistance(Math.round(distance([userLat, userLng], [issLat, issLng]))) 
  }

  return (
    <>
      <div>
        <div className="sidebar">
          Longitude: {barLng} | Latitude: {barLat} | Zoom: {barZoom}
        </div>
        <div ref={mapContainer} className="map-container"></div>
      </div>
      <button onClick={findTheIss} className="issBtn">Find the ISS</button>
      <div className="issInfo">
        <div className="distance">
          <h1 id="distanceHeader">The I.S.S is {userDistance} miles from your location</h1>
        </div>
        <div className="info-card">
          <h1>Country:</h1>
          <h2 className="card-description">{country}</h2>
        </div>
        <div className="info-card">
          <h1>State:</h1>
          <h2 className="card-description">{state}</h2>
        </div>
        <div className="info-card">
          <h1>Place:</h1>
          <h2 className="card-description">{place}</h2>
        </div>
      </div>
    </>
  )
}

export default App

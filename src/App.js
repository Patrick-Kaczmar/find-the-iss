import React, { useRef, useEffect, useState } from "react"
import mapboxgl from "!mapbox-gl" // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken =
  "pk.eyJ1Ijoiemh5bG93IiwiYSI6ImNsNXJrZzBpeDFhYmkzY292bGNjZnppcDIifQ.qbE1BTCATVEh2s6D-uaicg"

function App() {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [lng, setLng] = useState(-70.9)
  const [lat, setLat] = useState(42.35)
  const [zoom, setZoom] = useState(3)

  useEffect(() => {
    if (map.current) return // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      // center: [lng, lat],
      zoom: zoom,
      projection: "globe",
    })
  })

  useEffect(() => {
    if (!map.current) return // wait for map to initialize
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4))
      setLat(map.current.getCenter().lat.toFixed(4))
      setZoom(map.current.getZoom().toFixed(2))
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
          // This icon is a part of the Mapbox Streets style.
          // To view all images available in a Mapbox style, open
          // the style in Mapbox Studio and click the "Images" tab.
          // To add a new image to the style at runtime see
          // https://docs.mapbox.com/mapbox-gl-js/example/add-image/
          "icon-image": "rocket-15",
        },
      })

      // Update the source from the API every 2 seconds.
      const updateSource = setInterval(async () => {
        const geojson = await getLocation(updateSource)
        map.current.getSource("iss").setData(geojson)
      }, 5000)

      async function getLocation(updateSource) {
        // Make a GET request to the API and return the location of the ISS.
        try {
          const response = await fetch(
            "https://api.wheretheiss.at/v1/satellites/25544",
            { method: "GET" }
          )
          const { latitude, longitude } = await response.json()
          // Fly the map to the location.
          map.current.flyTo({
            center: [longitude, latitude],
            speed: 0.5,
          })
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

  return (
    <>
      <div>
        <div className="sidebar">
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
        <div ref={mapContainer} className="map-container" />
      </div>
    </>
  )
}

export default App

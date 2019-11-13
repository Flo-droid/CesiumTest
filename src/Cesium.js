import React, { useState, useEffect, useRef } from 'react'
import { Viewer, Entity, Globe, PolylineGraphics } from 'resium'
import { Cartesian3, Color } from 'cesium'
import axios from 'axios'
import TLEJS from 'tle.js';

const tlejs = new TLEJS();

const pointGraphics = { pixelSize: 10 };

const dummyCredit = document.createElement("div")

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {savedCallback.current = callback;}, [callback]);

  // Set up the interval.
  useEffect(() => {function tick() {savedCallback.current();}
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

const Cesium = () => {

  const [latISS, setLatISS] = useState(0)
  const [longISS, setLongISS] = useState(0)
  const [altiISS, setAltiISS] = useState(0)
  const positionISS = Cartesian3.fromDegrees(longISS, latISS, altiISS)
  

  const [orbit, setOrbit] = useState({
    "@id": "https://data.ivanstanojevic.me/api/tle/25544",
    "@type": "TleModel",
    "satelliteId": 25544,
    "name": "ISS (ZARYA)",
    "date": "2019-11-12T14:57:06+00:00",
    "line1": "1 25544U 98067A   19316.62299738  .00004810  00000-0  92183-4 0  9996",
    "line2": "2 25544  51.6451 345.3171 0006141 272.0902 233.9416 15.50005371198285"
})

  useEffect(async () => {
    await axios.get('https://data.ivanstanojevic.me/api/tle/25544')
    .then(res => setOrbit(res.data))
  }, [])


  useInterval(() => {
    axios.get('https://api.wheretheiss.at/v1/satellites/25544')
      .then(res => {
        setLatISS(res.data.latitude); setLongISS(res.data.longitude); setAltiISS(res.data.altitude)
      })
      .catch(err => console.log(err))
  }, 1000);

    let tleArr = [orbit.line1, orbit.line2];
    let track = tlejs.getGroundTrackLngLat(tleArr);
    let positions = track[1].map(arr => Cartesian3.fromDegrees(arr[0], arr[1]));

    return (
    <>
      <Viewer className='test' vrButton={false} timeline={false} animation={false} creditContainer={'Boop'}>
      <Globe enableLighting /> 
        <Entity position={positionISS} point={pointGraphics} name="ISS (Zarya)">
          <PolylineGraphics positions={positions} material={Color.RED}/>
        </Entity>
      </Viewer>
      <div id='Boop'></div>
    </>
  )
}

export default Cesium
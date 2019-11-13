import React, { useState, useEffect, useRef } from 'react'
import { Viewer, Entity, Globe, Polyline, PolylineCollection } from 'resium'
import { Cartesian3 } from 'cesium'
import axios from 'axios'

const pointGraphics = { pixelSize: 10 };

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
  const [orbitAPI, setOrbitAPI] = useState([])
  const [orbitISS, setOrbitISS] = useState([])
  const positionISS = Cartesian3.fromDegrees(longISS, latISS, altiISS)
  
  const [trigger, setTrigger] = useState(false)
  let totalTest = [0,0]
  let testing = Cartesian3.fromDegreesArray(totalTest)
  let init = Cartesian3.fromDegreesArray([0,0])
  
  useInterval(() => {
    axios.get('https://api.wheretheiss.at/v1/satellites/25544')
      .then(res => {
        setLatISS(res.data.latitude); setLongISS(res.data.longitude); setAltiISS(res.data.altitude)
      })
      .catch(err => console.log(err))
  }, 1000);

  useInterval(() => {
      axios.get('https://www.n2yo.com/rest/v1/satellite/positions/25544/0/0/0/2600/&apiKey=4HWX82-7AYZSW-Y84HPN-484B')
        .then(res => {
          setOrbitAPI(res.data.positions)
        })
            // .catch(err => console.log(err))
    },5000)
  
    useEffect(() => {
      totalTest = []

      orbitAPI.map(x => {

        return totalTest.push(x.satlatitude, x.satlongitude)})

        setTrigger(true)

        console.log(testing)

    }, [orbitAPI]) 

  return (
    <Viewer className='test'>
      <Globe enableLighting /> 
      <Entity
        name="ISS (Zarya)"
        position={positionISS}
        point={pointGraphics}
        description={`${latISS} ${longISS} `} />
      <PolylineCollection>
        <Polyline positions={trigger ? testing : init} width={2} />
      </PolylineCollection> 
    </Viewer>
  )
}

export default Cesium
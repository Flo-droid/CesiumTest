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
  const [orbitISS, setOrbitISS] = useState(0,0)
  const positionISS = Cartesian3.fromDegrees(longISS, latISS, altiISS)

  const testing = Cartesian3.fromDegreesArray([30,10, 55,10, 55,-6])
  

  useInterval(() => {
    axios.get('https://api.wheretheiss.at/v1/satellites/25544')
      .then(res => {
        setLatISS(res.data.latitude); setLongISS(res.data.longitude); setAltiISS(res.data.altitude)
      })
      .catch(err => console.log(err))
  }, 1000);

  useInterval(() => {
      axios.get('https://www.n2yo.com/rest/v1/satellite/positions/25544/0/0/0/3600/&apiKey=4HWX82-7AYZSW-Y84HPN-484B')
        .then(res => {
          setOrbitAPI(res.data.positions)
          console.log(res.data.positions)
        })
            // .catch(err => console.log(err))
    },5000)
  
    // useEffect(() => {
    //   setOrbitISS([])

    //   // orbitAPI.map(x => {
    //   //   setOrbitISS([...orbitISS, x.satlongitude, x.satlatitude, x.altitude])
    //   // })
    //   setOrbitISS(orbitAPI.map(x => { 
        
    //    return  [...orbitISS, x.satlongitude, x.satlatitude]}))
    //    console.log(orbitISS)
    // }, [orbitAPI])

    // console.log(orbitISS)
  
    // useEffect(() => {
    //   setOrbitISS([...orbitISS, orbitAPI.map(e => {  `new Cartesian3(${e.longitude}, ${e.latitude}, ${e.altitude})`
    //   })])
    // }, [orbitAPI]) 

  return (
    <Viewer className='test'>
      <Globe enableLighting /> 
      <Entity
        name="ISS (Zarya)"
        position={positionISS}
        point={pointGraphics}
        description={`${latISS} ${longISS} `} />
      <PolylineCollection>
        <Polyline positions={testing} width={2} />
      </PolylineCollection> 
    </Viewer>
  )
}

export default Cesium
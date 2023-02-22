import React, {useEffect, useState} from 'react';
import axios from "axios";
import HttpRequestHelper, {API} from "../helpers/HttpRequestHelper";
import {Container} from "reactstrap";

const MapImage = ({rid, mapName}) => {
  const [image, setImage] = useState();

  useEffect(() => {
    let cancelToken = axios.CancelToken.source();
    let image = new window.Image();
    HttpRequestHelper.instance(rid, cancelToken.token).get(API.map_png, {
      params: {mapName: mapName},
      responseType: 'blob'
    }).then(result => {
      setImage(URL.createObjectURL(result.data))
    })
    return () => {
      cancelToken.cancel()
      image.removeEventListener('load', () => {
        console.log("removed")
      })
    }
  }, [])

  return (
    <Container fluid>
      <img
        src={image}
        alt={mapName}
        className="img-thumbnail border-0  align-self-center"
      />
    </Container>
  );
};

export default MapImage;

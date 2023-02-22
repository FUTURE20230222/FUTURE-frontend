import React, {useEffect, useState} from 'react';
import axios from "axios";
import HttpRequestHelper, {API} from "../helpers/HttpRequestHelper";
import {Container} from "reactstrap";
import {Arrow, Circle} from "react-konva";

const Point = ({point, mapInfo}) => {

  return (
    <>
      <Circle radius={4} x={point.gridX} y={mapInfo.gridHeight - point.gridY}
              fill={"black"}/>
      <Arrow
        points={[point.gridX, mapInfo.gridHeight - point.gridY, point.gridX + 12 * Math.cos(point.angle / 180 * Math.PI), mapInfo.gridHeight - point.gridY + 12 * Math.sin(point.angle / 180 * Math.PI)]}
        pointerLength={6}
        pointerWidth={4}
        fill='green'
      />
    </>
  );
};

export default Point;

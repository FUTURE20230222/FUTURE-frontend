// import {store} from "../redux/store";
import {v4 as uuidv4} from 'uuid';

import axios from "axios";

export const API = {
  "maps": "/gs-robot/data/maps",
  "map_png": "/gs-robot/data/map_png",
  "position": "/gs-robot/real_time_data/position",
  "device_status": "/gs-robot/data/device_status",
  "laser_phit": "/gs-robot/real_time_data/laser_phit",
  "initialize_customized_directly": "/gs-robot/cmd/initialize_customized_directly",
  "positions": "/gs-robot/data/positions",
  "graph_paths": "/gs-robot/data/graph_paths",
  "aobo_getMap": "/aobo-robot/getMap",
  "aobo_getPosition": "/aobo-robot/getPosition",
  "aobo_getLaserScan": "/aobo-robot/getLaserScan",
}

export default class HttpRequestHelper {

  static domain = false ? "http://10.7.5.136:80/" : 'http://172.18.1.254:18080'

  static instance = (rid, cancelToken) => axios.create({
    baseURL: this.domain,
    headers: {
      rid: rid,
      uid: uuidv4(),
      // 'Access-Control-Allow-Origin': '*',
      // 'Access-Control-Allow-Methods': '*',
      // "Access-Control-Allow-Headers": "Content-Type",
      // "Content-Type": "application/x-www-form-urlencoded"
    },
    cancelToken: cancelToken
  });

  static updateDb = async (body) => {
    return await axios.post(this.domain + "db/update", body)
  }

  static getDb = async () => {
    return await axios.post(this.domain + "db/get", {
      "conditions": {"name": "admin"},
      "collection": "users"
    })
  }

  static getRobotsDb = async () => {
    return await axios.post(this.domain + "db/get", {
      "conditions": {},
      "collection": "robots"
    })
  }

  // static post = async (rid, api, data) => {
  //   let response = await this.instance(rid).post(api, data)
  //   apiResponseHelper(response.data, api)
  //
  // }
  //
  // static get = async (rid, api, params) => {
  //   let response = await this.instance(rid).get(api, {
  //     params: params
  //   })
  //   console.log(api, response.data)
  //   apiResponseHelper(response.data, api)
  // }

  static getBlob = async (rid, api, params) => {
    let response = await this.instance(rid).get(api, {
      params: params,
      responseType: 'blob'
    })

    // store.dispatch({
    //   robot: rid,
    //   data: response.data,
    //   type: 'UPDATE_MAP_BLOB'
    // })

  }

  static apiEmit = (robot, request, params, request_body) => {
    // this.client.emit('api-request', {
    //     robot: robot,
    //     request: request,
    //     params: params,
    //     request_body: request_body,
    //     id: this.client.id
    // })
    // store.dispatch({
    //     agv: {"channel": "C1", isActive: true, color: stringToColor("C1"), selected: true},
    //     type: 'PUSH_AGV'
    // })
  }

}


export function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

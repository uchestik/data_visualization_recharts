import React, { Component } from 'react';
import meterData from './dataFile'
import _ from 'lodash'
import {LineChart,XAxis,YAxis,Line,CartesianGrid,Legend} from 'recharts'

class App extends Component {
  state={
    data:meterData,
    meterList:[],
  }
  componentDidMount(){
    this.getTableData(meterData)
  }

  getTableData = (data) =>{
    if(data){
      let meterList = _.chain(data)
                        .uniqBy('Meter_ID')
                        .map((datum)=>{
                          return datum && datum.Meter_ID;
                        })
                        .value()
      let dateList = _.chain(data)
                        .uniqBy('Date')
                        .map((datum)=>{
                          return  datum && datum.Date
                        })
                        .orderBy('asc')
                        .value()
      let typeList = _.chain(data)
                        .uniqBy('Type')
                        .map((datum)=>{
                          return datum && datum.Type;
                        })
                        .value()

      this.setState({
        meterList,
        dateList,
        typeList,
        visualizedMeter:meterList[0],
        visualizedDate:dateList[0]
      })
    }
    return null
  }

  renderHeader = ({dateList}) => {
    if(dateList){
      return(
        <select onClick={(e)=>this.setState({visualizedDate:e.target.value})}>
          {
            dateList.map((date,index)=>{
              return (
                <option key={index} value={date} >
                  {date}
                </option>
              )
            })
          }
        </select>
      )
    }
    return null;
  }

  renderMeterTable = ({meterList}) =>{
    if(meterList){
      return(
        <table>
          <tbody>
          <tr>
            <th>Meter ID</th>
          </tr>
          {
            meterList.map((value,index)=>{
              return (
                <tr key={index} style={{cursor:'pointer'}}>
                  <td onClick={()=>this.setState({visualizedMeter:value})}>{value}</td>
                </tr>
              )
            })
          }
          </tbody>
        </table>
      )
    }
    return null;
  }

  renderChart = ({visualizedMeter,visualizedDate,typeList}) => {
    if(visualizedDate && visualizedMeter && typeList && meterData){
      let visualizedList=[];
      let object = {};
      let filteredData = meterData.filter((data)=>{
        return data.Date === visualizedDate && data.Meter_ID === visualizedMeter;
      })
      for(let i=0; i < typeList.length; i++){
        let type = typeList[i];
        object[type]=filteredData.filter((data)=>{
          return data.Type === type;
        })[0]
      }
      for(let k=1; k <= 24; k++){
        let loopObject = {}
        let hour = k;
        loopObject.name=k;
        for(let z = 0;z<typeList.length;z++){
          loopObject[typeList[z]] = object[typeList[z]][hour]
        }
        visualizedList.push(loopObject)
      }
      return (
        <div>
          {this.renderChartVisuals(visualizedList)}
        </div>
      )
    }
    return null;
  }

  renderChartVisuals = (data) => {
    if(data){
      return (
        <LineChart width={730} height={250} data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Legend />
          <Line type="monotone" dataKey="BaseLoad" stroke="purple" />
          <Line type="monotone" dataKey="TSL" stroke="#FF0000" />
          <Line type="monotone" dataKey="WSL" stroke="#00FF00" />
        </LineChart>
      )
    }
    return null;
  }

  render() {
    return (
      <div>
        <div>
          {this.renderHeader(this.state)}
        </div>
        <div style={{display:'flex',justifyContent:'space-between'}}>
          <div style={{margin:'0 auto'}}>{this.renderMeterTable(this.state)}</div>
          <div style={{margin:'0 auto'}}>{this.renderChart(this.state)}</div>
        </div>
      </div>
    )
  }
}

export default App;

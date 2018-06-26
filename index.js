const express = require('express')
const request = require('request')
const app = express()

let addressList = require('./adresses/addressList')

if(addressList){
    addressList.map((address,index)=>{
        return new Promise((resolve,reject)=>{
            request(`https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDtVbli-DqEY984NnMwLOyl2zh0ZaQZBRQ&address=${address}`, function (error, response, body) {
                if(error){
                    reject(error)
                }
                resolve(body)
            })
        }).then((body)=>{
            let resBody = JSON.parse(body);
            if(resBody){
                let lat = resBody.results[0].geometry.location.lat;
                let lng = resBody.results[0].geometry.location.lng;
                console.log(address,lat,lng)
            }
        })
        .catch((errors)=>{
            console.log(errors)
        })
    })
}
console.log('Adress list not found')

app.listen(5000,()=>{
    console.log('App is running on port 5000')
})

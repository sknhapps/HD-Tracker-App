/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 
var pts = [];               // All the GPS points
var distIndex = 1;          // Index for distance calculation
var totalDistance = 0.0;    // Total distance travelled
var currentLat = 0.0;       // Current latitude
var currentLng = 0.0;       // Current longitude
var accuracy = 0.0;         // Current accuracy in miles
var minDistance = 0.05;     // Minimum distance (miles) between collected points.
var isStarted = false;      // Flag tracking the application state.
var map = null;             // The map
var markers = [];           // Container for the map markers
var positionTimer;          // The id of the position timer.

$("#toggle").click(function(evt){
    evt.preventDefault();
    if(!isStarted){
        $(this).html("End Trip").removeClass("green").addClass("red");
        startGps();
        isStarted = true;
    }else{
        $(this).html("Start Trip").removeClass("red").addClass("green");
        stopGps();
        isStarted = false;
    }
});
$("#reset").click(function(evt){
    evt.preventDefault();
    if(confirm("Clear the data?")){
        pts = [];
        distIndex = 1;
        totalDistance = 0.0;
        currentLat = 0;
        currentLng = 0;
        accuracy = 0;
        updateStatus();
        clearMarkers();
    }
})
$("#map").click(function(evt){
    evt.preventDefault();
    showPoints();
})

function updateStatus(){
    $("#count").html(pts.length + " Points");
    $("#location").html("(" + currentLat.toFixed(4) + "," + currentLng.toFixed(4) + ") <br />&plusmn;" + accuracy.toFixed(4) + "miles");
    for(var i=distIndex;i<pts.length;i++){
        totalDistance += distance(
            pts[i-1].coords.latitude,
            pts[i-1].coords.longitude,
            pts[i].coords.latitude,
            pts[i].coords.longitude
        );
    }
    distIndex = pts.length;
    $("#distance").html(totalDistance.toFixed(4) + " miles");
}

function startGps(){
   // Check to see if this browser supports geolocation.
   if (navigator.geolocation) {
 
       positionTimer = navigator.geolocation.watchPosition(
           function( position ){
               if(position.coords.accuracy/609.344>0.5){    // 609.344 meters per mile
                   // First point has low accuracy (cell phone or IP geolocation)
                   // Ignore all low accuracy points.
                   return;
               }
               var dist = distance(currentLat, currentLng, position.coords.latitude, position.coords.longitude);
               if(dist<minDistance){
                   // Ignore points that are within a certain distance to the last point.
                   return;
               }
 
               pts.push(position);
 
               // Track current position
               accuracy = position.coords.accuracy/609.344; // 609.344 meters per mile
               currentLat = position.coords.latitude;
               currentLng = position.coords.longitude;
 
               // Update the status
               updateStatus();
           },
           function( error ){
               console.log( "Something went wrong: ", error );
           },
           {
               timeout: (60 * 1000),
               maximumAge: (1000),
               enableHighAccuracy: true
           }
       );
 
   } else {
       alert("Your browser does not support geo-location.");
   }
}
 
function stopGps(){
   navigator.geolocation.clearWatch(positionTimer);
   positionTimer = null;
}


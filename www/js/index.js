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
// General Variables
var chromePoints = 0;																				// Value of the user's accrued chromePoints
var motorcycleName = "1910 Harley";																	// Motorcycle Name
// Achievement Variables
var fiftycp = false;																				// Achievement for earning 50 ChromePoints

//Rename motorcycle
function nameCycle(){
	motorcycleName = prompt("Name your ride:");
	localStorage.setItem("motorcycleName",JSON.stringify(motorcycleName));
	document.getElementById("motorcycleName").innerHTML = motorcycleName;
}
//Log chromepoints to database
function logCP(){
	var save = {
		chromePoints: chromePoints,
	}
	localStorage.setItem("save",JSON.stringify(save));
};
//Achievement Updates
function updateAchievement(){
	if (chromePoints >= 50) {
		fiftycp = true;
	} else {
		fiftycp = false;
	}
	var achievements = {
		fiftycp: fiftycp,
	}
	localStorage.setItem("achievements",JSON.stringify(achievements));
	if (fiftycp) {
		document.getElementById('trophy').src = "img/Trophies/achfcp.png";
		document.getElementById('trophy').title = "Achievement: 50+ ChromePoints Earned";
	} 
}
//Reset profile
function resetProfile(){
	if (confirm("Would you like to reset your profile?")) {
		localStorage.removeItem("save");
		localStorage.removeItem("achievements");
		localstorage.removeItem("motorcycleName");
		location.reload();
	}
}

// JavaScript Document
// @author: jmacura 2016

// global variables
var dataBlob = null;
var region = "Č";

// setter for global variable
function setRegion(rg) {
	region = rg;
}

// **** Fction for sending info to user ****
function setInfo(text) {
	var infoBlock = document.getElementById("info-block");
	var ls, t;
	ls = document.createElement("P");
	t = document.createTextNode(text);
	ls.appendChild(t);
	while(infoBlock.hasChildNodes()) {
		infoBlock.removeChild(infoBlock.firstChild);
	}
	infoBlock.appendChild(ls);
}

// **** This is just data retrieval fction ****
function retrieveData() {
	setInfo('Probíhá...');
	var url = "http://oris.orientacnisporty.cz/API/";
	var queryUrl = url+"?format=json&method=getEventList&sport=1&rg="+encodeURIComponent(region)+"&callback=?";
	console.log(queryUrl);
	$.ajax({
		dataType: "json",
		url: queryUrl,
		success: function(_data) {
			console.log(_data);
			var results = convertToCSV(_data.Data);
			if (window.Blob) {
				dataBlob = new Blob([results], {type: "text/csv;charset=utf-8"});
			}
			else console.log("Yo browsa no suporr blub");
			setInfo('Hotovo');
		}
	});
	//console.log("done"); --async => is not relevant
}

function saveData() {
	saveAs(dataBlob, "zavody.csv");
}

// **** Converter from JSON 2 CSV ****
function convertToCSV(objArray) {
	var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
	//console.log(array);
	var str = 'Subject, Start date, Start time, End time, Description, Location\r\n';
	for (var i in array) {
		//console.log(array[i]);
		var line = '';
		if (array[i].Discipline.ShortName=="S") {continue;}
		if (array[i].Org1.Abbr) {
			line += array[i].Org1.Abbr;
		}
		else {continue;}
		if (array[i].Org2.Abbr) {
			line += "+" + array[i].Org2.Abbr;
		}
		if (array[i].Date) {
			line += "," + array[i].Date;
		}
		if (array[i].Time) {} //must be obtained from getEvent
		else {
			line += ",";
		}
		if (array[i].End) {} //must be obtained from getEvent
		else {
			line += ",";
		}
		if (array[i].Name != '') {
			line += "," + array[i].Name;
		}
		if (array[i].GPSLat != "0" && array[i].GPSLon != "0") {
			line += "," + array[i].GPSLat + "N " + array[i].GPSLon + "E";
		}
		str += line + '\r\n';
	}
	return str;
}

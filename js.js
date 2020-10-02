function getCalendarHTML(datMonat, datMarker) {
	const datErster = new Date(datMonat.getFullYear(), datMonat.getMonth(), 1, 12);
	const datErsterWochentag = datErster.getDay() > 0 ? datErster.getDay() : 7; // beginnt mit 0 = Sonntag bis 6 = Samstag, Sonntag auf 7 geändert
	const monatsnamenArray = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
	const wochentagShortsArray = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
	const datErsterMonatsname = monatsnamenArray[datErster.getMonth()];
	const datErsterNächsterMonat =
		datErster.getMonth() == 11 ? new Date(datErster.getFullYear() + 1, 0, 1) : new Date(datErster.getFullYear(), datErster.getMonth() + 1, 1);
	const datLetzter = new Date(datErsterNächsterMonat - 24 * 60 * 60 * 1000);
	const datLetzterWochentag = datLetzter.getDay() > 0 ? datLetzter.getDay() : 7;
	const datKalenderStart = new Date(datErster - (datErsterWochentag - 1) * 24 * 60 * 60 * 1000);
	const datKalenderEnde = new Date((7 - datLetzterWochentag) * 24 * 60 * 60 * 1000 + datLetzter.getTime());
	const datMonatLinks = new Date(datErster.getTime() - 24 * 60 * 60 * 1000);
	const datMonatRechts = datErsterNächsterMonat;
	// Bauen der HTML-Ausgabe
	var sHTML = '<div id="kalenderblatt">';
	sHTML +=
		"<div onClick=\"kalenderMonatClick('" +
		getDatStringFromDatum(datMonatLinks) +
		"','" +
		getDatStringFromDatum(datMarker) +
		'\')" id="kalenderblatt_links"><p>&lt;</p></div>';
	sHTML += '<div id="kalenderblatt_monat"><p>' + datErsterMonatsname + " " + datErster.getFullYear() + "</p></div>";
	sHTML +=
		"<div onClick=\"kalenderMonatClick('" +
		getDatStringFromDatum(datMonatRechts) +
		"','" +
		getDatStringFromDatum(datMarker) +
		'\')" id="kalenderblatt_rechts"><p>&gt;</p></div>';
	sHTML += '<div class="kalenderblatt_header" id="kalenderblatt_header_kw">Kw</div>';
	for (i = 1; i < 8; i++) {
		sHTML += '<div class="kalenderblatt_header" id="kalenderblatt_header_' + wochentagShortsArray[i].toLowerCase() + '">' + wochentagShortsArray[i] + "</div>";
	}
	for (dat = datKalenderStart.getTime(); dat < datKalenderEnde.getTime() + 23 * 60 * 60 * 1000; dat += 24 * 60 * 60 * 1000) {
		var datum = new Date(dat);
		var klasseMonth = datum < datErster ? "prev" : datum > datLetzter ? "next" : "akt";
		if (datum.getDay() == 1) {
			// Montag
			sHTML += '<div class="kalenderblatt_cell kw" id="kalenderblatt_kw_' + getKalenderwoche(datum) + '">' + getKalenderwoche(datum) + "</div>";
		}
		sHTML +=
			"<div onclick=\"kalenderClick('" +
			getDatStringFromDatum(datum) +
			'\')" class="kalenderblatt_cell monat_' +
			klasseMonth +
			" " +
			wochentagShortsArray[datum.getDay()].toLowerCase() +
			'" id="kalenderblatt_datum_' +
			getDatStringFromDatum(datum) +
			'">' +
			datum.getDate() +
			"</div>";
	}
	sHTML += "</div>";
	return sHTML;
}

function getDatStringFromDatum(datum) {
	var sVar = "";
	sVar += datum.getFullYear();
	sVar += parseInt(datum.getMonth()) < 9 ? "0" + (datum.getMonth() + 1) : datum.getMonth() + 1;
	sVar += datum.getDate() < 10 ? "0" + datum.getDate() : datum.getDate();
	return sVar;
}

function getDatumFromDatString(datString) {
	datum = new Date(parseInt(datString.substring(0, 4)), parseInt(datString.substring(4, 6)) - 1, parseInt(datString.substring(6, 8)));
	return datum;
}

// Get-Variable beziehen
function getGET() {
	var $_GET = {};
	if (document.location.toString().indexOf("?") !== -1) {
		var query = document.location
			.toString()
			// get the query string
			.replace(/^.*?\?/, "")
			// and remove any existing hash string (thanks, @vrijdenker)
			.replace(/#.*$/, "")
			.split("&");

		for (var i = 0, l = query.length; i < l; i++) {
			var aux = decodeURIComponent(query[i]).split("=");
			$_GET[aux[0]] = aux[1];
		}
	}
	return $_GET;
}

function getKalenderwoche(date) {
	var currentThursday = new Date(date.getTime() + (3 - ((date.getDay() + 6) % 7)) * 86400000);
	var yearOfThursday = currentThursday.getFullYear();
	var firstThursday = new Date(new Date(yearOfThursday, 0, 4).getTime() + (3 - ((new Date(yearOfThursday, 0, 4).getDay() + 6) % 7)) * 86400000);
	var weekNumber = Math.floor(1 + 0.5 + (currentThursday.getTime() - firstThursday.getTime()) / 86400000 / 7);
	return weekNumber;
}

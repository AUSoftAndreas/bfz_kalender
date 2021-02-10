// Hier sagen wir dem Browser nur, dass erm nachdem die Seite vollständig geladen
// wurde, die Funktion main(ohne Argumente) aufrufen soll.
window.onload = function() {
    main();
};

function main() {
    // Grund-Daten
    var strDebug = "";
    var datToday = new Date();
    strDebug += "datToday: " + datToday.toDateString() + "<br/>"; // Ausgabe
    var datTodayGerman = getDateGerman(datToday);
    strDebug += "datTodayGerman: " + datTodayGerman + "<br/>"; // Ausgabe

    // Wochentag
    var weekday = datToday.getDay(); // ergibt den Tag der Woche als Zahl (von 0 = Sonntag bis 6 = Samstag)
    strDebug += "weekday: " + weekday + "<br/>"; // Ausgabe
    var weekdayGerman = getWeekdayGerman(weekday);
    strDebug += "weekdayGerman: " + weekdayGerman + "<br/>";

    // Wir füllen die Informationen in den HTML-Code
    document.getElementById("field1").innerHTML = datTodayGerman;
    document.getElementById("field2").innerHTML = weekdayGerman;

    // Ausgabe in das elDebug
    var elDebug = document.getElementById("debug");
    if (elDebug != null) {
        elDebug.innerHTML = strDebug;
    } else {
        console.log("Debug-Element nicht gefunden.");
    }
}

function getDateGerman(date) {
    day = date.getDate();
    month = date.getMonth();
    month = month + 1; // Warum auch immer ... Javascript speichert Monate 0-basiert, also 0 = Januar, 11 = Dezember, daher hier Korrektur + 1
    year = date.getFullYear();
    // Man beachte: Man könnte hier nachfolgend nach dem if {} benutzen, aber da es sich nur um EINE nachfolgende Anweisung handelt, geht es auch so
    if (String(day).length == 1) day = "0" + day;
    // Nachfolgend alternativ MIT Klammern
    if (String(month).length == 1) {
        month = "0" + month;
    }
    dateGerman = day + "." + month + "." + year;
    return dateGerman;
}

function getWeekdayGerman(weekdayIndex) {
    if (weekdayIndex == 0) {
        return "Sonntag";
    } else if (weekdayIndex == 1) {
        return "Montag";
    } else if (weekdayIndex == 2) {
        return "Dienstag";
    } else if (weekdayIndex == 3) {
        return "Mittwoch";
    } else if (weekdayIndex == 4) {
        return "Donnerstag";
    } else if (weekdayIndex == 5) {
        return "Freitag";
    } else if (weekdayIndex == 6) {
        return "Samstag";
    }
}
window.onload = function() {
    main();
};

function main() {
    let strDebug = "";
    let datToday = new Date();
    strDebug += "datToday: " + datToday.toDateString() + "<br/>"; // Ausgabe
    let datTodayGerman = getDateGerman(datToday);
    strDebug += "datTodayGerman: " + datTodayGerman + "<br/>"; // Ausgabe

    // Wochentag
    let weekday = datToday.getDay(); // ergibt den Tag der Woche als Zahl (von 0 = Sonntag bis 6 = Samstag)
    strDebug += "weekday: " + weekday + "<br/>"; // Ausgabe
    let weekdayGerman = getWeekdayGerman(weekday);
    strDebug += "weekdayGerman: " + weekdayGerman + "<br/>";

    document.getElementById("field1").innerHTML = datTodayGerman;
    document.getElementById("field2").innerHTML = weekdayGerman;

    let htmlTabelle = calendarHTML(datToday);
    document.getElementById("kalenderblatt").innerHTML = htmlTabelle;

    let elDebug = document.getElementById("debug");
    if (elDebug != null) {
        elDebug.innerHTML = strDebug;
    } else {
        console.log("Debug-Element nicht gefunden.");
    }
}

function getCalendarWeek(date) {
    let thursday = getThursday(date);
    let cwYear = thursday.getFullYear();
    let thursdayCw1 = getThursday(new Date(cwYear, 0, 4));
    let cw = Math.floor(
        1.5 + (thursday.getTime() - thursdayCw1.getTime()) / 86400000 / 7
    );
    return cw;
}

function getThursday(date) {
    var thursday = new Date();
    thursday.setTime(date.getTime() + (3 - ((date.getDay() + 6) % 7)) * 86400000);
    return thursday;
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

function getMonthGerman(monthIndex) {
    let arr = [
        "Fehler",
        "Januar",
        "Februar",
        "März",
        "April",
        "Mai",
        "Juni",
        "Juli",
        "August",
        "September",
        "Oktober",
        "November",
        "Dezember",
    ];
    return arr[monthIndex];
}

function getWeekdayGerman(weekdayIndex) {
    let arr = [
        "Sontag",
        "Montag",
        "Dienstag",
        "Mittwoch",
        "Donnerstag",
        "Freitag",
        "Samstag",
        "Sonntag",
    ];
    return arr[weekdayIndex];
}

function getWeekdayShortGerman(weekdayIndex) {
    let arr = ["so", "mo", "di", "mi", "do", "fr", "sa", "so"];
    return arr[weekdayIndex];
}

function calendarHTML(date) {
    // Erster des Monats berechnen
    let firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    // Wochentag des Monatsersten bestimmen
    let firstOfMonthWeekday = firstOfMonth.getDay();
    // Wenn der Monat nicht mit einem Montag startet, müssen wir Tage des Vormonats
    // ebenfalls darstellen
    let offsetStart;
    if (firstOfMonthWeekday == 0) {
        offsetStart = 6;
    } else {
        offsetStart = firstOfMonthWeekday - 1;
    }
    let firstOfCalendar = new Date(firstOfMonth);
    firstOfCalendar.setDate(firstOfCalendar.getDate() - offsetStart);
    // Letzte des Monats ist der 0te des Folgemonats
    let lastOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    // Wenn der Letzte des Monats nicht zufällig ein Sonntag ist, müssen wir auch Tage des nächsten Monats
    // in unserem Kalender darstellen
    let lastOfMonthWeekday = lastOfMonth.getDay();
    let offsetEnd;
    if (lastOfMonthWeekday == 0) {
        offsetEnd = 0;
    } else {
        offsetEnd = 7 - lastOfMonthWeekday;
    }
    // Einfach Tage aufaddieren
    let lastOfCalendar = new Date(lastOfMonth.getFullYear(), lastOfMonth.getMonth(), lastOfMonth.getDate() + offsetEnd);

    // Jetzt beginnt das eigentliche Zeichnen des Kalenders
    let html = "";
    html += calendarHTML_head(firstOfMonth);
    let indexDate = new Date(firstOfCalendar);
    while (indexDate <= lastOfCalendar) {
        html += calendarHTML_cell(indexDate);
        indexDate.setDate(indexDate.getDate() + 1);
    }
    html += calendarHTML_footer();
    return html;
}

function calendarHTML_head(date) {
    // console.log("calendarHTML_head: " + date);
    let nameOfMonth = getMonthGerman(date.getMonth() + 1);
    // console.log("calendarHTML_head: " + nameOfMonth);
    let html =
        `<table>
                    <thead>
                        <tr>
                            <th colspan = "8">` +
        nameOfMonth +
        `</th>
                        </tr>
                        <tr>
                            <th class = "kw" > Kw </th>
                            <th class = "mo" > Mo </th> 
                            <th class = "di" > Di </th> 
                            <th class = "mi" > Mi </th> 
                            <th class = "do" > Do </th> 
                            <th class = "fr" > Fr </th> 
                            <th class = "sa" > Sa </th> 
                            <th class = "so" > So </th> 
                        </tr>
                    </thead> 
                    <tbody>`;
    return html;
}

function calendarHTML_cell(date) {
    let html = "";
    let cssClass = "";
    let weekday = date.getDay();
    if (weekday == 1) {
        // Montag: Neue Zeile beginnen
        html += "<tr>";
        // und Zelle für die Kalenderwoche
        html += '<td class="kw">' + getCalendarWeek(date) + "</td>";
    }
    let weekdayGerman = getWeekdayShortGerman(weekday);
    cssClass += " " + weekdayGerman;
    html += '<td class = "' + cssClass.trim() + '">' + date.getDate() + "</td>";
    if (weekday == 0) {
        html += "</tr>";
    }
    return html;
}

function calendarHTML_footer() {
    html = "</tbody></table>";
    return html;
}
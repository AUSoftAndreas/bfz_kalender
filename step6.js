window.onload = function() {
    main();
};

function main() {
    changeTime(new Date().getTime());
}

function changeTime(timeToday) {
    // Grund-Daten
    let strDebug = "";
    datToday = new Date(timeToday);
    let datTodayGerman = getDateGerman(datToday);

    // Wochentag
    let weekday = datToday.getDay(); // ergibt den Tag der Woche als Zahl (von 0 = Sonntag bis 6 = Samstag)
    let weekdayGerman = getWeekdayGerman(weekday);

    // Wievielte Wochentag dieser Art
    let wievielte = Math.floor((datToday.getDate() - 1) / 7) + 1;
    let wievielteGerman = getWievielteGerman(wievielte);

    // Monat
    let monthGerman = getMonthGerman(datToday.getMonth() + 1);
    // Javascript korrigiert automatisch. Der 0te des Folgemonats ist der letzte diesen Monats
    let lastOfMonth = new Date(datToday.getFullYear(), datToday.getMonth() + 1, 0);
    let days = lastOfMonth.getDate();

    // Feiertage
    let holidayHTML = '';
    let holidayArray = getHolidayArrayHessen(datToday);
    if (holidayArray.includes(datToday.getTime())) {
        holidayHTML = 'Der ' + datTodayGerman + ' ist ein gesetzlicher Feiertag.';
    } else {
        holidayHTML = 'Der ' + datTodayGerman + ' ist kein gesetzlicher Feiertag. ';
    }


    // Wir füllen die Informationen in den HTML-Code
    document.title = 'Kalenderblatt: ' + datTodayGerman;
    document.getElementById("field_datum_d_1").innerHTML = datTodayGerman;
    document.getElementById("field_datum_d_2").innerHTML = datTodayGerman;
    document.getElementById("field_weekday_1").innerHTML = weekdayGerman;
    document.getElementById("field_weekday_2").innerHTML = weekdayGerman;
    document.getElementById("field_howmany_1").innerHTML = wievielteGerman;
    document.getElementById("field_month_1").innerHTML = monthGerman;
    document.getElementById("field_year_1").innerHTML = datToday.getFullYear();
    document.getElementById("field_days_1").innerHTML = days;
    document.getElementById("field_feiertag_1").innerHTML = holidayHTML;

    let htmlTabelle = getCalendarHTML(datToday, holidayArray);
    document.getElementById("kalenderblatt").innerHTML = htmlTabelle;

    // Ausgabe in das elDebug
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

function getWievielteGerman(number) {
    let arr = ["erste", "zweite", "dritte", "vierte", "fünfte"];
    return arr[number - 1];
}

function getCalendarHTML(date, holidayArray) {
    // Erster des Monats berechnen
    let firstOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    let firstOfMonthWeekday = firstOfMonth.getDay();
    // Wenn der Monat nicht mit einem Montag startet, müssen wir Tage des Vormonats
    // ebenfalls darstellen
    let howManyDaysBeforeFirst;
    if (firstOfMonthWeekday == 0) {
        howManyDaysBeforeFirst = 6;
    } else {
        howManyDaysBeforeFirst = firstOfMonthWeekday - 1;
    }
    let firstOfCalendar = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth(), 1 - howManyDaysBeforeFirst);
    let lastOfMonth = new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth() + 1, 0);
    let howManyDaysAfterLast = lastOfMonth.getDay() == 0 ? 0 : 7 - lastOfMonth.getDay();
    let lastOfCalendar = new Date(lastOfMonth.getFullYear(), lastOfMonth.getMonth(), lastOfMonth.getDate() + howManyDaysAfterLast);

    // HTML-Generierung startet
    let html = '';
    html += calendarHTML_head(firstOfMonth);

    for (var x = firstOfCalendar; x <= lastOfCalendar; x = new Date(x.getFullYear(), x.getMonth(), x.getDate() + 1)) {
        html += getDayHTML(x, date, holidayArray);
    }

    html += calendarHTML_footer();
    return html;
}

function calendarHTML_head(date) {
    let nameOfMonth = getMonthGerman(date.getMonth() + 1);
    let lastOfMonthBefore = new Date(date.getFullYear(), date.getMonth(), 0).getTime();
    let firstOfNextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1).getTime();
    let html =
        `<table>
                    <thead>
                        <tr>
                            <th class="selectable" onClick="changeTime(` + lastOfMonthBefore + `)"><</th>
                            <th colspan = "6">` + nameOfMonth + `</th>
                            <th class="selectable" onClick="changeTime(` + firstOfNextMonth + `)">></td>
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

function getDayHTML(date, today, holidayArray) {
    // console.log(date);
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
    if (holidayArray.includes(date.getTime())) {
        cssClass += " feiertag";
    }
    if (date.getMonth() == today.getMonth() && date.getDate() == today.getDate()) {
        cssClass += " heute";
    }
    // Eigentliche HTML-Generation
    html += '<td class = "' + cssClass.trim() + '" onClick="changeTime(' + date.getTime() + ')">' + date.getDate() + "</td>";

    if (weekday == 0) {
        // Sontag: Zeile beenden
        html += "</tr>";
    }
    return html;
}

function getHolidayArrayHessen(date) {
    let year = date.getFullYear();
    let array = [];
    array.push(new Date(year - 1, 11, 25).getTime()); // 1. Weihnachtstag Vorjahr
    array.push(new Date(year - 1, 11, 26).getTime()); // 2. Weihnachtstag Vorjahr
    array.push(new Date(year, 0, 1).getTime()); // Neujahr
    array.push(new Date(year, 4, 1).getTime()); // Tag der Arbeit
    array.push(new Date(year, 9, 3).getTime()); // Tag der Dt. Einheit
    array.push(new Date(year, 11, 25).getTime()); // 1. Weihnachtstag
    array.push(new Date(year, 11, 26).getTime()); // 2. Weihnachtstag
    array.push(new Date(year + 1, 0, 1).getTime()); // Neujahr nächstes Jahr
    let osterSonntag = getEasterSunday(year);
    array.push(osterSonntag.getTime());
    let osterMontag = new Date(year, osterSonntag.getMonth(), osterSonntag.getDate() + 1);
    array.push(osterMontag.getTime());
    let christiHimmelfahrt = new Date(year, osterSonntag.getMonth(), osterSonntag.getDate() + 39);
    array.push(christiHimmelfahrt.getTime());
    let pfingstMontag = new Date(year, osterSonntag.getMonth(), osterSonntag.getDate() + 50);
    array.push(pfingstMontag.getTime());
    let fronLeichnam = new Date(year, osterSonntag.getMonth(), osterSonntag.getDate() + 60);
    array.push(fronLeichnam.getTime());
    return array;
}

function calendarHTML_footer() {
    html = "</tbody></table>";
    return html;
}

function getEasterSunday(Jahr) { // Erstellt von Ralf Pfeifer (www.arstechnica.de)
    // Falls ausserhalb des gültigen Datumsbereichs, kein Ergebnis zurueckgeben
    if ((Jahr < 1970) || (2099 < Jahr)) return null;
    var a = Jahr % 19;
    var d = (19 * a + 24) % 30;
    var Tag = d + (2 * (Jahr % 4) + 4 * (Jahr % 7) + 6 * d + 5) % 7;
    if ((Tag == 35) || ((Tag == 34) && (d == 28) && (a > 10))) { Tag -= 7; }

    var OsterDatum = new Date(Jahr, 2, 22)
    OsterDatum.setTime(OsterDatum.getTime() + 86400000 * Tag)
    return OsterDatum;
}
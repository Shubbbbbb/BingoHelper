function Timer() {
    // creates a reference to a HTML element for appending elements using JS
    const bingoTimer = document.getElementById("timer");

    // gets the current month to calculate the date of the next bingo
    currentMonth = new Date();
    currentMonth = currentMonth.getMonth();

    // gets the current year to calculate the date of the next bingo (NOTE: use `.getFullYear()` instead of `.getYear()` as the latter is depricated)
    currentYear = new Date();
    currentYear = currentYear.getFullYear();

    // gets the date of the next bingo so it can be used in later calculations
    if (currentMonth < 11) {
        nextBingo = new Date(currentYear, currentMonth + 1);
    } else {
        nextBingo = new Date(currentYear + 1, 0);
    }
    
    if (getCookie("endBingo") != "") {
        // uses saved cookies instead of the API to lower requests
        endBingo = getCookie("endBingo")

        // calls `getTimerTime()` after 'endBingo' is set
        getTimerTime()
    } else {
        // fetches bingo data from the Hypixel API to get the time of the end of the current bingo
        fetch(`https://api.hypixel.net/v2/resources/skyblock/bingo`)
            .then((response) => {
                if (!response.ok) {
                throw new Error(`HTTP error, status = ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                // gets the time of the end of the current bingo
                endBingo = data.end;

                setCookie("endBingo", endBingo)
            })
            .then(() => {
                // calls `getTimerTime()` after 'endBingo' is set
                getTimerTime()
            })
    }

    // sets a interval for `getTimerTime()` in order to refresh the timer every second 
    // if live updating is enabled (or timer seconds are shown)
    if (getCookie("liveUpdates") == "true" || liveUpdates == true || getCookie("timerSeconds") == "true" || timerSeconds == true) {
        timerRefresh = setInterval(getTimerTime, 1000);
    }
}

function getTimerTime() {
    // gets the current time in Unix Epoch
    currentTime = new Date().getTime();

    timeRemaining = endBingo - currentTime;
    timeRemaining = Math.floor(timeRemaining / 1000);

    // checks if a bingo is active by checking if the amount of time until the end of this months bingo is positive
    if (timeRemaining >= 0) {
        timerType = "Bingo ends in:"

        setTimer(timeRemaining)
    } else {
        // gets the time of the next bingo in Unix EPOCH and calculates the time until the next bingo in seconds
        timeRemaining = nextBingo.getTime() - currentTime;
        timeRemaining = Math.floor(timeRemaining / 1000);

        timerType = "Bingo starts in:"

        setTimer(timeRemaining)
    }
}    

function setTimer(time) {
    const bingoTimer = document.getElementById("timer");

    // removes all (text) nodes in 'bingoTimer', so that new text can be appended
    while (bingoTimer.hasChildNodes()) {
        bingoTimer.removeChild(bingoTimer.firstChild);
    }

    const timerValues = {}

    // calculates the amount of days, hours and minutes and adds it to a JS object
    timerValues.timerDays = Math.floor(time / 86400);
    timerValues.timerHours = Math.floor((time % 86400) / 3600);
    timerValues.timerMinutes = Math.floor(((time % 86400) % 3600) / 60);
    if (getCookie("timerSeconds") == "true" || timerSeconds == true) {
        timerValues.timerSeconds = Math.floor(((time % 86400) % 3600) % 60)
    }
    

    // adds text to the timer based on the remaining amount of time
    bingoTimer.append(timerType, document.createElement("br"))

    tempInt = 0

    // adds text to bingo timer for all of the items in 'timerValues'
    for (let value in timerValues) {
        if (timerValues[value] > 0) {
            bingoTimer.append(timerValues[value])

            tempStr = String(Object.keys(timerValues)[tempInt])
            tempStr = tempStr.replace("timer", " ")
            tempStr += " "

            bingoTimer.append(tempStr)
        }

        tempInt ++
    }
}

function getCurrentEvents() {
    const eventDisplay = document.getElementById("activeEvents")
    const eventText = document.getElementById("activeEventsText")

    // removes all elements inside `eventDisplay` so they can be added back later in the function
    while (eventDisplay.hasChildNodes()) {
        eventDisplay.removeChild(eventDisplay.firstChild);
    }

    // gets the current time and month
    cTime = new Date()
    month = cTime.getMonth()
    // gets the current time in Unix EPOCH
    unixTime = cTime.getTime()

    SBYear = Math.floor((unixTime - 1560275700000) / 446400000)
    // NOTE: 'SBMonth' goes from 0 to 11 just like `getMonth()`
    SBMonth = Math.floor((unixTime - 1560275700000 - (446400000 * SBYear)) / 37200000)
    // 'SBDay' needs to get + 1 in order to go from 1-31 like `getDay()`, and be consistent with the in-game date
    SBDay = Math.floor((unixTime - 1560275700000 - (446400000 * SBYear) - (37200000 * SBMonth)) / 1200000) + 1
    // 'SBDate' is the # of days since early spring 1st
    SBDate = SBDay + (SBMonth * 31) - 1

    // checks if there is an election
    if (SBMonth >= 6 && SBMonth <= 3) {
        election = document.createElement("img")
        election.setAttribute("src", "../img/election.png")
        eventDisplay.append(election)
    }
    
    // checks if the workshop event is active
    if (SBMonth == 11 || month == 11) {
        workshop = document.createElement("img")
        workshop.setAttribute("src", "../img/workshop.png")
        eventDisplay.append(workshop)
    }

    // checks if there is a dark auction
    if (Number.isInteger(SBDate / 3) == true) {
        darkAuction = document.createElement("img")
        darkAuction.setAttribute("src", "../img/darkAuction.png")
        darkAuction.id = "darkAuctionIcon"
        eventDisplay.append(darkAuction)
    }

    // checks if there is a farming contest
    if (Number.isInteger((SBDate - 1) / 3) == true) {
        farmingContest = document.createElement("img")
        farmingContest.setAttribute("src", "../img/farmingContest.png")
        eventDisplay.append(farmingContest)
    }

    // checks if the spooky fest event is active
    if (SBMonth == 7 && (SBDay >= 29 && SBDay <= 31)) {
        spookyFest = document.createElement("img")
        spookyFest.setAttribute("src", "../img/spookyFest.png")
        eventDisplay.append(spookyFest)
    }

    // checks if the hoppity's hunt event is active
    if (SBMonth == 1 && (SBDay >= 1 && SBDay <= 11)) {
        hoppity = document.createElement("img")
        hoppity.setAttribute("src", "../img/hoppity.png")
        eventDisplay.append(hoppity)
    }

    // checks if the travelling zoo event is active
    if ((SBMonth == 3 || SBMonth == 9) && (SBDay >= 1 && SBDay <= 3)) {
        zoo = document.createElement("img")
        zoo.setAttribute("src", "../img/zoo.png")
        zoo.id = "zooIcon"
        eventDisplay.append(hoppity)
    }

    // makes the "Active Events:" text invisible if there are no events active
    if (eventDisplay.hasChildNodes()) {
        eventText.classList.remove("empty")
    } else {
        eventText.classList.add("empty")
    }
}
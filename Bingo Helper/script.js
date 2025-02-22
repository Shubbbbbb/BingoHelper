isBurgOpen = false

liveUpdates = true
if (getCookie("liveUpdates") == "false") {
    liveUpdating()
} else {
    // had to place this here due to load timing issues
    try {
    currentEventRefresh = setInterval(getCurrentEvents, 60000);
    } catch {}
}
timerSeconds = false
if (getCookie("timerSeconds") == "true") {
    secondsInTimer()
}
showSpecialMayors = true
if (getCookie("specialMayorCalendar") == "false") {
    specialMayorsOnCalendar()
}
showMCCoulours = true
if (getCookie("showMCColours") == "false") {
    mcColours()
}

function burgerMenu() {
    const elements = [document.getElementById("burgerMenuBG"), document.getElementById("burgerIcon"), document.getElementById("borger"), document.getElementById("optionList")]

    elements.forEach(element => element.classList.toggle("active"))
    isBurgOpen = !isBurgOpen
}

function secondsInTimer() {
    const checkmark = document.getElementById("checkmark1")

    checkmark.classList.toggle("active")
    timerSeconds = !timerSeconds
    setCookie("timerSeconds", timerSeconds)

    if (timerSeconds == true) {
        // makes the timer still refresh if live updating is turned off
        if (getCookie("liveUpdates") == "false" || liveUpdates == false) {
            timerRefresh = setInterval(getTimerTime, 1000)
        }
    } else {
        // stops the timer from refreshing if live updating is turned off
        if (getCookie("liveUpdates") == "false" || liveUpdates == false) {
            clearInterval(timerRefresh)
        }
    }
}

function specialMayorsOnCalendar() {
    const checkmark = document.getElementById("checkmark2")

    checkmark.classList.toggle("active")
    showSpecialMayors = !showSpecialMayors
    setCookie("specialMayorCalendar", showSpecialMayors)

    if (showSpecialMayors == true) {
        getCalendar()
    } else {
        try {
            document.querySelectorAll('.derpyIcon').forEach(element => element.remove());
        } catch {}
        try {
            document.querySelectorAll('.jerryIcon').forEach(element => element.remove());
        } catch {}
    }
}

function mcColours() {
    const checkmark = document.getElementById("checkmark3")

    checkmark.classList.toggle("active")
    showMCCoulours = !showMCCoulours
    setCookie("showMCColours", showMCCoulours)

    try {
        if (firstLoad == false) {
            getBingoBoard()
        }
    } catch {}
    try {
        getMayorElectionData()
    } catch {}
}

function liveUpdating() {
    const checkmark = document.getElementById("checkmark4")

    checkmark.classList.toggle("active")
    liveUpdates = !liveUpdates
    setCookie("liveUpdates", liveUpdates)

    if (liveUpdates == true) {
        try {
        timerRefresh = setInterval(getTimerTime, 1000)
        currentEventRefresh = setInterval(getCurrentEvents, 60000);
        } catch {}
        try {
        playerDataRefresh = setInterval(getPlayerData, 60000)
        } catch {}
    } else {
        try {
            clearInterval(timerRefresh)
            clearInterval(currentEventRefresh)
        } catch {}
        try {
            clearInterval(playerDataRefresh)
        } catch {}
    }

    console.log(liveUpdates)
}

function setCookie(cName, cValue) {
    // does some mathy stuff to get the month and year of the next month
    year = new Date().getFullYear
    month = new Date().getMonth
    if (month == 11) {
        month = 0
        year ++
    } else {
        month ++
    }

    // gets the date of the 1st of the next month
    const expDate = new Date(year, month, 1)
    // turns 'expDate' to Coordinated Universal Time (dont ask me why the abbreviation is UTC) and puts it in the cookie syntax (which does NOT include spaces)
    let expires = "expires=" + expDate.toUTCString();

    // adds the name and value of the cookie in the syntax along with the expiration date
    document.cookie = cName + "=" + cValue + ";" + expires + "path=/";;
}
  
function getCookie(cName) {
    // appends "=" to 'cName' and passes it to 'name' so that when it is searched for there are no false positives
    let name = cName + "=";
    // decodes the cookie in order to handle special characters
    let decodedCookie = decodeURIComponent(document.cookie);
    // splits the cookie at ";" into an array in order to parse one cookie at a time (`document.cookie` returns all cookies, cookies are split with ";")
    let cArray = decodedCookie.split(';');
    // runs a for loop for each cookie in 'cArray'
    for(let i = 0; i < cArray.length; i ++) {
        // reads the cookie that is currently being parsed
        let cookie = cArray[i];
        // removes all spaces at the start of the string (required for next step)
        while (cookie.charAt(0) == " ") {
            // removes the first character
            cookie = cookie.substring(1);
        }
        // checks if cName is present at the beginning of the string (by checking if the location of the string is 0 using indexOf)
        if (cookie.indexOf(name) == 0) {
            // returns the value of the cookie using the `substring()` method
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

function removeCookie(cName) {
    // sets the expiration date of cookie 'cName' to a past date in order to remove it
    document.cookie = cName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function decodeCC(input, elementType) {
    const output = document.createElement(elementType)
    // split the input at the "§" symbol, which announces a colour code in Minecraft
    if (getCookie("showMCColours") == "true" || showMCCoulours == true) {
        array = input.split(/\u00A7/)

        for (segment of array) {
            // the colour code is always at the beggining of the segment
            cCode = segment.charAt(0)
            // removes the colour code so it does not appear in the final text
            segment = segment.replace(cCode, "")

            // empty strings in the array are possible due to how the `split()` method works, this works around that
            if (segment != "") {
                // creates a span element with the segments text as the content
                const cSegment = document.createElement("span")
                cSegment.textContent = segment
                // adds a class based on the colour code so it can be decoded in CSS
                cSegment.classList.add(`cc_${cCode}`)

                // adds the current element to the output element
                output.append(cSegment)
            }
        }
    } else {
        filteredInput = input.replace(/(\u00A7(?=[a-z0-9])|(?<=\u00A7)[a-z0-9])/g, "")

        output.classList.add("cc_7")
        output.textContent = filteredInput
    }

    return output
}

function progressColour(percent, element) {
    styleSheet = document.styleSheets[1]

    if (percent <= 50) {
        R = 224
        G = Math.round(percent * 1.24) + 100
    } else if (percent <= 100 * (2/3)) {
        R = 224
        G = Math.round(percent * 3.72) - 24
    } else if (percent <= 75) {
        R = Math.round(percent * -3.84) + 480
        G = 224
    } else {
        R = Math.round(percent * -3.68) + 368
        G = 224
    }

    Rbase16 = R.toString(16);
    if (R < 16) {
        Rbase16 = `0${Rbase16}`
    }
    Gbase16 = G.toString(16);
    if (G < 16) {
        Gbase16 = `0${Gbase16}`
    }

    colour = `#${Rbase16}${Gbase16}62`

    try {
        styleSheet.insertRule(`${element}::-moz-progress-bar { background-color: ${colour} !important; }`, 0)
    }
    catch {
        styleSheet.insertRule(`${element}::-webkit-progress-value { background-color: ${colour} !important; }`, 0)
    }
}
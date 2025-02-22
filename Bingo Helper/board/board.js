API_KEY = ""

var getPla = null
var firstLoad = true

// declare variables at highest scope to pass them between functions
var nINT = 0
var notesButton
var nodeRemoved = false

function getBingoBoard() {
    // checks if a username is saved in cookies and loads their data if it is found
    if (getCookie("playerName") != "" && firstLoad == true) {
        getPlayerData()
    }

    // sets note data if found
    for (cTempInt = 0; cTempInt < getCookie("noteAmount") && firstLoad == true; cTempInt ++) {
        newNote()
    }

    // creates references to HTML elements for appending elements using JS
    const bingoTitle = document.getElementById("wrapper")
    const goalList = document.getElementById("board")

    // removes all child nodes so that new elements can be appended
    while (goalList.hasChildNodes()) {
        goalList.removeChild(goalList.firstChild);
    }

    // sets 'playerUUID' and 'completedGoals' to null if they are unset to avoid errors
    try {
        console.log(playerUUID)
        console.log(completedGoals)
    }
    catch {
        playerUUID = null
        completedGoals = []
        playedBingo = false
    }

    // sets 'markedGoals' to an empty array if it is unset to avoid errors
    try {
        console.log(markedGoals)
    }
    catch {
        markedGoals = []
        amountMarked = 0
    }

    fetch(`https://api.hypixel.net/v2/resources/skyblock/bingo`)
        .then((response) => {
            if (!response.ok) {
            throw new Error(`HTTP error, status = ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // 'tempInt' is used to calculate the tier of community goals, 'INT' is used to keep track of what goal is being read
            var tempInt = 1
            var INT = 0

            for (const goals of data.goals) {
                const bingoGoal = document.createElement("goal");
                bingoGoal.id = `goal${INT}`

                // logic for community goals
                if (goals.progress != null) {
                    bingoGoal.classList.add("community")

                    totalProgress = goals.progress;

                    for (tempInt = 0; totalProgress > goals.tiers[tempInt]; tempInt++) {
                        if (tempInt == 4) break;
                    }

                    if (tempInt >= 1 && playedBingo == true) {
                        bingoGoal.classList.add("completed")
                    }

                    currentTier = goals.tiers[tempInt];
                    tierN = document.createElement("tier");
                    tierN.textContent = `T${tempInt + 1}`;

                    progress = document.createElement("progress");
                    progress.setAttribute("value", totalProgress);
                    progress.setAttribute("max", currentTier);

                    tempID = `bar${INT}`
                    progress.id = tempID

                    if (totalProgress > currentTier) {
                        totalProgress = currentTier
                    }
    
                    barPercent = (totalProgress / currentTier) * 100

                    progressColour(barPercent, `progress#bar${INT}`)

                    tempInt ++
                } else {
                    totalProgress = "";
                    progress = "";
                    currentTier = "";
                    tierN = "";
                }

                const name = document.createElement("name");
                name.textContent = goals.name;

                const objective = decodeCC(goals.lore, "objective")

                for (const completedGoal of completedGoals) {
                    if (completedGoal == goals.id) {
                        bingoGoal.classList.add("completed")
                    }
                }

                bingoGoal.append(name, document.createElement("br"), objective, progress, tierN);

                goalList.appendChild(bingoGoal);          
                
                bingoGoal.addEventListener("click", this.markGoal)

                INT ++
            }

            if (getCookie("markedGoals") != "") {
                tempJSON = getCookie("markedGoals")
                markedGoals = JSON.parse(tempJSON)
            }

            for (marked of markedGoals) {
                document.getElementById(marked).classList.add("marked")
            }

            bingoType = data.modifier
            bingoID = data.id
            
            if (bingoType == "NORMAL") {
                bingoType = ""
            }
            
            const type = document.createElement("span")
            type.textContent = `${bingoType} BINGO #${bingoID}`
            type.id = "title"

            bingoTitle.append(type)
        });

    firstLoad = false
};

function getPlayerData() {
    searchBar = document.getElementById("searchField")
    playerName = searchBar.value

    if (firstLoad == true) {
        playerName = getCookie("playerName")
    }

    console.log(playerName)

    setCookie("playerName", playerName)

    // accesses a 3rd party API for obtaining player UUID's
    fetch(`https://api.ashcon.app/mojang/v2/user/${playerName}`)
        .then((response) => {
            if (!response.ok) {
            throw new Error(`HTTP error, status = ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            // gets the player UUID from the GET request
            playerUUID = data.uuid

            // sends new API request and returns it to the next .then promise
            return fetch(`https://api.hypixel.net/v2/skyblock/bingo?uuid=${playerUUID}&key=${API_KEY}`)
        })
        .then((response) => { return response.json(); })
        .then((data) => {
            try {
                // gets the player's data for the current bingo (if there is any)
                if (data.events[data.events.length - 1].key == bingoID) {
                    completedGoals = data.events[data.events.length - 1].completed_goals
                    playedBingo = true
                } else {
                    completedGoals = []
                    playedBingo = false
                }
            }
            catch {
                completedGoals = []
                playedBingo = false
            }

            // calls getBingoBoard to redraw the board
            getBingoBoard()

            currentSearch = document.getElementById("currentSearch")
            currentSearch.textContent = "currently watching: "
            searchedPlayer = document.getElementById("searchedPlayer")
            searchedPlayer.textContent = playerName

            currentSearchHead = document.getElementById("headIcon")
            currentSearchHead.setAttribute("src", `https://crafatar.com/renders/head/${playerUUID}?overlay`)

            stopSearch = document.getElementById("stopSearch")
            stopSearch.textContent = "x"
        })
}

function interval() {
    getPlayerData()
    
    clearInterval(playerDataRefresh);
    if (getCookie("liveUpdates") == "true" || liveUpdates == true) {
        playerDataRefresh = setInterval(getPlayerData, 60000);
    }
}

function newNote() {
    if (nINT < 10) {
        notesDisplay = document.getElementById("notesDisplay")
        if (document.getElementById("notesButton") != null) {
            notesButton = document.getElementById("notesButton")
        }

        noteContainer = document.createElement("div")
        noteContainer.id = `container${nINT}`
        noteContainer.classList.add("notesContainer")

        note = document.createElement("input")
        note.id = `note${nINT}`
        note.classList.add("note")
        note.setAttribute("maxlength", "50")
        note.setAttribute("placeholder", "")

        completeButton = document.createElement("button")
        completeButton.id = `complete${nINT}`
        completeButton.classList.add("completeButton")

        completeImg = document.createElement("img")
        completeImg.id = `completeImg${nINT}`
        completeImg.classList.add("completeImg")
        completeImg.setAttribute("src", "../img/checkmark.png")

        completeButton.append(completeImg)

        removeNoteButton = document.createElement("button")
        removeNoteButton.id = `remove${nINT}`
        removeNoteButton.classList.add("removeNoteButton")
        removeNoteButton.textContent = "x"

        noteContainer.append(note, completeButton, removeNoteButton)

        notesDisplay.insertBefore(noteContainer, notesButton)

        document.querySelector(`#note${nINT}`).addEventListener("keypress", this.stopEnterKey, false)
        document.querySelector(`#note${nINT}`).addEventListener("blur", this.setValueCookie, false)
        document.querySelector(`#complete${nINT}`).addEventListener("click", this.completeNote, false)
        document.querySelector(`#remove${nINT}`).addEventListener("click", this.removeNote, false)

        if (firstLoad == true) {
            note.value = getCookie(`value${nINT}`)

            console.log(getCookie(`done${nINT}`))

            // DO NOT REMOVE THE QUOTATION MARKS. getCookie always returns a string, and not a boolean
            if (getCookie(`done${nINT}`) == "true") {
                note.classList.add("done")
                completeImg.classList.add("done")
            }
        }

        nINT ++

        if (firstLoad != true) {
            setCookie("noteAmount", nINT)
        }
    }
    
    if (nINT == 10 && nodeRemoved == false) {
        notesDisplay.removeChild(notesButton)
        nodeRemoved = true
    }
}

function removeSearch() {
    playerName = ""
    playerUUID = null
    completedGoals = []
    playedBingo = false

    searchBar.value = ""
    currentSearch.textContent = ""
    searchedPlayer.textContent = ""
    stopSearch. textContent = ""
    currentSearchHead.removeAttribute("src")

    setCookie("playerName", "")
    removeCookie("playerName")

    clearInterval(playerDataRefresh)
    getBingoBoard()
}

function enterKeySearch(event) {
    // clicks the search button when the enter key is pressed
    if (event.key == "Enter") {
        event.preventDefault();
        document.getElementById("searchButton").click();
    }
}

function stopEnterKey(event) {
    // stops the default functionality when enter is pressed and defocuses the selected element
    if (event.key == "Enter") {
        event.preventDefault();
        try {
            this.blur()
        }
        catch {
        }
    }
}

function setValueCookie(event) {
    valueLocation = this.id
    valueLocation = valueLocation.replace ("note", "")
    
    setCookie(`value${valueLocation}`, this.value)
}

function completeNote() {
    id = this.id
    id = id.replace("complete", "")
    id = id - 0

    if (getCookie(`done${id}`) != "false" && getCookie(`done${id}`) != "") {
        document.getElementById(`note${id}`).classList.remove("done")
        document.getElementById(`completeImg${id}`).classList.remove("done")
        setCookie(`done${id}`, false)
        removeCookie(`done${id}`)
    } else if (document.getElementById(`note${id}`).value != "") {
        document.getElementById(`note${id}`).classList.add("done")
        document.getElementById(`completeImg${id}`).classList.add("done")
        setCookie(`done${id}`, true)
    }
}

function removeNote(event) {
    event.preventDefault()

    id = this.id
    id = id.replace("remove", "")
    id = id - 0

    removeCookie(`value${id}`)
    removeCookie(`done${id}`)

    tempStr = this.id
    tempStr = tempStr.replace("remove", "container")
    document.getElementById(tempStr).remove()

    for (let lowerID = id + 1; lowerID < nINT; lowerID ++) {
        for (let whatElement = 0; whatElement < 4; whatElement ++) {
            switch (whatElement) {
                case 0:
                elementType = "container"
                break;
                case 1:
                elementType = "note"
                break;
                case 2:
                elementType = "edit"
                break;
                case 3:
                elementType = "remove"
                break
            }

            element = document.getElementById(`${elementType}${lowerID}`)
            element.id = `${elementType}${lowerID - 1}`
        }
    }

    nINT --
    nodeRemoved = false

    console.log(nINT)

    notesDisplay.appendChild(notesButton)

    setCookie("noteAmount", nINT)
}

function markGoal(event) {
    event.preventDefault()
    this.classList.toggle("marked")

    for (const goals of markedGoals) {
        if (goals != this.id) {
            var isUnMark = false
        } else {
            var isUnMark = true
            spliceThis = markedGoals.indexOf(goals);
            break;
        }
    }

    if (isUnMark == true) {
        markedGoals.splice(spliceThis, 1)
    } else {
        markedGoals.push(this.id)
    }

    tempJSON = JSON.stringify(markedGoals)
    setCookie("markedGoals", tempJSON)
}

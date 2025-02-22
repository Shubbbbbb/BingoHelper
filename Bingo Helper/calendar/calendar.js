function getCalendar() {
    const cellList = document.getElementById("calendar")
    const weekDays = document.getElementById("spacer")

    while (cellList.hasChildNodes()) {
        cellList.removeChild(cellList.firstChild);
    }
    while (weekDays.hasChildNodes()) {
        weekDays.removeChild(weekDays.firstChild);
    }

    for (let week = 0; week < 7; week++) {
        tempStr = new Date(1970, 8, week)
        tempStr = `${tempStr}`
        tempStr = tempStr.replace(/(?<=.{3})./g, "")

        const weekDay = document.createElement("span")
        weekDay.textContent = tempStr

        weekDay.classList.add("weekDay")

        weekDays.append(weekDay)
    }

    cTime = new Date()

    month = cTime.getMonth()
    year = cTime.getFullYear()
    
    day = new Date(year, month, 1).getDay()

    date = new Date().getDate()

    unixTime = new Date(year, month).getTime()

    currentDate = new Date().getDate()
    
    for (let tempInt = 1; tempInt < 36; tempInt ++) {
        const cell = document.createElement("block")
        cell.id = tempInt

        if (tempInt - day + 1 == currentDate) {
            cell.classList.add("currentDay")
        }

        getDays(month)
    
        if (tempInt >= day && tempInt - day < calDays) {
            cell.classList.add("thisMonth")
        }

        const date = document.createElement("span")
        date.classList.add("date")

        if (tempInt <= day) {
            if (month > 1) {
                lastMonth = month-1
                lastYear = year
            } else {
                lastMonth = 11
                lastYear = year-1
            }

            getDays(lastMonth)
            tempStr = new Date(lastYear, lastMonth, calDays - day + tempInt + 1).toDateString()

            getDays(month)

            dateUnix = new Date(lastYear, lastMonth, calDays - day + tempInt + 1).getTime()
            dateUnixLatest = new Date(lastYear, lastMonth, calDays - day + tempInt + 1, 23, 59, 59).getTime()
        } else if (tempInt - day >= calDays) {
            if (month < 11) {
                nextMonth = month + 1
                nextYear = year
            } else {
                nextMonth = 1
                nextYear = year + 1
            }

            getDays(month)
            tempStr = new Date(nextYear, nextMonth, tempInt - calDays - day + 1).toDateString()

            dateUnix = new Date(nextYear, nextMonth, tempInt - calDays - day + 1).getTime()
            dateUnixLatest = new Date(nextYear, nextMonth, tempInt - calDays - day + 1, 23, 59, 59).getTime()
        } else {
            getDays(month)
            tempStr = new Date(year, month, tempInt - day + 1).toDateString()

            dateUnix = new Date(year, month, tempInt - day + 1).getTime()
            dateUnixLatest = new Date(year, month, tempInt - day + 1, 23, 59, 59).getTime()
        }

        tempStr = `${tempStr}`
        tempStr = tempStr.replace(/([^0-9]{4}(?=[a-zA-Z]{3})|.{1}[0-9]{4}(?<=[0-9]{2}))/g, "")

        date.textContent = tempStr

        SBYear = Math.floor((dateUnix - 1560275700000) / 446400000)
        SBMonth = Math.floor((dateUnix - 1560275700000 - (446400000 * SBYear)) / 37200000)

        SBYearLatest = Math.floor((dateUnixLatest - 1560275700000) / 446400000)
        SBMonthLatest = Math.floor((dateUnixLatest - 1560275700000 - (446400000 * SBYearLatest)) / 37200000)

        bingo = ""
        election = ""
        derpy = ""
        jerry = ""

        for (let int = 0; int < 7; int ++) {
            if (tempInt == day + int || tempInt == day + calDays + int) {
                bingo = document.createElement("img")
                bingo.setAttribute("src", "../img/bingo.png")
                bingo.classList.add("bingoIcon")
            }
        }

        isDerpy = Number.isInteger((SBYear - 368) / 24)
        if (isDerpy == false) {
            isDerpy = Number.isInteger((SBYearLatest - 368) / 24)
        }

        isJerry = Number.isInteger((SBYear - 376) / 24)
        if (isJerry == false) {
            isJerry = Number.isInteger((SBYearLatest - 376) / 24)
        }

        if (SBMonth <= 6 && SBMonthLatest > 6 || SBMonth <= 3 && SBMonthLatest > 3 || SBMonth < 6 && SBMonthLatest > 3) {
            election = document.createElement("img")
            election.setAttribute("src", "../img/election.png")
            election.classList.add("electionIcon")

            if (isDerpy == true) {
                derpy = document.createElement("img")
                derpy.setAttribute("src", "../img/derpy.png")
                derpy.classList.add("derpyIcon")
            }
            if (isJerry == true) {
                jerry = document.createElement("img")
                jerry.setAttribute("src", "../img/jerry.png")
                jerry.classList.add("jerryIcon")
            }
        }


        if (SBMonth > SBMonthLatest) {
            lateWinter = true
        } else {
            lateWinter = false
        }

        if ((month == 11 && tempInt >= day && tempInt - day < calDays) || (month == 0 &&  tempInt < day) || lateWinter == true) {
            workshop = document.createElement("img")
            workshop.setAttribute("src", "../img/workshop.png")
            workshop.classList.add("workshopIcon")
        } else {
            workshop = ""
        }

        cell.append(date, bingo, workshop, election, derpy, jerry)

        cellList.appendChild(cell);
    }
}

fetch("https://api.hypixel.net/v2/resources/skyblock/election")
    .then((response) => {
        if (!response.ok) {
        throw new Error(`HTTP error, status = ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        currentMayorDisplay = document.getElementById("main")

        //

        electionDisplay = document.getElementById("main")

        candidateGroup = document.createElement("div")
        candidateGroup.id = "candidates"

        try {
            console.log(data.current)

            highestVotes = 0

            for (let tempInt = 0; tempInt < 5; tempInt ++) {
                if (data.current.candidates[tempInt].votes != undefined) {
                    notClosed = true

                    if (highestVotes < data.current.candidates[tempInt].votes) {
                        highestVotes = data.current.candidates[tempInt].votes
                    }
                } else {
                    notClosed = false
                }
            }

            if (notClosed == false) {
                electionStatus = document.createElement("span")
                electionStatus.id = "electionStatus"
                electionStatus.textContent = "The election is currently closed!"
    
                candidateGroup.append(electionStatus)
            }

            for (let tempInt = 0; tempInt < 5; tempInt ++) {
                candidateI = document.createElement("div")
                candidateI.classList.add("candidate")
                candidateI.id = `candidate${tempInt + 1}`

                if (notClosed == true) {
                    placement = 1
                    totalVotes = 0
    
                    for (let cd = 0; cd < 5; cd ++) {
                        if (data.current.candidates[tempInt].votes < data.current.candidates[cd].votes) {
                            placement ++
                        }
    
                        totalVotes += data.current.candidates[cd].votes
                    }
                }

                tempStr = data.current.candidates[tempInt].name
                tempStr = tempStr.toLowerCase()

                candidate = document.createElement("img")
                candidate.setAttribute("src", `../img/${tempStr}.png`)
                candidate.classList.add("candidateIcon")

                container = document.createElement("div")
                container.classList.add("tooltipSrc")

                votes = document.createElement("progress")
                votes.classList.add("votes")
                votes.id = `progressBar${tempInt + 1}`

                if (notClosed == true) {
                    votes.setAttribute("value", data.current.candidates[tempInt].votes)
                    votes.setAttribute("max", highestVotes)
    
                    placementDisplay = document.createElement("span")
                    placementDisplay.textContent = `#${placement}`
                    placementDisplay.classList.add("placement")

                    if (placement == 1) {
                        votes.classList.add("nextMayor")
                        placementDisplay.classList.add("nextMayor")
                    } else if (placement == 2) {
                        votes.classList.add("nextMinister")
                        placementDisplay.classList.add("nextMinister")
                    }

                    percentVotes = (data.current.candidates[tempInt].votes / totalVotes) * 100
                    percentVotes = Math.round(percentVotes * 10) / 10
    
                    percentDisplay = document.createElement("span")
                    percentDisplay.classList.add("percent")
                    percentDisplay.textContent = `${percentVotes}%`
                } else {
                    votes.classList.add("noElection")
                    votes.setAttribute("value", 1)
                    votes.setAttribute("max", 1)

                    percentDisplay = document.createElement("span")
                    percentDisplay.classList.add("percent")
                    percentDisplay.textContent = "?%"
                }

                perks = document.createElement("div")
                perks.classList.add("tooltip")
                perks.classList.add("candidateTooltip")

                for (let pk = 0; pk < 4; pk ++) {
                    try {
                        ministerPerk = ""

                        if (data.current.candidates[tempInt].perks[pk].minister == true) {
                            ministerPerk = document.createElement("span")
                            ministerPerk.textContent = "✯"
                            ministerPerk.classList.add("ministerPerk")
                        }
                        
                        perkName = document.createElement("span")
                        perkName.textContent = data.current.candidates[tempInt].perks[pk].name
                        perkName.classList.add("currentPerkName")

                        // the added "§7" is required as the perk description doesnt include a starting colour code for some reason
                        perkDesc = decodeCC("§7" + data.current.candidates[tempInt].perks[pk].description, "span")
                        perkDesc.classList.add("currentPerkDesc")



                        perks.append(ministerPerk, perkName, document.createElement("br"), perkDesc, document.createElement("br"), document.createElement("br"))
                    }
                    catch {
                        perkName = ""
                        perkDesc = ""
                    }
                }

                container.append(perks, candidate)

                candidateI.appendChild(container)
                if (notClosed == true) {
                    candidateI.append(votes, placementDisplay, percentDisplay)
                } else {
                    candidateI.append(votes, percentDisplay)
                }

                candidateGroup.append(candidateI)
            }

            electionDisplay.appendChild(candidateGroup)

            for (let tempInt = 0; tempInt < 5 && notClosed == true; tempInt ++) {
                percentVotes = (data.current.candidates[tempInt].votes / highestVotes) * 100

                progressColour(percentVotes, `progress#progressBar${tempInt + 1}`)
            }

            
        }
        catch(err) {
            console.log(err)
            // logic for handling when no election data is found
            for (let tempInt = 0; tempInt < 5; tempInt ++) {
                candidateI = document.createElement("div")
                candidateI.classList.add("candidate")
                candidateI.id = `candidate${tempInt + 1}`

                container = document.createElement("div")
                container.classList.add("tooltipSrc")

                candidate = document.createElement("img")
                candidate.setAttribute("src", `../img/noCandidate.png`)
                candidate.classList.add("candidateIcon")

                votes = document.createElement("progress")
                votes.classList.add("votes")
                votes.id = `progressBar${tempInt + 1}`

                votes.classList.add("noElection")
                votes.setAttribute("value", 1)
                votes.setAttribute("max", 1)

                percentDisplay = document.createElement("span")
                percentDisplay.classList.add("percent")
                percentDisplay.textContent = "N/A"

                container.append(candidate)

                candidateI.appendChild(container)
                candidateI.append(votes, percentDisplay)

                candidateGroup.append(candidateI)
            }

            electionStatus = document.createElement("span")
            electionStatus.id = "electionStatus"
            electionStatus.textContent = "There is currently no election!"

            candidateGroup.append(electionStatus)

            electionDisplay.appendChild(candidateGroup)
        }

        //

        currentMayor = document.createElement("div")
        currentMayor.id = "mayorDisplay"

        currentMayorName = document.createElement("span")
        currentMayorName.innerHTML = data.mayor.name
        currentMayorName.id = "currentMayorName"

        tempStr = data.mayor.name
        tempStr = tempStr.toLowerCase()

        mayorIcon = document.createElement("img")
        mayorIcon.setAttribute("src", `../img/${tempStr}.png`)
        mayorIcon.classList.add("mayorIcon")

        if (tempStr == "jerry") {
            mayorIcon.classList.add("noSquish")
        }

        align = document.createElement("div")
        align.id = "mayorAlign"

        align.append(currentMayorName, mayorIcon)

        currentMayor.append(align, document.createElement("br"))

        for (let tempInt = 0; tempInt < 4; tempInt ++) {
            tooltip = document.createElement("div")
            tooltip.classList.add("tooltipContainer")
            tooltip.textContent = tempInt + 1

            try {
                data.mayor.perks[tempInt].name

                currentName = document.createElement("span")
                currentName.innerHTML = data.mayor.perks[tempInt].name
                currentName.classList.add("currentPerkName")

                // the added "§7" is required as the perk description doesnt include a starting colour code for some reason
                currentDescr = decodeCC("§7" + data.mayor.perks[tempInt].description, "span")
                currentDescr.classList.add("currentPerkDesc")

                tooltipText = document.createElement("div")
                tooltipText.classList.add("tooltip")

                tooltipText.append(currentName, document.createElement("br"), currentDescr)
            } 
            catch {
                tooltip.classList.add("disabled")

                currentName = ""
                currentDescr = ""

                tooltipText = ""
            }

            tooltip.append(tooltipText)

            currentMayor.appendChild(tooltip)
        }

        currentMayorDisplay.appendChild(currentMayor)

        //
        try {
            console.log(data.mayor.minister.name)

            currentMinister = document.createElement("div")
            currentMinister.id = "ministerDisplay"

            currentMinisterName = document.createElement("span")
            currentMinisterName.innerHTML = data.mayor.minister.name
            currentMinisterName.id = "currentMinisterName"

            tempStr = data.mayor.minister.name
            tempStr = tempStr.toLowerCase()

            ministerIcon = document.createElement("img")
            ministerIcon.setAttribute("src", `../img/${tempStr}.png`)
            ministerIcon.id = "ministerIcon"

            align = document.createElement("div")
            align.id = "ministerAlign"

            align.append(currentMinisterName, ministerIcon)

            currentMinister.append(align, document.createElement("br"))

            tooltip = document.createElement("div")
            tooltip.classList.add("tooltipContainer")
            tooltip.textContent = "1"

            currentName = document.createElement("span")
            currentName.innerHTML = data.mayor.minister.perk.name
            currentName.classList.add("currentPerkName")
    
            tempStr = data.mayor.minister.perk.description
            tempStr = tempStr.replace(/(\u00A7(?=[a-z0-9])|(?<=\u00A7)[a-z0-9])/g, "")
    
            currentDescr = document.createElement("span")
            currentDescr.innerHTML = tempStr
            currentDescr.classList.add("currentPerkDesc")
    
            tooltipText = document.createElement("div")
            tooltipText.classList.add("tooltip")

            currentName.classList.add("minister")
            currentDescr.classList.add("minister")
            tooltip.classList.add("minister")
            tooltipText.classList.add("minister")
            
            tooltipText.append(currentName, document.createElement("br"), currentDescr)

            tooltip.append(tooltipText)

            currentMinister.appendChild(tooltip)
            
            currentMayorDisplay.appendChild(currentMinister)
        }
        catch {
            // code for handling special mayors (or if no minister data is found)
            currentMayor.classList.add("noMinister")
        }
    })


function getDays(tempMonth) {
    switch (tempMonth) {
        default:
            calDays = 31
            break;
        case 3:
        case 5:
        case 8:
        case 10:
            calDays = 30
            break;
        case 1:
            if (Number.isInteger(year/4) == true) {
                calDays = 29
            } else {
                calDays = 28
            }
            break;
    }
}
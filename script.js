// Get form 
const form = document.querySelector("form");

// Define min date that can be selected
const minStartDate = dayjs().add(1, "day").startOf("day");
document.querySelector("#endDate").min = minStartDate.format('YYYY-MM-DD');

// Prevent clicking Aurum Gift without Aurum Pass
const aurumPass = document.querySelector('#aurumPass');
const aurumWeekly = document.querySelector('#aurumWeekly');

aurumWeekly.disabled = true;

aurumPass.addEventListener('change', () => {
    aurumWeekly.disabled = !aurumPass.checked;
    if (!aurumPass.checked) aurumWeekly.checked = false;
});

// Select max stats for SHC
const clearSelect = document.querySelector('#stagesCleared');
const starsSelect = document.querySelector('#starsEarned');
const maxSHC = document.querySelector('#maxSHC');

maxSHC.addEventListener('change', () => {

    if (maxSHC.checked) {
        clearSelect.value = "12";
        clearSelect.disabled = true;
        starsSelect.value = "33";
        starsSelect.disabled = true;
    } else {
        clearSelect.value = "";
        clearSelect.disabled = false;
        starsSelect.value = "";
        starsSelect.disabled = false;
    }
})


// Rewards from Dailies
function getDailyDiamonds(hasAurumPass, hasAurumWeekly) {
    let total = 50; //base daily diamonds
    if (hasAurumPass) {
        total = total + 100;
    } if (hasAurumWeekly) {
        total = total + 150;
    }
    return total;
}

function calculateDailyTotal(startDate, endDate, hasAurumPass, hasAurumWeekly) {
    const totalDays = endDate.diff(startDate, "day") + 1;
    const dailyAmount = getDailyDiamonds(hasAurumPass, hasAurumWeekly);
    let total = totalDays * dailyAmount;
    return total;
}

//Rewards from Weekly agenda and weekly packs
function getWeeklyDiamonds(hasDiamondGift) {
    let total = 210; // base weekly diamonds including home
    if (hasDiamondGift) {
        total = total + 120; // adds 120 diamonds 
    }
    return total;
}

function countMondays(startDate, endDate) {
    let count = 0;
    let currentDay = startDate;
    while (currentDay <= endDate) {
        if (currentDay.day() === 1) { count++; }
        currentDay = currentDay.add(1, "day");
    }
    return count;
}

function calculateWeeklyTotal(countMondays, hasDiamondGift) {
    const weeklyAmount = getWeeklyDiamonds(hasDiamondGift);
    let total = countMondays * weeklyAmount;
    return total;
}

const wishGiftWeekly = 1;

function calculateWeeklyWishes(countMondays, hasWishGift) {
    let total = 0;
    if (hasWishGift) {
        total = countMondays * wishGiftWeekly;
    }
    return total;
}

// Rewards from Monthly Check-ins
const monthlyRewards = {
    3: 10,
    8: 10,
    13: 15,
    15: 100,
    18: 15,
    23: 20,
    28: 20
}

function calculateMonthlyTotal(startDate, endDate, monthlyRewards) {
    let count = 0;
    let currentDay = startDate;
    while (currentDay <= endDate) {
        if (monthlyRewards[currentDay.date()]) {
            count += monthlyRewards[currentDay.date()];
        }
        currentDay = currentDay.add(1, "day");
    }
    return count;
}

// Senior Hunt will reset every 14 days starting from this date
const shcReferenceDate = dayjs("2026-02-09").startOf("day");

function calculateSHCCycles(startDate, endDate) {
    let count = 0;
    let currentCycleDate = shcReferenceDate;
    console.log("Start:", startDate.format('YYYY-MM-DD'), "End:", endDate.format('YYYY-MM-DD'));
    while (currentCycleDate < startDate) {
        currentCycleDate = currentCycleDate.add(14, "day")
    }
    while (currentCycleDate <= endDate) {
        count++
        currentCycleDate = currentCycleDate.add(14, "day")
    }
    return count;
}

const starRewards = {
    3: 50,
    6: 50,
    9: 50,
    12: 50,
    15: 50,
    18: 50,
    21: 50,
    24: 50,
    27: 50,
    30: 50,
    32: 50,
    33: 50
}

function calculateStageReward(stagesCleared) {
    let total = stagesCleared * 20;
    return total;
}

function calculateStarReward(starsEarned) {
    let total = 0;
    for (let i in starRewards) {
        if (starsEarned >= i) {
            total += starRewards[i]
        }
    }
    return total;
}

function calculateSHCRewards(starTotal, stageTotal, cycles) {
    let total = (starTotal + stageTotal) * cycles;
    return total;
}

// Total
function calculateTotal(dailyTotal, weeklyTotal, monthlyTotal, SHCtotal, currentDiamonds) {
    let total = dailyTotal + weeklyTotal + monthlyTotal + SHCtotal + currentDiamonds;
    return total;
}

// Add event listener to form
form.addEventListener("submit", (e) => {
    // Prevent the default form submission
    e.preventDefault();

    // Target dates
    const startDate = dayjs().add(1, "day").startOf("day");
    const endDateValue = document.querySelector("#endDate").value;
    const endDate = dayjs(endDateValue).startOf("day");

    // Prevent select day that has passed
    if (endDate.isBefore(startDate)) {
        document.querySelector("#result").innerHTML =
            `<h3>Please select a future date!</h3>`;
        return;
    }


    // Paid Packs 
    const hasAurumPass = document.querySelector("#aurumPass").checked;
    const hasAurumWeekly = document.querySelector("#aurumWeekly").checked;
    const hasDiamondGift = document.querySelector("#diamondGift").checked;
    const hasWishGift = document.querySelector("#wishGift").checked;

    // Senior Hunt info
    const stagesCleared = Number(document.querySelector("#stagesCleared").value);
    const starsEarned = Number(document.querySelector("#starsEarned").value);
    const starTotal = calculateStarReward(starsEarned);
    const stageTotal = calculateStageReward(stagesCleared);
    const cycles = calculateSHCCycles(startDate, endDate);

    //Existing Diamonds/Wishes
    const currentDiamonds = Number(document.querySelector("#currentDiamonds").value);
    const currentWishCount = Number(document.querySelector("#currentWishCount").value);

    // Totals
    const dailyTotal = calculateDailyTotal(startDate, endDate, hasAurumPass, hasAurumWeekly);
    const weeklyTotal = calculateWeeklyTotal(countMondays(startDate, endDate), hasDiamondGift);
    const weeklyWishTotal = calculateWeeklyWishes(countMondays(startDate, endDate), hasWishGift);
    const monthlyTotal = calculateMonthlyTotal(startDate, endDate, monthlyRewards);
    const SHCtotal = calculateSHCRewards(starTotal, stageTotal, cycles);
    const finalTotal = calculateTotal(dailyTotal, weeklyTotal, monthlyTotal, SHCtotal, currentDiamonds);
    const earnedWishes = currentWishCount + weeklyWishTotal;
    const totalWishes = Math.floor(finalTotal / 150) + earnedWishes;

    console.log("Daily:", dailyTotal, "Weekly Dias: ", weeklyTotal, "Weekly Wishes: ", weeklyWishTotal, "Monthly: ", monthlyTotal, "SHC: ", SHCtotal, "Starting: ", currentDiamonds, "Final: ", finalTotal);


    // Results
    document.querySelector("#result").innerHTML =
        `<h3>
        You'll be able to save 
        <span class="highlight"> ${finalTotal.toLocaleString()} <img src="apple-touch-icon.png" class="diamond-icon">
        </span> 
        diamonds${earnedWishes > 1 ? ` and ${earnedWishes} wishes` : earnedWishes === 1 ? ` and ${earnedWishes} wish` : ""}.
        ${totalWishes > 1 ? `
        <p>That's ${totalWishes} wishes!</p>` : totalWishes === 1 ? `<p>That's 1 wish!</p>` : ""} </h3>`
}
);

// Code Your Carbon

let carbonChart = null;

function calculateCarbon() {

    // Get values
    const distance = Number(document.getElementById("distance").value) || 0;
    const vehicle = document.getElementById("vehicle").value;

    const electricity =
        Number(document.getElementById("electricity").value) || 0;

    const vegMeals =
        Number(document.getElementById("vegMeals").value) || 0;

    const nonVegMeals =
        Number(document.getElementById("nonVegMeals").value) || 0;

    const waste =
        Number(document.getElementById("waste").value) || 0;


    // Transport emission factors
    let transportFactor = 0;

    if (vehicle === "bike") {
        transportFactor = 0.08;
    } 
    else if (vehicle === "car") {
        transportFactor = 0.18;
    } 
    else if (vehicle === "bus") {
        transportFactor = 0.05;
    } 
    else if (vehicle === "metro") {
        transportFactor = 0.03;
    } 
    else if (vehicle === "walk") {
        transportFactor = 0;
    }


    // Calculate emissions
    const transportCarbon = distance * transportFactor;
    const electricityCarbon = electricity * 0.70;
    const foodCarbon =
        (vegMeals * 0.40) +
        (nonVegMeals * 1.50);
    const wasteCarbon = waste * 0.50;


    // Total
    const totalCarbon =
        transportCarbon +
        electricityCarbon +
        foodCarbon +
        wasteCarbon;


    // Show result
    document.getElementById("result").innerHTML = `
        <h2>🌱 Your Daily Carbon Footprint</h2>
        <h1>${totalCarbon.toFixed(2)} kg CO₂e</h1>
    `;


    // Show breakdown
    document.getElementById("breakdown").innerHTML = `
        <h3>📊 Carbon Breakdown</h3>

        <p>🚗 Transport: ${transportCarbon.toFixed(2)} kg CO₂e</p>

        <p>⚡ Electricity: ${electricityCarbon.toFixed(2)} kg CO₂e</p>

        <p>🍛 Food: ${foodCarbon.toFixed(2)} kg CO₂e</p>

        <p>🗑️ Waste: ${wasteCarbon.toFixed(2)} kg CO₂e</p>
    `;


    // Green score
    const greenScore = Math.max(
        0,
        Math.min(100, 100 - totalCarbon * 5)
    );

    document.getElementById("score").innerHTML = `
        <h3>🌿 Your Green Score</h3>
        <h2>${greenScore.toFixed(0)} / 100</h2>
    `;


    // Tips
    document.getElementById("tips").innerHTML = `
        <h3>💡 Ways to Reduce Your Carbon Footprint</h3>

        <p>🚶 Use walking, cycling or public transport.</p>

        <p>⚡ Switch off unused electrical appliances.</p>

        <p>🥗 Try more vegetarian meals.</p>

        <p>♻️ Reduce, reuse and recycle waste.</p>
    `;


    // Save history
    let history =
        JSON.parse(localStorage.getItem("carbonHistory")) || [];

    history.push({
        date: new Date().toLocaleDateString(),
        carbon: totalCarbon.toFixed(2)
    });

    localStorage.setItem(
        "carbonHistory",
        JSON.stringify(history)
    );


    // Show history
    showHistory();


    // Create chart
    createCarbonChart(
        transportCarbon,
        electricityCarbon,
        foodCarbon,
        wasteCarbon
    );
}


// Chart
function createCarbonChart(
    transport,
    electricity,
    food,
    waste
) {

    const canvas =
        document.getElementById("carbonChart");

    if (!canvas) {
        return;
    }

    if (typeof Chart === "undefined") {
        console.log("Chart.js is not loaded");
        return;
    }

    if (carbonChart !== null) {
        carbonChart.destroy();
    }

    carbonChart = new Chart(canvas, {

        type: "doughnut",

        data: {

            labels: [
                "Transport",
                "Electricity",
                "Food",
                "Waste"
            ],

            datasets: [{

                data: [
                    transport,
                    electricity,
                    food,
                    waste
                ]

            }]
        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    position: "bottom"
                }

            }

        }

    });
}


// History
function showHistory() {

    const history =
        JSON.parse(localStorage.getItem("carbonHistory")) || [];

    const historyBox =
        document.getElementById("history");

    if (!historyBox) {
        return;
    }

    let html = "<h3>📅 Carbon History</h3>";

    if (history.length === 0) {

        html += "<p>No previous calculations yet.</p>";

    } else {

        html += "<ul>";

        history.forEach(function(item) {

            html += `
                <li>
                    ${item.date} —
                    ${item.carbon} kg CO₂e
                </li>
            `;

        });

        html += "</ul>";
    }

    historyBox.innerHTML = html;
}


// Reset
function resetCalculator() {

    document.getElementById("distance").value = "";
    document.getElementById("electricity").value = "";
    document.getElementById("vegMeals").value = "";
    document.getElementById("nonVegMeals").value = "";
    document.getElementById("waste").value = "";

    document.getElementById("result").innerHTML = "";
    document.getElementById("breakdown").innerHTML = "";
    document.getElementById("score").innerHTML = "";
    document.getElementById("tips").innerHTML = "";

    if (carbonChart !== null) {

        carbonChart.destroy();

        carbonChart = null;
    }

    showHistory();
}


// Clear history
function clearHistory() {

    localStorage.removeItem("carbonHistory");

    showHistory();

    alert("Carbon history has been cleared!");
}


// Load history when page opens
showHistory();
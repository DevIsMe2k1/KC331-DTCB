import { tempRef, pHRef, turbRef } from './main.js';
const chartCanvas = document.getElementById("realTimeChart");
const ctx = chartCanvas.getContext("2d");
const chart = new Chart(ctx, {
    type: "line",
    data: {
        labels: [],
        datasets: [
            {
                label: "Temperature",
                data: [],
                borderColor: "red",
                fill: true,
                cubicInterpolationMode: 'monotone' // Make lines softer
            },
            {
                label: "pH",
                data: [],
                borderColor: "green",
                fill: true,
                cubicInterpolationMode: 'monotone'
            },
            {
                label: "Turbidity",
                data: [],
                borderColor: "blue",
                fill: true,
                cubicInterpolationMode: 'monotone'
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                display: true
            },
            y: {
                display: true
            }
        },
        plugins: {
            legend: {
                labels: {
                    // Customize the legend label
                    filter: function (legendItem, chartData) {
                        return legendItem.text !== 'Hidden'; // Hide the legend item with text 'Hidden'
                    }
                }
            }
        }
    }
});

// Update the chart with new data
function updateChart(time, tempValue, pHValue, turbValue) {
    chart.data.labels.push(time);
    chart.data.datasets[0].data.push(tempValue);
    chart.data.datasets[1].data.push(pHValue);
    chart.data.datasets[2].data.push(turbValue);

    // Remove the oldest data when the limit is reached (20 data points)
    if (chart.data.labels.length > 10) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
        chart.data.datasets[1].data.shift();
        chart.data.datasets[2].data.shift();
    }

    chart.update();
}

// Listen for changes in Firebase data
tempRef.on('value', (snapshot) => {
    const now = new Date();
    const time = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds(); // Format time to display hour and minute
    const tempValue = snapshot.val();
    pHRef.on('value', (snapshot) => {
        const pHValue = snapshot.val();
        turbRef.on('value', (snapshot) => {
            const turbValue = snapshot.val();
            updateChart(time, tempValue, pHValue, turbValue);
        });
    });
});
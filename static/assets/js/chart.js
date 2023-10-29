import { tempRef, pHRef, turbRef } from './main.js';

const chartCanvas = document.getElementById("realTimeChart");

let data = {
    labels: [],
    datasets: [{
        label: 'Temperature',
        data: [],
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
    }, {
        label: 'pH',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
    }, {
        label: 'Turbidity',
        data: [],
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1
    }]
};

let config = {
    type: 'line',
    data,
    options: {
        scales: {
            xAxes: [{
                type: 'time',
                time: {
                    unit: 'second'
                }
            }]
        }
    }
};

let chart = new Chart(chartCanvas, config);

let tempValue, pHValue, turbValue;

tempRef.on('value', (tempSnapshot) => {
    tempValue = tempSnapshot.val();
});

pHRef.on('value', (pHSnapshot) => {
    pHValue = pHSnapshot.val();
});

turbRef.on('value', (turbSnapshot) => {
    turbValue = turbSnapshot.val();

    const now = new Date();
    const time = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();

    data.labels.push(time);
    data.datasets[0].data.push(tempValue);
    data.datasets[1].data.push(pHValue);
    data.datasets[2].data.push(turbValue);
    
    if (data.labels.length > 30) {
        data.labels.shift();
        data.datasets[0].data.shift();
        data.datasets[1].data.shift();
        data.datasets[2].data.shift();
    }
    chart.update();
});

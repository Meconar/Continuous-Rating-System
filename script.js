let rating = 50;
let isRecording = true;
let isPaused = false;
let startTime = Date.now();
let lastUpdateTime = Date.now();
const updateInterval = 100; // Update every 100ms
let pauseStartTime = 0; // Track the start time of the pause

const ratingElement = document.getElementById('rating');
const ctx = document.getElementById('ratingChart').getContext('2d');

const data = {
    labels: [],
    datasets: [{
        label: 'Rating',
        data: [],
        borderColor: '#66b3ff', // Light blue for the line
        borderWidth: 1,
        fill: true, // Enable filling
        backgroundColor: 'rgba(102, 179, 255, 0.2)', // Light blue fill color
        pointRadius: 0,
        tension: 0,
        // Add shadow
        shadowColor: 'rgba(0, 0, 0, 0.2)', // Shadow color
        shadowBlur: 10, // Shadow blur effect
        shadowOffsetX: 0, // Horizontal shadow offset
        shadowOffsetY: 10, // Vertical shadow offset
    }]
};

const config = {
    type: 'line',
    data: data,
    options: {
        animation: {
            duration: 0,
        },
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                title: {
                    display: true,
                    text: 'Time (s)'
                },
                ticks: {
                    callback: function(value) {
                        return Math.round(value); // Round seconds to the nearest whole number
                    }
                }
            },
            y: {
                beginAtZero: true,
                max: 100,
                title: {
                    display: true,
                    text: 'Rating'
                },
                grid: {
                    drawOnChartArea: false, // Remove horizontal grid lines
                    drawBorder: false
                }
            }
        }
    }
};

const ratingChart = new Chart(ctx, config);

function updateRating(value) {
    rating = value;
}

function addDataPoint() {
    if (!isRecording || isPaused) return;

    const now = Date.now();
    const elapsed = (now - lastUpdateTime) / 1000; // Time elapsed in seconds

    if (elapsed >= updateInterval / 1000) {
        const time = (now - startTime - (pauseStartTime || 0)) / 1000; // Adjust for pause
        data.labels.push(time);
        data.datasets[0].data.push(rating);

        // Update x-axis to keep up with new data
        const xMax = Math.max(...data.labels);
        ratingChart.options.scales.x.max = xMax + 5; // Buffer to keep some space at the end

        ratingChart.update();
        lastUpdateTime = now;
    }
}

// Update graph continuously
setInterval(addDataPoint, updateInterval);

// Download chart as image
function downloadChartAsImage() {
    const link = document.createElement('a');
    link.href = ratingChart.toBase64Image();
    link.download = 'chart.png';
    link.click();
}

// Toggle recording and pause
function toggleRecording() {
    if (isPaused) {
        // Resume recording
        isPaused = false;
        document.getElementById('recordingButton').innerText = '⏸'; // Pause icon
        lastUpdateTime = Date.now(); // Reset the lastUpdateTime when resuming
        startTime += Date.now() - pauseStartTime; // Adjust start time to account for pause duration
        pauseStartTime = 0; // Reset pause start time
    } else {
        // Pause recording
        isPaused = true;
        document.getElementById('recordingButton').innerText = '▶️'; // Play icon
        pauseStartTime = Date.now(); // Record the start time of the pause
    }
}

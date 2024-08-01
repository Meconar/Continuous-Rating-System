let rating = 50;
let isRecording = true;
let startTime = Date.now();
let lastUpdateTime = Date.now();
let pauseTime = 0;
let lastInteractionTime = Date.now();
const fastUpdateInterval = 10; // Fast update interval (10ms)
const slowUpdateInterval = 100; // Slow update interval (100ms)
const interactionTimeout = 30000; // 30 seconds timeout for fast updates

const ratingElement = document.getElementById('rating');
const ctx = document.getElementById('ratingChart').getContext('2d');

const data = {
    labels: [],
    datasets: [{
        label: 'Rating',
        data: [],
        borderColor: '#66b3ff', // Light blue for the line
        borderWidth: 3,
        fill: true,
        pointRadius: 0,
        tension: 1,
        backgroundColor: 'rgba(102, 179, 255, 0.2)', // Light blue shadow under the line
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
                        if (value < 240) {
                            return Math.round(value) + 's'; // Round seconds to the nearest whole number
                        } else if (value < 7200) {
                            return Math.round(value / 60) + 'm'; // Convert to minutes
                        } else {
                            return Math.round(value / 3600) + 'h'; // Convert to hours
                        }
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
    lastInteractionTime = Date.now(); // Update the last interaction time
}

function addDataPoint() {
    if (!isRecording) return;

    const now = Date.now();
    const elapsed = (now - lastUpdateTime) / 1000; // Time elapsed in seconds
    const totalTime = (now - startTime - pauseTime) / 1000;

    // Determine the current update interval
    const currentUpdateInterval = (now - lastInteractionTime < interactionTimeout) ? fastUpdateInterval : slowUpdateInterval;

    if (elapsed >= currentUpdateInterval / 1000) {
        data.labels.push(totalTime);
        data.datasets[0].data.push(rating);

        // Update x-axis to keep up with new data
        const xMax = Math.max(...data.labels);
        ratingChart.options.scales.x.max = xMax + 5; // Buffer to keep some space at the end

        ratingChart.update();
        lastUpdateTime = now;
    }
}

// Update graph continuously using requestAnimationFrame
function animate() {
    addDataPoint();
    requestAnimationFrame(animate);
}
animate();

// Download chart as image
function downloadChartAsImage() {
    const link = document.createElement('a');
    link.href = ratingChart.toBase64Image();
    link.download = 'chart.png';
    link.click();
}

// Toggle recording
function toggleRecording() {
    isRecording = !isRecording;
    document.getElementById('recordingButton').innerText = isRecording ? '⏸' : '▶'; // Pause and Play icons
    if (isRecording) {
        const now = Date.now();
        pauseTime += (now - lastUpdateTime);
        lastUpdateTime = now;
    }
}

// Event listener for slider interaction
ratingElement.addEventListener('input', () => {
    updateRating(ratingElement.value);
});
}

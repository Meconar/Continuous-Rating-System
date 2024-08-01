let rating = 50;
const ratingElement = document.getElementById('rating');
const currentRatingElement = document.getElementById('currentRating');
const ctx = document.getElementById('ratingChart').getContext('2d');
const data = {
    labels: [],
    datasets: [{
        label: 'Rating',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: false,
        tension: 0 // Straight lines
    }]
};

const config = {
    type: 'line',
    data: data,
    options: {
        animation: {
            duration: 0, // Disable all animations
        },
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                title: {
                    display: true,
                    text: 'Time (s)'
                }
            },
            y: {
                beginAtZero: true,
                max: 100,
                title: {
                    display: true,
                    text: 'Rating'
                }
            }
        }
    }
};

const ratingChart = new Chart(ctx, config);

function updateRating(value) {
    rating = value;
    currentRatingElement.innerText = value;
}

function adjustRating(change) {
    const newRating = Math.max(0, Math.min(100, rating + change));
    updateRating(newRating);
    ratingElement.value = newRating;
}

function addDataPoint() {
    const time = data.labels.length;
    data.labels.push(time);
    data.datasets[0].data.push(rating);
    ratingChart.update();
}

setInterval(addDataPoint, 1000);

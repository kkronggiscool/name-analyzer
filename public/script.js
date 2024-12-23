document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('nameForm');
    const nameInput = document.getElementById('nameInput');
    const nameChartCanvas = document.getElementById('nameChart').getContext('2d');

    let nameChart;

    // Define a set of vibrant colors for pie slices
    const colors = [
        "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#F9C74F", "#90BE6D",
        "#F94144", "#F3722C", "#F2A65A", "#FF6F91", "#9A4EAE", "#B1A7A6",
        "#2D98DA", "#FF1F3A", "#F0A500", "#2C6E49"
    ];

    const fetchNames = async () => {
        const res = await fetch('/api/names');
        const names = await res.json();

        // Count occurrences of each name
        const nameCounts = names.reduce((acc, name) => {
            acc[name] = (acc[name] || 0) + 1;
            return acc;
        }, {});

        // Get labels and data
        const labels = Object.keys(nameCounts);
        const data = Object.values(nameCounts);

        // Calculate percentages
        const total = data.reduce((sum, count) => sum + count, 0);
        const percentages = data.map(count => ((count / total) * 100).toFixed(2));

        // Update or create the chart
        if (nameChart) {
            nameChart.data.labels = labels;
            nameChart.data.datasets[0].data = percentages;
            nameChart.data.datasets[0].backgroundColor = labels.map((_, i) => colors[i % colors.length]);
            nameChart.update();
        } else {
            nameChart = new Chart(nameChartCanvas, {
                type: 'pie',
                data: {
                    labels,
                    datasets: [
                        {
                            data: percentages,
                            backgroundColor: labels.map((_, i) => colors[i % colors.length]),
                        },
                    ],
                },
                options: {
                    responsive: false, // Do not auto-scale
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: (tooltipItem) => {
                                    const label = tooltipItem.label || '';
                                    const percentage = tooltipItem.raw || 0;
                                    return `${label}: ${percentage}%`;
                                },
                            },
                        },
                        legend: {
                            position: 'bottom',
                            labels: {
                                boxWidth: 15,
                                padding: 10
                            }
                        },
                    },
                },
            });
        }
    };

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = nameInput.value.trim();
        if (name) {
            await fetch('/api/names', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
            nameInput.value = '';
            fetchNames();
        }
    });

    // Initial fetch
    fetchNames();
});

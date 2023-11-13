import React from 'react';

const Dashboard = () => {
    return (
        <div className="flex flex-row flex-wrap flex-grow mt-2">
            <div className="w-full md:w-1/2 xl:w-1/3 p-6">
                {/* Graph Card 1 */}
                <div className="bg-white border-transparent rounded-lg shadow-xl">
                    <div className="bg-gradient-to-b from-gray-300 to-gray-100 uppercase text-gray-800 border-b-2 border-gray-300 rounded-tl-lg rounded-tr-lg p-2">
                        <h2 className="font-bold uppercase text-gray-600">Proformace Bar Chart</h2>
                    </div>
                    <div className="p-5">
                        <canvas id="chartjs-7" className="chartjs" width="undefined" height="undefined"></canvas>
                        <script>
                            {`new Chart(document.getElementById("chartjs-7"), {
                                "type": "bar",
                                "data": {
                                    "labels": ["January", "February", "March", "April"],
                                    "datasets": [{
                                        "label": "Page Impressions",
                                        "data": [10, 20, 30, 40],
                                        "borderColor": "rgb(255, 99, 132)",
                                        "backgroundColor": "rgba(255, 99, 132, 0.2)"
                                    }, {
                                        "label": "Adsense Clicks",
                                        "data": [5, 15, 10, 30],
                                        "type": "line",
                                        "fill": false,
                                        "borderColor": "rgb(54, 162, 235)"
                                    }]
                                },
                                "options": {
                                    "scales": {
                                        "yAxes": [{
                                            "ticks": {
                                                "beginAtZero": true
                                            }
                                        }]
                                    }
                                }
                            })`}
                        </script>
                    </div>
                </div>
                {/* /Graph Card 1 */}
            </div>

            <div className="w-full md:w-1/2 xl:w-1/3 p-6">
                {/* Graph Card 2 */}
                <div className="bg-white border-transparent rounded-lg shadow-xl">
                    <div className="bg-gradient-to-b from-gray-300 to-gray-100 uppercase text-gray-800 border-b-2 border-gray-300 rounded-tl-lg rounded-tr-lg p-2">
                        <h2 className="font-bold uppercase text-gray-600"> Line Chart</h2>
                    </div>
                    <div className="p-5">
                        <canvas id="chartjs-0" className="chartjs" width="undefined" height="undefined"></canvas>
                        <script>
                            {`new Chart(document.getElementById("chartjs-0"), {
                                "type": "line",
                                "data": {
                                    "labels": ["January", "February", "March", "April", "May", "June", "July"],
                                    "datasets": [{
                                        "label": "Views",
                                        "data": [65, 59, 80, 81, 56, 55, 40],
                                        "fill": false,
                                        "borderColor": "rgb(75, 192, 192)",
                                        "lineTension": 0.1
                                    }]
                                },
                                "options": {}
                            })`}
                        </script>
                    </div>
                </div>
                {/* /Graph Card 2 */}
            </div>

            <div className="w-full md:w-1/2 xl:w-1/3 p-6">
                {/* Graph Card 3 */}
                <div className="bg-white border-transparent rounded-lg shadow-xl">
                    <div className="bg-gradient-to-b from-gray-300 to-gray-100 uppercase text-gray-800 border-b-2 border-gray-300 rounded-tl-lg rounded-tr-lg p-2">
                        <h2 className="font-bold uppercase text-gray-600">Pie Chart</h2>
                    </div>
                    <div className="p-5">
                        <canvas id="chartjs-1" className="chartjs" width="undefined" height="undefined"></canvas>
                        <script>
                            {`new Chart(document.getElementById("chartjs-1"), {
                                "type": "bar",
                                "data": {
                                    "labels": ["January", "February", "March", "April", "May", "June", "July"],
                                    "datasets": [{
                                        "label": "Likes",
                                        "data": [65, 59, 80, 81, 56, 55, 40],
                                        "fill": false,
                                        "backgroundColor": ["rgba(255, 99, 132, 0.2)", "rgba(255, 159, 64, 0.2)", "rgba(255, 205, 86, 0.2)", "rgba(75, 192, 192, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(153, 102, 255, 0.2)", "rgba(201, 203, 207, 0.2)"],
                                        "borderColor": ["rgb(255, 99, 132)", "rgb(255, 159, 64)", "rgb(255, 205, 86)", "rgb(75, 192, 192)", "rgb(54, 162, 235)", "rgb(153, 102, 255)", "rgb(201, 203, 207)"],
                                        "borderWidth": 1
                                    }]
                                },
                                "options": {
                                    "scales": {
                                        "yAxes": [{
                                            "ticks": {
                                                "beginAtZero": true
                                            }
                                        }]
                                    }
                                }
                            })`}
                        </script>
                    </div>
                </div>
                {/* /Graph Card 3 */}
            </div>

            <div className="w-full md:w-1/2 xl:w-1/3 p-6">
                {/* Graph Card 4 */}
                <div className="bg-white border-transparent rounded-lg shadow-xl">
                    <div className="bg-gradient-to-b from-gray-300 to-gray-100 uppercase text-gray-800 border-b-2 border-gray-300 rounded-tl-lg rounded-tr-lg p-2">
                        <h5 className="font-bold uppercase text-gray-600">Graph</h5>
                    </div>
                    <div className="p-5">
                        <canvas id="chartjs-4" className="chartjs" width="undefined" height="undefined"></canvas>
                        <script>
                            {`new Chart(document.getElementById("chartjs-4"), {
                                "type": "doughnut",
                                "data": {
                                    "labels": ["P1", "P2", "P3"],
                                    "datasets": [{
                                        "label": "Issues",
                                        "data": [300, 50, 100],
                                        "backgroundColor": ["rgb(255, 99, 132)", "rgb(54, 162, 235)", "rgb(255, 205, 86)"]
                                    }]
                                }
                            })`}
                        </script>
                    </div>
                </div>
                {/* /Graph Card 4 */}
            </div>
        </div>
    );
}

export default Dashboard;
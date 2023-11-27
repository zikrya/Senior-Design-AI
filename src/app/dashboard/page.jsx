"use client";

import Chart from 'chart.js/auto';
import React, { useEffect, useState } from 'react';
import Improvements from '../../components/improvements';

// ErrorBoundary component to catch and handle errors
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ hasError: true });
        // Log the error to an error reporting service (e.g., Sentry)
        console.error(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Fallback UI when an error occurs
            return <div>Something went wrong.</div>;
        }

        return this.props.children;
    }
}

const Dashboard = () => {
    const [userQuestions, setUserQuestions] = useState([]);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to save responses.');
                return;
            }

            const response = await fetch(`/api/user-questions`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include your actual access token
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUserQuestions(data);
            } else if (response.status === 401) {
                // Redirect to login page
                window.location.href = '/login';
            } else {
                console.error(`Error fetching user questions: ${response.statusText}`);
            }
        } catch (error) {
            setError('An error occurred while fetching data.');
            console.error('Fetch data error:', error);
        }
    };
    const renderBarChart = () => {
        const barChart = Chart.getChart('chartjs-7');
        const topics = [...new Set(userQuestions.map((entry) => entry.topic))]; // Get unique topics

        if (barChart) {
            // If chart already exists, update the data
            barChart.data.labels = topics;
            barChart.data.datasets[0].data = topics.map((topic) => {
                const filteredQuestions = userQuestions.filter((entry) => entry.topic === topic);
                const correctAnswersCount = filteredQuestions.filter((entry) => entry.isCorrect).length;
                return correctAnswersCount;
            });
            barChart.data.datasets[1].data = topics.map((topic) => {
                const filteredQuestions = userQuestions.filter((entry) => entry.topic === topic);
                const correctAnswersCount = filteredQuestions.filter((entry) => entry.isCorrect).length;
                const incorrectAnswersCount = filteredQuestions.length - correctAnswersCount;
                return incorrectAnswersCount;
            });
            barChart.update();
        } else {
            // If chart doesn't exist, create a new instance
            new Chart(document.getElementById('chartjs-7'), {
                type: 'bar',
                data: {
                    labels: topics,
                    datasets: [
                        {
                            label: 'Correct Answers',
                            data: topics.map((topic) => {
                                const filteredQuestions = userQuestions.filter((entry) => entry.topic === topic);
                                const correctAnswersCount = filteredQuestions.filter((entry) => entry.isCorrect).length;
                                return correctAnswersCount;
                            }),
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                        {
                            label: 'Incorrect Answers',
                            data: topics.map((topic) => {
                                const filteredQuestions = userQuestions.filter((entry) => entry.topic === topic);
                                const correctAnswersCount = filteredQuestions.filter((entry) => entry.isCorrect).length;
                                const incorrectAnswersCount = filteredQuestions.length - correctAnswersCount;
                                return incorrectAnswersCount;
                            }),
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1,
                        },
                    ],
                },
                options: {
                    scales: {
                        yAxes: [
                            {
                                ticks: {
                                    beginAtZero: true,
                                },
                            },
                        ],
                    },
                },
            });
        }
    };


    const renderLineChart = () => {
        const lineChart = Chart.getChart('chartjs-0');
        if (lineChart) {
            // If chart already exists, update the data
            const correctAnswersData = calculateDailyAverage(userQuestions, true);
            const incorrectAnswersData = calculateDailyAverage(userQuestions, false);

            lineChart.data.labels = Array.from(correctAnswersData.keys());
            lineChart.data.datasets[0].data = Array.from(correctAnswersData.values());
            lineChart.data.datasets[1].data = Array.from(incorrectAnswersData.values());

            lineChart.update();
        } else {
            // If chart doesn't exist, create a new instance
            new Chart(document.getElementById('chartjs-0'), {
                type: 'line',
                data: {
                    labels: Array.from(calculateDailyAverage(userQuestions, true).keys()),
                    datasets: [
                        {
                            label: 'Correct Answers',
                            data: Array.from(calculateDailyAverage(userQuestions, true).values()),
                            fill: false,
                            borderColor: 'rgb(75, 192, 192)',
                            lineTension: 0.1,
                        },
                        {
                            label: 'Incorrect Answers',
                            data: Array.from(calculateDailyAverage(userQuestions, false).values()),
                            fill: false,
                            borderColor: 'rgb(255, 99, 132)',
                            lineTension: 0.1,
                        },
                    ],
                },
                options: {},
            });
        }
    };

    const calculateDailyAverage = (data, isCorrect) => {
        const dailyData = data.reduce((acc, entry) => {
            const date = new Date(entry.createdAt).toLocaleDateString();

            if (!acc.has(date)) {
                acc.set(date, { sum: 0, count: 0 });
            }

            if ((isCorrect && entry.isCorrect) || (!isCorrect && !entry.isCorrect)) {
                acc.get(date).sum += 1;
            }
            acc.get(date).count += 1;

            return acc;
        }, new Map());

        // Ensure the result has an entry for every date
        const result = new Map(
            userQuestions.map(entry => {
                const date = new Date(entry.createdAt).toLocaleDateString();
                return [date, dailyData.has(date) ? dailyData.get(date).sum / dailyData.get(date).count : 0];
            })
        );

        return result;
    };

    const calculateTopicDistribution = (userQuestions) => {
        return userQuestions.reduce((acc, question) => {
            const topic = question.topic;

            if (!acc[topic]) {
                acc[topic] = 1;
            } else {
                acc[topic]++;
            }

            return acc;
        }, {});
    };

    const renderPieChart = () => {
        const existingChart = Chart.getChart('pie-chart');

        if (existingChart) {
            // If chart already exists, destroy it before creating a new one
            existingChart.destroy();
        }

        const topicDistribution = calculateTopicDistribution(userQuestions);

        const generateRandomColor = () => {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        };

        const backgroundColors = Object.keys(topicDistribution).map(() => generateRandomColor());

        new Chart(document.getElementById('pie-chart'), {
            type: 'pie',
            data: {
                labels: Object.keys(topicDistribution),
                datasets: [
                    {
                        data: Object.values(topicDistribution),
                        backgroundColor: backgroundColors,
                    },
                ],
            },
            options: {
                title: {
                    display: true,
                    text: 'Questions Distribution by Topic',
                },
            },
        });
    };


    const renderBarChart2 = () => {
        const existingChart = Chart.getChart('bar-chart');

        if (existingChart) {
            // If chart already exists, destroy it before creating a new one
            existingChart.destroy();
        }

        const today = new Date().toLocaleDateString();
        const dailyData = calculateDailyCorrectIncorrect(userQuestions, today);

        const topics = Object.keys(dailyData);
        const correctCounts = topics.map((topic) => dailyData[topic].correctCount);
        const incorrectCounts = topics.map((topic) => dailyData[topic].incorrectCount);

        new Chart(document.getElementById('bar-chart'), {
            type: 'bar',
            data: {
                labels: topics,
                datasets: [
                    {
                        label: 'Correct Answers',
                        data: correctCounts,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                    {
                        label: 'Incorrect Answers',
                        data: incorrectCounts,
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                title: {
                    display: true,
                    text: `Daily Correct and Incorrect Counts (${today})`,
                },
            },
        });
    };

    const calculateDailyCorrectIncorrect = (data, targetDate) => {
        return data.reduce((acc, entry) => {
            const date = new Date(entry.createdAt).toLocaleDateString();

            if (date === targetDate) {
                const topic = entry.topic;

                if (!acc[topic]) {
                    acc[topic] = { correctCount: 0, incorrectCount: 0 };
                }

                if (entry.isCorrect) {
                    acc[topic].correctCount += 1;
                } else {
                    acc[topic].incorrectCount += 1;
                }
            }

            return acc;
        }, {});
    };





    useEffect(() => {
        fetchData();
    }, []);


    useEffect(() => {
        if (userQuestions.length > 0) {
            renderBarChart();
            renderLineChart();
            renderPieChart();
            renderBarChart2();
        }
    }, [userQuestions]);


    return (
        <div className="flex flex-row flex-wrap flex-grow mt-2">
            {/* Bar Chart */}
            <div className="w-full md:w-1/2 xl:w-1/3 p-6">
                <div className="bg-white border-transparent rounded-lg shadow-xl">
                    <div className="bg-gradient-to-b from-gray-300 to-gray-100 uppercase text-gray-800 border-b-2 border-gray-300 rounded-tl-lg rounded-tr-lg p-2">
                        <h2 className="font-bold uppercase text-gray-600">Overall Performance</h2>
                    </div>
                    <div className="p-5">
                        <canvas id="chartjs-7" className="chartjs" width="undefined" height="undefined"></canvas>
                    </div>
                </div>
            </div>


            {/* Line Chart */}
            <div className="w-full md:w-1/2 xl:w-1/3 p-6">
                <div className="bg-white border-transparent rounded-lg shadow-xl">
                    <div className="bg-gradient-to-b from-gray-300 to-gray-100 uppercase text-gray-800 border-b-2 border-gray-300 rounded-tl-lg rounded-tr-lg p-2">
                        <h2 className="font-bold uppercase text-gray-600">Average Correct/Incorrect Answers per day</h2>
                    </div>
                    <div className="p-5">
                        <canvas id="chartjs-0" className="chartjs" width="undefined" height="undefined"></canvas>
                    </div>
                </div>
            </div>

            {/* barchart2 */}
            <div className="w-full md:w-1/2 xl:w-1/3 p-6">
                <div className="bg-white border-transparent rounded-lg shadow-xl">
                    <div className="bg-gradient-to-b from-gray-300 to-gray-100 uppercase text-gray-800 border-b-2 border-gray-300 rounded-tl-lg rounded-tr-lg p-2">
                        <h2 className="font-bold uppercase text-gray-600">Daily</h2>
                    </div>
                    <div className="p-5">
                        <canvas id="bar-chart" className="chartjs" width="undefined" height="undefined"></canvas>
                    </div>
                </div>
            </div>


            {/* pie chart   */}
            <div className="w-full md:w-1/2 xl:w-1/3 p-6">
                <div className="bg-white border-transparent rounded-lg shadow-xl">
                    <div className="bg-gradient-to-b from-gray-300 to-gray-100 uppercase text-gray-800 border-b-2 border-gray-300 rounded-tl-lg rounded-tr-lg p-2">
                        <h2 className="font-bold uppercase text-gray-600">Questions Done On Each Topic</h2>
                    </div>
                    <div className="p-5">
                        <canvas id="pie-chart" className="chartjs" width="undefined" height="undefined"></canvas>
                    </div>
                </div>
            </div>
            <div className="w-full md:w-1/2 xl:w-1/3 p-6">
                <div className="bg-white border-transparent rounded-lg shadow-xl">
                    <div className="bg-gradient-to-b from-gray-300 to-gray-100 uppercase text-gray-800 border-b-2 border-gray-300 rounded-tl-lg rounded-tr-lg p-2">
                        <h2 className="font-bold uppercase text-gray-600">Topics to Review</h2>
                    </div>
                    <div className="p-5">
                        <Improvements />
                    </div>
                </div>
            </div>
        </div>
    );
};


export default Dashboard;
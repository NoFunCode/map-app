"use client"
import { FC } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type AirbnbData = {
  month: number;
  price: number;
};

type AirbnbBarGraphProps = {
  data: AirbnbData[];
  error?: string;
};

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const Graph: FC<AirbnbBarGraphProps> = ({ data, error }) => {
  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Average Airbnb Prices by Month",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const chartData = {
    labels: data.map((d) => monthNames[d.month - 1]), // Convert month number to month name
    datasets: [
      {
        label: "Average Price",
        data: data.map((d) => d.price),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <Bar options={options} data={chartData} />;
};

export default Graph;

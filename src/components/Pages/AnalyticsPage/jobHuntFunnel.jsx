import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Typography, Box } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export default function JobHuntFunnel() {
  const [funnelData, setFunnelData] = useState({
    jobsSaved: 0,
    applications: 0,
    interviews: 0,
    offers: 0,
  });

  useEffect(() => {
    const fetchFunnelData = async () => {
      try {
        const response = await axios.get("/api/analytics/funnel");
        setFunnelData(response.data);
      } catch (error) {
        console.error("Error fetching funnel data:", error);
      }
    };

    fetchFunnelData();
  }, []);

  const data = {
    labels: ["Jobs Saved", "Applications", "Interviews", "Offers"],
    datasets: [
      {
        label: "Job Hunt Funnel",
        data: [
          funnelData.jobsSaved,
          funnelData.applications,
          funnelData.interviews,
          funnelData.offers,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
      datalabels: {
        anchor: 'center',
        align: 'center',
        formatter: (value) => value,
        color: 'black',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        display: false,
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    elements: {
      line: {
        borderWidth: 2,
        tension: 0.3,
      },
      point: {
        radius: 5,
        backgroundColor: 'rgba(75, 192, 192, 1)',
        borderColor: 'rgba(75, 192, 192, 1)',
      },
    },
  };

  return (
    <Box>
      <Typography variant="h6" >Job Hunt Funnel</Typography>
      <Bar data={data} options={options} />
    </Box>
  );
}

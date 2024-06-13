import React, { useEffect, useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import { Box, Typography, CircularProgress, Grid } from "@mui/material";
import axios from "axios";
import JobHuntFunnel from "./jobHuntFunnel";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    applicationsPerDay: [],
    applicationsByStatus: {},
    applicationsByType: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/analytics");
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
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
    <div className="container" style={{margin:"auto", width:"60%"}}>
      <Typography variant="h4" gutterBottom>
        Analytics Dashboard
      </Typography>
      
      <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h6">Applications Per Day</Typography>
            <Line
              data={{
                labels: data.applicationsPerDay.map((entry) => entry.day),
                datasets: [
                  {
                    label: "Applications",
                    data: data.applicationsPerDay.map((entry) => entry.applications),
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                  },
                ],
              }}
              options={{
                ...commonOptions,
                plugins: {
                  ...commonOptions.plugins,
                  datalabels: {
                    anchor: 'end',
                    align: 'end',
                    formatter: (value) => value,
                    color: 'black',
                    backgroundColor: 'white',
                    borderRadius: 3,
                    padding: 5,
                    font: {
                      size: 16,
                      weight: 'bold',
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
                    hoverRadius: 7,
                  },
                },
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h6">Applications by Status</Typography>
            <Bar
              data={{
                labels: Object.keys(data.applicationsByStatus),
                datasets: [
                  {
                    label: "Applications",
                    data: Object.values(data.applicationsByStatus),
                    backgroundColor: "rgba(153, 102, 255, 0.2)",
                    borderColor: "rgba(153, 102, 255, 1)",
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                ...commonOptions,
                plugins: {
                  ...commonOptions.plugins,
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
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h6">Applications by Type</Typography>
            <Pie
              data={{
                labels: Object.keys(data.applicationsByType),
                datasets: [
                  {
                    label: "Applications",
                    data: Object.values(data.applicationsByType),
                    backgroundColor: [
                      "rgba(255, 99, 132, 0.2)",
                      "rgba(54, 162, 235, 0.2)",
                      "rgba(255, 206, 86, 0.2)",
                      "rgba(75, 192, 192, 0.2)",
                      "rgba(153, 102, 255, 0.2)",
                      "rgba(255, 159, 64, 0.2)",
                    ],
                    borderColor: [
                      "rgba(255, 99, 132, 1)",
                      "rgba(54, 162, 235, 1)",
                      "rgba(255, 206, 86, 1)",
                      "rgba(75, 192, 192, 1)",
                      "rgba(153, 102, 255, 1)",
                      "rgba(255, 159, 64, 1)",
                    ],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    enabled: true,
                  },
                  datalabels: {
                    formatter: (value) => value,
                    color: 'black',
                    font: {
                      size: 16,
                      weight: 'bold',
                    },
                  },
                },
              }}
            />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box>
            <JobHuntFunnel />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default AnalyticsPage;

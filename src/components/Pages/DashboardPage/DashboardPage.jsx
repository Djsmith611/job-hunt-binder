import "./DashboardPage.css";
import useUser from "../../../modules/hooks/useUser";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserRequest } from "../../../modules/actions/loginActions";
import FolderButton from "../../Util/Buttons/FolderButton/FolderButton";

const days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

const getDayOfWeek = () => {
  const currentDayIndex = new Date().getDay();
  return { day: days[currentDayIndex], index: currentDayIndex };
};

const getSunday = () => {
  const date = new Date();
  const day = date.getDay();
  const diff = date.getDate() - day; // Get last Sunday's date
  return new Date(date.setDate(diff)).toISOString().split("T")[0];
};

const getSaturday = () => {
  const date = new Date();
  const day = date.getDay();
  const diff = date.getDate() + (6 - day); // Get upcoming Saturday's date
  return new Date(date.setDate(diff)).toISOString().split("T")[0];
};

const getHuntLength = (dateCreated) => {
  const createdDate = new Date(dateCreated);
  const currentDate = new Date();
  const timeDiff = Math.abs(currentDate - createdDate);
  const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return dayDiff;
};

export default function Dashboard() {
  const user = useUser();
  const fullName = `${user.f_name} ${user.l_name}`;
  const [huntLength, setHuntLength] = useState(0);
  const [readyCount, setReadyCount] = useState(0);
  const [applicationsPerDay, setApplicationsPerDay] = useState(
    new Array(7).fill(0)
  ); // Initialize with zeros
  const appliedCount = user.app_count;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { index } = getDayOfWeek();

  useEffect(() => {
    if (user.date_created) {
      setHuntLength(getHuntLength(user.date_created));
    }

    // Fetch applications per day data from the backend
    const fetchApplicationsPerDay = async () => {
      try {
        const response = await axios.get("/api/data/tracker", {
          params: {
            startDay: getSunday(), // Function to get the date of the last Sunday
            endDay: getSaturday(), // Function to get the date of the upcoming Saturday
          },
        });
        setApplicationsPerDay(response.data);
      } catch (error) {
        console.error("Error fetching applications per day:", error);
      }
    };

    fetchApplicationsPerDay();

    const fetchReadyCount = async () => {
      try {
        const readyResponse = await axios.get("/api/data/ready");
        setReadyCount(parseInt(readyResponse.data));
      } catch (error) {
        console.error("Error fetching readyCount:", error);
      }
    };

    fetchReadyCount();

  }, [user.date_created]);

  useEffect(() => {
    dispatch(fetchUserRequest());
  }, [dispatch]);

  return (
    <div className="dashboard">
      {/* <h1 className="binder-title">Welcome back, {fullName}!</h1> */}
      <div className="this-week">
        <h1>This Week's Applications</h1>
        <div className="days-container">
          <div className="days">
            {days.map((day, i) => (
              <div key={day} className={`day ${i <= index ? "past-day" : ""}`}>
                <p>{day}</p>
                <p>{applicationsPerDay[i].applications}</p>
              </div>
            ))}
            <div
              className="progress-bar"
              style={{
                width: `${((index + 1) / 7) * 100 - 10}%`,
                marginLeft: "5%",
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="dash-cont">
        <div className="message-box">
          <h3 className="message-one">
            You've been searching for{" "}
            <span className="message-count">
              {huntLength} {huntLength === 1 ? "day" : "days"}
            </span>
            , with{" "}
            <span className="message-count">{appliedCount} applications</span>.
          </h3>
        </div>
        <div className="message-box">
          <h3 className="message-one">
            <span className="message-count">
              {readyCount} {readyCount === 1 ? "job" : "jobs"}
            </span>{" "}
             marked ready to apply.
          </h3>
        </div>
        <div className="button-cont">
          <FolderButton
            text="Binder"
            clickFunction={() => navigate("/binder")}
          />
          <FolderButton
            text="Analytics"
            clickFunction={() => navigate("/analytics")}
          />
        </div>
      </div>
    </div>
  );
}

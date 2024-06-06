import "./DashboardPage.css";
import useUser from "../../../modules/hooks/useUser";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserRequest } from "../../../modules/actions/loginActions";
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
  }, [user.date_created]);

  useEffect(() => {
    dispatch(fetchUserRequest());
  }, [dispatch]);

  const messageRef = useRef(null);
  const messageRef2 = useRef(null);

  useEffect(() => {
    const lettering = (node) => {
      if (!node) return;
      let str = node.textContent;
      node.innerHTML = ""; // Clear the node's current content

      // Initialize the new HTML content
      let newHTML = "<span>";
      let closeTags = "</span>";

      // Iterate over each character of the string
      for (let i = 0, iCount = str.length; i < iCount; i++) {
        newHTML += str[i] + "<span>";
        closeTags += "</span>";
      }

      // Update the node's inner HTML with the new content
      node.innerHTML = newHTML + closeTags;
    };

    lettering(messageRef.current);

    lettering(messageRef2.current);
  }, []);

  return (
    <div className="dashboard">
      <h1 className="binder-title">Welcome back, {fullName}!</h1>
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
      <div className="binder">
        <div className="title-container"></div>
        <div className="dash">
          <div className="message-box">
            <div className="message-container">
              <h3 ref={messageRef} className="message-one">
                You've been searching for{" "}
              </h3>
              <div className="message-value">
                <span className="message-count">
                  {huntLength} {huntLength === 1 ? "day" : "days"}
                </span>
              </div>
            </div>
            <div className="button-cont">
              <button className="dash-btn" onClick={() => navigate('/binder')}>Binder</button>
              <button className="dash-btn" onClick={() => navigate('/analytics')}>Analytics</button>
            </div>
            <div className="message-container">
              <h3 ref={messageRef2} className="message-two">
                You've submitted{" "}
              </h3>
              <div className="message-value">
                <span className="message-count">
                  {appliedCount} applications!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

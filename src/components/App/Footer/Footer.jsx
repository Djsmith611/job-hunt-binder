import "./Footer.css";
import FolderButton from "../../Util/Buttons/FolderButton/FolderButton";
import { TextField } from "@mui/material";

export default function Footer() {
  return (
    <div className="around-footer">
      <div className="footer">
        <div className="footer-section-1">
          <div>
            <h5>Help</h5>
            <p>Email Prompt: info@huntbinder.com</p>
          </div>
        </div>
        <div className="footer-section-2">
          <h2>Job Hunt Binder</h2>
          <p>Attributions</p>
          <div className="subscribe-section">
            <h5>Stay Up-To-Date</h5>
            <form>
              <TextField type="email" label="Email Address" required />
              <FolderButton type="submit" text="Subscribe" />
            </form>
          </div>
        </div>
        <div className="footer-section-3">
          <h5>Legal</h5>
          <p>Terms & Conditions</p>
          <p>Copyright Notice</p>
          <p>Privacy Policy</p>
          <p>Cookie Policy</p>
          <p>Disclaimer</p>
        </div>
      </div>
    </div>
  );
}

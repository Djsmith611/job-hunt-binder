import "./ParallaxButton.css";

export default function ParallaxButton({ type, text, onClickFunction }) {
  return (
    <div className="parallax-button-container" onClick={onClickFunction}>
      <div className="parallax-button-inner">
        <button type={type} className="parallax-button">
          {text}
        </button>
      </div>
    </div>
  );
}

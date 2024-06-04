import './ParallaxButton.css';

export default function ParallaxButton({ type, text, onClickFunction }) {
  return (
    <div className="parallax-button-container">
      <div className="parallax-button-inner">
        <button
          type={type}
          className="parallax-button"
          onClick={onClickFunction}
        >
          {text}
        </button>
      </div>
    </div>
  );
}
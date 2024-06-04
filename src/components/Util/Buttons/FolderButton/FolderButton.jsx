import "./FolderButton.css";

export default function FolderButton({ type, text, clickFunction }) {
  return (
    <button type={type} className="button" onClick={clickFunction}>
      {text}
    </button>
  );
}

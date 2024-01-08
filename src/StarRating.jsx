const ContainerStyle = {
  display: "flex",
  alignItem: "centre",
  gap: "16px",
};
const StarContainerStyle = {
  display: "flex",
  gap: "4px",
};
const textStyle = {
  lineHeight: "1",
  margin: "0",
};

function StarRating({ maxRating }) {
  return (
    <div style={ContainerStyle}>
      <div style={StarContainerStyle}>
        {Array.from({ length: maxRating }, (_, i) => (
          <span key={i}>⭐️ {i + 1}</span>
        ))}
      </div>
      <p style={textStyle}>10</p>
    </div>
  );
}

export default StarRating;

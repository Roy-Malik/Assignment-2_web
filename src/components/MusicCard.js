function MusicCard({ title, description }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p>{description}</p>
      <button className="play-btn">▶ Play</button>
    </div>
  );
}
export default MusicCard;
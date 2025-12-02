import "../app.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">Purbeli News</div>
      <ul className="nav-links">
        <li>Home</li>
        <li>Politics</li>
        <li>Sports</li>
        <li>Entertainment</li>
        <li>Technology</li>
      </ul>
    </nav>
  );
}

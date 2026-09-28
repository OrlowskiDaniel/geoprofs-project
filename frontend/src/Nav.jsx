import { Link } from "react-router-dom";
import Logo from "./assets/FinalProfs.png";

export default function Nav() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <div className="flex flex-row items-center h-16 w-full bg-[#6D28D9] px-6">
        
        <Link to="/Home">
          <img
            src={Logo}
            alt="GeoProfs"
            className="h-12 w-auto"
          />
        </Link>

        <nav>
          <Link to="/profile">Profile</Link>
        </nav>

      </div>
    </div>
  );
}

import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav>
      <NavLink to="/">Brew</NavLink>
      <NavLink to="/config">Configure</NavLink>
    </nav>
  )
}
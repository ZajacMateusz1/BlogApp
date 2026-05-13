import { NavLink } from "react-router-dom";

interface MobileNavProps {
  links: { name: string; link: string }[];
}
export default function MobileNav({ links }: MobileNavProps) {
  return (
    <nav className="md:hidden">
      {links.map((link) => (
        <NavLink to={link.link} key={link.link}>
          {link.name}
        </NavLink>
      ))}
    </nav>
  );
}

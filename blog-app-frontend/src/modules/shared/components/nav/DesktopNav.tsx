import { NavLink } from "react-router-dom";
interface DesktopNavProps {
  links: { name: string; link: string }[];
}
export default function DesktopNav({ links }: DesktopNavProps) {
  return (
    <nav className="max-w-5xl mx-auto p-4 hidden md:block">
      <ul className="flex justify-end gap-4">
        {links.map((link) => (
          <NavLink to={link.link} key={link.name}>
            {link.name}
          </NavLink>
        ))}
      </ul>
    </nav>
  );
}

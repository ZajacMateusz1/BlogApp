import { type ComponentPropsWithoutRef } from "react";
import { Search } from "lucide-react";
interface SearchBarProps extends ComponentPropsWithoutRef<"input"> {
  children: string;
  id: string;
}
export default function SearchBar({ children, id, ...props }: SearchBarProps) {
  return (
    <div className="text-center w-full">
      <label
        className="font-bold text-center text-lg md:text-xl lg:text-2xl block mb-1 md:mb-2 lg:mb-4"
        htmlFor={id}
      >
        {children}
      </label>
      <div className="flex gap-2 p-2 rounded-md border border-border-light focus-within:border-primary">
        <Search className="pointer-events-none" />
        <input
          className="border-none outline-0 grow lg:text-lg"
          id={id}
          type="search"
          placeholder="Type 3 first letter"
          {...props}
        />
      </div>
    </div>
  );
}

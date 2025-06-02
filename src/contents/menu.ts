export type MenuItem = {
  name: string;
  href: string;
};

export const menu: MenuItem[] = [
  { name: "Home", href: "/" },
  { name: "Writing", href: "/writing" },
  { name: "Experience", href: "/experience" },
  { name: "About", href: "/about" },
];

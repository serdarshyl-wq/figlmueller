
export const NAV_LINKS = [
  {
    label: "About",
    href: "/about",
    submenu: [
      { label: "About", href: "/about" },
      {
        label: "Engineering philosophy",
        href: "/about",
        section: "engineering-philosophy",
      },
      { label: "Mission & vision", href: "/about", section: "mission-vision" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    /* Each of these lights the sheet with a picture of its own on hover. */
    submenu: [
      {
        label: "Automation & Control",
        href: "/services-automation-control",
        image: "/services-assets/services-dummy1.jpeg",
      },
      {
        label: "Custom Machinery",
        href: "/services-custom-machinery",
        image: "/services-assets/services-dummy2.jpeg",
      },
      {
        label: "Applications",
        href: "/services-app-locations-areas",
        image: "/services-assets/services-dummy3.jpeg",
      },
    ],
  },
  { label: "Contact", href: "/contact" },
  { label: "Citrine® Machine", href: "/citrine" },
  { label: "Resources", href: "/resources" },
];

const half = Math.ceil(NAV_LINKS.length / 2);

export const NAV_LINKS_LEFT = NAV_LINKS.slice(0, half);
export const NAV_LINKS_RIGHT = NAV_LINKS.slice(half);

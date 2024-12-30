import {
  BellIcon,
  BookmarkIcon,
  HomeIcon,
  MailIcon,
  SettingsIcon
} from "lucide-react";

export const sidebarItems = [
  {
    icon: HomeIcon,
    label: "Home",
    href: "/"
  },
  {
    icon: BellIcon,
    label: "Notifications",
    href: "/notifications"
  },
  {
    icon: MailIcon,
    label: "Messages",
    href: "/messages"
  },
  {
    icon: BookmarkIcon,
    label: "Bookmarks",
    href: "/bookmarks"
  },
  {
    icon: SettingsIcon,
    label: "Settings",
    href: "/settings"
  }
];

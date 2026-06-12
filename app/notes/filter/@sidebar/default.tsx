import SidebarNotes from "./SidebarNotes";

const TAGS = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

export default function SidebarDefault() {
  return <SidebarNotes tags={TAGS} />;
}

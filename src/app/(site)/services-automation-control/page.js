import ServicesAutomationControl from "@/components/sections/services/ServicesAutomationControl";
import PageTransition from "@/components/layout/PageTransition";

export const metadata = {
  title: "Automation & Control — Figlmueller Ind | L.L.C",
  description:
    "PLC-driven automation and control built into every Figlmueller machine — one interface for the full production cycle.",
};

export default function AutomationControlPage() {
  return (
    <PageTransition>
      <main className="flex-1 bg-bone text-black">
        <ServicesAutomationControl />
      </main>
    </PageTransition>
  );
}

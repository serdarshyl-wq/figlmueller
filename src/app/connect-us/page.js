import ConnectPanel from "@/components/sections/connect/ConnectPanel";
import PageTransition from "@/components/layout/PageTransition";

export const metadata = {
  title: "Connect — Figlmueller Ind | L.L.C",
  description:
    "Project enquiries — tell us about yourself and we will get back to you as soon as we can.",
};

export default function ConnectUsPage() {
  return (
    <PageTransition>
      <main className="flex-1 bg-bone text-black">
        <ConnectPanel />
      </main>
    </PageTransition>
  );
}

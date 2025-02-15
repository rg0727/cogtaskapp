import React from "react";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BrainAnalyticsDashboard from "@/components/BrainAnalyticsData";

export default function Dashboard() {
  return (
    // <div className="min-h-screen bg-gray-100">
    //   <main className="container mx-auto px-4 py-8">
    //     <h1 className="text-3xl font-bold mb-4">Welcome to Your Dashboard</h1>
    //     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //       <div className="bg-white p-6 rounded-lg shadow">
    //         <h2 className="text-xl font-semibold mb-2">Activities</h2>
    //         <p className="mb-4">Choose between learning activities or games.</p>
    //         <Link href="/activity">
    //           <Button>Go to Activities</Button>
    //         </Link>
    //       </div>
    //       <div className="bg-white p-6 rounded-lg shadow">
    //         <h2 className="text-xl font-semibold mb-2">Your Progress</h2>
    //         <p className="mb-4">Track your learning journey here.</p>
    //         <Button variant="outline">View Progress</Button>
    //       </div>
    //     </div>
    //   </main>
    // </div>
    <BrainAnalyticsDashboard />
  );
}

"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function BrainNeuralNetwork() {
  const neurons = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 200 - 100,
    y: Math.random() * 160 - 80,
  }));

  const connections = neurons.flatMap((neuron, i) =>
    neurons
      .slice(i + 1)
      .filter(() => Math.random() > 0.7)
      .map((otherNeuron, j) => ({
        id: `${i}-${j}`,
        x1: neuron.x,
        y1: neuron.y,
        x2: otherNeuron.x,
        y2: otherNeuron.y,
        opacity: Math.random() * 0.2 + 0.1,
      }))
  );

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full text-blue-900/40 dark:text-blue-400/40"
        viewBox="-100 -80 200 160"
        fill="none"
      >
        <title>Brain Neural Network</title>
        {connections.map((connection) => (
          <motion.line
            key={connection.id}
            x1={connection.x1}
            y1={connection.y1}
            x2={connection.x2}
            y2={connection.y2}
            stroke="currentColor"
            strokeWidth={0.5}
            strokeOpacity={connection.opacity}
            initial={{ pathLength: 0 }}
            animate={{
              pathLength: [0, 1, 0],
              opacity: [0, connection.opacity, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
        {neurons.map((neuron) => (
          <motion.circle
            key={neuron.id}
            cx={neuron.x}
            cy={neuron.y}
            r={1.5}
            fill="currentColor"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1, 0] }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

const overviewData = [
  { name: "Mon", reactionTime: 250, memoryAccuracy: 80, taskCompletion: 90 },
  { name: "Tue", reactionTime: 240, memoryAccuracy: 85, taskCompletion: 92 },
  { name: "Wed", reactionTime: 230, memoryAccuracy: 90, taskCompletion: 95 },
  { name: "Thu", reactionTime: 220, memoryAccuracy: 88, taskCompletion: 93 },
  { name: "Fri", reactionTime: 210, memoryAccuracy: 92, taskCompletion: 97 },
  { name: "Sat", reactionTime: 200, memoryAccuracy: 95, taskCompletion: 98 },
  { name: "Sun", reactionTime: 205, memoryAccuracy: 93, taskCompletion: 96 },
];

const performanceData = [
  { name: "Memory", score: 85 },
  { name: "Problem Solving", score: 78 },
  { name: "Attention", score: 90 },
  { name: "Processing Speed", score: 82 },
];

const healthData = [
  { name: "Sleep", value: 35 },
  { name: "Exercise", value: 25 },
  { name: "Nutrition", value: 20 },
  { name: "Stress", value: 20 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function BrainAnalyticsDashboard() {
  return (
    <div className="relative min-h-screen w-full bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <BrainNeuralNetwork />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200">
          Cognitive Performance Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Overview Panel */}
          <Card className="col-span-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Reaction Time
                  </p>
                  <p className="text-2xl font-bold">205ms</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Memory Accuracy
                  </p>
                  <p className="text-2xl font-bold">93%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Task Completion
                  </p>
                  <p className="text-2xl font-bold">96%</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={overviewData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="reactionTime"
                    stroke="#8884d8"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="memoryAccuracy"
                    stroke="#82ca9d"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="taskCompletion"
                    stroke="#ffc658"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Details Panel */}
          <Card className="col-span-full md:col-span-1 lg:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Performance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Health Insights Panel */}
          <Card className="col-span-full md:col-span-1 lg:col-span-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Health Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={healthData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {healthData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                Improved sleep correlates with better memory accuracy. Consider
                maintaining a consistent sleep schedule.
              </p>
            </CardContent>
          </Card>

          {/* Personalized Feedback Panel */}
          <Card className="col-span-full md:col-span-1 lg:col-span-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Personalized Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-lg font-semibold text-green-600 dark:text-green-400">
                Your reaction time has improved by 10% over the past month!
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                To further enhance your cognitive performance, consider:
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-300">
                <li>Practicing mindfulness meditation for 10 minutes daily</li>
                <li>Incorporating more omega-3 rich foods in your diet</li>
                <li>
                  Trying new problem-solving games to challenge different
                  cognitive skills
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Historical Trends Panel */}
          <Card className="col-span-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Historical Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={overviewData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="reactionTime"
                    stroke="#8884d8"
                  />
                  <Line
                    type="monotone"
                    dataKey="memoryAccuracy"
                    stroke="#82ca9d"
                  />
                  <Line
                    type="monotone"
                    dataKey="taskCompletion"
                    stroke="#ffc658"
                  />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 flex justify-between">
                <Button variant="outline" size="sm">
                  Last 7 Days
                </Button>
                <Button variant="outline" size="sm">
                  Last 30 Days
                </Button>
                <Button variant="outline" size="sm">
                  Last 3 Months
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

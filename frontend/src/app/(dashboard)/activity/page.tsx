import Link from "next/link";
import { GamepadIcon as GameController, BookOpen } from "lucide-react";

const games = [
  { id: 1, title: "Game 1" },
  { id: 2, title: "Game 2" },
  { id: 3, title: "Game 3" },
];

export default function Activity() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Activity</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Games Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <GameController className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Games</h2>
            </div>
            <ul className="space-y-2">
              {games.map((game) => (
                <li key={game.id}>
                  <Link
                    href={`/activity/game/game${game.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {game.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Learning Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Link
            href="/activity/learning"
            className="block p-6 hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-center mb-4">
              <BookOpen className="w-6 h-6 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Learning</h2>
            </div>
            <p className="text-gray-600">Explore your learning activities</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

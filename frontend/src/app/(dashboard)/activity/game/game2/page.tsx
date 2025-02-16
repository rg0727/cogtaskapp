import VideoCapture from "@/components/VideoCapture";

export default function Page() {
  return (
    <div>
      <h1 className="text-xl font-bold">Game 2</h1>
      <p>Welcome to Game 2! Test your skills with this challenge.</p>
      <VideoCapture game_id={2}/>
    </div>
  );
}

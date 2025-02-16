import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ParsedTask {
  title: string;
  scenarioDescription: string;
  taskInstructions: string[];
  questions: string[];
  skillsTested: string[];
}

function parseTaskText(text: string): ParsedTask {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");

  const title =
    lines
      .find((line) => line.startsWith("**Task:"))
      ?.replace("**Task:", "")
      .trim() || "Untitled Task";

  const scenarioIndex = lines.findIndex((line) =>
    line.startsWith("1. **Scenario Description**:")
  );
  const taskInstructionIndex = lines.findIndex((line) =>
    line.startsWith("2. **Task Instruction**:")
  );
  const questionIndex = lines.findIndex((line) =>
    line.startsWith("3. **Question**:")
  );

  const scenarioDescription = lines[scenarioIndex + 1] || "";

  const taskInstructions = lines
    .slice(taskInstructionIndex + 1, questionIndex)
    .filter((line) => line.startsWith("-"))
    .map((line) => line.replace("-", "").trim());

  const questions = lines
    .slice(questionIndex + 1)
    .filter((line) => line.startsWith("-"))
    .map((line) => line.replace("-", "").trim());

  const skillsTested = lines
    .slice(
      lines.findIndex((line) => line.includes("encourages users to use")) + 1
    )
    .map((skill) => skill.replace("and", ",").trim())
    .flatMap((skill) => skill.split(","))
    .map((skill) => skill.trim())
    .filter((skill) => skill !== "");

  return {
    title,
    scenarioDescription,
    taskInstructions,
    questions,
    skillsTested,
  };
}

interface TaskCardProps {
  taskText: string;
}

export default function TaskCard({ taskText }: TaskCardProps) {
  const parsedTask = parseTaskText(taskText);

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>{parsedTask.title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div>
          <h3 className="font-semibold mb-2">Scenario Description:</h3>
          <p>{parsedTask.scenarioDescription}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Task Instructions:</h3>
          <ul className="list-disc pl-5 space-y-1">
            {parsedTask.taskInstructions.map((instruction, index) => (
              <li key={index}>{instruction}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Questions:</h3>
          <ul className="list-disc pl-5 space-y-1">
            {parsedTask.questions.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Skills Tested:</h3>
          <ul className="list-disc pl-5 space-y-1">
            {parsedTask.skillsTested.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

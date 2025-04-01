import { useRef, type FormEvent } from "react";

interface NewGoalProps {
  onAdd: (text: string, summary: string) => void;
}

function clearInputs() {
  const goalInput = document.querySelector("#goal") as HTMLInputElement;
  const summaryInput = document.querySelector("#summary") as HTMLInputElement;

  goalInput.value = "";
  summaryInput.value = "";
}

export default function NewGoal({ onAdd }: NewGoalProps) {
  const goalRef = useRef<HTMLInputElement>(null);
  const summaryRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const enteredGoal = goalRef.current!.value;
    const enteredSummary = goalRef.current!.value;

    // validation...

    onAdd(enteredGoal, enteredSummary);
    clearInputs();
  }

  return (
    <form onSubmit={handleSubmit}>
      <p>
        <label htmlFor="goal">Your goal</label>
        <input id="goal" type="text" ref={goalRef}></input>
      </p>
      <p>
        <label htmlFor="summary">Short summary </label>
        <input id="summary" type="text" ref={summaryRef}></input>
      </p>
      <p>
        <button>Add goal</button>
      </p>
    </form>
  );
}

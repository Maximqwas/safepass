import PasswordChecker from "./components/PasswordChecker";
import PasswordGenerator from "./components/PasswordGenerator";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">SafePass MVP</h1>
      <PasswordChecker />
      <PasswordGenerator />
    </div>
  );
}

export default App;

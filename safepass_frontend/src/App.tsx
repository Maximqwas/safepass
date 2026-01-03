import PasswordChecker from "./components/PasswordChecker";
import PasswordGenerator from "./components/PasswordGenerator";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6 text-center">
      <div className="max-w-4xl w-full space-y-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">🔐 SafePass MVP</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <PasswordChecker />
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <PasswordGenerator />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

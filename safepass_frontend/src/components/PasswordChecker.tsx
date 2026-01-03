import { useState } from "react";
import axios from "axios";
export default function PasswordChecker() {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);

  const checkPassword = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/check", { password });
      console.log(res.data);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setResult(null);
    }
  };

  const getStrengthColor = (score: number) => {
    if (score < 50) return "from-red-400 to-red-600";
    if (score < 75) return "from-yellow-400 to-yellow-600";
    return "from-green-400 to-green-600";
  };

  const getStrengthText = (score: number) => {
    if (score < 50) return "Слабкий";
    if (score < 75) return "Середній";
    return "Сильний";
  };

  return (
    <div className="text-center" style={{ textAlign: 'center' }}>
      <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center justify-center">
        🔍 Перевірка пароля
      </h2>
      <div className="space-y-4 text-center">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введіть пароль"
            className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        <button
          onClick={checkPassword}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          🔍 Перевірити
        </button>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4 text-center">
          <div>
            <div className="flex justify-center items-center mb-2">
              <p className="font-medium text-gray-700 mr-2">Сила паролю:</p>
              <span className="text-sm font-semibold text-gray-600">
                {getStrengthText(result.score_percent)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mx-auto max-w-xs">
              <progress
                className="w-full h-3 rounded-full"
                value={result.score_percent}
                max="100"
                style={{
                  backgroundColor: '#e5e7eb',
                  borderRadius: '9999px',
                }}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {result.score_percent}% (0–100)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm max-w-md mx-auto text-center">
            <div className="bg-white p-3 rounded-lg shadow-sm text-center">
              <p className="text-gray-600">Ентропія: {result.entropy_bits?.toFixed(2) ?? "N/A"} біт</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm text-center">
              <p className="text-gray-600">Алфавіт: {result.alphabet_size ?? "N/A"} символів</p>
            </div>
          </div>

          {result.feedback?.message && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 max-w-md mx-auto text-center">
              <p className="text-green-800 flex items-center justify-center">
                ✅ {result.feedback.message}
              </p>
            </div>
          )}
          {result.feedback?.suggestions?.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-md mx-auto text-center">
              <p className="text-blue-800 font-medium mb-2 text-center">💡 Рекомендації:</p>
              <ul className="list-disc list-inside space-y-1 text-blue-700 text-center">
                {result.feedback.suggestions.map((s: string, i: number) => (
                  <li key={i} className="text-left">{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

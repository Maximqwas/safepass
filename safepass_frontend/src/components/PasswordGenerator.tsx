import { useState } from "react";
import axios from "axios";

export default function PasswordGenerator() {
  const [length, setLength] = useState(12);
  const [password, setPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<any>(null);

  const generatePassword = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/generate?length=${length}`);
      console.log(res.data);
      const newPassword = res.data.password;
      setPassword(newPassword);
      // Автоматически проверяем силу пароля
      checkPasswordStrength(newPassword);
    } catch (err) {
      console.error(err);
      setPassword("");
      setPasswordStrength(null);
    }
  };

  const checkPasswordStrength = async (pwd: string) => {
    try {
      const res = await axios.post("http://localhost:8000/api/check", { password: pwd });
      setPasswordStrength(res.data);
    } catch (err) {
      console.error(err);
      setPasswordStrength(null);
    }
  };

  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      alert("Пароль скопійовано!");
    }
  };

  const getStrengthColor = (score: number) => {
    if (score < 50) return "from-red-400 to-red-600";
    if (score < 75) return "from-yellow-400 to-yellow-600";
    return "from-green-400 to-green-600";
  };

  const getStrengthText = (score: number) => {
    if (score < 50) return "Слабый";
    if (score < 75) return "Средний";
    return "Сильный";
  };

  return (
    <div className="text-center" style={{ textAlign: 'center' }}>
      <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center justify-center">
        🔑 Генератор паролів
      </h2>
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <label className="font-medium text-gray-700">Довжина:</label>
          <input
            type="number"
            value={length}
            min={6}
            max={32}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-20 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          <span className="text-sm text-gray-500">символів (6-32)</span>
        </div>
        <button
          onClick={generatePassword}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          ⚡ Згенерувати
        </button>
      </div>

      {password && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="flex-1 max-w-md">
              <p className="text-sm text-gray-600 mb-1">Згенерований пароль:</p>
              <p className="font-mono text-lg bg-white p-3 rounded-lg border break-all text-center">
                {password}
              </p>
            </div>
            <button
              onClick={copyToClipboard}
              className="ml-3 bg-gray-200 hover:bg-gray-300 text-gray-700 p-2 rounded-lg transition-colors duration-200"
              title="Копировать"
            >
              📋
            </button>
          </div>

          {passwordStrength && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-center items-center mb-2">
                  <p className="font-medium text-gray-700 mr-2">Сила паролю:</p>
                  <span className="text-sm font-semibold text-gray-600">
                    {getStrengthText(passwordStrength.score_percent)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mx-auto max-w-xs">
                  <progress
                    className="w-full h-4 rounded-full"
                    value={passwordStrength.score_percent}
                    max="100"
                    style={{
                      backgroundColor: '#e5e7eb',
                      borderRadius: '9999px',
                    }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {passwordStrength.score_percent}%
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm max-w-md mx-auto text-center">
                <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                  <p className="text-gray-600">Ентропія: {passwordStrength.entropy_bits?.toFixed(2) ?? "N/A"} біт</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm text-center">
                  <p className="text-gray-600">Алфавіт: {passwordStrength.alphabet_size ?? "N/A"} символів</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

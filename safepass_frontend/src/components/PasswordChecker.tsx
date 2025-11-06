import { useState } from "react";
import axios from "axios";

export default function PasswordChecker() {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<any>(null);

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

  // Максимальное значение для шкалы сложности
  const maxLog = 10; // можно подстроить по максимуму логарифма попыток

  return (
    <div className="p-4 border rounded max-w-md mx-auto mt-6">
      <h2 className="text-xl font-bold mb-2">Проверка пароля</h2>
      <input
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Введите пароль"
        className="border p-2 w-full mb-2"
      />
      <button
        onClick={checkPassword}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Проверить
      </button>

      {result && (
        <div className="mt-4 p-2 border rounded bg-gray-50 space-y-2">
          {/* Прогрессбар для оценки */}
          <div>
            <p className="mb-1 font-medium">Оценка:</p>
            <div className="w-full bg-gray-200 rounded h-4">
              <div
                className="bg-green-500 h-4 rounded"
                style={{ width: `${(result.score / 4) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">{result.score} из 4</p>
          </div>

          {/* Примерное количество попыток */}
          <p>Примерное количество попыток: {result.guesses ?? "N/A"}</p>

          {/* Прогрессбар для сложности */}
          <div>
            <p className="mb-1 font-medium">Сложность:</p>
            <div className="w-full bg-gray-200 rounded h-4">
              <div
                className="bg-yellow-500 h-4 rounded"
                style={{
                  width: `${
                    result.guesses_log10
                      ? Math.min((result.guesses_log10 / maxLog) * 100, 100)
                      : 0
                  }%`,
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              {result.guesses_log10?.toFixed(2) ?? "N/A"} из {maxLog}
            </p>
          </div>

          {result.feedback?.warning && (
            <p className="text-red-600">⚠️ {result.feedback.warning}</p>
          )}
          {result.feedback?.suggestions?.length > 0 && (
            <ul className="list-disc list-inside">
              {result.feedback.suggestions.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

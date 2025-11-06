import { useState } from "react";
import axios from "axios";

export default function PasswordGenerator() {
  const [length, setLength] = useState(12);
  const [password, setPassword] = useState("");

  const generatePassword = async () => {
    try {
        const res = await axios.get(`http://localhost:8000/api/generate?length=${length}`);
        console.log(res.data); // ✅ проверяем данные
        setPassword(res.data.password);
    } catch (err) {
        console.error(err);
        setPassword("");
    }
    };


  return (
    <div className="p-4 border rounded max-w-md mx-auto mt-6">
      <h2 className="text-xl font-bold mb-2">Генератор паролей</h2>
      <div className="flex items-center mb-2">
        <label className="mr-2">Длина:</label>
        <input
          type="number"
          value={length}
          min={6}
          max={32}
          onChange={(e) => setLength(Number(e.target.value))}
          className="border p-1 w-16"
        />
      </div>
      <button
        onClick={generatePassword}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Сгенерировать
      </button>
      {password && (
        <div className="mt-4 p-2 border rounded bg-gray-50">
          <p className="font-mono">{password}</p>
        </div>
      )}
    </div>
  );
}

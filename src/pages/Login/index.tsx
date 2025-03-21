import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Phone, Lock } from "lucide-react";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    try {
      const response = await axios.post("http://localhost:3000/auth/sign-in", {
        phone,
        password,
      });
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Usuário ou senha inválidos");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
      <div className="w-full max-w-md p-8 shadow-2xl bg-white rounded-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Playfieldz</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <div className="space-y-6">
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="tel"
              placeholder="Telefone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <button
            onClick={handleLogin}
            className="w-full p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-semibold"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}

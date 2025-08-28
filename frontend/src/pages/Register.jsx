import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import MessagePopup from "../components/MessagePopup";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    siape: "",
    cpf: "",
    username: "",
    email: "",
    cellphone: "",
    password: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Validações
  const validations = {
    firstName: (value) => {
      if (!value.trim()) return "Nome é obrigatório";
      if (value.length < 2) return "Nome deve ter pelo menos 2 caracteres";
      if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/.test(value)) return "Nome deve conter apenas letras";
      return "";
    },
    lastName: (value) => {
      if (!value.trim()) return "Sobrenome é obrigatório";
      if (value.length < 2) return "Sobrenome deve ter pelo menos 2 caracteres";
      if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/.test(value)) return "Sobrenome deve conter apenas letras";
      return "";
    },
    email: (value) => {
      if (!value) return "Email é obrigatório";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Email inválido";
      return "";
    },
    cpf: (value) => {
      const cleanCPF = value.replace(/\D/g, "");
      if (!cleanCPF) return "CPF é obrigatório";
      if (cleanCPF.length !== 11) return "CPF deve ter 11 dígitos";
      return "";
    },
    siape: (value) => {
      const cleanSIAPE = value.replace(/\D/g, "");
      if (!cleanSIAPE) return "SIAPE é obrigatório";
      if (cleanSIAPE.length !== 7) return "SIAPE deve ter 7 dígitos";
      return "";
    },
    username: (value) => {
      if (!value) return "Nome de usuário é obrigatório";
      if (value.length < 3) return "Nome de usuário deve ter pelo menos 3 caracteres";
      if (!/^[a-zA-Z0-9_]*$/.test(value)) return "Nome de usuário deve conter apenas letras, números e _";
      return "";
    },
    password: (value) => {
      if (!value) return "Senha é obrigatória";
      if (value.length < 8) return "Senha deve ter pelo menos 8 caracteres";
      if (!/[A-Z]/.test(value)) return "Senha deve conter pelo menos uma letra maiúscula";
      if (!/[a-z]/.test(value)) return "Senha deve conter pelo menos uma letra minúscula";
      if (!/[0-9]/.test(value)) return "Senha deve conter pelo menos um número";
      if (!/[!@#$%^&*]/.test(value)) return "Senha deve conter pelo menos um caractere especial (!@#$%^&*)";
      return "";
    },
    confirmPassword: (value) => {
      if (!value) return "Confirmação de senha é obrigatória";
      if (value !== formData.password) return "As senhas não coincidem";
      return "";
    },
    cellphone: (value) => {
      const cleanPhone = value.replace(/\D/g, "");
      if (!cleanPhone) return "Telefone é obrigatório";
      if (cleanPhone.length !== 11) return "Telefone deve ter 11 dígitos";
      return "";
    }
  };

  // Formatadores
  const formatters = {
    cpf: (value) => {
      return value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
    },
    cellphone: (value) => {
      return value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
        .replace(/(-\d{4})\d+?$/, "$1");
    },
    siape: (value) => {
      return value.replace(/\D/g, "").slice(0, 7);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (formatters[name]) {
      formattedValue = formatters[name](value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Validação em tempo real
    const error = validations[name]?.(formattedValue) || "";
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (validations[key]) {
        const error = validations[key](formData[key]);
        if (error) newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage({
        text: "Por favor, corrija os erros no formulário antes de continuar.",
        type: "error"
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          siape: formData.siape.replace(/\D/g, ""),
          cpf: formData.cpf.replace(/\D/g, ""),
          cellphone: formData.cellphone.replace(/\D/g, "")
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao registrar usuário");
      }

      setMessage({
        text: "Cadastro realizado com sucesso! Aguarde a aprovação do administrador. Você receberá um email quando seu cadastro for aprovado.",
        type: "success"
      });

      setTimeout(() => {
        navigate("/");
      }, 5000);
    } catch (error) {
      setMessage({
        text: "Erro ao realizar cadastro. Por favor, tente novamente.",
        type: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <section className="flex items-center justify-center flex-col gap-6 py-8 min-h-screen">
      <div className="absolute left-5 top-8">
        <a href="/" className="absolute top-8 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-10 rounded transition-colors duration-300 shadow-md w-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="36" fill="currentColor" className="bi bi-arrow-left-short" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5"/>
          </svg>
        </a>
      </div>

      <img src={logo} alt="logo" className="w-17 h-12" />

      <div className="border border-gray-300 rounded-xl p-8 w-full max-w-2xl shadow-lg bg-white">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 text-transparent bg-clip-text mb-2">
          Cadastro
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-3">
          {/* Nome */}
          <div>
            <label className="block font-medium mb-1">Nome:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.firstName ? "border-red-500" : ""
              }`}
              required
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>

          {/* Sobrenome */}
          <div>
            <label className="block font-medium mb-1">Sobrenome:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.lastName ? "border-red-500" : ""
              }`}
              required
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>

          {/* Nome de Usuário */}
          <div>
            <label className="block font-medium mb-1">Nome de Usuário:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.username ? "border-red-500" : ""
              }`}
              required
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>

          {/* Email */}
          <div className="col-span-2">
            <label className="block font-medium mb-1">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.email ? "border-red-500" : ""
              }`}
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Cargo */}
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Cargo
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="PROFESSOR">Professor</option>
              <option value="TECHNICIAN">Técnico</option>
            </select>
          </div>

          {/* SIAPE */}
          <div>
            <label className="block font-medium mb-1">SIAPE:</label>
            <input
              type="text"
              name="siape"
              value={formData.siape}
              onChange={handleChange}
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.siape ? "border-red-500" : ""
              }`}
              required
            />
            {errors.siape && <p className="text-red-500 text-sm mt-1">{errors.siape}</p>}
          </div>

          {/* CPF */}
          <div>
            <label className="block font-medium mb-1">CPF:</label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.cpf ? "border-red-500" : ""
              }`}
              required
            />
            {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>}
          </div>

          {/* Telefone */}
          <div>
            <label className="block font-medium mb-1">Telefone:</label>
            <input
              type="text"
              name="cellphone"
              value={formData.cellphone}
              onChange={handleChange}
              className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                errors.cellphone ? "border-red-500" : ""
              }`}
              required
            />
            {errors.cellphone && <p className="text-red-500 text-sm mt-1">{errors.cellphone}</p>}
          </div>

          {/* Divisor */}
          <div className="col-span-3 h-px bg-gray-200"></div>

          {/* Senha */}
          <div>
            <label className="block font-medium mb-1">Senha:</label>
            <div className="relative">
              <input
                type={showPassword.password ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.password ? "border-red-500" : ""
                }`}
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("password")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword.password ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Confirmar Senha */}
          <div>
            <label className="block font-medium mb-1">Confirmar Senha:</label>
            <div className="relative">
              <input
                type={showPassword.confirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmPassword")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                {showPassword.confirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Botão de Cadastrar */}
          <button
            type="submit"
            disabled={loading}
            className="col-span-3 bg-green-600 text-white p-3 rounded-lg font-semibold w-full hover:bg-green-700 transition disabled:bg-green-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Cadastrando...
              </div>
            ) : (
              "Cadastrar"
            )}
          </button>
        </form>
      </div>

      {message.text && (
        <MessagePopup
          message={message.text}
          type={message.type}
          onClose={() => setMessage({ text: "", type: "" })}
        />
      )}
    </section>
  );
};

export default Register;

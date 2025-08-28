import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";

function UserProfile() {
  const [originalUser, setOriginalUser] = useState(null);
  const [user, setUser] = useState({
    username: "",
    email: "",
    cellphone: "",
    password: "",
    confirmPassword: "",
    siape: "",
    cpf: "",
    first_name: "",
    last_name: "",
    role: "",
    is_staff: false
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    match: false,
    hasNumber: false,
    hasUpper: false,
    hasLower: false
  });
  const [fieldErrors, setFieldErrors] = useState({
    siape: false,
    cpf: false,
    cellphone: false
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/user/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (!response.ok) throw new Error("Erro ao buscar perfil");
        const data = await response.json();
        
        const userData = {
          username: data.username || "",
          email: data.email || "",
          cellphone: data.cellphone || "",
          password: "",
          confirmPassword: "",
          siape: data.siape || "",
          cpf: data.cpf || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          role: data.role || "",
          is_staff: data.is_staff || false
        };
        
        setUser(userData);
        setOriginalUser(userData);
      } catch (error) {
        console.error("Erro ao carregar perfil:", error);
        setMessage("Erro ao carregar perfil");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const validatePassword = (password) => {
    return {
      length: password.length >= 6,
      hasNumber: /\d/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasLower: /[a-z]/.test(password),
      match: password === user.confirmPassword
    };
  };

  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  };

  const formatSIAPE = (value) => {
    return value.replace(/\D/g, '').slice(0, 7);
  };

  const unformatValue = (value) => {
    // Remove tudo que não é número
    return value.replace(/\D/g, '');
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'siape':
        return value.length === 7;
      case 'cpf':
        return unformatValue(value).length === 11;
      case 'cellphone':
        return unformatValue(value).length === 11;
      default:
        return true;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'password' || name === 'confirmPassword') {
      const newUser = { ...user, [name]: value };
      setUser(newUser);
      
      const errors = {
        length: value.length >= 6,
        hasUpper: /[A-Z]/.test(value),
        hasLower: /[a-z]/.test(value),
        hasNumber: /\d/.test(value),
        match: newUser.password === newUser.confirmPassword
      };
      setPasswordErrors(errors);
    } else if (name === 'cpf') {
      const formattedValue = formatCPF(value);
      setUser({ ...user, [name]: formattedValue });
      setFieldErrors({
        ...fieldErrors,
        [name]: unformatValue(formattedValue).length !== 11
      });
    } else if (name === 'cellphone') {
      const formattedValue = formatPhone(value);
      setUser({ ...user, [name]: formattedValue });
      setFieldErrors({
        ...fieldErrors,
        [name]: unformatValue(formattedValue).length !== 11
      });
    } else if (name === 'siape') {
      const formattedValue = formatSIAPE(value);
      setUser({ ...user, [name]: formattedValue });
      setFieldErrors({
        ...fieldErrors,
        [name]: formattedValue.length !== 7
      });
    } else if (name === 'username') {
      const limitedValue = value.slice(0, 150);
      setUser({ ...user, [name]: limitedValue });
    } else if (name === 'email') {
      const limitedValue = value.slice(0, 254);
      setUser({ ...user, [name]: limitedValue });
    } else if (name === 'first_name' || name === 'last_name') {
      const limitedValue = value.slice(0, 150);
      setUser({ ...user, [name]: limitedValue });
    } else {
      setUser({ ...user, [name]: value });
      
      // Validação dos outros campos
      if (['siape'].includes(name)) {
        setFieldErrors({
          ...fieldErrors,
          [name]: !validateField(name, value)
        });
      }
    }
  };

  const hasChanges = () => {
    // Verifica se há alterações nos campos e se não há erros
    const hasFieldChanges = JSON.stringify(user) !== JSON.stringify(originalUser);
    const hasFieldErrors = Object.values(fieldErrors).some(error => error);
    const hasPasswordErrors = user.password && Object.values(passwordErrors).some(error => !error);
    
    return hasFieldChanges && !hasFieldErrors && !hasPasswordErrors;
  };

  const canSendCode = () => {
    // Verifica se todos os requisitos da senha foram atendidos
    const allPasswordRequirementsMet = !Object.values(passwordErrors).includes(false);
    // Verifica se ambos os campos de senha estão preenchidos
    const bothPasswordFieldsFilled = user.password && user.confirmPassword;
    
    return bothPasswordFieldsFilled && allPasswordRequirementsMet;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (showPasswordFields) {
      if (Object.values(passwordErrors).includes(false)) {
        setMessage("Por favor, corrija os erros da senha antes de continuar");
        return;
      }
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/user/profile/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          ...user,
          password: showPasswordFields ? user.password : undefined
        }),
      });

      if (!response.ok) throw new Error("Erro ao atualizar perfil");
      setMessage("Perfil atualizado com sucesso!");
      
      if (showPasswordFields) {
        setUser(prev => ({ ...prev, password: "", confirmPassword: "" }));
        setShowPasswordFields(false);
      }
      
      // Atualiza o originalUser com os novos dados
      setOriginalUser({...user, password: "", confirmPassword: ""});
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setMessage("Erro ao salvar alterações");
    }
  };

  const handleSendEmailConfirmation = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/user/send-confirmation/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) throw new Error("Erro ao enviar email");
      setMessage("Email de confirmação enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      setMessage("Erro ao enviar email de confirmação");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const roleTranslations = {
    ADMIN: "Administrador",
    PROFESSOR: "Professor",
    TECHNICIAN: "Técnico"
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-500 to-blue-500 text-transparent bg-clip-text">
          {user.is_staff ? "Perfil do Administrador" : "Meu Perfil"}
        </h1>
        {message && (
          <div className={`p-4 rounded-lg mb-4 ${message.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="">
          <div className="grid grid-cols-3 gap-4 mb-2">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nome
              </label>
              <input
                type="text"
                name="first_name"
                value={user.first_name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                maxLength={150}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Sobrenome
              </label>
              <input
                type="text"
                name="last_name"
                value={user.last_name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                maxLength={150}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nome de Usuário
              </label>
              <input
                type="text"
                name="username"
                value={user.username}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                maxLength={150}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                SIAPE
              </label>
              <input
                type="text"
                name="siape"
                value={user.siape}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${fieldErrors.siape ? 'border-red-300' : 'border-gray-300'}`}
                disabled={!user.is_staff}
                placeholder="0000000"
              />
              {fieldErrors.siape && (
                <p className="text-red-500 text-xs mt-1">SIAPE deve ter exatamente 7 dígitos</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                CPF
              </label>
              <input
                type="text"
                name="cpf"
                value={user.cpf}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${fieldErrors.cpf ? 'border-red-300' : 'border-gray-300'}`}
                disabled={!user.is_staff}
                placeholder="000.000.000-00"
              />
              {fieldErrors.cpf && (
                <p className="text-red-500 text-xs mt-1">CPF inválido</p>
              )}
            </div>
          </div>

          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Cargo
            </label>
            <select
              name="role"
              value={user.role}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={!user.is_staff}
            >
              <option value="ADMIN">Administrador</option>
              <option value="PROFESSOR">Professor</option>
              <option value="TECHNICIAN">Técnico</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                maxLength={254}
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Telefone
              </label>
              <input
                type="text"
                name="cellphone"
                value={user.cellphone}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${fieldErrors.cellphone ? 'border-red-300' : 'border-gray-300'}`}
                placeholder="(00) 00000-0000"
              />
              {fieldErrors.cellphone && user.cellphone && (
                <p className="text-red-500 text-xs mt-1">Telefone inválido</p>
              )}
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <button
              type="button"
              onClick={() => setShowPasswordFields(!showPasswordFields)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {showPasswordFields ? "Cancelar alteração de senha" : "Alterar senha"}
            </button>

            {showPasswordFields && (
              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nova Senha
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${Object.values(passwordErrors).includes(false) ? 'border-red-300' : 'border-gray-300'}`}
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={user.confirmPassword}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${!passwordErrors.match && user.confirmPassword ? 'border-red-300' : 'border-gray-300'}`}
                    minLength={6}
                  />
                </div>

                {/* Requisitos da senha */}
                <div className="text-sm space-y-1">
                  <p className={passwordErrors.length ? 'text-green-600' : 'text-red-600'}>
                    ✓ Mínimo de 6 caracteres
                  </p>
                  <p className={passwordErrors.hasUpper ? 'text-green-600' : 'text-red-600'}>
                    ✓ Pelo menos uma letra maiúscula
                  </p>
                  <p className={passwordErrors.hasLower ? 'text-green-600' : 'text-red-600'}>
                    ✓ Pelo menos uma letra minúscula
                  </p>
                  <p className={passwordErrors.hasNumber ? 'text-green-600' : 'text-red-600'}>
                    ✓ Pelo menos um número
                  </p>
                  <p className={passwordErrors.match ? 'text-green-600' : 'text-red-600'}>
                    ✓ Senhas coincidem
                  </p>
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={handleSendEmailConfirmation}
                    disabled={!canSendCode()}
                    className={`w-full font-bold py-2 px-4 rounded-lg transition-colors duration-300
                      ${canSendCode() 
                        ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    Enviar Código de Confirmação
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={!hasChanges()}
              className={`w-full font-bold py-3 px-4 rounded-lg transition-colors duration-300
                ${hasChanges() 
                  ? 'bg-green-500 hover:bg-green-600 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserProfile;

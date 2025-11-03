### God Component — Large Class - ⚠️ **ALTO IMPACTO**

**📍 Localização:** `/src/frontend/src/pages/CreateReservation.jsx` (~636 linhas)

**📝 Descrição do Problema:**
Componente extremamente grande, com múltiplas responsabilidades: estado, validação, requisições, lógica de negócio e UI.

**🔧 Exemplo Encontrado:**
```jsx
// CreateReservation.jsx (arquivo com ~636 linhas)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/BackButton";
import MessagePopup from "../components/MessagePopup";

const generateTimeOptions = () => {
  const options = [];
  for (let hour = 7; hour < 23; hour++) {
    const formattedHour = hour.toString().padStart(2, '0');
    options.push(`${formattedHour}:00`);
    options.push(`${formattedHour}:30`);
  }
  return options;
};

const CreateReservation = () => {
  // ... múltiplos estados e efeitos, além da renderização de uma UI extensa
}
```

**❌ Por que é um Code Smell:**
- Viola o Single Responsibility Principle
- Difícil de testar e manter
- Baixa reutilização e alto acoplamento

**💥 Impactos:**
- Maior probabilidade de bugs ao modificar trechos não relacionados
- Dificulta testes unitários e revisão de código
- Reduz velocidade de desenvolvimento e reuso

  **Antes e Depois**
  ![Nome do smell](.COLOCAR A IMAGEM DEPOIS.jpg)


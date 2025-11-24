### URL Hardcoded (Duplicated String Literals) - ⚠️ **ALTO IMPACTO**

**📍 Localização:** Presente em praticamente todos os arquivos que fazem requisições HTTP

**📝 Descrição do Problema:**
A URL base `http://127.0.0.1:8000` está repetida em dezenas de lugares diferentes no código.

**🔧 Exemplos Encontrados:**
```jsx
// Login.jsx - linha ~30
const response = await fetch('http://127.0.0.1:8000/api/login/', {
  method: 'POST',
});

// CreateReservation.jsx - linhas ~127-129
const [auditoriumResponse, meetingRoomResponse, vehicleResponse] = await Promise.all([
  fetch('http://127.0.0.1:8000/api/resources/auditoriums/', { headers }),
  fetch('http://127.0.0.1:8000/api/resources/meeting-rooms/', { headers }),
  fetch('http://127.0.0.1:8000/api/resources/vehicles/', { headers })
]);

// AdminRecursos.jsx - linhas ~35-37
fetch('http://127.0.0.1:8000/api/auditorium-admin/', { headers }),
fetch('http://127.0.0.1:8000/api/meeting-room-admin/', { headers }),
fetch('http://127.0.0.1:8000/api/vehicle-admin/', { headers })
```

**❌ Por que é um Code Smell:**
- Violação do princípio DRY (Don't Repeat Yourself)
- Dificuldade de manutenção: para alterar a URL, seria necessário modificar dezenas de arquivos
- Propenso a erros: alto risco de esquecer alguma ocorrência durante mudanças
- Inconsistência: existe um arquivo `api.js` configurado, mas não utilizado

**💥 Impactos:**
- Dificulta deploy para diferentes ambientes
- Aumenta tempo de manutenção
- Risco de bugs por inconsistência
- Dificuldade de configuração

  **Antes e Depois**
  ![Hardcoded](.COLOCAR A IMAGEM DEPOIS.jpg)

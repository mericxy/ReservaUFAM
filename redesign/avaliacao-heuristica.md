# 📝 Relatório de Redesign – Aplicação das 10 Heurísticas de Nielsen
### Projeto: ReservaUFAM

Este documento apresenta a avaliação heurística e o redesign realizado no sistema **ReservaUFAM**, seguindo como base as **10 Heurísticas de Usabilidade de Nielsen**.  
O objetivo não foi apenas tornar a interface mais agradável visualmente, mas **corrigir problemas reais de usabilidade**, documentando claramente:

✔ Problema identificado  
✔ Severidade  
✔ Heurística violada 
✔ Evidências (imagens)  
✔ Solução proposta  
✔ Resultado (antes → depois)

---

## ✅ Metodologia

1. **Avaliação Heurística Inicial**
   - Analisamos todas as telas principais do sistema: cadastro, login, perfil de usuário, reserva, administração.
   - Para cada problema, registramos: descrição, impacto, severidade e heurística violada.

2. **Redesign**
   - Implementamos melhorias baseadas nas heurísticas.
   - Foram priorizados problemas de **prevenção de erros**, **consistência**, **controle do usuário** e **redução de frustração**.

3. **Comparativos**
   - Cada melhoria possui: capturas de tela antes/depois, issues vinculadas e pull requests.

---

## ✅ Lista de Problemas Encontrados e Melhorias Aplicadas

A estrutura padrão utilizada:

**Problema → Descrição → Tela → Severidade → Heurística → Evidências → Solução → Impacto**

---

### 1) ❌ Falta da função “Cancelar” no Cadastro — Issue #36
- **Tela:** Cadastro
- **Severidade:** 🔴 Alta
- **Heurística violada:** **3. Controle e liberdade do usuário**

**Descrição:**  
Não havia botão para cancelar para que o usuário tivesse o controle de cancelar a ação de cadastro.

**Antes:**  
<img width="565" height="589" alt="Image" src="https://github.com/user-attachments/assets/d8dce077-e623-46a5-a71f-a69b193540b7" />

**Depois da implementação:**  
<img width="579" height="646" alt="Image" src="https://github.com/user-attachments/assets/695dad92-6441-4a5a-800c-854f26832e90" />

✅ **Solução:** Botão “Cancelar” implementado com confirmação.  
✅ **Resultado esperado:** Mais sensação de controle de cadastro para o usuário.  
- 📌 Pull Request: #52

---

### 2) ❌ Logout sem confirmação — Issue #37
- **Tela:** Header do usuário e do administrador
- **Severidade:** 🔴 Alta
- **Heurística violada:** 3. Controle e Liberdade e 5. Prevenção de Erros

**Descrição:** Logout era imediato, sem confirmação, gerando riscos de sair acidentalmente.

**Evidência:**  
<img src="https://github.com/user-attachments/assets/6c88214c-7684-4632-994d-0efe76b02d4a" />

✅ **Solução:** Modal “Deseja realmente sair?”.  
✅ **Impacto esperado:** Menos erros acidentais e frustração por parte do usuário.

---

### 3) 🔄 Sem botão para voltar à Home — Issue #44
- **Tela:** Tela Home e telas internas
- **Severidade:** 🟡 Média
- **Heurística violada:** 3. Controle e liberdade / 1. Visibilidade de status

**Evidência:**  
<img width="846" height="344" alt="Image" src="https://github.com/user-attachments/assets/759d6682-de52-42f5-9f8c-af9e71fb259f" />

✅ **Solução:** Adicionado botão de navegação para Home.  
✅ **Impacto esperado:** navegação mais fluida e intuitiva.

---

### 4) ❗ Campos obrigatórios sem identificação — Issue #38
- **Tela:** Cadastro e formulários
- **Severidade:** 🟡 Média
- **Heurística violada:** 4. Consistência e padrões

**Antes:**  
<img width="522" height="623" src="https://github.com/user-attachments/assets/8d312dd7-5875-4899-963c-4858ebc24dbd" />

**Depois:**  
<img width="516" height="626" src="https://github.com/user-attachments/assets/1fcf3fbb-e7f7-42d0-b7f5-8003d5642835" />

✅ Indicadores padronizados adicionados.  
📌 Pull Request: #54

---

### 5) 🔐 Falta de ícone “mostrar senha” em outras telas — Issue #39
- **Severidade:** 🟡 Média
- **Heurística violada:** 3. Controle e Liberdade do usuário e 4. Consistência e padrões

**Antes:**  
<img width="1169" height="724" alt="Image" src="https://github.com/user-attachments/assets/42051210-6858-49e4-a2b5-66e3049c3964" />

**Depois:** 
<img width="737" height="535" src="https://github.com/user-attachments/assets/3754eaf9-c276-4b03-a73b-bf3bb4ddd430" />

📌 Pull Request: #48

---

### 6) 📞 CPF, SIAPE e telefone sem formatação — Issue #46
- **Severidade:** 🟡 Média
- **Heurística violada:** 4. Consistência e padrões

✅ Máscaras aplicadas  
✅ Agora leitura é mais fácil e previne erros de digitação

📌 Pull Request: #51

---

### 7) Botão “Home” diferente entre perfis — Issue #44
- **Severidade:** 🟡 Média
- **Heurística violada:** 4. Consistência

✅ Comportamento padronizado para usuários comuns e administradores

---

### 8) ❌ Conflitos de horários não prevenidos — Issue #49
- **Severidade:** 🔴 Alta
- **Heurística violada:** 5. Prevenção de erros

✅ Nova validação impede horários conflitantes antes do envio  
✅ Menos retrabalho e frustração

---

### 9) ❌ Campos SIAPE/CPF/Cargo parecendo editáveis — Issue #50
- **Severidade:** 🟡 Média
- **Heurística violada:** 5. Prevenção de erros

✅ Campos agora são bloqueados visualmente e informados ao usuário  
📌 Pull Request #53

---

### 10) ❗ Falta de histórico de ações recentes — Issue #40
- **Severidade:** 🟡 Média
- **Heurística violada:** 6. Reconhecimento ao invés de memorização

✅ Administrador agora visualiza solicitações recentes sem precisar “lembrar” de checar

---

### 11) ❌ Falta de sugestões de recuperação nas mensagens de erro — Issue #41
- **Severidade:** 🟡 Média
- **Heurística violada:** 7. Flexibilidade e eficiência

**📸 Evidências pré ajustes:**
<img width="2015" height="688" alt="Image" src="https://github.com/user-attachments/assets/db23cde3-c43d-463c-99f5-ab95304d9e1f" />

**✅ Solução aplicada:**
As mensagens de erro passaram a oferecer instruções de recuperação, como:

- “Verifique seus dados e tente novamente”
- “Se o problema persistir, contate o suporte”
- Sugestões com ação concreta

Links e botões de retry quando aplicável

**📸 Evidências pós ajustes:**
<img width="2026" height="679" alt="Image" src="https://github.com/user-attachments/assets/811da540-4c4f-49c4-8e46-60a2652f5b48" />

**✅ Impacto esperado:**

- Aumenta autonomia dos usuários
- Reduz necessidade de suporte
- Comunicação mais clara e empática
- Diminui frustração e abandono do sistema

---

## ✅ Conclusão

O redesign do sistema **ReservaUFAM** aplicou as 10 heurísticas de Nielsen de maneira objetiva e comprovada com evidências.  
As melhorias já implementadas trouxeram:

- ✅ Mais controle ao usuário  
- ✅ Prevenção de erros antes que aconteçam  
- ✅ Mais consistência visual e funcional  
- ✅ Redução de frustração e retrabalho  
- ✅ Navegação mais clara e responsiva

Este documento continua sendo atualizado conforme novas melhorias forem concluídas.

---

📌 **Caminho do arquivo no repositório:**  
`docs/redesign/avaliacao-heuristica.md`


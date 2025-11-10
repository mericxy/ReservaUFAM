# 📝 Avaliação Heurística - ReservaUFAM

## ✅ Formato unificado por problema

Cada problema está descrito com: Problema → Descrição → Tela → Severidade → Heurísticas violadas.

---

### 1) Falta de Função "Cancelar" no Formulário de Cadastro
- Problema: Usuário pode perder dados preenchidos acidentalmente.
- Descrição: Não existe botão de cancelar ou voltar que preserva dados.
- Tela: Register.jsx
- Severidade: 🔴 ALTA
- Heurísticas violadas: Controle e Liberdade do Usuário

---

### 2) Logout Sem Confirmação
- Problema: Risco de logout acidental com perda de trabalho.
- Descrição: O botão de logout executa imediatamente sem confirmação.
- Tela: Header.jsx, HeaderAdmin.jsx
- Severidade: 🔴 ALTA
- Heurísticas violadas: Controle e Liberdade do Usuário

---

### 3) Falta de Opção para Voltar à Home
- Problema: Navegação depende do botão do navegador e reduz sensação de controle.
- Descrição: Algumas telas do usuário não oferecem um elemento claro (botão/link) para retornar à página inicial.
- Tela: UserProfile.jsx / páginas internas após login
- Severidade: 🟡 MÉDIA
- Heurísticas violadas: Controle e Liberdade do Usuário

---

### 4) Alterar Senha sem Opção de Mostrar/Ocultar
- Problema: Aumenta erros de digitação e dificulta confirmação visual.
- Descrição: Os campos de nova senha e confirmação não possuem alternador para visualizar/ocultar o conteúdo.
- Tela: UserProfile.jsx (Alterar Senha)
- Severidade: 🟡 MÉDIA
- Heurísticas violadas: Controle e Liberdade do Usuário

---

### 5) Ícone de Obrigatoriedade em Todas as Telas
- Problema: Confusão sobre o que é obrigatório preencher.
- Descrição: O sistema não possui asteriscos em todos os campos obrigatórios do sistema.
- Tela: Cadastro
- Severidade: 🟡 MÉDIA
- Heurísticas violadas: Consistência e Padrões

---

### 6) Ícone de Ocultação de Senha
- Problema: Inconsistência na funcionalidade de senha entre telas/componentes.
- Descrição: O sistema possui alguns campos com a falta do ícone de ocultar senha.
- Tela: Cadastro, UserProfile.jsx (Alterar Senha)
- Severidade: 🟡 MÉDIA
- Heurísticas violadas: Consistência e Padrões

---

### 7) CPF, SIAPE e Telefone Sem Formatação Padronizada
- Problema: Maior chance de erro de digitação e dificuldade de leitura/validação visual.
- Descrição: Campos de identificação e contato são exibidos/aceitos sem máscara ou validação de formato (ex.: CPF 000.000.000-00, SIAPE 7 dígitos, telefone (99) 99999-9999).
- Tela: Register.jsx, UserProfile.jsx, AdminUsuarios.jsx
- Severidade: 🟡 MÉDIA
- Heurísticas violadas: Consistência e Padrões

---

### 8) Navegação para Home Inconsistente Entre Perfis
- Problema: Quebra de consistência e expectativa, prejudicando aprendizagem do fluxo.
- Descrição: Perfis administrativos possuem botão/link claro para retornar à Home, enquanto as telas do usuário comum não oferecem a mesma opção.
- Tela: Header.jsx, HeaderAdmin.jsx, telas de usuário pós-login
- Severidade: 🟡 MÉDIA
- Heurísticas violadas: Consistência e Padrões

---

### 9) Conflitos de Horário Não Prevenidos
- Problema: Conflitos só são descobertos no backend, gerando retrabalho.
- Descrição: Sistema não previne seleção de horários conflitantes na interface.
- Tela: CreateReservation.jsx
- Severidade: 🔴 ALTA
- Heurísticas violadas: Prevenção de Erros

---

### 10) Campos Imutáveis Sem Indicação (SIAPE, CPF, Cargo)
- Problema: Usuário tenta alterar repetidamente, gerando frustração e dúvida sobre erro do sistema.
- Descrição: Campos de identificação (SIAPE, CPF e Cargo) não podem ser editados por regra de negócio, mas a interface não deixa isso explícito (parecem editáveis ou não mostram estado de bloqueio).
- Tela: UserProfile.jsx / AdminProfile.jsx
- Severidade: 🟡 MÉDIA
- Heurísticas violadas: Prevenção de Erros

---

### 11) Falta de Histórico de Ações Recentes
- Problema: Usuário precisa lembrar de escolhas anteriores.
- Descrição: Não mostra recursos utilizados recentemente.
- Tela: Home.jsx
- Severidade: 🟡 MÉDIA
- Heurísticas violadas: Reconhecimento ao Invés de Lembrança

---

### 12) Ausência de Ações em Lote para Administradores
- Problema: Ineficiência para volume alto de reservas.
- Descrição: Admin precisa aprovar/reprovar reservas uma por uma.
- Tela: AdminReservations.jsx
- Severidade: � MÉDIA
- Heurísticas violadas: Flexibilidade e Eficiência de Uso

---

### 13) Ausência de Sistema de Ajuda
- Problema: Usuários novos ficam perdidos sem orientação.
- Descrição: Não existe sistema de ajuda contextual.
- Tela: Todas as telas
- Severidade: 🟡 MÉDIA
- Heurísticas violadas: Ajuda e Documentação






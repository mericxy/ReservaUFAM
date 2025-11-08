# 📝 Avaliação Heurística - ReservaUFAM

## 👁️ Visibilidade do Status do Sistema

### 🚨 Violações Identificadas:

#### Ausência de Indicação de Progresso no Cadastro
- **🟡 Severidade:** MÉDIA
- **📱 Tela:** Register.jsx
- **📝 Descrição:** No formulário de cadastro extenso, não há indicação de progresso ou etapas.
- **⚠️ Problema:** Usuário não sabe quantos campos ainda precisa preencher.

---

## 🌍 Correspondência Entre Sistema e Mundo Real

### 🚨 Violações Identificadas:

---

## 🎮 Controle e Liberdade do Usuário

### 🚨 Violações Identificadas:

#### Falta de Função "Cancelar" no Formulário de Cadastro
- **🔴 Severidade:** ALTA
- **📱 Tela:** Register.jsx
- **📝 Descrição:** Não existe botão de cancelar ou voltar que preserva dados.
- **⚠️ Problema:** Usuário pode perder dados preenchidos acidentalmente.

#### Logout Sem Confirmação
- **🔴 Severidade:** ALTA
- **📱 Tela:** Header.jsx, HeaderAdmin.jsx
- **📝 Descrição:** O botão de logout executa imediatamente sem confirmação.
- **⚠️ Problema:** Risco de logout acidental com perda de trabalho.

---

## 🔄 Consistência e Padrões

### 🚨 Violações Identificadas:

#### Ícone de Obrigatoriedade em Todas as Telas
- **🟡 Severidade:** MÉDIA
- **📱 Tela:** Cadastro
- **📝 Descrição:** O sistema não possui asteriscos em todos os campos obrigatórios do sistema.
- **⚠️ Problema:** Eventual confusão sobre campos obrigatórios ou não.

#### Ícone de Ocultação de Senha
- **🟡 Severidade:** MÉDIA
- **📱 Tela:** Cadastro
- **📝 Descrição:** O sistema possui alguns campos com a falta do ícone de ocultar senha.
- **⚠️ Problema:** Inconsistência na funcionalidade de senha.

---

## 🛡️ Prevenção de Erros

### 🚨 Violações Identificadas:

#### Conflitos de Horário Não Prevenidos
- **🔴 Severidade:** ALTA
- **📱 Tela:** CreateReservation.jsx
- **📝 Descrição:** Sistema não previne seleção de horários conflitantes na interface.
- **⚠️ Problema:** Erro descoberto apenas no backend.

---

## 🧠 Reconhecimento ao Invés de Lembrança

### 🚨 Violações Identificadas:

#### Falta de Histórico de Ações Recentes
- **🟡 Severidade:** MÉDIA
- **📱 Tela:** Home.jsx
- **📝 Descrição:** Não mostra recursos utilizados recentemente.
- **⚠️ Problema:** Usuário precisa lembrar de escolhas anteriores.

---

## ⚡ Flexibilidade e Eficiência de Uso

### 🚨 Violações Identificadas:

#### Ausência de Ações em Lote para Administradores
- **🟡 Severidade:** MÉDIA
- **📱 Tela:** AdminReservations.jsx
- **📝 Descrição:** Admin precisa aprovar/reprovar reservas uma por uma.
- **⚠️ Problema:** Ineficiência para volume alto de reservas.

---


## 🔧 Ajudar Usuários a Reconhecer, Diagnosticar e Recuperar Erros

### 🚨 Violações Identificadas:

####  Falta de Sugestões de Recuperação
- **🟡 Severidade:** MÉDIA
- **📱 Tela:** ErrorPopup.jsx
- **📝 Descrição:** Erros não oferecem sugestões de como resolver.
- **⚠️ Problema:** Usuário fica perdido após erro.

---

##  📚 Ajuda e Documentação

### 🚨 Violações Identificadas:

####  Ausência de Sistema de Ajuda
- **🟡 Severidade:** MÉDIA
- **📱 Tela:** Todas as telas
- **📝 Descrição:** Não existe sistema de ajuda contextual.
- **⚠️ Problema:** Usuários novos ficam perdidos.




## ✨ Funcionalidades  

### 🔑 Cadastro e Autenticação de Usuários  
- Cadastro exclusivo para professores e técnicos da UFAM.  
- Dados exigidos: **SIAPE, CPF, Nome, Email, Telefone e Senha**.  
- **Restrições:** SIAPE e CPF devem ser únicos.  
- Validação automática para professores já cadastrados na base da UFAM.  
- Envio de **e-mail de confirmação** para ativação do cadastro.  
- Perfis de usuário:  
  - **Pendente**: Aguardando aprovação do administrador.  
  - **Aprovado**: Pode acessar e fazer reservas.  
  - **Reprovado**: Sem acesso ao sistema.  

### 📅 Gerenciamento de Reservas  
- Usuários podem solicitar reserva para: **Salas, Auditórios e Veículos**.  
- Cada reserva contém:  
  - **Datas e horários de início/término**  
  - **Recurso solicitado**  
  - **Descrição da atividade**  
  - **Justificativa**  
- **Regras de prioridade:**  
  - Primeira solicitação tem preferência, exceto em eventos prioritários.  
  - Reservas de veículos exigem **verificação prévia das condições** antes da aprovação.  
- Administradores podem **aprovar ou rejeitar reservas**.  

### 🎛️ Painel Administrativo  
- Visualização e gerenciamento de todas as reservas.  
- Aprovação ou rejeição de cadastros e reservas.  
- Criação de **eventos prioritários** que sobrepõem reservas comuns.  

## ⚙️ Requisitos Não Funcionais  
- **API RESTful** para comunicação entre frontend e backend.  
- **Autenticação JWT** para segurança.  
- **Criptografia de senhas**.  
- **Envio automático de e-mails** para confirmações.  
- **Responsividade** para acesso via dispositivos móveis.  
- **Tempo de resposta inferior a 3 segundos**.  
- **Suporte a múltiplos administradores**.  
- **Recuperação de senha via e-mail**.  

## 📜 Regras de Negócio  
- Login obrigatório com **CPF ou SIAPE**.  
- **Restrições de senha:**  
  - 8 a 12 caracteres  
  - Pelo menos uma **letra maiúscula, uma minúscula ou um símbolo**  
- Professores previamente cadastrados são **aprovados automaticamente**.  
- **Reservas simultâneas:**  
  - Apenas a **primeira solicitação válida** é registrada.  
  - Solicitações posteriores ficam **pendentes**, a menos que sejam eventos prioritários.  
- Reservas de veículos só são confirmadas após **inspeção do administrador**.  

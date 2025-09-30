## 🔄 Fluxo do Sistema  

### 📝 Cadastro do Usuário  
1. O usuário preenche o formulário com **Nome, E-mail, CPF, SIAPE, Senha**.  
2. O sistema verifica **unicidade de CPF e SIAPE**.  
3. Se os dados forem válidos, o usuário recebe um **código de verificação por e-mail**.  
4. O status do cadastro fica como **"Pendente de Aprovação"** até validação do administrador.  

### 📧 Confirmação de E-mail  
1. O usuário insere o código recebido para ativar a conta.  
2. Se o código for válido, o cadastro é atualizado para **"Pendente de Aprovação"**.  

### ✅ Aprovação do Cadastro pelo Administrador  
1. O administrador acessa o painel de **usuários pendentes**.  
2. Ele pode:  
   - **Aprovar** → O usuário recebe um **e-mail de confirmação** e ganha acesso ao sistema.  
   - **Rejeitar** → O usuário recebe um **e-mail com o motivo da reprovação**.  

### 🔓 Login e Solicitação de Reservas  
1. O usuário aprovado acessa o sistema com **e-mail e senha**.  
2. No painel, ele pode visualizar as **reservas disponíveis**.  
3. Ele preenche um formulário informando:  
   - **Data e horário desejados**  
   - **Local da reserva**  
   - **Descrição da atividade**  
4. O sistema verifica a disponibilidade:  
   - **Se disponível:** A solicitação é enviada para o administrador.  
   - **Se indisponível:** O usuário é informado.  

### ⚖️ Aprovação/Rejeição de Reservas pelo Administrador  
1. O administrador acessa o painel de **reservas pendentes**.  
2. Ele pode:  
   - **Aprovar** → O usuário recebe um **e-mail de confirmação**.  
   - **Rejeitar** → O usuário recebe um **e-mail com o motivo da recusa**.  

### 📆 Atualização do Calendário  
- Reservas **aprovadas** aparecem automaticamente no **calendário do sistema**.  
- Datas e horários reservados são **bloqueados para outros usuários**.  
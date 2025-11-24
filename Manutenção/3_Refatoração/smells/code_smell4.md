### Método Longo (Long Method) - ⚠️ **(Alto) IMPACTO**

**📍 Localização:** `backend/reserve/services.py` e `backend/reserve/views.py`

**📝 Descrição do Problema:**
Uma análise do código-fonte identificou a presença significativa do "code smell" **Método Longo**. Métodos críticos nos módulos de serviço e de visualização (views) excediam centenas de linhas, concentrando responsabilidades de diferentes camadas da aplicação (lógica de apresentação/template, lógica de transporte/API, lógica de negócio e persistência de dados).

**🔧 Exemplos Encontrados:**
- `reserve/services.py`:
    - `EmailService.send_approval_email()`
    - `EmailService.send_rejection_email()`
- `reserve/views.py`:
    - `LoginView.post()`
    - `UpdateUserStatusView.patch()`
    - `AdminReservationListView.get_queryset()`
    - `UserProfileView.patch()`

**❌ Por que é um Code Smell:**
- **Violação do Princípio da Responsabilidade Única (SRP):** Um único método estava executando múltiplas tarefas funcionalmente distintas. Por exemplo, `send_approval_email` era simultaneamente um construtor de HTML, um configurador de cliente de API e um orquestrador de transporte de e-mail.
- **Baixa Coesão (Low Cohesion):** As operações dentro de um mesmo método não possuíam uma relação conceitual forte, misturando, por exemplo, a validação de dados de entrada com a lógica de notificação.
- **Alto Acoplamento (High Coupling):** A lógica de negócio (ex: aprovar um usuário) estava fortemente acoplada à sua implementação de apresentação (o HTML do e-mail), tornando impossível alterar um sem impactar o outro.
- **Testabilidade Comprometida:** A complexidade e a mistura de responsabilidades impediam a escrita de testes unitários isolados. Era inviável testar a lógica de geração de um template HTML sem também simular (mock) toda a camada de transporte da API do SendGrid.

**💥 Impactos:**
- **Sobrecarga Cognitiva e Manutenibilidade:** A dificuldade de leitura e compreensão do fluxo de execução tornava a manutenção lenta e aumentava a sobrecarga cognitiva para novos desenvolvedores.
- **Risco de Regressão:** Alterar uma responsabilidade (ex: ajustar o CSS do e-mail) colocava em risco outras lógicas (ex: o envio do e-mail), aumentando a suscetibilidade a bugs de regressão.
- **Duplicação de Lógica (Violação do DRY):** A lógica de transporte de e-mail (configuração do `SendGridAPIClient`, `try/except`) estava duplicada em ambos os métodos do `EmailService`.
- **Obstrução da Reutilização:** A lógica de negócio estava "presa" dentro de métodos específicos, impedindo sua reutilização em outros contextos.

---
&nbsp;
### **Antes e Depois: `services.py` (Refatoração de Serviço)**

A refatoração aplicou o padrão "Extrair Método" para criar uma camada de abstração, separando a **Construção** de conteúdo da camada de **Transporte**.

#### Exemplo 1: O Método de Envio de Aprovação

**⬅️ Antes (`services.py`)**
O método `send_approval_email` era monolítico, misturando a geração de um template HTML de 70 linhas com a lógica de envio da API.

```python
# ANTES: services.py

class EmailService:
    @staticmethod
    def send_approval_email(user_email, user_name, username):
        """ Envia email de aprovação de cadastro usando SendGrid API """
        subject = "🎉 Cadastro Aprovado - ReservasUFAM"
        
        # 1. Responsabilidade: Geração de Template (HTML)
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head> ... (70+ linhas de HTML e CSS) ... </head>
        <body>
            <p>Olá <strong>{user_name}</strong>, Seu cadastro foi <strong>aprovado</strong>...</p>
        </body>
        </html>
        """
        
        # 2. Responsabilidade: Geração de Conteúdo (Plain-text)
        plain_content = f"Olá {user_name}, ..."
        
        # 3. Responsabilidade: Configuração e Transporte (API)
        try:
            from_email = ('navir.ufam@gmail.com', 'ReservasUFAM')
            message = Mail(
                from_email=from_email,
                to_emails=user_email,
                subject=subject,
                html_content=html_content,
                plain_text_content=plain_content
            )
            sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
            response = sg.send(message)
            print(f"✅ Email enviado para {user_email}! Status: {response.status_code}")
            return True
        except Exception as e:
            print(f"❌ Erro ao enviar email: {e}")
            return False
````

**➡️ Depois (`services.py`)**
O método público foi refatorado para ser um "Orquestrador", delegando a construção do conteúdo e o envio para métodos privados especializados.

```python
# DEPOIS: services.py

class EmailService:
    
    @staticmethod
    def send_approval_email(user_email, user_name, username):
        """
        Orquestra o fluxo de notificação de aprovação, delegando
        a construção do conteúdo e o transporte.
        """
        try:
            # 1. Delega a construção do conteúdo
            subject, html_content, plain_content = EmailService._build_approval_content(user_name, username)
            
            # 2. Delega o envio
            return EmailService._send_mail(
                user_email=user_email,
                subject=subject,
                html_content=html_content,
                plain_text_content=plain_content
            )
        except Exception as e:
            logger.error(f"Falha ao orquestrar e-mail de aprovação para {user_email}: {e}")
            return False

    @staticmethod
    def _build_approval_content(user_name, username):
        """
        Abstrai a responsabilidade de gerar o conteúdo (HTML e plain-text)
        para o template de aprovação.
        """
        subject = "🎉 Cadastro Aprovado - ReservasUFAM"
        
        # O HTML agora está isolado e pode ser testado unitariamente
        html_content = f"""
        <!DOCTYPE html>
        <html> ... (template) ... </html>
        """
        
        plain_content = f"Cadastro Aprovado - ReservasUFAM ..."
        
        return subject, html_content, plain_content
```

#### Exemplo 2: A Lógica de Transporte (Centralização - DRY)

**⬅️ Antes (`services.py`)**
A lógica de `try/except` e configuração do `SendGridAPIClient` estava **duplicada** nos métodos `send_approval_email` e `send_rejection_email`.

```python
# ANTES: (Lógica duplicada em send_approval_email)
try:
    from_email = ('navir.ufam@gmail.com', 'ReservasUFAM')
    message = Mail(...)
    sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
    response = sg.send(message)
    print(f"✅ Email enviado!")
    return True
except Exception as e:
    print(f"❌ Erro: {e}")
    return False

# ... (O MESMO BLOCO DE CÓDIGO SE REPETIA EM send_rejection_email) ...
```

**➡️ Depois (`services.py`)**
A lógica foi extraída para um único método privado `_send_mail`, aderindo ao princípio **DRY (Don't Repeat Yourself)**.

```python
# DEPOIS: (Lógica de envio centralizada)

    @staticmethod
    def _send_mail(user_email, subject, html_content, plain_text_content):
        """
        Abstrai a camada de transporte de e-mail.
        É o único método que interage com a API do SendGrid.
        """
        try:
            from_email = (os.environ.get('DEFAULT_FROM_EMAIL', 'navir.ufam@gmail.com'), 'ReservasUFAM')
            
            message = Mail(
                from_email=from_email,
                to_emails=user_email,
                subject=subject,
                html_content=html_content,
                plain_text_content=plain_content
            )
            
            sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
            response = sg.send(message)
            
            logger.info(f"✅ Email enviado para {user_email}! Status: {response.status_code}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Erro ao enviar email para {user_email} via SendGrid: {e}")
            return False
```

 

### **Antes e Depois: `views.py` (Refatoração de Views)**

A solução foi extrair a lógica de negócio dos métodos da API (controladores) para métodos auxiliares privados e coesos.

#### Exemplo 1: A Lógica de Login (`LoginView`)

**⬅️ Antes (`views.py`)**
O método `post` era um bloco monolítico que misturava autenticação, múltiplas verificações de regras de negócio (status do usuário) e a criação da resposta.

```python
# ANTES: views.py (LoginView)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        identifier = serializer.validated_data['identifier']
        password = serializer.validated_data['password']
        
        user = authenticate(request, username=identifier, password=password)

        if user:
            # Mistura de Lógica de Negócio e Lógica de View
            if user.status == 'Bloqueado':
                return Response(
                    {"detail": "Esta conta de usuário está bloqueada."},
                    status=status.HTTP_403_FORBIDDEN
                )
            if user.status != 'Aprovado':
                return Response(
                    {"detail": "Esta conta ainda não foi aprovada..."},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Mistura de Criação de Resposta
            login(request, user)
            refresh = RefreshToken.for_user(user)
            return Response({ ... }, status=status.HTTP_200_OK)
        
        return Response(
            {"detail": "Credenciais inválidas ou usuário não encontrado."},
            status=status.HTTP_401_UNAUTHORIZED
        )
```

**➡️ Depois (`views.py`)**
O método `post` foi refatorado para ser um "Coordenador". O fluxo de execução é autodocumentado, delegando cada etapa para um método auxiliar.

```python
# DEPOIS: views.py (LoginView)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        """
        Coordena o processo de autenticação. Delega a validação de
        credenciais, a verificação de regras de negócio (status)
        e a criação da resposta.
        """
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # 1. Delega a autenticação
        user = self._authenticate_user(request, serializer.validated_data)
        
        if not user:
            return Response(
                {"detail": "Credenciais inválidas ou usuário não encontrado."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # 2. Delega a verificação das regras de negócio
        error_response = self._check_user_can_login(user)
        if error_response:
            return error_response
        
        # 3. Delega a criação da resposta de sucesso
        return self._create_login_response(request, user)

    def _authenticate_user(self, request, validated_data):
        """ Abstrai a interação com o backend de autenticação. """
        return authenticate(...)

    def _check_user_can_login(self, user):
        """ Encapsula a lógica de negócio que autoriza uma sessão. """
        if user.status == 'Bloqueado':
            return Response(...)
        if user.status != 'Aprovado':
            return Response(...)
        return None

    def _create_login_response(self, request, user):
        """ Encapsula a criação da sessão (tokens) e serialização. """
        login(request, user)
        refresh = RefreshToken.for_user(user)
        return Response(...)
```

#### Exemplo 2: A Lógica de Atualização de Status (`UpdateUserStatusView`)

**⬅️ Antes (`views.py`)**
O método `patch` misturava validação de entrada, persistência no banco e a complexa lógica condicional de notificação.

```python
# ANTES: views.py (UpdateUserStatusView)

class UpdateUserStatusView(APIView):
    permission_classes = [permissions.IsAdminUser]
    def patch(self, request, pk):
        from .models import CustomUser
        user = get_object_or_404(CustomUser, pk=pk)
        old_status = user.status
        new_status = request.data.get('status')
        
        # 1. Lógica de Validação
        valid_statuses = [s[0] for s in CustomUser.STATUS_CHOICES]
        if new_status not in valid_statuses:
            return Response({"error": "Status inválido"}, ...)
        
        # 2. Lógica de Persistência
        user.status = new_status
        user.save()
        
        # 3. Lógica de Negócio (Notificação)
        if old_status != 'Aprovado' and new_status == 'Aprovado':
            success = EmailService.send_approval_email(...)
            email_status = "enviado" if success else "falha no envio"
            message = f"Status... Email: {email_status}"
        
        elif old_status != 'Reprovado' and new_status == 'Reprovado':
            success = EmailService.send_rejection_email(...)
            email_status = "enviado" if success else "falha no envio"
            message = f"Status... Email: {email_status}"
        else:
            message = f"Status do usuário alterado para {new_status}"
        
        return Response({"message": message})
```

**➡️ Depois (`views.py`)**
O método `patch` agora apenas orquestra o fluxo. A lógica de validação e a lógica de notificação foram extraídas para métodos privados e coesos.

```python
# DEPOIS: views.py (UpdateUserStatusView)

class UpdateUserStatusView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        """
        Orquestra a atualização de status do usuário. Delega a
        validação, persistência e a lógica de notificação.
        """
        from .models import CustomUser
        user = get_object_or_404(CustomUser, pk=pk)
        new_status = request.data.get('status')
        
        # 1. Delega a Validação
        if not self._is_valid_status(new_status):
            return Response({"error": "Status inválido"}, ...)
        
        # 2. Lógica de Persistência
        old_status = user.status
        user.status = new_status
        user.save()
        
        # 3. Delega a Lógica de Notificação
        message = self._handle_status_change_notification(
            user, old_status, new_status, request.data
        )
        
        return Response({"message": message})

    def _is_valid_status(self, new_status):
        """ Encapsula a lógica de validação de dados de entrada. """
        from .models import CustomUser
        valid_statuses = [s[0] for s in CustomUser.STATUS_CHOICES]
        return new_status in valid_statuses

    def _handle_status_change_notification(self, user, old_status, new_status, data):
        """ Decide qual notificação enviar, se alguma. """
        if old_status != 'Aprovado' and new_status == 'Aprovado':
            return self._send_approval_notification(user)
        
        if old_status != 'Reprovado' and new_status == 'Reprovado':
            return self._send_rejection_notification(user, data.get('reason'))
        
        return f"Status do usuário alterado para {new_status}"
    
    # ... (métodos _send_approval_notification e _send_rejection_notification)
```

```
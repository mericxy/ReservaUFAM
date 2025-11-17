# services.py
import os
import logging
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

logger = logging.getLogger(__name__)
ENABLE_SENDGRID_DEBUG = os.environ.get("SENDGRID_ENABLE_DEBUG", "false").lower() in {
    "1",
    "true",
    "yes",
}

class EmailService:
    """
    Serviço centralizado para o envio de e-mails transacionais.
    """
    
    @staticmethod
    def send_approval_email(user_email, user_name, username):
        """
        Constrói e envia um e-mail de aprovação de cadastro.
        """
        try:
            subject, html_content, plain_content = EmailService._build_approval_content(user_name, username)
            
            return EmailService._send_mail(
                user_email=user_email,
                subject=subject,
                html_content=html_content,
                plain_text_content=plain_content
            )
        except Exception:
            logger.exception("Falha ao orquestrar e-mail de aprovação para %s", user_email)
            return False

    @staticmethod
    def send_rejection_email(user_email, user_name, reason=None):
        """
        Constrói e envia um e-mail de reprovação de cadastro.
        """
        try:
            subject, html_content, plain_content = EmailService._build_rejection_content(user_name, reason)
            
            return EmailService._send_mail(
                user_email=user_email,
                subject=subject,
                html_content=html_content,
                plain_text_content=plain_content
            )
        except Exception:
            logger.exception("Falha ao orquestrar e-mail de reprovação para %s", user_email)
            return False

    # --- Método Privado de Transporte ---

    @staticmethod
    def _send_mail(user_email, subject, html_content, plain_text_content):
        """
        Método privado responsável por configurar e enviar o e-mail via SendGrid.
        """
        try:
            from_email = (os.environ.get('DEFAULT_FROM_EMAIL', 'navir.ufam@gmail.com'), 'ReservasUFAM')

            message = Mail(
                from_email=from_email,
                to_emails=user_email,
                subject=subject,
                html_content=html_content,
                plain_text_content=plain_text_content
            )
            message.custom_headers = {
                "X-Priority": "3",
                "X-MSMail-Priority": "Normal",
                "Importance": "Normal"
            }

            sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
            response = sg.send(message)

            message_id = response.headers.get("X-Message-Id") if response.headers else None
            logger.info(
                "âœ… Email enviado para %s | assunto=%s | status=%s | message_id=%s",
                user_email,
                subject,
                response.status_code,
                message_id,
            )

            if ENABLE_SENDGRID_DEBUG:
                logger.info(
                    "SendGrid debug | headers=%s | body=%s",
                    dict(response.headers or {}),
                    response.body.decode("utf-8") if getattr(response.body, "decode", None) else response.body,
                )

            return True

        except Exception:
            logger.exception("âŒ Erro ao enviar email para %s via SendGrid", user_email)
            return False

    @staticmethod
    def _build_approval_content(user_name, username):
        """
        Gera o conteúdo (assunto, html, texto) para o e-mail de aprovação.
        """
        subject = "🎉 Cadastro Aprovado - ReservasUFAM"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {{ font-family: 'Arial', sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f5f5f5; }}
                .container {{ max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
                .header {{ background: #22C55E; color: white; padding: 30px 20px; text-align: center; }}
                .content {{ padding: 30px; }}
                .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #666666; background: #f9f9f9; }}
                .button {{ background: #22C55E; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin: 20px 0; font-size: 16px; }}
                .user-info {{ background: #f8f9fa; padding: 15px; border-radius: 6px; text-align: center; margin: 25px 0; border-left: 4px solid #22C55E; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 ReservasUFAM</h1>
                    <h2>Cadastro Aprovado!</h2>
                </div>
                <div class="content">
                    <p>Olá <strong>{user_name}</strong>,</p>
                    <p>Seu cadastro no <strong>ReservasUFAM</strong> foi <strong style="color: #22C55E;">aprovado</strong> com sucesso! ✅</p>
                    <p>Agora você pode acessar o sistema e fazer reservas de auditórios, salas de reunião e veículos.</p>
                    <div class="user-info">
                        <p><strong>👤 Usuário:</strong> {username}</p>
                    </div>
                    <div style="text-align: center;">
                        <a href="http://localhost:5173/" class="button" style="color: white;">Acessar o Sistema</a>
                    </div>
                    <p>Se você tiver qualquer dúvida, entre em contato conosco pelo email: 
                    <a href="mailto:navir.ufam@gmail.com">reservaufam@gmail.com</a></p>
                </div>
                <div class="footer">
                    <p>Este é um email automático, por favor não responda.</p>
                    <p>&copy; 2025 ReservasUFAM - Sistema em Desenvolvimento</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        plain_content = f"""
        Cadastro Aprovado - ReservasUFAM

        Olá {user_name},

        Seu cadastro no ReservasUFAM foi APROVADO com sucesso!

        Agora você pode acessar o sistema e fazer reservas de auditórios, salas de reunião e veículos.

        Usuário: {username}

        Acesse o sistema: http://localhost:5173/login

        Se você tiver qualquer dúvida, entre em contato conosco pelo email: reservaufam@gmail.com

        ---
        Este é um email automático, por favor não responda.
        © 2025 ReservasUFAM - Sistema em Desenvolvimento
        """
        
        return subject, html_content, plain_content

    @staticmethod
    def send_password_reset_email(user_email, user_name, reset_link, expires_minutes):
        """
        Envia o e-mail com o link seguro para redefinição de senha.
        """
        try:
            subject = "Redefinição de Senha - ReservasUFAM"
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {{ font-family: 'Arial', sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }}
                    .container {{ max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
                    .header {{ background: #22C55E; color: white; padding: 30px 20px; text-align: center; }}
                    .content {{ padding: 30px; }}
                    .button {{ background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: bold; }}
                    .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #666666; background: #f9f9f9; }}
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>ReservasUFAM</h1>
                    </div>
                    <div class="content">
                        <p>Olá <strong>{user_name}</strong>,</p>
                        <p>Recebemos uma solicitação para redefinir sua senha.</p>
                        <p>Para continuar, clique no botão abaixo dentro de <strong>{expires_minutes} minutos</strong>:</p>
                        <p style="text-align: center;">
                            <a class="button" href="{reset_link}">Redefinir Senha</a>
                        </p>
                        <p>Se você não solicitou esta ação, ignore este e-mail. Por segurança, o link expira automaticamente após o período informado e só pode ser utilizado uma única vez.</p>
                    </div>
                    <div class="footer">
                        <p>Este é um e-mail automático. Não responda.</p>
                    </div>
                </div>
            </body>
            </html>
            """
            plain_content = (
                "Olá {user_name},\n\n"
                "Recebemos uma solicitação para redefinir sua senha. Utilize o link abaixo dentro "
                "dos próximos {expires_minutes} minutos:\n{reset_link}\n\n"
                "Se você não solicitou esta ação, ignore este e-mail."
            ).format(
                user_name=user_name,
                expires_minutes=expires_minutes,
                reset_link=reset_link
            )

            return EmailService._send_mail(
                user_email=user_email,
                subject=subject,
                html_content=html_content,
                plain_text_content=plain_content
            )
        except Exception:
            logger.exception("Falha ao enviar e-mail de redefinição para %s", user_email)
            return False

    @staticmethod
    def _build_rejection_content(user_name, reason=None):
        """
        Gera o conteúdo (assunto, html, texto) para o e-mail de reprovação.
        """
        subject = "Status do Cadastro - ReservasUFAM"
        
        rejection_reason = reason or "Os requisitos necessários para aprovação não foram atendidos."
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {{ font-family: 'Arial', sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 20px; background-color: #f5f5f5; }}
                .container {{ max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
                .header {{ background: #f44336; color: white; padding: 25px 20px; text-align: center; }}
                .content {{ padding: 30px; }}
                .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #666666; background: #f9f9f9; }}
                .reason-box {{ background: #ffebee; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #f44336; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Status do Cadastro</h1>
                </div>
                <div class="content">
                    <p>Olá <strong>{user_name}</strong>,</p>
                    <p>Seu cadastro no ReservasUFAM <strong>não foi aprovado</strong>.</p>
                    <div class="reason-box">
                        <p><strong>Motivo:</strong><br>
                        {rejection_reason}</p>
                    </div>
                    <p>Se você acredita que houve um engano ou precisa de mais informações, 
                    entre em contato conosco pelo email: 
                    <a href="mailto:navir.ufam@gmail.com">reservaufam@gmail.com</a></p>
                </div>
                <div class="footer">
                    <p>Este é um email automático, por favor não responda.</p>
                    <p>&copy; 2025 ReservasUFAM - Sistema em Desenvolvimento</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        plain_content = f"""
        Status do Cadastro - ReservasUFAM
        Olá {user_name},
        Seu cadastro no ReservasUFAM NÃO FOI APROVADO.
        Motivo: {rejection_reason}
        Se você acredita que houve um engano ou precisa de mais informações, 
        entre em contato conosco pelo email: navir.ufam@gmail.com
        ---
        Este é um email automático, por favor não responda.
        © 2025 ReservasUFAM - Sistema em Desenvolvimento
        """
        
        return subject, html_content, plain_content
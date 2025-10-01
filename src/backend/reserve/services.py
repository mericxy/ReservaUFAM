# services.py
import os
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail

class EmailService:
    @staticmethod
    def send_approval_email(user_email, user_name, username):
        """
        Envia email de aprovação de cadastro usando SendGrid API
        """
        subject = "🎉 Cadastro Aprovado - ReservasUFAM"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {{ 
                    font-family: 'Arial', sans-serif; 
                    line-height: 1.6; 
                    margin: 0; 
                    padding: 0; 
                    background-color: #f5f5f5;
                }}
                .container {{ 
                    max-width: 600px; 
                    margin: 0 auto; 
                    background: white;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }}
                .header {{ 
                    background: #22C55E; 
                    color: white; 
                    padding: 30px 20px; 
                    text-align: center; 
                }}
                .content {{ 
                    padding: 30px; 
                }}
                .footer {{ 
                    text-align: center; 
                    padding: 20px; 
                    font-size: 12px; 
                    color: #666666;
                    background: #f9f9f9;
                }}
                .button {{ 
                    border: 3px solid #22C55E; 
                    color: white; 
                    padding: 15px 30px; 
                    text-decoration: none; 
                    border-radius: 6px; 
                    display: inline-block;
                    font-weight: bold;
                    margin: 20px 0;
                    font-size: 16px;
                }}
                .user-info {{
                    background: #f8f9fa;
                    padding: 15px;
                    border-radius: 6px;
                    text-align: center;
                    margin: 25px 0;
                    border-left: 4px solid #22C55E;
                }}
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
                    
                    <div style="text-align: center; color: #fff;">
                        <a href="http://localhost:5173/login" class="button">Acessar o Sistema</a>
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
        
        try:
            from_email = ('navir.ufam@gmail.com', 'ReservasUFAM')
            
            message = Mail(
                from_email=from_email,
                to_emails=user_email,
                subject=subject,
                html_content=html_content,
                plain_text_content=plain_content
            )

            message.custom_headers = {
                "X-Priority": "3",
                "X-MSMail-Priority": "Normal", 
                "Importance": "Normal"
            }

            sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
            response = sg.send(message)
            
            print(f"✅ Email enviado para {user_email}! Status: {response.status_code}")
            return True
            
        except Exception as e:
            print(f"❌ Erro ao enviar email: {e}")
            return False

    @staticmethod
    def send_rejection_email(user_email, user_name, reason=None):
        """
        Envia email de rejeição de cadastro (opcional)
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
                body {{ 
                    font-family: 'Arial', sans-serif; 
                    line-height: 1.6; 
                    color: #333333; 
                    margin: 0; 
                    padding: 20px; 
                    background-color: #f5f5f5;
                }}
                .container {{ 
                    max-width: 600px; 
                    margin: 0 auto; 
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }}
                .header {{ 
                    background: #f44336; 
                    color: white; 
                    padding: 25px 20px; 
                    text-align: center; 
                }}
                .content {{ 
                    padding: 30px; 
                }}
                .footer {{ 
                    text-align: center; 
                    padding: 20px; 
                    font-size: 12px; 
                    color: #666666;
                    background: #f9f9f9;
                }}
                .reason-box {{
                    background: #ffebee;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                    border-left: 4px solid #f44336;
                }}
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
        
        try:
            from_email = ('navir.ufam@gmail.com', 'ReservasUFAM')
            
            message = Mail(
                from_email=from_email,
                to_emails=user_email,
                subject=subject,
                html_content=html_content,
                plain_text_content=plain_content
            )
            
            message.custom_headers = {
                "X-Priority": "3",
                "Importance": "Normal"
            }

            sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
            response = sg.send(message)
            
            print(f"📧 Email de rejeição enviado para {user_email}! Status: {response.status_code}")
            return True
            
        except Exception as e:
            print(f"❌ Erro ao enviar email de rejeição: {e}")
            return False
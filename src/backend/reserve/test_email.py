# test_email.py
import os
import sys
import django
from dotenv import load_dotenv

from services import EmailService

load_dotenv()

def test_email():
    print("🧪 Testando envio de email...")
    
    success = EmailService.send_rejection_email(
        user_email="evelimbacury@gmail.com",
        user_name="Evelim Teste"
    )
    
    if success:
        print("✅ Email enviado com sucesso! Verifique sua caixa de entrada.")
    else:
        print("❌ Falha ao enviar email.")

if __name__ == "__main__":
    test_email()
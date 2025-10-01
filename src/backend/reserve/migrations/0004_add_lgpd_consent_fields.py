# Generated manually for LGPD compliance

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reserve', '0003_reservation_resource_id_reservation_resource_type'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='privacy_consent',
            field=models.BooleanField(default=False, help_text='Consentimento para tratamento de dados pessoais conforme LGPD'),
        ),
        migrations.AddField(
            model_name='customuser',
            name='privacy_consent_date',
            field=models.DateTimeField(blank=True, help_text='Data e hora do consentimento', null=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='privacy_consent_ip',
            field=models.GenericIPAddressField(blank=True, help_text='IP do usuário no momento do consentimento', null=True),
        ),
        migrations.AddField(
            model_name='customuser',
            name='data_processing_consent',
            field=models.BooleanField(default=False, help_text='Consentimento específico para processamento de dados'),
        ),
    ]
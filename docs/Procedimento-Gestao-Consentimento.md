# PROCEDIMENTO DE GESTÃO DE CONSENTIMENTO
## Sistema ReservaUFAM - UFAM

**Versão:** 1.0  
**Data:** 01 de outubro de 2025  
**Responsável:** [Nome do DPO]  
**Aprovado por:** [Nome da Autoridade]  

---

## 1. OBJETIVO

Estabelecer procedimentos padronizados para coleta, registro, gerenciamento e revogação de consentimento para tratamento de dados pessoais no sistema ReservaUFAM.

---

## 2. APLICAÇÃO

Este procedimento aplica-se a:
- Processo de cadastro de novos usuários
- Coleta de consentimento para finalidades específicas
- Gerenciamento de preferências de consentimento
- Processamento de solicitações de revogação

---

## 3. DEFINIÇÕES

**Consentimento:** Manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento de seus dados pessoais para finalidade determinada.

**Consentimento Livre:** Dado sem coação, fraude ou indução.

**Consentimento Informado:** Precedido de informação clara sobre finalidades, forma de tratamento e direitos do titular.

**Consentimento Inequívoco:** Não deixa dúvidas sobre a vontade do titular.

---

## 4. COLETA DE CONSENTIMENTO

### 4.1 Requisitos Obrigatórios

#### Antes da Coleta:
- ✅ Política de Privacidade disponível e acessível
- ✅ Informações claras sobre finalidades específicas
- ✅ Identificação da base legal para cada tratamento
- ✅ Informações sobre direitos do titular

#### Durante a Coleta:
- ✅ Linguagem clara e acessível
- ✅ Opções granulares quando possível
- ✅ Não aceitar consentimento pré-marcado
- ✅ Permitir consentimento seletivo

#### Após a Coleta:
- ✅ Registro da data, hora e IP
- ✅ Armazenamento seguro dos dados de consentimento
- ✅ Confirmação da coleta para o titular

### 4.2 Implementação Técnica

#### No Sistema ReservaUFAM:
```
Campos obrigatórios no cadastro:
- privacy_consent (Boolean): Aceite da Política de Privacidade
- data_processing_consent (Boolean): Consentimento para processamento
- privacy_consent_date (DateTime): Data/hora do consentimento
- privacy_consent_ip (IPAddress): IP do usuário
```

#### Validações:
- Ambos os consentimentos devem ser TRUE
- Data/hora devem ser registradas automaticamente
- IP deve ser capturado automaticamente
- Formulário só pode ser enviado com consentimentos marcados

---

## 5. REGISTRO E ARMAZENAMENTO

### 5.1 Dados Registrados

Para cada consentimento, registrar:
- **Titular:** CPF/SIAPE do usuário
- **Data/Hora:** Timestamp exato da ação
- **IP:** Endereço IP do usuário
- **Versão da Política:** Versão da política aceita
- **Finalidades:** Finalidades específicas consentidas
- **Método:** Como foi coletado (web form, email, etc.)

### 5.2 Armazenamento Seguro

- **Local:** Banco de dados principal (criptografado)
- **Backup:** Incluído nos backups regulares
- **Acesso:** Restrito ao DPO e administradores autorizados
- **Retenção:** Mantido enquanto necessário para comprovar consentimento

### 5.3 Auditoria

- **Logs:** Todas as ações de consentimento são logadas
- **Rastreabilidade:** Possibilidade de rastrear histórico completo
- **Integridade:** Medidas para evitar alteração dos registros

---

## 6. GERENCIAMENTO DE CONSENTIMENTO

### 6.1 Consulta de Consentimento

**Usuários podem consultar:**
- Status atual dos consentimentos
- Histórico de consentimentos dados
- Finalidades para as quais consentiram
- Data da última atualização

**Como consultar:**
- Através do perfil do usuário no sistema
- Solicitação ao DPO via email/telefone

### 6.2 Atualização de Consentimento

**Quando necessário:**
- Mudança nas finalidades de tratamento
- Atualização da Política de Privacidade
- Nova legislação aplicável
- Solicitação do próprio titular

**Procedimento:**
1. Notificar titular sobre mudanças
2. Solicitar novo consentimento
3. Registrar nova manifestação
4. Manter histórico anterior

---

## 7. REVOGAÇÃO DE CONSENTIMENTO

### 7.1 Direito do Titular

O titular pode revogar consentimento:
- A qualquer momento
- Para finalidades específicas
- Sem justificativa
- Gratuitamente

### 7.2 Canais para Revogação

**Online:**
- Através do perfil no sistema (quando implementado)
- Formulário específico no site

**Offline:**
- Email: dpo@ufam.edu.br
- Telefone: (92) 3305-1181
- Presencial: [Endereço do setor]

### 7.3 Processamento da Revogação

#### Prazos:
- **Confirmação:** Imediata
- **Execução:** Até 15 dias úteis
- **Notificação:** Até 3 dias após execução

#### Procedimento:
1. **Recebimento:** Registrar solicitação
2. **Identificação:** Confirmar identidade do titular
3. **Análise:** Verificar impactos legais/contratuais
4. **Execução:** Interromper tratamentos baseados no consentimento
5. **Registro:** Documentar revogação
6. **Comunicação:** Notificar titular da execução

### 7.4 Consequências da Revogação

**O que acontece:**
- Interrupção do tratamento para finalidades consentidas
- Manutenção de dados com base legal diferente (se aplicável)
- Possível impacto no funcionamento do sistema

**Orientações ao titular:**
- Explicar consequências antes da revogação
- Informar sobre outras bases legais aplicáveis
- Esclarecer que alguns dados podem ser mantidos

---

## 8. CASOS ESPECIAIS

### 8.1 Menores de Idade

**Regra geral:** Não aplicável (sistema restrito a servidores UFAM)

**Se aplicável no futuro:**
- Consentimento dos pais/responsáveis para menores de 16 anos
- Documentação adicional necessária
- Procedimentos específicos de verificação

### 8.2 Dados Sensíveis

**Atual:** Sistema não coleta dados sensíveis

**Se necessário no futuro:**
- Consentimento específico e destacado
- Justificativa clara para coleta
- Medidas de segurança reforçadas

### 8.3 Tratamento sem Consentimento

**Bases legais alternativas:**
- Execução de contrato (Art. 7º, III)
- Exercício regular de direitos (Art. 7º, VI)
- Interesse público (Art. 23, III)

**Procedimento:**
- Identificar base legal aplicável
- Documentar no RAT
- Informar titular na Política de Privacidade
- Não solicitar consentimento quando não necessário

---

## 9. TREINAMENTO E ORIENTAÇÃO

### 9.1 Equipe Interna

**Topics de treinamento:**
- Conceitos de consentimento LGPD
- Procedimentos de coleta
- Uso dos sistemas de registro
- Processamento de revogações

**Frequência:** Inicial + reciclagem anual

### 9.2 Usuários do Sistema

**Orientações:**
- Como dar consentimento informado
- Direitos relacionados ao consentimento
- Como revogar consentimento
- Impactos da revogação

**Canais:** Política de Privacidade, FAQ, suporte

---

## 10. MONITORAMENTO E CONTROLE

### 10.1 Indicadores

- **Taxa de consentimento:** % de usuários que consentem
- **Tempo de processamento:** Tempo para processar revogações
- **Solicitações de revogação:** Número e motivos
- **Conformidade:** % de consentimentos válidos

### 10.2 Revisões

**Periodicidade:**
- Mensal: Análise de indicadores
- Semestral: Revisão de procedimentos
- Anual: Auditoria completa

**Responsável:** DPO em coordenação com equipe técnica

---

## 11. DOCUMENTAÇÃO DE SUPORTE

### 11.1 Formulários
- [ ] Formulário de revogação de consentimento
- [ ] Modelo de notificação de mudanças
- [ ] Checklist de coleta de consentimento

### 11.2 Templates
- [ ] Email de confirmação de consentimento
- [ ] Notificação de revogação processada
- [ ] Comunicação de mudanças na política

### 11.3 Registros
- [ ] Log de consentimentos coletados
- [ ] Histórico de revogações
- [ ] Relatórios de auditoria

---

## 12. CONTROLE DE VERSÕES

| Versão | Data | Responsável | Alterações |
|--------|------|-------------|------------|
| 1.0 | 01/10/2025 | [Nome do DPO] | Criação do procedimento |

---

## 13. CONTATOS

**DPO:** [Nome]  
**Email:** dpo@ufam.edu.br  
**Telefone:** (92) 3305-1181  

**Suporte Técnico:** [Nome]  
**Email:** [email]  
**Telefone:** [telefone]  

---

**Observação:** Este procedimento deve ser revisado sempre que houver mudanças na legislação, sistema ou estrutura organizacional.
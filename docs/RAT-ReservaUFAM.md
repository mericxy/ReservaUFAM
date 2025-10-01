# REGISTRO DE ATIVIDADES DE TRATAMENTO (RAT)
## Sistema ReservaUFAM - UFAM

**Data de Criação:** 01 de outubro de 2025  
**Última Atualização:** 01 de outubro de 2025  
**Responsável:** [Nome do Responsável]  
**DPO:** [Nome do DPO] - dpo@ufam.edu.br  

---

## 1. IDENTIFICAÇÃO DO CONTROLADOR

**Controlador:** Universidade Federal do Amazonas (UFAM)  
**CNPJ:** [CNPJ da UFAM]  
**Endereço:** Av. General Rodrigo Octavio Jordão Ramos, 1200 - Coroado I, Manaus - AM, 69067-005  
**Contato:** dpo@ufam.edu.br  
**Telefone:** (92) 3305-1181  

---

## 2. SISTEMA/APLICAÇÃO

**Nome:** ReservaUFAM  
**Descrição:** Sistema de gestão e reserva de recursos institucionais (auditórios, salas de reunião e veículos)  
**Tipo:** Sistema web administrativo  
**Ambiente:** Produção e desenvolvimento  

---

## 3. ATIVIDADES DE TRATAMENTO

### 3.1 ATIVIDADE: Cadastro de Usuários

**Finalidade:** Gestão de cadastro e autenticação de usuários do sistema  
**Base Legal:** Art. 7º, III - Execução de contrato ou procedimentos preliminares  

**Dados Coletados:**
- **Dados de Identificação:** Nome completo, CPF, SIAPE
- **Dados de Contato:** E-mail, telefone celular
- **Dados de Acesso:** Nome de usuário, senha (criptografada)
- **Dados Profissionais:** Cargo (Professor/Técnico)
- **Dados de Consentimento:** Aceite da política, data/hora, IP

**Origem dos Dados:** Titular (cadastro próprio)  
**Compartilhamento:** Administradores do sistema (aprovação de cadastros)  
**Prazo de Retenção:** Durante vínculo + 5 anos  
**Medidas de Segurança:** Criptografia de senhas, controle de acesso  

### 3.2 ATIVIDADE: Gestão de Reservas

**Finalidade:** Processamento e controle de reservas de recursos institucionais  
**Base Legal:** Art. 7º, III - Execução de contrato ou procedimentos preliminares  

**Dados Coletados:**
- **Dados da Reserva:** Datas, horários, descrição, status
- **Dados do Solicitante:** Identificação do usuário (referência)
- **Dados do Recurso:** Tipo e identificação do recurso reservado

**Origem dos Dados:** Titular (solicitação de reserva)  
**Compartilhamento:** Administradores (aprovação), usuários (visualização própria)  
**Prazo de Retenção:** 2 anos após finalização da reserva  
**Medidas de Segurança:** Controle de acesso baseado em perfil, logs de auditoria  

### 3.3 ATIVIDADE: Controle de Acesso e Auditoria

**Finalidade:** Segurança do sistema e rastreabilidade de ações  
**Base Legal:** Art. 7º, VI - Exercício regular de direitos  

**Dados Coletados:**
- **Logs de Acesso:** Data/hora, IP, ações realizadas
- **Dados de Sessão:** Tokens de autenticação (localStorage), preferências temporárias

**Origem dos Dados:** Coleta automática do sistema  
**Compartilhamento:** Equipe técnica (manutenção), DPO (investigações)  
**Prazo de Retenção:** 6 meses  
**Medidas de Segurança:** Acesso restrito, criptografia  

---

## 4. DIREITOS DOS TITULARES

**Canais de Atendimento:**
- **Email:** dpo@ufam.edu.br
- **Telefone:** (92) 3305-1181
- **Presencial:** [Endereço do setor responsável]

**Procedimentos Implementados:**
- ✅ Confirmação da existência de tratamento
- ✅ Acesso aos dados pessoais
- ✅ Correção de dados incompletos/inexatos
- ⚠️ Anonimização/eliminação (em desenvolvimento)
- ⚠️ Portabilidade dos dados (em desenvolvimento)
- ✅ Informação sobre compartilhamento
- ✅ Revogação do consentimento

---

## 5. MEDIDAS DE SEGURANÇA IMPLEMENTADAS

### Técnicas:
- Criptografia de senhas (bcrypt/pbkdf2)
- HTTPS obrigatório em produção
- Controle de acesso baseado em roles
- Validação de entrada de dados
- Backup automatizado
- Logs de auditoria

### Organizacionais:
- Política de privacidade publicada
- Termo de consentimento obrigatório
- Treinamento da equipe (planejado)
- Procedimentos de resposta a incidentes (em desenvolvimento)
- Avaliação periódica de riscos (planejada)

---

## 6. TRANSFERÊNCIAS INTERNACIONAIS

**Status:** Não há transferências internacionais de dados pessoais.

---

## 7. VIOLAÇÕES DE DADOS

**Registro:** Nenhuma violação registrada até a data.  
**Procedimento:** [Definir procedimento de notificação à ANPD e titulares]

---

## 8. ATUALIZAÇÕES

| Data | Responsável | Alteração |
|------|-------------|-----------|
| 01/10/2025 | [Nome] | Criação do documento RAT |

---

**Observações:**
- Este documento deve ser atualizado sempre que houver mudanças nas atividades de tratamento
- Deve estar disponível para apresentação à ANPD quando solicitado
- Deve ser revisado periodicamente (recomenda-se anualmente)

**Próximas Ações:**
- [ ] Definir responsável formal pelo documento
- [ ] Implementar procedimentos para direitos pendentes
- [ ] Estabelecer cronograma de revisões
- [ ] Treinar equipe sobre procedimentos de LGPD
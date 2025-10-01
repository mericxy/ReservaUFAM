# Plano Estratégico de Melhoria de Aplicação

**Equipe Responsável:** Evelim Bacury, Gabriel Moriz, Marcio Eric, José Santo

---

## 1. Visão Geral
Este documento descreve um plano estratégico focado na melhoria da aplicação, abordando quatro pilares principais: a confiabilidade da comunicação, a conformidade legal com a LGPD, a ampliação dos direitos do usuário e a modernização técnica da base de código. O objetivo é elevar a qualidade, segurança e confiança na plataforma.

## 2. Iniciativas Estratégicas

### 2.1. Integração com API de E-mail
**Objetivo:** Implementar o envio de e-mails de confirmação por meio de uma API pública confiável, aumentando a confiabilidade e reduzindo a complexidade de desenvolvimento interno.

**Justificativa:**
- Reduz a carga de desenvolvimento e manutenção de uma solução interna.
- Aproveita a robustez, escalabilidade e taxa de entrega de serviços especializados.
- Melhora significativamente a experiência do usuário com comunicações confiáveis.

**Entregas:**
- Pesquisa e seleção do provedor de API de e-mail.
- Implementação da integração no backend da aplicação.
- Criação de templates de e-mail para confirmação.
- Testes de envio e entrega.

### 2.2. Conformidade com a LGPD
**Objetivo:** Garantir que a aplicação adote todas as práticas e diretrizes da Lei Geral de Proteção de Dados, assegurando a segurança, privacidade e integridade dos dados dos usuários.

**Justificativa:**
- Atende a requisitos legais obrigatórios, evitando sanções.
- Fortalece a confiança e a transparência com os usuários.
- Posiciona a aplicação como um produto que valoriza a privacidade.

**Entregas:**
- Revisão e mapeamento de todos os dados pessoais coletados.
- Atualização da Política de Privacidade e Termos de Uso.
- Implementação de mecanismos para obtenção e registro de consentimento.
- Estabelecimento de processos internos para gestão de incidentes de vazamento.

### 2.3. Funcionalidade de Exclusão de Conta
**Objetivo:** Implementar uma funcionalidade clara e segura que permita ao usuário solicitar e efetivar a exclusão permanente de sua conta e dados, em conformidade com a LGPD.

**Justificativa:**
- Atende ao direito de revogação de consentimento e exclusão de dados, previsto na LGPD.
- Promove transparência e dá ao usuário controle sobre suas informações.
- Consolida o compromisso da aplicação com a privacidade.

**Entregas:**
- Desenvolvimento do fluxo no frontend para o usuário solicitar a exclusão.
- Criação de processo backend para exclusão/anonimização de todos os dados do usuário em todos os sistemas.
- Definição de um protocolo de confirmação por e-mail para evitar exclusões acidentais.
- Documentação do processo para a equipe de suporte.

### 2.4. Atualização de Biblioteca Crítica
**Objetivo:** Realizar a atualização ou substituição de uma biblioteca crítica no projeto para garantir maior estabilidade, segurança e compatibilidade com o ambiente de desenvolvimento.

**Justificativa:**
- Elimina vulnerabilidades de segurança conhecidas em versões antigas.
- Corrige possíveis falhas de desempenho e bugs.
- Facilita a manutenção evolutiva e a adoção de novas tecnologias.

**Entregas:**
- Auditoria da biblioteca para identificar impactos da atualização/substituição.
- Execução da atualização em um ambiente de homologação.
- Realização de testes rigorosos de funcionalidade e desempenho.
- Implantação controlada em produção.

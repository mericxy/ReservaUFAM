# Relatório Final – Manutenção Adaptativa

## Sumário

1. **Introdução**  
2. **Breve Descrição do Sistema**  
3. **Funcionalidades Implementadas e suas Classificações**  
4. **Links para Issues Correspondentes**  
5. **Links para Pull Requests (PRs)**  
6. **Evidências das Estratégias Adaptativas**  
   - 6.1 Exclusão de Conta e Anonimização de Dados (LGPD)  
   - 6.2 Políticas de Privacidade  
   - 6.3 Integração de E-mail (SendGrid)  
   - 6.4 Atualização do TailwindCSS 4.1 / PostCSS  
7. **Reflexão Crítica**  
8. **Conclusão**  

## 1. Introdução

Este relatório apresenta as **estratégias de manutenção adaptativa** implementadas no sistema **ReservaUFAM**, desenvolvidas como parte do trabalho prático da disciplina *Manutenção e Integração de Software* (TP2 – Manutenção Adaptativa).  
O objetivo é evidenciar como o sistema foi ajustado para se adequar a **mudanças legais, técnicas e funcionais**, demonstrando a capacidade da aplicação de evoluir frente a novos requisitos externos e de ambiente.  

Foram abordadas três principais frentes de manutenção adaptativa:

- **Adequação à LGPD (Lei nº 13.709/2018)** – Implementação da exclusão de conta e da política de privacidade obrigatória.  
- **Atualização de dependências** – Adaptação do projeto à nova versão do TailwindCSS 4.1 e integração com o novo módulo `@tailwindcss/postcss`.  
- **Integração de API externa** – Implementação do envio de notificações por e-mail via **SendGrid API**, com testes e validações em ambiente controlado.

---

## 2. Breve Descrição do Sistema

O sistema **ReservaUFAM** é uma aplicação web desenvolvida para gerenciar reservas de recursos institucionais da Universidade Federal do Amazonas (UFAM), como auditórios, salas e veículos.  
A solução visa centralizar e otimizar o controle de agendamentos, oferecendo **eficiência operacional**, **segurança na autenticação** e **transparência na gestão dos recursos**.  

A aplicação é composta por:

- **Backend:** Django REST Framework (Python);
- **Frontend:** ReactJS + TailwindCSS;
- **Autenticação:** JWT (JSON Web Token).

Essa arquitetura modular permite flexibilidade e facilita a implementação de novas funcionalidades ou adaptações conforme requisitos futuros.

---

## 3. Funcionalidades Implementadas e suas Classificações

| Nº | Funcionalidade | Classificação | Descrição |
|----|----------------|---------------|------------|
| 1  | Exclusão de Conta e Anonimização de Dados | Manutenção Adaptativa / Requisito Legal (LGPD) | Implementa o “direito ao esquecimento” (Art. 18, VI da LGPD), permitindo que usuários solicitem a exclusão permanente de seus dados pessoais, com anonimização preservando a integridade dos registros históricos. |
| 2  | Políticas de Privacidade e Termo de Consentimento | Manutenção Adaptativa / Requisito Legal (LGPD) | Adiciona a seção de Políticas de Privacidade e o campo de aceite obrigatório no cadastro de usuários, conforme exigências da LGPD. |
| 3  | Integração de E-mail (SendGrid) | Manutenção Adaptativa / Funcionalidade | Implementa o envio automático de e-mails de notificação para usuários aprovados ou reprovados, utilizando a API externa SendGrid. Corrige também um bug de `view` duplicada que impedia o envio. |
| 4  | Atualização do TailwindCSS 4.1 e PostCSS | Manutenção Adaptativa / Dependência Técnica | Resolve incompatibilidades geradas pela atualização do TailwindCSS para a versão 4.1, adaptando o sistema à nova arquitetura de plugins. |

---

## 4. Links para Issues Correspondentes

- **Issue #15:** [Implementar funcionalidade de exclusão completa de conta e anonimização de dados](https://github.com/users/mericxy/projects/5?pane=issue&itemId=131502287&issue=mericxy%7CReservaUFAM%7C15)  
- **Issue #16:** [Atualização do TailwindCSS para a versão 4](https://github.com/users/mericxy/projects/5?pane=issue&itemId=131504408&issue=mericxy%7CReservaUFAM%7C16)  
- **Issue #17:** [Inclusão de Política de Privacidade e Termo de Consentimento Obrigatório no Cadastro](https://github.com/users/mericxy/projects/5?pane=issue&itemId=131504408&issue=mericxy%7CReservaUFAM%7C17)  
- **Issue #20:** [Integração de API externa de e-mail (SendGrid)](https://github.com/users/mericxy/projects/5/views/1?pane=issue&itemId=131640694&issue=mericxy%7CReservaUFAM%7C20)

---

## 5. Links para Pull Requests (PRs)

- **PR #18:** [Atualização do TailwindCSS 4.1 e PostCSS](https://github.com/mericxy/ReservaUFAM/pull/18)  
- **PR #19:** [Exclusão de conta (LGPD)](https://github.com/mericxy/ReservaUFAM/pull/19)  
- **PR #21:** [Inclusão de Política de Privacidade e Termo de Consentimento](https://github.com/mericxy/ReservaUFAM/pull/21)  
- **PR #22:** [Integração do serviço de e-mail com SendGrid](https://github.com/mericxy/ReservaUFAM/pull/22)

---

## 6. Evidências das Estratégias Adaptativas

### 6.1 Exclusão de Conta e Anonimização de Dados (LGPD)

#### Teste 1 – Comparativo de Interface (Antes e Depois)

- **Antes:** A página “Meu Perfil” não possuía controle de exclusão de conta.  
  ![Antes](./evidencia15-1.jpg)

- **Depois:** A interface recebeu a seção “Zona de Perigo”, incluindo o botão “Excluir Minha Conta Permanentemente”.  
  ![Depois](./evidencia15-2.jpg)

- Ao clicar, o navegador exibe uma confirmação (`window.confirm`).  
  ![Confirmação](./evidencia15-3.jpg)

#### Teste 2 – Validação no Backend
```http
DELETE /api/user/delete/ HTTP/1.1
Authorization: Bearer <token_jwt_do_usuario>

HTTP/1.1 204 No Content
```
```json
{
  "username": "anon_5",
  "email": "anon_5@deleted.user",
  "is_active": false,
  "is_anonymized": true
}
```
**Resultado:** Dados pessoais anonimizados conforme exigência da LGPD, garantindo integridade do histórico de reservas.

---

### 6.2 Políticas de Privacidade

#### Teste 1 – Comparativo da Interface (Antes e Depois)

- **Antes:** Tela de cadastro sem política de privacidade.  
  ![Cadastro antes](./evidencia17-1.jpg)

- **Depois:** Adição da seção “Política de Privacidade e Termos de Uso”, com campo de aceite obrigatório.  
  ![Cadastro depois](./evidencia17-2.png)

**Resultado:** A inclusão do campo de consentimento garante transparência e adequação legal, conforme o Art. 7º da LGPD.

---

### 6.3 Integração de E-mail (SendGrid)

#### Teste 1 – Fluxo de Aprovação
```json
{
  "message": "Status do usuário alterado para Aprovado. E-mail enviado com sucesso."
}
```

![Cadastro depois](./evidencia20-3.jpg)

#### Teste 2 – Fluxo de Reprovação
```json
{
  "message": "Status do usuário alterado para Reprovado. E-mail enviado com sucesso."
}
```
> **Assunto:** Atualização sobre sua conta no ReservaUFAM  
> **Corpo:** Olá, [Nome do Usuário]. Seu cadastro não foi aprovado. Motivo: [Motivo opcional].

#### Teste 3 – Validação Manual (Script)
```
[INFO] Attempting to send a test email...
[INFO] Test email sent successfully! Status Code: 202 Accepted.
```

#### Teste 4 – Falha Simulada
```
[ERROR] EmailService: Failed to send approval email. Status Code: 401.
```

**Resultado:** O sistema lida corretamente com erros de integração, preservando a consistência do fluxo administrativo.

---

### 6.4 Atualização do TailwindCSS 4.1 / PostCSS

#### Evidência 1 – Erro Inicial (VSCode)
```
Unknown at rule @tailwind css(unknownAtRules)
```
![Erro Tailwind](./evidencia1.png)

#### Evidência 2 – Erro de Build (Vite)
```
[plugin:vite:css] [postcss] It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin.
```
![Erro PostCSS](./evidencia2.png)

#### Solução
```bash
npm install @tailwindcss/postcss
```
```js
// postcss.config.js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {}
  }
}
```

**Resultado:** Após a adaptação, o projeto compilou normalmente, validando a correção da dependência.

---

## 7. Reflexão Crítica

As manutenções adaptativas realizadas no **ReservaUFAM** demonstram como ajustes contínuos são essenciais para a longevidade e a conformidade de um software.  
A adequação à **LGPD** fortaleceu a proteção de dados e a confiança do usuário; a atualização do **TailwindCSS** assegurou a sustentabilidade técnica do projeto; e a integração do **SendGrid** elevou a comunicação automatizada do sistema.  

Essas melhorias consolidam o sistema como uma aplicação madura, moderna e aderente às boas práticas de **engenharia de software**.

---

## 8. Conclusão

As quatro estratégias implementadas — **duas legais (LGPD)**, **uma técnica (TailwindCSS)** e **uma de integração externa (SendGrid)** — comprovam a capacidade de evolução do sistema **ReservaUFAM** diante de novos contextos e exigências.  
O projeto cumpre todos os requisitos de **Manutenção Adaptativa** e se mantém atualizado, seguro e em conformidade com as normas vigentes.

---

**Universidade Federal do Amazonas (UFAM)**  
**Instituto de Ciências Exatas e Tecnologia (ICET)**  
**Disciplina:** Manutenção e Integração de Software  
**Data:** Outubro de 2025  
**Equipe:** Evelim Bacury, Gabriel Moriz, José Santo, Márcio Éric

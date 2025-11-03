# 📝 Relatório de Code Smells

Este modelo deve ser utilizado pela equipe para documentar os code smells identificados, as ações realizadas e os responsáveis pelas correções. Preencha cada campo de acordo com o que foi encontrado ou corrigido.

---

## 1. ℹ️ Informações Gerais

**👥 Equipe responsável:**  
**📅 Data do relatório:**  
**🕒 Período de identificação:**  

---

## 2. 🚩 Resumo dos Code Smells

| 📄 Arquivo/Classe   | 🕵️ Tipo de Code Smell              | 📝 Descrição do Problema                                                         | ⚠️ Severidade | 👤 Responsável     | 📊 Status da Correção |
|---------------------|-------------------------------------|----------------------------------------------------------------------------------|---------------|-------------------|---------------------|
| api.js, Login.jsx, CreateReservation.jsx, AdminRecursos.jsx, outros | Código Duplicado (DRY)         | URLs da API hardcoded em múltiplos módulos, dificultando manutenção               | Média         | mericxy           | Corrigido           |
| CreateReservation.jsx                                  | Large Class / God Object        | Componente com múltiplas responsabilidades, difícil manutenção e testes           | Alta          | mericxy           | Corrigido           |
| Diversos (ex: CreateReservation.jsx, AdminPage.jsx)    | Debug Code                     | Logs (`console.log`, `console.error`) remanescentes do desenvolvimento em produção| Baixa         | mericxy           | Corrigido           |
| reserve/services.py, reserve/views.py                  | Long Method                    | Métodos com centenas de linhas e múltiplas responsabilidades                      | Alta          | JSMouraNeto       | Corrigido           |

---

## 3. 🔍 Descrição Detalhada

### 3.1. Arquivo/Classe: api.js e componentes React (Login.jsx, CreateReservation.jsx, AdminRecursos.jsx, outros)

- **🕵️ Tipo de Code Smell:** Código Duplicado (DRY)
- **📝 Descrição detalhada:** O endereço da API estava hardcoded em vários componentes, tornando o código redundante e suscetível a erros caso houvesse necessidade de alteração deste endereço.
- **🔧 Proposta de correção:** Centralização da URL base em arquivo único (api.js) usando variável de ambiente (VITE_API_URL).
- **📊 Status:** Corrigido ([PR #30](https://github.com/mericxy/ReservaUFAM/pull/30))

### 3.2. Arquivo/Classe: CreateReservation.jsx

- **🕵️ Tipo de Code Smell:** Large Class / God Object
- **📝 Descrição detalhada:** O componente era responsável por diversas funcionalidades: busca de recursos, validação de formulário, controle de várias etapas, integração com diferentes APIs, tudo concentrado em um único arquivo.
- **🔧 Proposta de correção:** Modularização do componente, extração de lógicas para custom hooks e criação de subcomponentes especializados.
- **📊 Status:** Corrigido ([PR #32](https://github.com/mericxy/ReservaUFAM/pull/32))

### 3.3. Arquivo/Classe: Diversos (ex: CreateReservation.jsx, AdminPage.jsx)

- **🕵️ Tipo de Code Smell:** Debug Code
- **📝 Descrição detalhada:** Existência de instruções `console.log` e `console.error` utilizadas apenas no desenvolvimento, mas presentes no código de produção.
- **🔧 Proposta de correção:** Remover todos os logs de debug desnecessários e dead code associado.
- **📊 Status:** Corrigido ([PR #31](https://github.com/mericxy/ReservaUFAM/pull/31))

### 3.4. Arquivo/Classe: reserve/services.py, reserve/views.py

- **🕵️ Tipo de Code Smell:** Long Method
- **📝 Descrição detalhada:** Métodos como `send_approval_email()`, `send_rejection_email()`, `UpdateUserStatusView.patch()`, `LoginView.post()` e `AdminReservationListView.get_queryset()` têm centenas de linhas, múltiplas responsabilidades e lógica complexa embutida (incluindo HTML).
- **🔧 Sugestão de melhoria:** Extrair funções auxiliares para construção de HTML, separar lógica de envio de e-mail em módulo utilitário, quebrar blocos condicionais em funções menores e usar mixins/serializers nas views.
- **📊 Status:** Aberto para refatoração. Não há confirmação de PR fechado relacionado à refatoração dos métodos longos, mas há PRs que melhoram estrutura de e-mails e consolidam views:

    - [PR #22 - Integração de API externa de e-mail, consolidação e melhorias em views](https://github.com/mericxy/ReservaUFAM/pull/22)
    - Outros PRs estão relacionados à manutenção e ajustes gerais, mas não tratam diretamente a refatoração dos métodos longos.

---

## 4. ✅ Ações Realizadas

- [x] ✨ Refatoração aplicada em: api.js, Login.jsx, CreateReservation.jsx, AdminRecursos.jsx e outros por mericxy
- [x] ✨ Refatoração modular e divisão de responsabilidades no CreateReservation.jsx por mericxy
- [x] ✨ Remoção de logs de debug em múltiplos componentes por mericxy
- [x] 🧪 Testes realizados após refatoração
- [x] 🗒️ Documentação atualizada
- [x] 👀 Revisão por membro da equipe: mericxy

---

## 5. 📈 Resultados e Observações

- **🔝 Melhorias percebidas após refatoração:**
  - Eliminação de redundância na base de código
  - Aumento da legibilidade, manutenibilidade e testabilidade dos componentes principais
  - Facilidade para mudanças de ambiente (ex: prod/dev)
- **⚠️ Desafios encontrados:**
  - Identificação de todos os pontos afetados
  - Cuidados na decomposição de componentes complexos e manutenção de funcionalidades
- **💡 Observações Gerais:**
  - Recomenda-se seguir esse padrão para outras constantes de configuração e componentes grandes
  - Refatoração de métodos longos em andamento nos módulos de serviço e views

---

## 6. 📎 Anexos

- [🔗 PR #32 - Refatoração do God Object CreateReservation.jsx](https://github.com/mericxy/ReservaUFAM/pull/32)
- [🔗 PR #31 - Remoção de logs de debug em código de produção](https://github.com/mericxy/ReservaUFAM/pull/31)
- [🔗 PR #30 - Centralização de URLs da API (evita código duplicado)](https://github.com/mericxy/ReservaUFAM/pull/30)
- [🔗 PR #22 - Integração de API externa de e-mail, consolidação de views e início de modularização](https://github.com/mericxy/ReservaUFAM/pull/22)

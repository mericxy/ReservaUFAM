# 📝 Relatório de Code Smells

Este modelo deve ser utilizado pela equipe para documentar os code smells identificados, as ações realizadas e os responsáveis pelas correções. Preencha cada campo de acordo com o que foi encontrado ou corrigido.

---

## 1. ℹ️ Informações Gerais

**👥 Equipe responsável:**  
**📅 Data do relatório:**  
**🕒 Período de identificação:**  

---

## 2. 🚩 Resumo dos Code Smells

| 📄 Arquivo/Classe   | 🕵️ Tipo de Code Smell              | 📝 Descrição do Problema                                                         | ⚠️ Severidade | 👤 Responsável | 📊 Status da Correção |
|---------------------|-------------------------------------|----------------------------------------------------------------------------------|---------------|----------------|---------------------|
| api.js, Login.jsx, CreateReservation.jsx, AdminRecursos.jsx, outros | Código Duplicado (DRY)         | URLs da API hardcoded em múltiplos módulos, dificultando manutenção               | Média         | mericxy        | Corrigido           |
| CreateReservation.jsx                                  | Large Class / God Object        | Componente com múltiplas responsabilidades, difícil manutenção e testes           | Alta          | mericxy        | Corrigido           |
| Diversos (ex: CreateReservation.jsx, AdminPage.jsx)    | Debug Code                     | Logs (`console.log`, `console.error`) remanescentes do desenvolvimento em produção| Baixa         | mericxy        | Corrigido           |

---

## 3. 🔍 Descrição Detalhada

### 3.1. Arquivo/Classe: api.js e componentes React (Login.jsx, CreateReservation.jsx, AdminRecursos.jsx, outros)

- **🕵️ Tipo de Code Smell:** Código Duplicado (DRY)
- **🔢 Linha(s):** Diversas ocorrências de http://127.0.0.1:8000
- **📝 Descrição detalhada:** O endereço da API estava hardcoded em vários componentes, tornando o código redundante e suscetível a erros caso houvesse necessidade de alteração deste endereço.
- **❓ Motivo do problema:** Ausência de centralização da URL base da API.
- **💥 Impacto no sistema:** Dificuldade na manutenção, potencial para inconsistências e erros ao trocar ambientes (ex: produção, desenvolvimento).
- **🔧 Proposta de correção:** Centralização da URL base em arquivo único (api.js) usando variável de ambiente (VITE_API_URL).
- **👤 Responsável pela análise/correção:** mericxy
- **📊 Status:** Corrigido ([PR #30](https://github.com/mericxy/ReservaUFAM/pull/30))

### 3.2. Arquivo/Classe: CreateReservation.jsx

- **🕵️ Tipo de Code Smell:** Large Class / God Object
- **🔢 Linha(s):** Mais de 600 linhas (~todas)
- **📝 Descrição detalhada:** O componente era responsável por diversas funcionalidades: busca de recursos, validação de formulário, controle de várias etapas, integração com diferentes APIs, tudo concentrado em um único arquivo.
- **❓ Motivo do problema:** Falta de separação de responsabilidades e modularização.
- **💥 Impacto no sistema:** Dificuldade de manutenção, testes, maior risco de bugs ao implementar mudanças e baixa escalabilidade.
- **🔧 Proposta de correção:** Modularização do componente, extração de lógicas para custom hooks (`useResources`, `useFormReservation`), criação de subcomponentes especializados (ReservationForm, ResourceSelector), separação da interface e regras de negócio.
- **👤 Responsável pela análise/correção:** mericxy
- **📊 Status:** Corrigido ([PR #32](https://github.com/mericxy/ReservaUFAM/pull/32))

### 3.3. Arquivo/Classe: Diversos (ex: CreateReservation.jsx, AdminPage.jsx)

- **🕵️ Tipo de Code Smell:** Debug Code
- **🔢 Linha(s):** Diversas
- **📝 Descrição detalhada:** Existência de instruções `console.log` e `console.error` utilizadas apenas no desenvolvimento, mas presentes no código de produção.
- **❓ Motivo do problema:** Falta de limpeza do código ao promover para produção.
- **💥 Impacto no sistema:** Poluição de logs, exposição desnecessária de detalhes internos da aplicação.
- **🔧 Proposta de correção:** Remover todos os logs de debug desnecessários e dead code associado.
- **👤 Responsável pela análise/correção:** mericxy
- **📊 Status:** Corrigido ([PR #31](https://github.com/mericxy/ReservaUFAM/pull/31))

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

---

## 6. 📎 Anexos

- [🔗 PR #32 - Refatoração do God Object CreateReservation.jsx](https://github.com/mericxy/ReservaUFAM/pull/32)
- [🔗 PR #31 - Remoção de logs de debug em código de produção](https://github.com/mericxy/ReservaUFAM/pull/31)
- [🔗 PR #30 - Centralização de URLs da API (evita código duplicado)](https://github.com/mericxy/ReservaUFAM/pull/30)

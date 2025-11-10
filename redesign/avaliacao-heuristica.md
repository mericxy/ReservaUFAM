# 📝 Relatório de Redesign – Aplicação das 10 Heurísticas de Nielsen
### Projeto: ReservaUFAM

Este documento apresenta a avaliação heurística e o redesign realizado no sistema **ReservaUFAM**, seguindo as **10 Heurísticas de Usabilidade de Nielsen**.

O objetivo central foi **corrigir problemas reais de usabilidade**, documentando:

✔ Problema identificado  
✔ Severidade  
✔ Heurística violada  
✔ Evidências (imagens)  
✔ Solução aplicada  
✔ Resultado (antes → depois)

---

## ✅ Metodologia

1. **Avaliação Heurística Inicial**
   - Análise das telas: cadastro, login, perfil, reserva e administração.
   - Registro dos problemas com descrição, impacto e heurística violada.

2. **Redesign**
   - Implementação das melhorias priorizando:
     - Consistência
     - Prevenção de erros
     - Controle do usuário
     - Redução de frustração

3. **Comparativos**
   - Cada melhoria documentada com imagens antes/depois, issue e pull request.

---

## ✅ Lista de Problemas Encontrados e Melhorias Aplicadas  
Formato de estruturação:

**Descrição resumida → detalhada → tela → severidade → heurística → evidências → impacto atual → solução → evidências pós → impacto esperado → pull request**

---

### 1) ❌ Falta da função “Cancelar” no Cadastro — Issue #36

**Descrição resumida:**  
A tela de cadastro não oferecia opção de cancelar a operação.

**Descrição detalhada:**  
O usuário ficava preso ao fluxo de cadastro sem opção de desistir ou retornar, violando o princípio de controle do usuário.

**Tela afetada:**  
Cadastro de usuário

**Severidade:** 🔴 Alta

**Heurística violada:**  
- 3 - Controle e liberdade do usuário

**Evidências (antes):**  
<img width="565" height="589" src="https://github.com/user-attachments/assets/d8dce077-e623-46a5-a71f-a69b193540b7" />

**Impacto atual:**  
- Usuário sem opção de retorno  
- Frustração e perda de tempo

**Solução aplicada:**  
- Botão “Cancelar” com confirmação

**Evidências (depois):**  
<img width="579" height="646" src="https://github.com/user-attachments/assets/695dad92-6441-4a5a-800c-854f26832e90" />

**Impacto esperado:**  
- Mais controle sobre ações  
- Navegação eficiente

**Pull Request:** #52

---

### 2) ❌ Logout sem confirmação — Issue #37

**Descrição resumida:**  
Logout era imediato e sem aviso.

**Descrição detalhada:**  
Um clique acidental encerrava a sessão instantaneamente, interrompendo ações em andamento.

**Tela afetada:**  
Header do usuário e administrador

**Severidade:** 🔴 Alta

**Heurísticas violadas:**  
- 3 - Controle e liberdade  
- 5 - Prevenção de erros

**Evidências (antes):**  
<img src="https://github.com/user-attachments/assets/6c88214c-7684-4632-994d-0efe76b02d4a" />

**Impacto atual:**  
- Deslogar sem querer  
- Perda de dados preenchidos

**Solução aplicada:**  
- Inserção de modal “Deseja realmente sair?”

**Evidências (depois):** 
![Image](https://github.com/user-attachments/assets/d648bb70-e59a-4c54-a069-aa5b68efd19c)

**Impacto esperado:**  
- Prevenção de erros  
- Aumento de segurança e controle

**Pull Request:** #57

---

### 3) ❗ Campos obrigatórios sem identificação — Issue #38

**Descrição resumida:**  
Formulários não indicavam quais campos eram obrigatórios.

**Descrição detalhada:**  
Usuários enviavam dados incompletos por não saberem o que era requerido.

**Tela afetada:**  
Cadastro e formulários

**Severidade:** 🟡 Média

**Heurísticas violadas:**  
- 4 - Consistência e padrões  
- 5 - Prevenção de erros

**Evidências (antes):**  
<img width="522" height="623" src="https://github.com/user-attachments/assets/8d312dd7-5875-4899-963c-4858ebc24dbd" />

**Impacto atual:**  
- Erros repetidos  
- Necessidade de retrabalho

**Solução aplicada:**  
- Indicadores e asteriscos adicionados

**Evidências (depois):**  
<img width="516" height="626" src="https://github.com/user-attachments/assets/1fcf3fbb-e7f7-42d0-b7f5-8003d5642835" />

**Impacto esperado:**  
- Menos erros e retrabalho

**Pull Request:** #54

---

### 4) 🔐 Falta de ícone “mostrar senha” — Issue #39

**Descrição resumida:**  
Usuários não podiam visualizar a senha enquanto digitavam.

**Descrição detalhada:**  
Erros de digitação só eram percebidos após falha de login, causando retrabalho.

**Tela afetada:**  
Login e redefinição

**Severidade:** 🟡 Média

**Heurísticas violadas:**  
- 3 - Controle e liberdade  
- 4 - Consistência

**Evidências (antes):**  
<img width="1169" height="724" src="https://github.com/user-attachments/assets/42051210-6858-49e4-a2b5-66e3049c3964" />

**Impacto atual:**  
- Erros frequentes na digitação  
- Perda de tempo

**Solução aplicada:**  
- Ícone "mostrar senha" adicionado

**Evidências (depois):**  
<img width="737" height="535" src="https://github.com/user-attachments/assets/3754eaf9-c276-4b03-a73b-bf3bb4ddd430" />

**Impacto esperado:**  
- Menos erros  
- Maior acessibilidade

**Pull Request:** #48

---

### 5) 📞 CPF, SIAPE e telefone sem formatação — Issue #46

**Descrição resumida:**  
Campos numéricos não tinham máscara.

**Descrição detalhada:**  
Usuários inseriam número manualmente, permitindo formatos incorretos.

**Tela afetada:**  
Cadastro

**Severidade:** 🟡 Média

**Heurísticas violadas:**  
- 4 - Consistência e padrões  
- 5 - Prevenção de erros

**Evidências (antes):** 
Na tela Cadastro aparece os dados formatados
<img width="710" height="419" alt="Image" src="https://github.com/user-attachments/assets/dc91c3c1-3e80-43c1-9a88-1e8e5c3abb31" />

Porém nas telas retratadas na imagem abaixo não está com a formatação.

<img width="1046" height="620" alt="Image" src="https://github.com/user-attachments/assets/a87bd83f-71a8-4343-8cbb-8c3ec70ad5a5" />

**Impacto atual:**  
- Dificuldade de leitura e validação

**Solução aplicada:**  
- Máscaras automáticas adicionadas

**Evidências (depois):** 
Foi aplicada a formatação na exibição das informações dos usuários

<img width="480" height="270" alt="Image" src="https://github.com/user-attachments/assets/9e0b191d-484b-4d18-b208-512c9a73fca3" />

<img width="280" height="445" alt="Image" src="https://github.com/user-attachments/assets/2056b545-eac6-44fb-8c00-2b3b4e5474df" />

<img width="360" height="348" alt="Image" src="https://github.com/user-attachments/assets/6e5536f6-9bf3-44ef-8898-3fd1287e9cee" />

**Impacto esperado:**  
- Padronização e menos erros

**Pull Request:** #51

---

### 6) 🔄 Ausência de opção clara para voltar à Home — Issue #44

**Descrição resumida:**  
O botão Home possuía aparência e comportamento diferente para usuários e administradores. Além de que é dificultoso para o usuário não saber que está na tela Home e não ter a opção de voltar por ela no Header.

**Descrição detalhada:**  
A navegação para a Home não estava clara. Em alguns perfis o botão “Home” estava ausente, e quando existia, tinha visual e comportamento diferentes entre administrador e usuário comum. Além disso, o usuário não tinha feedback de que já estava na Home, nem opção explícita para retornar a ela pelo header.

**Tela afetada:**  
Home e header

**Severidade:** 🟡 Média

**Evidências (antes):** 
<img width="846" height="344" alt="Image" src="https://github.com/user-attachments/assets/759d6682-de52-42f5-9f8c-af9e71fb259f" />

**Heurísticas violadas:**  
- 1 - Visibilidade do status do sistema
  2 - Controle e liberdade do usuário
- 4 - Consistência e padrões

**Solução aplicada:**  
- Adição de aba Home no header Usuário

**Evidências (depois):** 
<img width="561" height="61" alt="Image" src="https://github.com/user-attachments/assets/eccd8b1e-465e-4f32-8a49-6978e8fde1ac" />

**Impacto esperado:**  
- Navegação mais intuitiva  
- Consistência visual

**Pull Request:** #56

---

### 7) ❌ Campos imutáveis sem indicação (SIAPE, CPF, Cargo) — Issue #50

**Descrição resumida:**  
Campos fixos pareciam editáveis, induzindo erro.

**Descrição detalhada:**  
Usuário tentava modificá-los e acreditava que o sistema estava travado.

**Tela afetada:**  
Perfil

**Severidade:** 🟡 Média

**Heurísticas violadas:**  
- 5 - Prevenção de erros  
- 4 - Consistência

**Evidências (antes):**  
<img width="760" height="748" alt="Image" src="https://github.com/user-attachments/assets/99104503-f0a2-41d9-a867-d0b2a6f8f8e4" />

**Impacto atual:**  
- Sensação de falha no sistema

**Solução aplicada:**  
- Campos com aspecto visual de somente leitura e mensagem adicional

**Evidências (depois):** 
Agora os campos imutáveis estão devidamente simbolizados que não permitem alterações

<img width="760" height="748" alt="Image" src="https://github.com/user-attachments/assets/d102a4f3-fae9-4fe3-a67f-d84aee537b05" />

**Impacto esperado:**  
- Redução de tentativas e dúvidas

**Pull Request:** #53

---

### 8) ❗ Necessidade de Memorização para Ver Reservas Recentes — Issue #40

**Descrição resumida:**  
Administrador precisava navegar por múltiplas telas para verificar novas reservas.

**Descrição detalhada:**  
O sistema não exibia status recente, exigindo memorização e consultas manuais.

**Tela afetada:**  
Administrador

**Severidade:** 🟡 Média

**Heurística violada:**  
- 6 - Reconhecimento ao invés de memorização

**Evidências (antes):**  
Necessidade de conferir manualmente a aba de Reservas para verificar atualizações pois não aparece no painel.
<img width="1572" height="867" alt="Image" src="https://github.com/user-attachments/assets/1be66d83-58bd-4736-9d4d-eea55c8970db" />


Percebe-se que há uma nova reserva porém não é sinalizada para o administrador quando o mesmo abre a aplicação.
<img width="1595" height="734" alt="Image" src="https://github.com/user-attachments/assets/e1237496-e850-4d0f-ac38-b08149874513" />

**Impacto atual:**  
- Perda de tempo  
- Risco de deixar solicitações passarem despercebidas

**Solução aplicada:**  
- Histórico exibido diretamente na Home do administrador

**Evidências (depois):** 
Agora o sistema notifica o administrador que existem reservas pendentes.

<img width="1920" height="996" alt="Image" src="https://github.com/user-attachments/assets/ddbd7f75-12fb-4cb1-9801-b2997cbf9265" />

<img width="1920" height="996" alt="Image" src="https://github.com/user-attachments/assets/d83a6f6d-c713-42c4-a788-29fa25821a90" />

**Impacto esperado:**  
- Acesso rápido e eficiente às solicitações

**Pull Request:** #58

---

### 9) ❌ Falta de sugestões de recuperação nas mensagens de erro — Issue #42

**Descrição resumida:**  
Mensagens de erro não orientavam sobre como resolver o problema.

**Descrição detalhada:**  
Usuários ficavam sem saber o que fazer após mensagem de falha, aumentando frustração e suporte.

**Tela afetada:**  
ErrorPopup.jsx

**Severidade:** 🟡 Média

**Heurística violada:**  
- 9 - Ajudar o usuário a reconhecer, diagnosticar e recuperar-se de erros

**Evidências (antes):**  
<img width="2015" height="688" src="https://github.com/user-attachments/assets/db23cde3-c43d-463c-99f5-ab95304d9e1f" />

**Impacto atual:**  
- Usuário travado sem saber como corrigir  
- Chamados desnecessários ao suporte

**Solução aplicada:**  
- Mensagens com orientação clara:
  - Verifique seus dados  
  - Tente novamente  
  - Contate suporte  
  - Botão de retry

**Evidências (depois):**   
<img width="2026" height="679" src="https://github.com/user-attachments/assets/811da540-4c4f-49c4-8e46-60a2652f5b48" />

**Impacto esperado:**  
- Usuários recuperam-se sem ajuda  
- Redução de frustração  
- Atendimento mais eficiente

**Pull Request:** #55

---

## ✅ Conclusão

O redesign trouxe melhorias efetivas:

- ✅ Maior controle do usuário  
- ✅ Prevenção de erros  
- ✅ Consistência visual e funcional  
- ✅ Navegação fluida  
- ✅ Redução de retrabalho e suporte

📌 Documento atualizado continuamente conforme novas melhorias forem aplicadas.

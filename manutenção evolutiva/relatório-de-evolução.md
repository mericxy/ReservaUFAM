# 📝 Relatório de Manutenção Evolutiva – Planejamento da Evolução
### Projeto: ReservaUFAM

Este documento apresenta as implementações de _features_ relacionadas a evolução e acessibilidade do sistema **ReservaUFAM**.

O objetivo central foi **implementar mudanças que melhorem a experiência do usuário**, documentando:

- ✔ Justificativa
- ✔ Impacto esperado
- ✔ Passos de Implementação
- ✔ Evidências (imagens)  
- ✔ Resultado (antes → depois)

---
## ✅ Metodologia

1. **Estudo de Caso**
   - Possíveis implementações
   - Escolha de funcionalidade de acessibilidade

2. **Desenvolvimento**
   - Implementação das funcionalidades

3. **Comparativos**
   - Cada melhoria documentada com imagens antes/depois, issue e pull request.

---

## ✨ Lista de Novas Funcionalidades
### 👓 Melhoria de Acessibilidade – Tema Claro, Escuro e Alto Contraste Unificado [#62](https://github.com/mericxy/ReservaUFAM/issues/62)
**Problema identificado:**
Adiciona um sistema de temas com opções de modo claro, escuro e alto contraste, permitindo trocar o visual da interface de forma dinâmica e persistindo a preferência do usuário.

**Justificativa:**
A aplicação é voltada principalmente para **professores** e **técnicos**, incluindo pessoas com baixa visão ou sensibilidade à luminosidade. Oferecer um modo de alto contraste seguindo diretrizes de acessibilidade melhora a legibilidade, reduz barreiras de uso e atende às necessidades reais desse público em diferentes ambientes de trabalho.

**Impacto esperado:**
Aumenta a acessibilidade, o conforto visual e a inclusão dos usuários.

**Evidências (antes):**  
<img width="1920" height="996" alt="Image" src="https://github.com/user-attachments/assets/ddbd7f75-12fb-4cb1-9801-b2997cbf9265" />

## ✅ Mudanças Realizadas
- Criação um botão de configurações para personalização de temas
- Criados tokens globais para cores, bordas e botões (inclusive para alto contraste) em themes.css.
- Ajustes globais no index.css: utilitários .btn*, herança de cores em inputs/placeholders e bordas padrão nos cards.
- Inclusão do ThemeModal com ícone (react-icons) e logout seguro no header do usuário.
- Alternancia dinâmica sem recarregar a página
- Padronização de textos/botões nas páginas de usuário e de administrtador usando as novas classes.
- Atualização das cores primárias para tons green-600/500, garantindo alinhamento com a identidade visual.

**Evidências (depois):**  

**Alto contrraste**
<img width="2532" height="1405" alt="Captura de tela 2025-11-17 092826" src="https://github.com/user-attachments/assets/1bb37c20-406f-47ff-9a85-9d5ae6263eb7" />

**Modo branco**
<img width="2538" height="1407" alt="Captura de tela 2025-11-17 092856" src="https://github.com/user-attachments/assets/4761c337-3746-4ea0-b8fa-f59ccc72bb4d" />

**Modo escuro**
<img width="2532" height="1401" alt="image" src="https://github.com/user-attachments/assets/e0d56736-3644-498c-a77f-529fd15a78dc" />

**Pull Request:** [#64](https://github.com/mericxy/ReservaUFAM/pull/64)

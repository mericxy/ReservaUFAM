# Etapa 7 – Relatório Final

## Breve descrição do sistema

O sistema **ReservaUFAM** é uma aplicação web desenvolvida para gerenciar reservas de recursos da Universidade Federal do Amazonas, como auditórios, salas de reunião e veículos. O objetivo é permitir que usuários realizem reservas de forma centralizada, eficiente e segura, com funcionalidades de autenticação, validação de dados e administração dos recursos disponíveis. O backend utiliza Django REST Framework, enquanto o frontend é construído majoritariamente em JavaScript.

## Lista dos bugs identificados e suas classificações

| Nº | Bug | Classificação | Link Issue |
|----|-----|---------------|------------|
| 1  | Campo de capacidade permite valores negativos em Gerenciar Recursos | Crítico, Lógica | [Issue #4](https://github.com/mericxy/ReservaUFAM/issues/4) |
| 2  | Inconsistência entre models e views de Reservation | Crítico, Lógica | [Issue #7](https://github.com/mericxy/ReservaUFAM/issues/7) |
| 3  | Falha nos testes unitários (campo email não informado) | Lógica | [Issue #6](https://github.com/mericxy/ReservaUFAM/issues/6) |
| 4  | Ícone de visualizar senha ausente ou duplicado na tela de Login | Baixa prioridade, Interface | [Issue #2](https://github.com/mericxy/ReservaUFAM/issues/2) |
| 5  | Problemas de responsividade geral | Lógica | [Issue #1](https://github.com/mericxy/ReservaUFAM/issues/1) |

## Links para as issues correspondentes no GitHub

- [Issue #1 - Problemas de responsividade geral](https://github.com/mericxy/ReservaUFAM/issues/1)
- [Issue #2 - Ícone de visualizar senha ausente ou duplicado](https://github.com/mericxy/ReservaUFAM/issues/2)
- [Issue #4 - Campo de capacidade permite valores negativos](https://github.com/mericxy/ReservaUFAM/issues/4)
- [Issue #6 - Falha nos testes unitários](https://github.com/mericxy/ReservaUFAM/issues/6)
- [Issue #7 - Inconsistência entre models e views de Reservation](https://github.com/mericxy/ReservaUFAM/issues/7)

## Links para os commits/PRs que corrigem cada bug

- **Bug #1**: [Issue #4](https://github.com/mericxy/ReservaUFAM/issues/4) corrigido pelo PR [#11 - Ensure Resource Capacity is a Positive Number](https://github.com/mericxy/ReservaUFAM/pull/11)
- Os demais bugs ainda não apresentam PRs de correção vinculados diretamente nas informações coletadas.

## Evidências dos testes de validação

- **Bug #3** - Falha nos testes unitários:
  - Evidência: Erro apresentado ao executar `python manage.py test` devido à ausência do campo obrigatório `email`. Imagens disponíveis na [issue #6](https://github.com/mericxy/ReservaUFAM/issues/6).
- **Bug #1** - Campo de capacidade negativo:
  - Evidência: Cadastro de capacidade negativa possível, conforme imagem na [issue #4](https://github.com/mericxy/ReservaUFAM/issues/4).
- **Bug #2** - Inconsistência entre models e views:
  - Evidência: Print dos status divergentes disponível na [issue #7](https://github.com/mericxy/ReservaUFAM/issues/7).
- **Bug #4** - Ícone de senha ausente/duplicado:
  - Evidências visuais na [issue #2](https://github.com/mericxy/ReservaUFAM/issues/2).
- **Bug #5** - Responsividade:
  - Evidência: GIF ilustrando o problema na [issue #1](https://github.com/mericxy/ReservaUFAM/issues/1).

---

![image1](image1)

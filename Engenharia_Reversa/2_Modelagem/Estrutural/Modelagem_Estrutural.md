# Modelagem Estrutural - Sistema ReservaUFAM

Este documento apresenta a modelagem estrutural do sistema **ReservaUFAM**, desenvolvida como parte da segunda etapa do Trabalho Prático 5 de Manutenção e Integração de Software.

A modelagem estrutural tem como objetivo representar formalmente a organização interna do sistema, servindo como documentação técnica para futuras manutenções e evoluções.

---

## Diagrama de Classes

Para representar a estrutura estática do sistema, foi utilizado o **Diagrama de Classes da UML (Unified Modeling Language)**. Este diagrama evidencia os principais "blocos de construção" do sistema (classes), seus atributos, métodos essenciais e, principalmente, os relacionamentos entre eles (como associações, heranças e dependências).

Ele reflete a estrutura do domínio da aplicação conforme implementado no backend (Django Models) e utilizado nas regras de negócio.

### Diagrama de Classes do Domínio

<div align="center">
  <img src="../../imgs/diagrama-classe.png" alt="Diagrama de Classes do Sistema ReservaUFAM" width="800">
  <p><em>Figura 1: Diagrama de Classes do Domínio</em></p>
</div>

### Descrição dos Principais Elementos

O diagrama acima destaca as seguintes estruturas centrais:

* **`CustomUser`:** Representa os usuários do sistema, estendendo o modelo padrão para incluir informações específicas como SIAPE, CPF e o papel (Role) do usuário (Administrador ou Comum).
* **`Resource` (e suas subclasses):** Uma estrutura de herança que representa os recursos reserváveis. `Resource` funciona como uma classe base (abstrata ou conceitual) que define características comuns (como capacidade), enquanto `Auditorium`, `MeetingRoom` e `Vehicle` são as especializações concretas.
* **`Reservation`:** A classe central que conecta um usuário a um recurso em um determinado período de tempo. Ela gerencia o status da solicitação (Pendente, Aprovado, etc.) e armazena as datas e horários de início e fim. O relacionamento é de muitos-para-um em relação ao usuário (um usuário pode ter várias reservas).
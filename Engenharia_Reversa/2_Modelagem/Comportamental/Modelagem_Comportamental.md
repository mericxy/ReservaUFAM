# Modelagem Comportamental - Sistema ReservaUFAM

Este documento apresenta a modelagem comportamental do sistema **ReservaUFAM**, desenvolvida como parte da segunda etapa do Trabalho Prático 5 de Manutenção e Integração de Software.

A modelagem comportamental tem como objetivo representar como os componentes do sistema interagem para realizar as funcionalidades principais.

---

## Diagrama de Sequência

Para representar a modelagem comportamental (interacional), foi utilizado um **Diagrama de Sequência da UML**. Este diagrama foca na troca de mensagens entre os diferentes objetos e componentes do sistema ao longo do tempo.

Ele é fundamental para entender o fluxo de execução das funcionalidades principais, desde a ação inicial dos usuários na interface até a persistência dos dados no banco.

O diagrama abaixo ilustra os fluxos dos cenários mais críticos do sistema: **Login**, **Busca de Disponibilidade**, **Solicitação de Reserva** e os processos administrativos de **Aprovação/Rejeição de Reserva**, **Gerenciamento de Usuários** e **Gerenciamento de Recursos**.

### Diagrama de Sequência dos Fluxos Principais

<div align="center">
  <img src="../../imgs/Diagrama-Sequencia.png" alt="Diagrama de Sequência dos Fluxos Principais" width="800">
  <p><em>Figura 1: Diagrama de Sequência dos Fluxos Principais</em></p>
</div>

### Descrição dos Fluxos Representados

O diagrama consolida as interações entre os atores (Usuário, Administrador), o Frontend, a API/Backend, o Banco de Dados e o Serviço de Notificação:

1.  **Login:** O usuário fornece credenciais, o backend as valida no banco de dados e retorna uma resposta de sucesso ou erro para o frontend.
2.  **Buscar Disponibilidade:** O usuário seleciona parâmetros de busca (data, local) no frontend. O backend consulta o banco de dados para verificar reservas existentes e retorna a lista de horários disponíveis.
3.  **Solicitar Reserva:** O usuário escolhe um horário e envia a solicitação. O backend realiza uma verificação crítica de disponibilidade no momento exato da solicitação. Se disponível, a reserva é salva com status "Pendente" e o administrador é notificado. Se houver conflito, o usuário é informado.
4.  **Aprovação/Rejeição de Reserva (Admin):** O administrador visualiza a lista de reservas pendentes e decide aprovar ou rejeitar. O backend atualiza o status no banco de dados e o serviço de notificação envia um e-mail ao usuário solicitante com o resultado.
5.  **Gerenciamento de Usuários (Admin):** Similar ao fluxo de reservas, o administrador visualiza cadastros pendentes e os aprova ou reprova, com atualização no banco e notificação via e-mail.
6.  **Gerenciamento de Recursos (Admin):** O administrador realiza operações de CRUD (Criar, Ler, Atualizar, Deletar) sobre os recursos (salas, veículos, etc.), e o backend persiste essas alterações no banco de dados.
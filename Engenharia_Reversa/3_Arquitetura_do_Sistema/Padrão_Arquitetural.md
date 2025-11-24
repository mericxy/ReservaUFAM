# Relatório de Padrão Arquitetural - Sistema ReservaUFAM

Este documento detalha o padrão arquitetural identificado no sistema **ReservaUFAM**, conforme os requisitos da terceira etapa do Trabalho Prático 5 de Manutenção e Integração de Software. A análise foi realizada através de engenharia reversa, observando a estrutura do código-fonte, a organização dos diretórios e os fluxos de comunicação entre os componentes.

---

## Padrão Arquitetural Identificado: Arquitetura em Camadas (Layered Architecture)

O sistema ReservaUFAM adota uma **Arquitetura em Camadas (Layered Architecture)**. Este padrão organiza o software em grupos horizontais (camadas), onde cada camada tem uma responsabilidade específica e se comunica apenas com as camadas adjacentes, geralmente de forma hierárquica.

Esta escolha arquitetural promove a separação de preocupações (separation of concerns), facilitando a manutenção, a testabilidade e a evolução do sistema, uma vez que mudanças em uma camada tendem a ter impacto limitado nas demais.

No contexto do ReservaUFAM, que opera em um modelo Cliente-Servidor, a arquitetura em camadas se manifesta de forma distribuída, com camadas distintas no lado do cliente (Frontend) e no lado do servidor (Backend).

---

## Estrutura das Camadas

A arquitetura do sistema pode ser visualizada através das seguintes camadas principais, detalhadas abaixo:

<img src="..\imgs\arquitetura_img.png" alt="Diagrama da Arquitetura em Camadas do Sistema ReservaUFAM">

### 1. Camada de Apresentação (Frontend)

**Responsabilidade:** Esta é a camada mais externa, responsável pela interação direta com o usuário. Ela gerencia a interface gráfica (UI), captura as ações do usuário (cliques, preenchimento de formulários) e apresenta os dados retornados pelo sistema de forma amigável.

**Implementação no ReservaUFAM:**
* Desenvolvida utilizando a biblioteca **React**.
* Organizada em componentes reutilizáveis (`/src/components`) e páginas (`/src/pages`), que representam as diferentes telas do sistema (ex: Login, Home, Nova Reserva).
* Utiliza o **React Router** para o gerenciamento de navegação entre as diferentes visões da aplicação.
* A comunicação com o backend é realizada através de requisições HTTP (REST API), utilizando a biblioteca **Axios**. Esta camada não possui lógica de negócios complexa nem acesso direto ao banco de dados.

### 2. Camada de Aplicação / Serviços (Backend API)

**Responsabilidade:** Esta camada atua como a "porta de entrada" do servidor. Ela recebe as requisições provenientes da Camada de Apresentação, realiza validações iniciais, autentica o usuário e coordena o fluxo de trabalho, delegando as operações para a Camada de Negócio. Ela também é responsável por serializar os dados de resposta (geralmente em formato JSON) para serem enviados de volta ao frontend.

**Implementação no ReservaUFAM:**
* Implementada utilizando o **Django REST Framework (DRF)**.
* Composta por **Views** (baseadas em classes ou funções) e **ViewSets**, definidas no arquivo `views.py`.
* Utiliza **Serializers** (`serializers.py`) para converter objetos Python (models) em JSON e vice-versa, além de realizar validações de dados de entrada.
* Gerencia a autenticação e as permissões de acesso (ex: via tokens JWT), garantindo que apenas usuários autorizados possam realizar determinadas operações.
* Define os endpoints da API (URLs) no arquivo `urls.py`, mapeando-os para as Views correspondentes.

### 3. Camada de Negócio (Business Logic)

**Responsabilidade:** É o coração do sistema, onde residem todas as regras de negócio, validações complexas e a lógica principal da aplicação. Esta camada garante que as operações do sistema estejam em conformidade com os requisitos funcionais e as políticas definidas.

**Implementação no ReservaUFAM:**
* A lógica de negócio está distribuída principalmente entre os **Models** (`models.py`) e, em alguns casos, em métodos específicos dos **Serializers** ou em serviços/utilitários auxiliares.
* **Exemplos de regras nesta camada:**
       
     - Verificação de conflito de horários antes de confirmar uma reserva (um recurso não pode ser reservado duas vezes para o mesmo período).
     - Regras para aprovação automática ou manual de reservas, dependendo do tipo de recurso (ex: salas de reunião vs. auditórios).
     - Lógica para cálculo de períodos de reserva (ex: múltiplos dias).
     - Regras de validação de dados de cadastro de usuário (CPF, SIAPE, e-mail institucional).
* Esta camada não deve conter lógica de apresentação nem detalhes de implementação de banco de dados (SQL puro), operando sobre os objetos de domínio.

### 4. Camada de Persistência (Data Access)

**Responsabilidade:** Esta camada é responsável por abstrair o acesso ao banco de dados. Ela realiza as operações de criação, leitura, atualização e exclusão (CRUD) dos dados, traduzindo os objetos de domínio da aplicação para o formato relacional do banco de dados e vice-versa.

**Implementação no ReservaUFAM:**
* Utiliza o **ORM (Object-Relational Mapper) do Django**.
* Os **Models** (`models.py`) definem a estrutura das tabelas do banco de dados e seus relacionamentos (ex: `CustomUser`, `Reservation`, `Resource`, `Auditorium`, `MeetingRoom`, `Vehicle`).
* O ORM permite que a Camada de Negócio interaja com o banco de dados utilizando código Python de alto nível, sem a necessidade de escrever consultas SQL manualmente na maioria dos casos.
* A configuração da conexão com o banco de dados (PostgreSQL) é feita no arquivo `settings.py`.

### 5. Camada de Dados (Database)

**Responsabilidade:** É a camada onde os dados são fisicamente armazenados e gerenciados de forma persistente.

**Implementação no ReservaUFAM:**
* Utiliza o Sistema Gerenciador de Banco de Dados Relacional (SGBDR) **PostgreSQL**.
* Armazena as informações de usuários, recursos, reservas, tokens de recuperação de senha e outros dados essenciais para o funcionamento do sistema.
* Garante a integridade e a consistência dos dados através de restrições (constraints), chaves primárias e estrangeiras, conforme definido nos Models do Django.

---

## Fluxo de Comunicação Típico

O fluxo de uma operação típica no sistema (ex: criar uma nova reserva) ilustra a interação entre as camadas:

1.  **Usuário** preenche o formulário de reserva na **Camada de Apresentação (Frontend)** e clica em "Confirmar".
2.  O **Frontend** envia uma requisição HTTP POST com os dados da reserva para a **Camada de Aplicação (Backend API)**.
3.  Uma **View** na Camada de Aplicação recebe a requisição. Ela usa um **Serializer** para validar os dados de entrada.
4.  Se os dados forem válidos, o Serializer (ou a View) chama a lógica apropriada na **Camada de Negócio**.
5.  A **Camada de Negócio** verifica as regras (ex: conflito de horário). Se tudo estiver correto, ela solicita à **Camada de Persistência (ORM)** que salve a nova reserva.
6.  A **Camada de Persistência** traduz a solicitação em um comando SQL `INSERT` e o executa na **Camada de Dados (PostgreSQL)**.
7.  O banco de dados confirma a operação. A **Camada de Persistência** retorna o objeto da nova reserva para a Camada de Negócio, que o retorna para a Camada de Aplicação.
8.  A **Camada de Aplicação** usa o Serializer para converter o objeto da reserva recém-criada em JSON e retorna uma resposta HTTP 201 (Created) para o Frontend.
9.  A **Camada de Apresentação (Frontend)** recebe a resposta e exibe uma mensagem de sucesso ao usuário, redirecionando-o para a lista de suas reservas.

---

## Padrões Relacionados

Além da arquitetura em camadas, o sistema também incorpora elementos de outros padrões:

* **MVC (Model-View-Controller):** O framework Django, utilizado no backend, segue uma variação do padrão MVC, que ele chama de **MTV (Model-Template-View)**. Neste contexto

    * **Model (Modelo):** Corresponde à Camada de Persistência e parte da Camada de Negócio (os Models do Django).
    * **View (Visão):** No Django REST Framework, as "Views" (`views.py`) atuam mais como **Controllers**, processando as requisições e coordenando os modelos e serializers. A verdadeira "Visão" (a interface do usuário) é delegada ao Frontend React.
    * **Template:** No contexto de uma API REST, o papel do "Template" (apresentação) é substituído pelos **Serializers**, que definem a estrutura dos dados retornados (JSON).

* **Cliente-Servidor:** A separação clara entre o Frontend (Cliente) e o Backend (Servidor), comunicando-se via API REST, caracteriza um modelo cliente-servidor.

## Conclusão

A adoção da Arquitetura em Camadas no sistema ReservaUFAM proporciona uma estrutura sólida e organizada. A separação de responsabilidades entre apresentação, aplicação, negócio, persistência e dados facilita o entendimento do sistema, permite o desenvolvimento paralelo de diferentes partes (ex: frontend e backend) e simplifica futuras manutenções e evoluções, como a substituição de uma tecnologia em uma camada específica sem afetar drasticamente as demais.
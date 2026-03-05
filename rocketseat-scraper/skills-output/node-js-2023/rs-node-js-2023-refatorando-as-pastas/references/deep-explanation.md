# Deep Explanation: Refatorando Pastas — Clean Architecture + DDD

## Por que essa refatoracao importa

O instrutor destaca que uma das maiores dificuldades ao aprender Clean Architecture e que os exemplos na internet usam nomenclaturas diferentes do diagrama original do livro do Uncle Bob. Isso cria uma desconexao entre teoria e pratica. A refatoracao de pastas proposta resolve isso mapeando diretamente a estrutura de pastas para o diagrama classico de Clean Architecture.

## Dois conceitos juntos: Clean Architecture + DDD

O ponto chave do instrutor: **estamos usando dois conceitos simultaneamente**.

- **Clean Architecture** → dita a implementacao do codigo, as camadas e dependencias
- **DDD (Domain-Driven Design)** → dita a nomenclatura e organizacao em dominios/subdominios

Entidades e casos de uso fazem parte do **dominio** (conceito DDD). Dentro do dominio, a separacao em **application** e **enterprise** vem do Clean Architecture.

## Mapeamento com o diagrama

O famoso diagrama de circulos concentricos do Clean Architecture tem:

- **Camada amarela (centro):** Enterprise Business Rules → pasta `enterprise/` → contem entidades
- **Camada vermelha:** Application Business Rules → pasta `application/` → contem use-cases e contratos de repositorios

Os repositorios ficam em `application/` porque sao **contratos** (interfaces). A implementacao concreta dos repositorios fica em camadas externas (infraestrutura), fora do dominio.

## Subdominios: fronteiras de negocio

O instrutor explica que conforme a aplicacao cresce, ela pode ter **varios subdominios**. Subdominios sao "setores do problema" que estamos resolvendo.

Em um monolito, subdominios sao divididos em **pastas/modulos**. Em microservicos, cada subdomain pode virar um **servico independente**. Essa e uma das grandes vantagens: a estrutura de pastas ja antecipa a possibilidade de separacao futura.

No exemplo, o subdomain e `forum` (aplicacao de perguntas e respostas). Se no futuro precisar de notificacoes, cria-se `domain/notification/` com a mesma estrutura interna.

## Cuidados praticos ao refatorar

1. **Importacoes quebram** — O VS Code corrige a maioria automaticamente ao mover pastas, mas nem todas. Revise manualmente.
2. **Path aliases** — Importacoes longas como `../../../` devem ser substituidas por aliases (`@core`, `@domain`).
3. **Rode os testes** — Apos a refatoracao, rode todos os testes para validar que nada quebrou. E a forma mais rapida de garantir integridade.

## Insight do instrutor sobre nomenclatura

> "Uma das grandes dificuldades que pelo menos eu tive quando eu estava aprendendo Clean Architecture e que a grande maioria dos exemplos nao utilizava as mesmas nomenclaturas e aquilo faria uma grande diferenca para mim entender o que e cada coisa."

Usar `application/` e `enterprise/` ao inves de nomes genericos como `core/`, `shared/`, `common/` cria uma correspondencia direta com a literatura, facilitando onboarding e comunicacao no time.
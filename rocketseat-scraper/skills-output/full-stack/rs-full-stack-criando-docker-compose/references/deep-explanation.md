# Deep Explanation: Criando Docker Compose para PostgreSQL

## Por que Bitnami?

O instrutor escolhe a imagem `bitnami/postgresql:latest` ao invés da imagem oficial `postgres:latest`. A Bitnami oferece imagens pré-configuradas e hardened, com configurações de segurança padrão e atualizações frequentes. Para ambiente de desenvolvimento, ambas funcionam, mas a Bitnami já vem com defaults razoáveis.

## Indentação YAML — O cuidado principal

O instrutor enfatiza repetidamente: **"tem que tomar bastante cuidado e prestar bastante atenção na indentação"**. YAML é sensível a indentação, e erros aqui causam falhas silenciosas ou erros de parsing.

### Estrutura hierárquica

```
services:          # nível 0
  postgres:        # nível 1 (2 espaços)
    image: ...     # nível 2 (4 espaços)
    ports:         # nível 2 (4 espaços) — mesmo nível de image
    environment:   # nível 2 (4 espaços) — mesmo nível de ports
```

O instrutor menciona que as linhas-guia do VS Code ajudam a identificar se os elementos estão no mesmo nível de indentação. `image`, `ports` e `environment` devem estar todos alinhados no mesmo nível, como propriedades do serviço `postgres`.

### Dica do instrutor: Shift+Tab

Para voltar um nível de indentação no VS Code, use `Shift+Tab`. O instrutor usa isso para alinhar `environment` no mesmo nível de `ports`.

## Mapeamento de portas

```yaml
ports:
  - "5432:5432"
```

O formato é `"porta_host:porta_container"`. O instrutor explica: "a gente está mapeando a porta do computador para a porta do container, do nosso host para o container."

As aspas são importantes porque YAML pode interpretar `5432:5432` de formas inesperadas sem elas.

## Nomeação do banco de dados

O instrutor inicialmente nomeia o banco como `api`, mas depois corrige para o nome da aplicação (`rocket-log`): "vamos colocar o nome aqui da nossa aplicação". Isso é uma boa prática porque:

1. Quando você tem múltiplos projetos com Docker, cada um terá um banco identificável
2. Evita confusão entre bancos genéricos chamados `api` ou `db`
3. O nome do banco documenta qual aplicação ele serve

## Fluxo de criação demonstrado

O instrutor mostra o que ele chama de "forma bem chuta" (direta, sem frescura) de criar o Docker Compose:

1. Botão direito na raiz → novo arquivo
2. Nomear `docker-compose.yml`
3. Escrever a estrutura de cima para baixo
4. Verificar indentação a cada nível
5. Salvar

Não há necessidade de ferramentas especiais ou geradores — o arquivo é simples o suficiente para escrever manualmente.
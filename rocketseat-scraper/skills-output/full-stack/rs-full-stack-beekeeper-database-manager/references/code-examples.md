# Code Examples: Beekeeper Studio

## Exemplo de conexao PostgreSQL

Ao abrir o Beekeeper, os campos tipicos de conexao sao:

```
Connection Type: PostgreSQL
Host: localhost
Port: 5432
User: postgres
Password: ******
Default Database: myapp_dev
```

## Exemplo de conexao MySQL

```
Connection Type: MySQL
Host: localhost
Port: 3306
User: root
Password: ******
Default Database: myapp_dev
```

## Exemplo de conexao SQLite

```
Connection Type: SQLite
Database File: /path/to/database.sqlite
```

## Usando o SQL Editor

Apos conectar, voce pode abrir uma nova aba de query e executar SQL diretamente:

```sql
-- Listar todas as tabelas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

-- Consultar dados de uma tabela
SELECT * FROM users LIMIT 10;

-- Inserir um registro
INSERT INTO users (name, email)
VALUES ('João', 'joao@email.com');
```

## Fluxo tipico de uso no desenvolvimento

1. **Iniciar o projeto** — configurar conexao com banco local
2. **Durante desenvolvimento** — verificar se migrations rodaram corretamente
3. **Debugging** — consultar dados para entender bugs
4. **Testes** — verificar se dados foram inseridos/atualizados corretamente

## Dica: salvar conexoes

O Beekeeper permite salvar conexoes com nomes descritivos. Recomendacao de nomenclatura:

```
[ENV] Projeto - Banco
Exemplos:
  [DEV] MyApp - PostgreSQL
  [STAGING] MyApp - PostgreSQL
  [LOCAL] Estudos - SQLite
```

Isso facilita alternar entre ambientes sem precisar lembrar credenciais.
# Deep Explanation: Abrindo Banco de Dados com BeeKeeper Studio

## Por que usar um cliente GUI para SQLite?

SQLite e um banco de dados baseado em arquivo. Diferente de PostgreSQL ou MySQL, nao ha um servidor rodando — o banco e apenas um arquivo `.db` no disco. Isso significa que voce pode inspeciona-lo diretamente com ferramentas GUI sem configurar credenciais ou portas.

### BeeKeeper Studio como escolha

O BeeKeeper Studio e um cliente de banco de dados open-source e multiplataforma. Ele suporta SQLite nativamente, o que o torna ideal para desenvolvimento local com projetos que usam SQLite (como APIs Node.js com Knex ou Drizzle).

## Fluxo mental do desenvolvedor

```
Codigo cria tabela (migration) → Preciso verificar se funcionou → Abro BeeKeeper → Conecto no .db → Vejo a tabela
```

O BeeKeeper serve como ferramenta de **verificacao visual** durante o desenvolvimento. Em vez de escrever queries SQL no terminal para conferir se uma migration rodou, voce simplesmente abre o cliente e ve as tabelas.

## Salvar conexao: por que importa

O instrutor enfatiza salvar a conexao com um nome descritivo (`Restaurant`). Isso evita ter que navegar ate o arquivo `.db` toda vez que quiser reconectar. Em projetos reais, voce pode ter multiplos bancos (dev, test, staging) e conexoes salvas ajudam a alternar rapidamente.

## Cuidados com SQLite em desenvolvimento

- **Lock de arquivo:** SQLite usa file-level locking. Se a API estiver rodando e escrevendo no banco, o BeeKeeper pode ter problemas de leitura em alguns casos.
- **Arquivo inexistente:** Se as migrations nao rodaram, o arquivo `.db` simplesmente nao existe. O BeeKeeper nao conseguira abrir nada.
- **Caminho correto:** O arquivo fica dentro de `src/database/` no projeto da aula. Navegue ate la ao usar o Choose File.
# Deep Explanation: Seguranca no Armazenamento de Senhas

## Por que nao armazenar senhas em texto puro?

O instrutor destaca que a questao fundamental nao e "como criptografar", mas "por que criptografar". A resposta: **voce nao pode garantir que o acesso ao banco de dados sera sempre seguro.** Cenarios reais:

1. **Funcionario de infraestrutura** precisa de acesso ao banco — se as senhas estiverem em texto puro, nao existe nivel de permissao que resolva. Ele veria todas as senhas.
2. **Vazamento de dados** — um hacker que compromete o banco teria acesso direto a todas as senhas.
3. **Reutilizacao de senhas** — usuarios usam a mesma senha em multiplos servicos, entao um vazamento compromete a vida digital inteira do usuario.

## A progressao de seguranca (raciocinio do instrutor)

### Nivel 1: Hash puro (SHA-256)
- Deterministico: mesma entrada = mesma saida, sempre
- Problema demonstrado ao vivo: o hash de "banana" pode ser encontrado no Google
- **Ataque de dicionario**: gerar hashes de palavras comuns e comparar com o banco
- **Rainbow table**: tabela pre-computada de senhas comuns → hashes

### Nivel 2: Salt (string global)
- Concatenar uma string secreta antes da senha: `hash(salt + password)`
- Resultado: o hash de "banana" com salt e unico, nao aparece em rainbow tables
- **Limitacao**: salt e o mesmo para todos os usuarios. Se o atacante descobre o salt, ele gera UM dicionario e testa contra TODOS os 10.000 usuarios. Algum usuario com senha fraca sera descoberto.

### Nivel 3: Pepper (string unica por usuario)
- Gerar um valor aleatorio unico para cada usuario
- Concatenar: `hash(pepper + salt + password)`
- Armazenar o pepper junto ao hash (separado por virgula ou outro delimitador)
- **Vantagem critica**: o atacante precisaria gerar 10.000 dicionarios (um por usuario) em vez de 1. O custo computacional torna o ataque impraticavel.

### Nivel 4: Argon2 (solucao de producao)
- Vencedor da Password Hashing Competition (2013-2015)
- Desenvolvido pela Universidade de Luxemburgo
- Faz tudo automaticamente: pepper, custo computacional, paralelismo
- Configuravel: threads, memoria, iteracoes
- O custo para computar cada hash e deliberadamente alto, tornando ataques de forca bruta impraticaveis

## A armadilha das funcoes random

O instrutor enfatiza um ponto que "a maior parte das pessoas nem sabe": funcoes `random` comuns sao otimizadas para ser **baratas** (rapidas, pouco processamento), nao para ser **imprevisíveis**.

Se um atacante souber:
- Seu sistema operacional
- Caracteristicas do software
- O momento aproximado em que o numero foi gerado

...ele pode **deduzir componentes da seed** e reduzir drasticamente o espaco de busca. Funcoes criptograficamente seguras usam fontes de entropia do sistema operacional que resistem a essa analise.

## Hierarquia de algoritmos (decisao pragmatica)

O instrutor apresenta uma hierarquia pragmatica, nao dogmatica:

1. **Argon2** — "tenta primeiro, e mais legal, voce vai ser mais feliz"
2. **scrypt** — "nivel de seguranca comparavel ao Argon2"
3. **bcrypt** — "e de 1999, tao antigo que nao tinha site na epoca", mas ainda seguro para sistemas legados

A logica: **nunca faca voce mesmo** quando alguem ja fez melhor. O codigo manual com SHA-256+salt+pepper demonstrado na aula e didatico, mas em producao use bibliotecas especializadas.

## Configuracao minima recomendada do Argon2

O instrutor mostrou um site gerador de hashes Argon2 com as configuracoes minimas recomendadas para 2025:
- Memory cost: >= 19 MB
- Iterations: >= 2
- Parallelism: >= 1

Esses valores sao o **minimo**. Em producao, ajuste conforme a capacidade do seu servidor — quanto maior o custo, mais seguro, mas mais lento o login.
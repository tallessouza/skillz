# Deep Explanation: Expressoes Regulares

## O que sao expressoes regulares

Expressoes regulares (regex) sao padroes usados para identificar se uma ocorrencia ou padrao existe dentro de uma string. O instrutor Rodrigo enfatiza que o caso de uso mais comum e **validacao de dados** — por exemplo, verificar se o que o usuario digitou em um campo de email realmente tem formato de email valido.

## Anatomia de uma regex: `/\D+/g`

O instrutor desmontou a expressao peca por peca usando o texto `"53A7B5C"`:

### 1. Delimitadores `/` ... `/`
- A primeira barra indica o **inicio** da expressao
- A segunda barra indica o **fim** da expressao
- Tudo entre as barras e o padrao a ser buscado
- Flags (como `g`) ficam **depois** da segunda barra

### 2. Classe de caractere `\D`
- `\D` (D maiusculo) verifica qualquer caractere que **nao** seja um digito
- Digitos sao 0-9, entao `\D` encontra letras e outros caracteres
- No texto `"53A7B5C"`:
  - `5` → ignorado (digito)
  - `3` → ignorado (digito)
  - `A` → reconhecido (nao-digito)
  - `7` → ignorado (digito)
  - `B` → reconhecido (nao-digito)
  - `5` → ignorado (digito)
  - `C` → reconhecido (nao-digito)

### 3. Quantificador `+`
- Sem o `+`: a regex ve **caractere por caractere** individualmente
- Com o `+`: a regex agrupa **sequencias consecutivas** que atendem o padrao
- Exemplo do instrutor: se `B` e `C` estivessem juntos (`"53A7BC"`):
  - Sem `+`: match em `B` e match separado em `C`
  - Com `+`: match unico em `BC` como sequencia

### 4. Flag `g` (global)
- O modificador global indica que a busca deve percorrer **toda a string**
- Sem `g`: a regex encontra a primeira correspondencia e para
- Com `g`: continua buscando ate o fim da string
- O `g` fica depois da barra final: `/\D+/g`

## Filosofia do instrutor sobre decorar regex

Rodrigo enfatizou fortemente: **nao e necessario decorar as combinacoes**. O importante e:

1. Saber que regex **existe** como ferramenta de validacao
2. Entender o **conceito** de como funciona (padrao → busca → match)
3. Quando precisar, **pesquisar** a expressao especifica para o caso de uso
4. Com o tempo e pratica, as combinacoes mais comuns ficam naturais

Essa abordagem pragmatica e importante porque regex tem dezenas de metacaracteres e combinacoes — tentar decorar tudo de uma vez e contraproducente.

## Regex como ferramenta de validacao

O caso de uso principal apresentado foi validacao de input de usuario:
- Usuario digita algo em um campo (email, telefone, CPF, etc.)
- O sistema aplica uma regex para verificar se o formato e valido
- Se o padrao "bate", o dado e aceito; se nao, mostra erro

Isso e muito mais robusto do que tentar validar com condicionais manuais, porque a regex expressa o padrao inteiro de forma declarativa.
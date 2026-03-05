# Deep Explanation: Metodos de String

## Por que strings sao centrais em dados

O instrutor destaca que ao trabalhar com dados, strings aparecem constantemente — emails, CPFs, nomes, datas. Dominar os metodos nativos e essencial porque evita complexidade desnecessaria com regex ou loops manuais.

## count() — Frequencia de caracteres

O metodo `count()` recebe uma string (caractere ou sequencia) e retorna quantas vezes aparece. No exemplo do email `bispo@skillz.com.br`:
- `email.count("@")` → 1
- `email.count("m")` → 4
- `email.count("a")` → 2

Util para validacoes rapidas (ex: email deve ter exatamente 1 `@`).

## find() — Posicao na string

O `find()` retorna o indice (base 0) da primeira ocorrencia. No exemplo, `email.find(".com")` retorna 20. O instrutor enfatiza: **strings comecam no indice 0, nao 1**. Se a substring nao for encontrada, retorna -1 (diferente de `index()` que levanta excecao).

## startswith() e endswith() — Verificacao de bordas

Metodos booleanos que verificam se a string comeca ou termina com determinada sequencia. O instrutor destaca a utilidade para **filtros em dados**: filtrar emails por dominio, verificar extensoes de arquivo, validar prefixos.

- `email.startswith("bispo")` → True
- `email.startswith("will")` → False
- `email.endswith(".br")` → True
- `email.endswith(".com")` → False (termina com `.com.br`)

## isnumeric(), isalpha(), isalnum() — Validacao de composicao

### isnumeric()
Verifica se a string contem apenas digitos. O instrutor usa o exemplo do **CPF**: e um numero grande que na programacao se armazena como string (nao como inteiro). Mesmo sendo `type(cpf) == str`, `cpf.isnumeric()` retorna True se so tem digitos. Qualquer letra ou caractere especial faz retornar False.

### isalpha()
Oposto do isnumeric — verifica se contem apenas letras. Um unico numero ou caractere especial faz retornar False.

### isalnum()
Verifica se contem apenas letras E/OU numeros. Retorna False se houver caractere especial (asterisco, arroba, etc). Util para validar que nao ha caracteres especiais indesejados.

## strip() — Remoção de espacos

O instrutor cria um exemplo dramatico: string com 6 espacos antes e 10 depois de "cachorro". Antes do strip: 24 caracteres. Depois: 8. O `strip()` remove espacos no inicio E no fim (nao no meio). O instrutor enfatiza: **na parte de dados, vai encontrar diversas strings com esse problema de espacos**.

Variantes: `lstrip()` (so esquerda), `rstrip()` (so direita).

## replace() — Substituicao

O instrutor faz analogia com editores de texto: "Find and Replace". O `replace(antigo, novo)` troca todas as ocorrencias. Importante: **Python e case sensitive** — `replace("H", "G")` so troca H maiusculo.

## split() — Divisao em lista

O `split()` transforma uma string em lista, cortando pelo delimitador. Sem argumento, o delimitador padrao e espaco. Com argumento, usa o delimitador especificado.

O instrutor sugere o caso pratico de **datas**: `"28/02/2026".split("/")` separa em dia, mes, ano. Tambem funciona com virgulas em CSVs.

## Python e case sensitive

O instrutor reforça varias vezes: Python diferencia maiusculas de minusculas. Isso afeta `replace()`, `find()`, `count()`, `startswith()`, `endswith()` — todos fazem comparacao exata.
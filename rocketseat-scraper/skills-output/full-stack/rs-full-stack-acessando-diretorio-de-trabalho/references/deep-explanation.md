# Deep Explanation: Acessando Diretório de Trabalho do Container

## Por que acessar o container?

Containers sao **efemeros** — eles existem enquanto rodam e seu conteudo interno nao e visivel de fora por padrao. Para debugar, verificar se o build copiou os arquivos certos, ou entender o que o `.dockerignore` esta fazendo, voce precisa **entrar** no container.

## O que e `docker exec`?

`docker exec` executa um comando dentro de um container **que ja esta rodando**. Diferente de `docker run` (que cria um novo container), `exec` conecta a um existente.

### Flags importantes

- `-i` (interactive): Mantem STDIN aberto, permitindo voce digitar comandos
- `-t` (tty): Aloca um pseudo-terminal, dando formatacao de terminal real
- Combinados como `-it`: Experiencia de terminal completa dentro do container

## WORKDIR e o ponto de entrada

Quando o Dockerfile define:

```dockerfile
WORKDIR /usr/src/app
```

Isso significa:
1. Todos os comandos subsequentes (`RUN`, `COPY`, `CMD`) executam **nesse diretorio**
2. Quando voce faz `docker exec -it <id> bash`, voce **entra diretamente nesse diretorio**
3. `pwd` confirma: `/usr/src/app`

## .dockerignore em acao

O instrutor mostrou algo importante: ao listar os arquivos dentro do container, certos arquivos do projeto local **nao estao la**:

- `.dockerignore` — nao copiado (listado no proprio .dockerignore)
- `.gitignore` — nao copiado (listado no .dockerignore)
- `Dockerfile` — nao copiado (listado no .dockerignore)

Porem, `dist/` e `node_modules/` **existem** no container mesmo estando possivelmente no .dockerignore local, porque:
- `dist/` foi **recriada** pelo `RUN npm run build` dentro do container
- `node_modules/` foi **recriada** pelo `RUN npm install` dentro do container

Isso e um conceito chave: o .dockerignore impede a **copia**, mas o Dockerfile pode **gerar** esses mesmos diretorios internamente.

## bash vs /bin/sh

Nem todo container tem `bash` instalado:
- **Imagens baseadas em Debian/Ubuntu:** `bash` disponivel
- **Imagens Alpine:** apenas `sh` (ou `/bin/sh`)
- **Imagens distroless:** nenhum shell — nao e possivel usar `exec` interativo

O instrutor usa ZSH localmente, entao precisou especificar `/bin/sh` explicitamente. A maioria dos usuarios com bash padrao pode usar apenas `bash`.

## Container efemero — implicacao pratica

Qualquer alteracao feita dentro do container via `exec` (criar arquivo, editar algo) **desaparece** quando o container e removido. Isso reforca o conceito de efemeridade: o container nao e seu ambiente de desenvolvimento, e sim um ambiente de execucao isolado e descartavel.
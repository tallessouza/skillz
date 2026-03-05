# Deep Explanation: Criando um Projeto Node.js

## Por que npm init -y?

O comando `npm init` sem flags inicia um wizard interativo que pergunta:
1. package name (sugere o nome da pasta)
2. version (sugere 1.0.0)
3. description
4. entry point (sugere index.js)
5. test command
6. git repository
7. keywords
8. author
9. license (sugere ISC)

Na pratica, a maioria dos desenvolvedores aceita os padroes e edita depois. O `-y` (abreviacao de `--yes`) pula todas as perguntas e gera o package.json com valores padrao imediatamente.

O instrutor demonstrou o fluxo manual primeiro para que o aluno entenda o que cada campo significa, e depois mostrou o atalho `-y` como a forma recomendada no dia a dia.

## O que e o package.json?

E o arquivo central de configuracao de qualquer projeto Node.js. Ele:
- Define metadados do projeto (nome, versao, autor)
- Lista dependencias (sera preenchido quando instalar pacotes)
- Define scripts executaveis via `npm run <nome>`
- Aponta o arquivo principal da aplicacao (`main`)

Formato: JSON — um objeto com pares chave-valor separados por virgula. A ultima propriedade nao tem virgula.

## NPM — Node Package Manager

Quando voce instala o Node.js, o npm vem junto automaticamente. O npm e:
- Um gerenciador de pacotes (instalar bibliotecas)
- Um executor de scripts (rodar comandos do projeto)
- Um inicializador de projetos (`npm init`)

## Sobre licencas

O instrutor mencionou que existem diversos tipos de licencas:
- **ISC** (padrao do npm) — permissiva, permite uso livre
- **MIT** — muito popular, permite uso comercial e modificacao
- **GPL** — exige que derivados tambem sejam open source
- **Proprietary** — codigo fechado

Para projetos de estudo, a licenca padrao ISC e suficiente.

## Atalhos de terminal mencionados

| Atalho | Funcao | Plataforma |
|--------|--------|-----------|
| `Ctrl+L` | Limpar terminal | Linux/Mac |
| `clear` | Limpar terminal (comando) | Linux/Mac |
| `cls` | Limpar terminal | Windows |
| `Ctrl+C` | Cancelar operacao em andamento | Todos |
| Arrastar pasta para terminal | Inserir caminho completo | Todos |

## Navegacao no terminal

Para entrar na pasta do projeto:
```bash
cd /caminho/completo/da/pasta
```

Dica do instrutor: arrastar a pasta do gerenciador de arquivos para o terminal insere automaticamente o caminho completo, evitando erros de digitacao.
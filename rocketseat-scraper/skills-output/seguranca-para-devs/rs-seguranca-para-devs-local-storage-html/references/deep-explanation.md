# Deep Explanation: Seguranca do Armazenamento Local

## Como o navegador salva dados locais

O instrutor explica que existem tres APIs de armazenamento local no HTML5:

1. **LocalStorage** — persistente, sem limite de tempo. Dados sobrevivem ao fechamento do navegador. So desaparecem se o usuario manualmente limpar os dados.
2. **SessionStorage** — por sessao de navegacao. Quando todas as abas (incluindo abas filhas abertas via Ctrl+click ou popups) sao fechadas, os dados sao perdidos.
3. **IndexedDB** — banco de dados de chave-valor completo dentro do navegador, com suporte a tabelas.

## Por que o gerenciador de senhas e diferente

O instrutor faz uma distincao crucial entre como o Chrome salva senhas do gerenciador vs como o LocalStorage salva dados:

### Gerenciador de senhas do Chrome:
- **macOS**: senhas salvas dentro do Keychain (carteira de segredos do sistema)
- **Linux (KDE/GNOME)**: senhas salvas no keyring do sistema operacional
- **Windows**: Chrome cria uma chave de criptografia, e essa chave e protegida pela senha da sessao do usuario Windows

Em todos os casos, as senhas do gerenciador estao **criptografadas**.

### LocalStorage/SessionStorage/IndexedDB:
- Salvos no disco **sem criptografia nenhuma**
- Armazenados como arquivos levelDB no diretorio do perfil do Chrome
- Caminho tipico: `~/.config/google-chrome/Default/Local Storage/leveldb/`

## Demonstracao pratica do instrutor

O instrutor demonstrou o ataque completo:

1. Criou um usuario "Jimmy" no sistema
2. Jimmy acessou uma pagina web e salvou a senha "pafuncio serve fritas" no localStorage
3. Como root, copiou a pasta levelDB do perfil do Jimmy: `~/.config/google-chrome/Default/Local Storage/leveldb/*`
4. Usou um leitor de levelDB para abrir os arquivos
5. A senha apareceu em texto puro, sem criptografia

A saida mostrou claramente:
- Chave: `password` (dentro do dominio `http://127.0.0.1:8080`)
- Valor: a senha em texto puro, separada apenas por um caractere especial `\x01`

## Implicacoes de seguranca

1. **Outro usuario na mesma maquina** pode copiar os arquivos e ler tudo sem precisar de senha
2. **Notebook roubado**: se o filesystem nao estiver criptografado, os dados do LocalStorage sao acessiveis (diferente das senhas do Chrome, que precisam da sessao do usuario)
3. **Ataques XSS**: JavaScript malicioso pode ler `localStorage` e `sessionStorage` via `document.cookie` ou diretamente via API

## O que o instrutor recomenda armazenar

Apenas dados que:
- Facilitam a vida do usuario (UX)
- Se vazarem, NAO representam problema de seguranca
- Se vazarem, NAO representam problema de LGPD

Exemplos do instrutor do que NAO armazenar:
- Senhas
- Chaves de API
- Dados pessoais do usuario (endereco, nome da mae, data de nascimento, documentos)
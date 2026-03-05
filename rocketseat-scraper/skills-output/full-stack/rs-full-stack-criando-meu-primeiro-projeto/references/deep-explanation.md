# Deep Explanation: Criando Meu Primeiro Projeto HTML

## VS Code: Estável vs Insiders

O instrutor usa o VS Code Insiders apenas por ter uma configuração limpa. A recomendação explícita é usar o **VS Code estável** porque:
- Insiders recebe atualizações em teste que podem causar problemas
- A versão estável é mais confiável para quem está aprendendo
- Não há diferença funcional relevante para desenvolvimento web básico

O tema padrão do VS Code é "Dark Plus", enquanto o Insiders vem com "Dark Modern". Isso não afeta funcionalidade.

## Por que index.html?

A convenção `index.html` existe porque servidores web (Apache, Nginx) procuram automaticamente por esse arquivo quando alguém acessa uma pasta. É o ponto de entrada padrão de qualquer site. Mesmo em desenvolvimento local, manter essa convenção prepara o projeto para deploy futuro.

A estrutura do nome é: `nome.extensão` — o ponto separa o nome da extensão que define o tipo do arquivo.

## Emmet Abbreviation

O Emmet não é uma feature exclusiva do VS Code — é uma ferramenta independente integrada em vários editores. O atalho `!` + `Enter` gera o boilerplate HTML5 completo. Isso inclui:
- `<!DOCTYPE html>` — declaração do tipo de documento
- `<meta charset="UTF-8">` — suporte a caracteres especiais
- `<meta name="viewport">` — responsividade básica

## Ancoragem com IDs

O mecanismo de navegação interna funciona assim:
1. Um link `<a href="#blog">` aponta para um ID
2. Um elemento `<section id="blog">` define o destino
3. Ao clicar, o navegador rola automaticamente até o elemento com aquele ID

Se o `href` contém apenas `#` sem valor, o link não ancora em lugar nenhum — serve como placeholder.

## Atalhos VS Code mencionados

| Atalho (Windows/Linux) | Atalho (Mac) | Ação |
|------------------------|--------------|------|
| `Ctrl+C`, `Ctrl+V` em linha | `Cmd+C`, `Cmd+V` | Duplicar linha inteira (cursor em qualquer posição) |
| `Ctrl++` | `Cmd++` | Aumentar zoom do editor |
| `Ctrl+-` | `Cmd+-` | Diminuir zoom do editor |
| — | `Ctrl+Alt+Espaço` | Abrir seletor de emojis (Mac) |

## Semântica HTML

O instrutor usa tags semânticas desde o início:
- `<nav>` para navegação
- `<main>` para conteúdo principal
- `<section>` para seções temáticas
- `<h1>` único para o heading principal
- `<h2>` para headings de seções

A regra de um único `<h1>` por página é mencionada explicitamente: "eu preciso só ter um h1 na minha página pra definir bem".

## Abrindo no navegador

O método mais simples: dois cliques no arquivo `.html` no explorador de arquivos do sistema operacional. O navegador padrão abre o arquivo com protocolo `file://`. Não é necessário servidor local para HTML estático básico.
# Deep Explanation: Iniciando Projeto HTML com Git

## Por que index.html e nao outro nome?

O instrutor enfatiza: "é muito padrão a gente usar index nos primeiros arquivos, tão padrão que eu diria pra você não use outro nome, use index.html mesmo, você vai me agradecer depois."

A razao tecnica: servidores web (Apache, Nginx, hospedagens) servem automaticamente `index.html` quando alguem acessa um diretorio. Se voce nomeou `home.html`, precisa configurar o servidor ou usar URL completa. Alem disso, ferramentas como Live Server no VS Code abrem `index.html` por padrao.

## Por que iniciar git imediatamente?

O instrutor diz: "assim que possível, assim que você fizer o seu primeiro arquivo, nem enche de muita coisa, já inicia o seu git."

A filosofia aqui e de seguranca incremental. Cada commit e um checkpoint. Se voce espera o projeto crescer, quando algo quebra voce nao tem historico para comparar. Com git desde o inicio:
- Pode voltar a qualquer versao
- Pode experimentar sem medo
- Tem rastreabilidade completa

## Terminal no Windows: por que git bash?

O instrutor explica que no Windows, o terminal padrao (PowerShell/CMD) pode nao ter git configurado corretamente. O git bash vem com a instalacao do Git for Windows e garante que todos os comandos funcionem. No Linux e Mac, o bash/zsh padrao ja funciona.

Como acessar no VS Code: ao inves de clicar no `+` do terminal, clique na seta ao lado e selecione "Git Bash".

## Stage area e commit pelo VS Code

O instrutor mostra duas formas de fazer commit:
1. **Terminal:** `git init .` → `git add .` → `git commit -m "initial commit"`
2. **Interface do VS Code:** aba Source Control → clicar no `+` para stage → digitar mensagem → commit

Ambas sao validas. A interface do VS Code e mais visual e amigavel para iniciantes.

## Publicar no GitHub nao e obrigatorio agora

O instrutor deixa claro: "eu não preciso publicar, ou seja, eu não vou linkar agora com o github." O git local ja oferece versionamento. Publicar no GitHub e um passo adicional que pode ser feito depois, quando o aluno estiver confortavel com os conceitos basicos.

## Emmet: a exclamacao magica

Digitar `!` e pressionar Tab no VS Code gera toda a estrutura HTML5 basica via Emmet. Isso inclui DOCTYPE, meta charset, viewport e estrutura head/body. O instrutor ajusta apenas `lang` e `title`, mantendo o resto como esta.
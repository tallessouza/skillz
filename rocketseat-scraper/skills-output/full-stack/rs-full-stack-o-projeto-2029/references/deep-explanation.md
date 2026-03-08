# Deep Explanation: Validacao Local Pre-Deploy

## Por que testar localmente antes do deploy

O instrutor enfatiza um principio fundamental: **producao nao e lugar para descobrir problemas**. A validacao local serve como o ultimo checkpoint antes de expor a aplicacao ao mundo.

### O raciocinio por tras da abordagem

O foco da aula nao e criar um novo projeto — o instrutor assume que o aluno ja sabe desenvolver. O objetivo e ir "direto ao ponto" na parte de deploy. Isso reflete uma mentalidade profissional: separar a fase de desenvolvimento da fase de deploy.

A frase-chave do instrutor: *"Uma vez funcionando na sua maquina, a gente vai conseguir fazer funcionar ali em producao."* Isso estabelece um contrato: se funciona localmente, o deploy se torna uma questao de configuracao de ambiente, nao de correcao de bugs.

### Por que node_modules nao vem no download

Quando voce faz download de um projeto do GitHub, a pasta `node_modules` nao esta incluida (ela esta no `.gitignore`). Isso e proposital:

1. **Tamanho**: node_modules pode ter centenas de MBs
2. **Plataforma**: dependencias nativas variam entre OS
3. **Reprodutibilidade**: `package-lock.json` garante que `npm install` recria exatamente o mesmo estado

O `npm install` le o `package.json` e o `package-lock.json` para gerar a pasta `node_modules` com todas as dependencias necessarias.

### O projeto usado como exemplo

O projeto "Adivinha" e um jogo de adivinhacao de palavras onde:
- Uma dica de tipagem e exibida
- O usuario tenta adivinhar letras
- Erros sao marcados e contados como tentativas
- Existe uma margem de erro antes de perder

O instrutor escolheu um projeto ja desenvolvido em modulo anterior para que o foco fique 100% no processo de deploy, nao no codigo.

### A mentalidade de deploy

O instrutor estabelece uma sequencia clara:
1. **Ter o projeto** (download/clone)
2. **Instalar dependencias** (npm install)
3. **Executar localmente** (npm run dev)
4. **Validar no navegador** (testar interacoes)
5. **So entao** partir para o deploy

Essa sequencia e universal para qualquer projeto frontend, independente do framework (React, Vue, Angular, Vanilla JS com Vite, etc.).

### Edge cases a considerar

- **Variaveis de ambiente**: Se o projeto depende de `.env`, o download nao incluira esse arquivo. Verifique se existe um `.env.example`.
- **Versao do Node**: Projetos mais antigos podem nao funcionar com versoes muito novas do Node. Verifique se existe um `.nvmrc` ou campo `engines` no `package.json`.
- **Porta ocupada**: Se ja existe outro processo usando a porta 5173 (Vite) ou 3000 (CRA), o servidor pode falhar ao iniciar ou automaticamente usar outra porta.
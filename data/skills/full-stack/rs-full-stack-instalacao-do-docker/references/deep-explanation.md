# Deep Explanation: Instalação do Docker

## Por que CLI e não GUI?

O instrutor enfatiza um ponto importante: mesmo que a instalação do Docker forneça uma interface gráfica (Docker Desktop), a recomendação é usar exclusivamente o terminal/CLI. O raciocínio:

1. **No dia a dia profissional, comandos são mais usados** — em ambientes de produção, servidores não têm interface gráfica. Tudo é feito via SSH + terminal.

2. **Deploy é feito via terminal** — quando você faz deploy de uma aplicação, seja em AWS, DigitalOcean, ou qualquer cloud provider, você estará no terminal. Se não praticou os comandos, vai travar nessa hora.

3. **Alinhamento com o mercado** — o instrutor reforça "de acordo com o que se usa mesmo no mercado". Empresas esperam que desenvolvedores saibam os comandos Docker de cabeça.

### Analogia implícita

É como aprender Git: você poderia usar uma GUI (GitHub Desktop, GitKraken), mas o mercado espera que você saiba `git commit`, `git push`, `git rebase` no terminal. Docker é o mesmo caso.

## O que a instalação inclui

A instalação do Docker é um pacote único que entrega dois componentes:

- **Docker Desktop** — aplicação gráfica para gerenciar containers, imagens, volumes. Útil para visualização, mas não é o foco.
- **Docker CLI** — o binário `docker` disponível no PATH do sistema. É isso que permite executar `docker run`, `docker build`, etc. no terminal.

## Verificação como primeiro passo

O instrutor termina a aula com a verificação (`docker --version` / `docker -v`). Isso estabelece um padrão importante: **sempre verifique que a ferramenta está acessível antes de tentar usá-la**. É um hábito de profissional — nunca assuma que a instalação funcionou, confirme.
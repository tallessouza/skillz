# Deep Explanation: SAST — Static Application Security Testing

## O que e SAST

SAST (Static Application Security Testing) e um software que tenta detectar falhas de seguranca **lendo o seu codigo**, sem executa-lo. A analise e estatica — olha o codigo fonte e aplica regras conhecidas de vulnerabilidades.

## Por que camadas multiplas

O instrutor enfatiza um principio fundamental: **voce nao quer estar num ambiente onde a responsabilidade e total e voce nao pode esquecer nada**. Seguranca precisa de camadas porque humanos esquecem, "comem bola". SAST e uma segunda camada — vai que o dev esqueceu de colocar timeout no requests, vai que concatenou string numa query SQL.

A analogia e clara: quanto mais camadas de protecao, melhor. SAST nao substitui o humano, mas pega o que o humano deixou passar.

## Dois tipos de ferramenta

### 1. Especifica da linguagem (ex: Bandit para Python)

**Caracteristicas:**
- Rapida, roda na linha de comando
- Zero configuracao — instala e roda
- Conhece profundamente os padroes da linguagem
- Ideal para git hooks (pre-commit)
- Encontra mais issues especificas da linguagem

O instrutor demonstrou que Bandit encontrou 3 problemas sem configuracao nenhuma:
1. SQL Injection por concatenacao de string
2. Uso de MD5 (hash inseguro)
3. `requests.get()` sem timeout (risco de DDoS)

**Insight do instrutor:** "Rapidinho, rodou bem rapidinho aqui, sem configuracao nenhuma, sem precisar fazer nada, tem um excelente report de seguranca."

### 2. Generica centralizada (ex: SonarQube)

**Caracteristicas:**
- Suporta multiplas linguagens
- Interface web com gestao de riscos
- Integra com CI (Jenkins, GitHub Actions, Bitbucket Pipelines)
- Permite revisao compartilhada pelo time
- Menos especifica que a ferramenta dedicada da linguagem
- Demora mais para inicializar (banco de dados de vulnerabilidades)

O instrutor notou que SonarQube encontrou menos issues que Bandit (encontrou MD5 mas nao marcou o requests sincrono como security issue), mas oferece:
- Gestao centralizada dos riscos
- Visibilidade compartilhada com o time
- Integracao com CI — pega o dev que nao instalou a ferramenta local
- Review e classificacao de Security Hotspots

## Complementaridade, nao escolha

O instrutor recomenda **ter ambas**: "Voce pode ter duas ferramentas, uma especifica para cada linguagem que voce estiver trabalhando num projeto. Entao, um projeto com tres linguagens, voce vai ter tres ferramentas especificas ali e uma generica compartilhada com o time todo, integrada no seu CI."

## Lista da OWASP

O instrutor mencionou a pagina da OWASP que lista ferramentas de analise de codigo. A lista e enorme, com ferramentas comerciais e open source para praticamente todas as linguagens. O importante nao e conhecer todas, mas entender os conceitos e escolher as adequadas para seu projeto.

## Limitacao fundamental do SAST

**SAST nao entende regras de negocio.** O instrutor enfatiza: "E necessario um ser humano para trabalhar seguranca. As regras de negocio sao parte da seguranca. O que pode, o que nao pode, access control, quem pode ver o que. Nao tem como uma maquina avaliar essas coisas."

SAST detecta padroes conhecidos: credenciais expostas, SQL injection, hashes fracos, requests sem timeout. Mas logica de autorizacao, permissoes entre usuarios, fluxos de negocio — isso precisa de revisao humana.
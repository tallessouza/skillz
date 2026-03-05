# Deep Explanation: Gestao de Dependencias

## Por que monitoramento continuo e essencial

O instrutor destaca um ponto fundamental: voce instala um pacote hoje que nao tem vulnerabilidades conhecidas. Amanha alguem descobre uma vulnerabilidade. Isso NAO e hipotetico — e inevitavel. A demonstracao usa Django 4.0, que acumulou mais de 10 vulnerabilidades criticas depois de ser considerado seguro.

A implicacao pratica: mesmo projetos legados "em manutencao" precisam de monitoramento ativo. Nao basta auditar no momento da instalacao.

## Dependency Track — Arquitetura e conceitos

### O que e
Ferramenta OWASP para gestao centralizada de dependencias de todos os projetos de uma organizacao. Sobe via Docker Compose com 3 containers: PostgreSQL, backend (API + processos agendados), frontend.

### Modelo mental
Dependency Track NAO analisa codigo. Ele recebe uma lista de dependencias (SBOM) e cruza com bancos de dados de vulnerabilidades conhecidas. E como um "vigia noturno" — fica la rodando 24h, verificando se alguma vulnerabilidade nova foi publicada que afeta seus projetos.

### Configuracoes importantes

**Task Scheduler:** Por padrao roda a cada 24h. O instrutor enfatiza que isso e suficiente — nao precisa rodar de hora em hora. Vulnerabilidades nao aparecem com essa urgencia.

**Analyzers:** O Internal analyzer e gratuito. Trivi, Sneak e VulnDB sao pagos. Sonatype vem habilitado por padrao mas precisa de chave API paga — desabilitar se nao tiver.

**CPE vs PURL:** Dois padroes para identificar componentes de software:
- **PURL** (Package URL): padrao da comunidade, mais usado
- **CPE** (Common Platform Enumeration): padrao do NIST/governo americano

O problema: as vezes uma vulnerabilidade e reportada pelo NIST usando CPE, mas seu pacote so tem PURL. Sem matching cruzado, a vulnerabilidade nao e detectada. O instrutor recomenda ativar FuseCPEMatching mesmo sabendo que gera falsos positivos: "prefiro ser avisado de um falso positivo e ignorar do que nao ser avisado de uma vulnerabilidade real."

**Fontes de vulnerabilidade:**
- National Vulnerability Database (NVD/NIST): principal, requer chave API gratuita, usar mirroring (feed direto e deprecated)
- Google Open Source Vulnerability: selecionar ecossistemas especificos (PyPI, NPM, etc.)

### Collection Logic
Deixar em "none" para projetos simples. Usar "AggregateDirectChildren" apenas para projeto-pai com sub-projetos.

### Fluxo de upload
1. Gerar arvore de dependencias com pipdeptree
2. Converter para SBOM com cyclonedx-bom
3. Upload do JSON no Dependency Track via interface (Components > Upload BOM)
4. Analise roda automaticamente em background

### Logs
Quando rodar no Docker, os logs ficam em `/var/lib/docker/volumes/dt-trackdata/_data/`. O instrutor enfatiza: "voce muito provavelmente vai ter problemas em algum momento e vai precisar olhar esse log."

## Pip Audit — Ferramenta local complementar

Ferramenta Python simples que roda localmente e verifica vulnerabilidades instantaneamente. Renova cache de vulnerabilidades diariamente.

Vantagem: feedback imediato ao desenvolvedor. Se instalou uma dependencia vulneravel, descobre antes de commitar.

Limitacao: especifica para Python. Cada linguagem precisa de sua propria ferramenta equivalente.

## Estrategia em duas camadas

O instrutor recomenda explicitamente combinar:

1. **Camada local** (pip-audit, npm audit): dev recebe feedback imediato ao adicionar dependencia
2. **Camada centralizada** (Dependency Track): monitora todos os projetos continuamente, alerta a equipe por email quando nova vulnerabilidade surge

A camada local nao substitui a centralizada porque vulnerabilidades novas aparecem independentemente da acao do programador. A centralizada nao substitui a local porque o dev precisa de feedback antes de commitar.

## Gestao de vulnerabilidades encontradas

Quando o Dependency Track lista vulnerabilidades, cada uma precisa ser triada individualmente:
- Avaliar severidade (critica, alta, media, baixa)
- Decidir: atualizar pacote, mitigar de outra forma, ou marcar como falso positivo
- Em projetos antigos, espere "paginas e paginas" de vulnerabilidades — cada uma e "uma porta aberta"
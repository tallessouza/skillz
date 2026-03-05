# Code Examples: Gestao de Dependencias

## Setup completo do Dependency Track

### 1. Download e inicializacao

```bash
# Criar diretorio e baixar docker-compose
mkdir dt && cd dt
curl -LO https://dependencytrack.org/docker-compose.yml

# Subir os 3 containers (postgres, backend, frontend)
docker compose up -d

# Verificar se subiu
docker compose ps

# Acessar: http://localhost:8080
# Login padrao: admin / admin (trocar imediatamente)
```

### 2. Localizar logs (importante para debug)

```bash
# Caminho dos logs no Docker
ls /var/lib/docker/volumes/dt-trackdata/_data/

# Acompanhar logs em tempo real
tail -f /var/lib/docker/volumes/dt-trackdata/_data/dependency-track.log

# Ou via docker
docker compose logs -f backend
```

### 3. Configuracoes na interface web

```
1. Admin > Configuration > General:
   - Base URL: definir URL do servidor (importante para integracoes)

2. Admin > Configuration > Email:
   - Configurar conta SMTP para alertas de vulnerabilidade

3. Admin > Configuration > Task Scheduler:
   - Manter padrao 24h (suficiente para monitoramento)

4. Admin > Configuration > Analyzers:
   - Internal: manter habilitado (gratuito)
   - Sonatype: desabilitar se nao tiver chave API paga
   - FuseCPEMatching: habilitar (para Python especialmente)
   - FuseCPEMatching for PURL: habilitar

5. Admin > Configuration > Vulnerability Sources:
   - NVD: ativar "Mirroring via API" (NAO usar feed direto, e deprecated)
   - Cadastrar chave API em https://nvd.nist.gov/
   - Google OSV: selecionar ecossistemas (PyPI, NPM, etc.)
```

## Geracao de SBOM (Python)

### Instalar ferramentas

```bash
pip install pipdeptree cyclonedx-bom
```

### Gerar arvore de dependencias (visualizacao)

```bash
# --freeze gera formato compativel com pip
pipdeptree --freeze > requirements-tree.txt
```

Exemplo de saida (arvore indentada mostrando cadeia de dependencias):
```
bandit==1.7.x
  rick==x.x
    markdown-it-py==x.x
      mdurl==x.x
```
Isso mostra: `mdurl` esta instalado porque `markdown-it-py` depende dele, que esta instalado porque `rick` depende dele, que esta instalado porque `bandit` depende dele.

### Gerar SBOM CycloneDX

```bash
# Ler do requirements e gerar JSON
cyclonedx-py -r --format json -o sbom.json

# O arquivo sbom.json e o que sera enviado ao Dependency Track
# NAO enviar codigo fonte, apenas este arquivo
```

### Upload no Dependency Track

```
1. Projects > Criar projeto:
   - Name: "Bad App" (nome do seu projeto)
   - Classifier: Application
   - Collection Logic: None (para projeto simples)

2. Dentro do projeto > Components > Upload BOM
   - Selecionar o sbom.json gerado
   - Fazer upload
   - Dar F5 (interface nao atualiza automaticamente)

3. Audit Vulnerabilities:
   - Analise roda em background automaticamente
   - Pode demorar (sincronizacao do banco de 100k+ vulnerabilidades)
   - Clicar em "Reanalyze" se necessario
```

## Pip Audit (auditoria local Python)

### Instalacao e uso basico

```bash
# Instalar
pip install pip-audit

# Executar auditoria
pip-audit
```

### Exemplo de saida com Django 4.0

```
Name    Version ID             Fix Versions
------- ------- -------------- ----------------
django  4.0     PYSEC-2022-... 4.0.1
django  4.0     PYSEC-2022-... 4.1.2
django  4.0     PYSEC-2023-... 4.2.2
...
```

### Testando com pacote vulneravel

```bash
# Instalar pacote antigo vulneravel
pip install flask==0.5

# Auditar
pip-audit
# Resultado: flask 0.5 aparece com vulnerabilidades conhecidas

# Corrigir
pip install --upgrade flask
pip-audit
# Resultado: limpo
```

## Equivalentes em outras linguagens

### Node.js / NPM

```bash
# Audit nativo do npm
npm audit

# Gerar SBOM CycloneDX
npx @cyclonedx/cyclonedx-npm --output-file sbom.json
```

### Java / Maven

```bash
# Plugin CycloneDX para Maven
mvn org.cyclonedx:cyclonedx-maven-plugin:makeAggregateBom
```

### .NET

```bash
# dotnet tool
dotnet tool install --global CycloneDX
dotnet CycloneDX project.csproj -o sbom.json
```

## Fluxo completo recomendado

```bash
# 1. Desenvolvimento: audit local antes de commit
pip-audit  # ou npm audit, etc.

# 2. CI/CD: gerar SBOM e enviar ao Dependency Track
pipdeptree --freeze > requirements-tree.txt
cyclonedx-py -r --format json -o sbom.json
# Upload via API do Dependency Track:
curl -X POST "http://dt-server:8080/api/v1/bom" \
  -H "X-Api-Key: YOUR_API_KEY" \
  -H "Content-Type: multipart/form-data" \
  -F "project=PROJECT_UUID" \
  -F "bom=@sbom.json"

# 3. Monitoramento continuo: Dependency Track roda analise diaria
# Alertas por email quando nova vulnerabilidade e descoberta
```
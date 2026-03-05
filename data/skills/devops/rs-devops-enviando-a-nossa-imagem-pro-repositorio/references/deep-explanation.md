# Deep Explanation: Enviando Imagem Docker para o Repositorio

## Por que login antes do build?

O instrutor enfatiza a ordem dos steps: login → build → push. A logica e economica: se o login falhar (token expirado, credenciais erradas), voce nao quer ter gasto minutos buildando uma imagem que nunca sera enviada. Fail fast.

## Estrutura do nome no Docker Hub

Um ponto critico que causa falhas silenciosas: o Docker Hub organiza repositorios como `username/repo-name`. Quando voce faz `docker build -t skillz-ci-api:tag`, o build funciona localmente, mas o push falha porque o Docker Hub nao sabe para qual conta enviar.

A solucao e sempre incluir o username no tag:
```
danielrodrigues/skillz-ci-api:abc123
```

Alternativa: fazer build sem username e depois usar `docker tag` para renomear. Mas o instrutor recomenda ja passar o nome completo no build para economizar um step.

## Secrets vs Variables no GitHub

O GitHub Actions oferece dois mecanismos:
- **Secrets** (Settings > Security > Secrets and variables > Actions): valores criptografados, nunca aparecem nos logs. Use para credenciais.
- **Variables** (mesmo local, aba Variables): valores em texto claro, aparecem nos logs. Use para configuracoes nao-sensiveis.

O instrutor nota que o menu "Actions" em Settings pode confundir — as secrets ficam em "Security > Secrets and variables", nao diretamente em "Actions".

## Token vs Senha

No Docker Hub, voce gera access tokens em My Account > Security > Access Tokens. Vantagens sobre senha:
- Pode ser escopado (read, write, read+write+delete)
- Pode ser revogado individualmente sem afetar outros acessos
- Para CI/CD, o minimo necessario e `write` (para push)

O instrutor gera com permissao completa (read, write, delete) por conveniencia, mas recomenda escopar apenas para write em producao.

## Verificacao do push

Para confirmar que o push funcionou:
1. Va ao Docker Hub > Repositories
2. Encontre o repositorio
3. Verifique se a tag corresponde ao SHA do commit no GitHub

O instrutor demonstra copiando a tag do Docker Hub e comparando com o hash do commit — devem ser identicos.

## Otimizacoes mencionadas (para aulas futuras)

O instrutor menciona que o fluxo atual reinstala dependencias (yarn install) dentro do Dockerfile a cada build, o que custa tempo. Otimizacoes possiveis:
- Instalar dependencias fora do Docker e copiar `node_modules`
- Separar steps de teste e build
- Cache de layers do Docker

Tambem menciona que existem actions especificas para build e push (como `docker/build-push-action`) que serao abordadas na proxima aula.

## Registries alternativos

O principio e o mesmo para qualquer container registry:
- **Docker Hub**: `docker/login-action`
- **AWS ECR**: action especifica do ECR (abordado no modulo 5)
- **Google Cloud**: action especifica do GCloud

A unica diferenca e a action de login e a estrutura do nome da imagem.
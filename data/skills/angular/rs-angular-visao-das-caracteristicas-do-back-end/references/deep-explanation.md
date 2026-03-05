# Deep Explanation: Visao das Caracteristicas do Back-end

## Por que nao usar base64 para imagens

O instrutor enfatiza fortemente este ponto: quando uma imagem e convertida para base64 (texto), o tamanho resultante fica **33% maior** que o binario original. Isso causa:

1. **JSON inflado** — como os dados sao persistidos em arquivos JSON, salvar base64 dentro do JSON tornaria os arquivos enormes
2. **Cache do navegador prejudicado** — navegadores fazem cache eficiente de imagens servidas como arquivos estaticos (URLs). Com base64 inline, o navegador pode nem fazer cache
3. **Performance de rede** — transferir 33% mais dados em cada request

A solucao: salvar o binario diretamente no disco, armazenar apenas o caminho relativo no JSON, e servir a pasta public estaticamente pelo Express. O navegador recebe uma URL normal de imagem e faz cache normalmente.

## Arquitetura Feature-Based e Domain Driven Design

O instrutor conecta Feature-Based com DDD: a ideia e separar por **contexto de dominio** (Users, Movies, Favorites) em vez de separar por camada tecnica (controllers/, models/, services/). Cada feature contem tudo que precisa para funcionar.

Isso foi mencionado como continuacao de um nivel anterior do curso onde Feature-Based ja foi ensinado.

## Abordagem serverless-like local

O backend roda localmente simulando servicos que em producao seriam cloud:
- **JSON files** simulam um banco de dados
- **File system** simula um storage (S3, etc.)
- Tudo roda no localhost, sem dependencias externas

Isso permite que o aluno foque no frontend Angular sem precisar configurar infraestrutura.

## Seguranca com JWT

O fluxo de autenticacao:
1. Usuario faz POST /users/login com credenciais
2. Backend valida credenciais contra JSON de usuarios
3. Gera JWT com validade de 1 hora
4. Retorna token + dados do usuario (sem senha)
5. Frontend envia token no header de requests subsequentes
6. Auth middleware intercepta, decodifica, injeta dados tipados do usuario na request
7. Endpoints protegidos so executam se middleware validar token

## Middleware de upload com multer

Para criar filmes, o frontend envia multi-part form data (imagem + dados do filme). O middleware:
1. Usa multer para processar o multi-part
2. Valida que o arquivo e uma imagem
3. Gera nome unico para evitar colisoes
4. Salva no disco (pasta public)
5. O caminho relativo e armazenado no JSON

O Angular facilita o envio de multi-part form data, segundo o instrutor.

## CORS

Configurado para permitir requisicoes de dominios diferentes — essencial porque o frontend Angular roda em uma porta/dominio diferente do backend Express. Sem CORS configurado, o navegador bloquearia as requisicoes.

## Media ponderada incremental para ratings

Quando um usuario avalia um filme (1-5), o backend nao recalcula a media de todas as avaliacoes. Ele usa uma formula incremental que atualiza a nota media e o total de votos em tempo real. O response ja retorna os valores atualizados para o frontend atualizar a UI imediatamente.

## Contexto importante

O instrutor deixa claro que:
- O backend **ja esta pronto** — nao sera construido do zero neste curso
- O foco do curso e o **frontend Angular**
- O backend sera apenas rodado localmente e consumido via HTTP
- Os endpoints serao revisados na pratica em videos posteriores
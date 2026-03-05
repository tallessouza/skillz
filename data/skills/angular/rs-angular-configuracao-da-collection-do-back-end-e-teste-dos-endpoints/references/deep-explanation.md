# Deep Explanation: Configuracao de Collection e Teste de Endpoints

## Por que testar no Insomnia antes do front-end?

O instrutor enfatiza que o objetivo e ter uma nocao completa de como cada endpoint funciona antes de implementar no Angular. Isso permite:
- Entender o formato exato de request e response
- Identificar quais endpoints precisam de token
- Ver os status codes esperados (200, 201, 204)
- Compreender o fluxo de autenticacao completo

## Fluxo de Autenticacao JWT explicado

1. **Criar usuario** → `POST /users` com name, email, password
2. **Login** → `POST /users/login` retorna um token JWT
3. **Usar token** → Enviar no header `Authorization: Bearer <token>` em todas as requisicoes seguintes
4. **Validar token** → `GET /users/validate-token` para checar se o token ainda e valido

O token JWT contem informacoes do usuario embutidas. O back-end "desmembra" o token para extrair essas informacoes (ex: qual usuario esta pedindo a lista de favoritos).

## Por que imagens como binario e nao Base64?

O instrutor explica a decisao de design: salvar o binario da imagem no servidor e servir via URL estatica (`/uploads/nome.jpg`) em vez de retornar Base64 no JSON do endpoint. Razoes:

- **Cache do navegador**: URLs de imagem sao facilmente cacheadas pelo browser. Base64 dentro de JSON nao recebe cache eficiente.
- **Performance**: Base64 aumenta o tamanho do payload JSON em ~33%.
- **Simplicidade no front**: Basta usar `<img src="localhost:3000/uploads/nome.jpg">`.

## Configuracao Auth no Insomnia

O Insomnia tem uma funcionalidade de Auth que automaticamente:
1. Pega o response de outro endpoint (no caso, o login)
2. Extrai uma propriedade especifica (o token)
3. Adiciona automaticamente o header `Authorization: Bearer <token>`

Isso evita copiar/colar o token manualmente. No front-end Angular, esse mesmo comportamento sera implementado com um **HTTP Interceptor**.

## Separacao por features no back-end

O back-end segue uma arquitetura de separacao por features (nao por tipo de arquivo):
- Cada feature (users, movies, favorites) tem seus proprios controller, service e routes
- **Controller**: lida com HTTP (request/response) e orquestracao do JWT
- **Service**: logica de negocios e acesso aos dados (leitura/escrita dos JSON)
- **Routes**: define os paths e conecta ao controller

## Banco de dados simplificado com JSON

Os dados ficam em arquivos `.json` dentro de `server/data/`:
- `users.json`: lista de usuarios cadastrados
- `movies.json`: informacoes completas dos filmes
- `favorites.json`: relacao usuario → lista de IDs de filmes favoritos

O service de cada feature le e escreve nesses arquivos diretamente.

## Multipart Form para criacao de filmes

Quando o endpoint precisa receber um arquivo binario (imagem), o body nao pode ser JSON puro. Usa-se **Multipart Form** que permite enviar campos texto (title, description, year, genre) junto com o binario da imagem no mesmo request.
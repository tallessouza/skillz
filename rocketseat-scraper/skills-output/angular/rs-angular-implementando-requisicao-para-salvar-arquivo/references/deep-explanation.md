# Deep Explanation: Requisicoes MultipartFormData no Angular

## Por que MultipartFormData e nao JSON?

O instrutor explica usando a analogia do "envelopinho": o MultipartFormData funciona como um envelope que consegue carregar diferentes tipos de conteudo simultaneamente — tanto texto (titulo, descricao, ano, genero) quanto binarios (imagem do filme). JSON puro nao suporta transporte de dados binarios diretamente.

## O papel do Content-Type

Quando enviamos uma requisicao multipart, o header `Content-Type` precisa ser `multipart/form-data` com um `boundary` unico que separa as diferentes partes do envelope. O Angular detecta automaticamente quando o body da requisicao e um objeto `FormData` e:

1. Define o `Content-Type` como `multipart/form-data`
2. Gera o `boundary` correto automaticamente
3. Serializa cada campo do FormData como uma parte separada

**Por isso nunca devemos definir o Content-Type manualmente** — se definirmos, o boundary gerado pelo Angular nao vai bater com o que colocamos no header, e a requisicao vai falhar.

## Separacao de responsabilidades

O instrutor segue um padrao claro:
- **Service**: recebe `FormData` pronto e faz o POST. Nao sabe como o FormData foi montado.
- **Componente**: monta o `FormData` com os campos corretos (texto + binario). Conhece o formulario e os arquivos selecionados.

Essa separacao e importante porque:
- O service fica reutilizavel (qualquer componente pode montar FormData diferente)
- O componente e responsavel pela logica de UI (captura de arquivo, validacao de formulario)
- Facilita testes unitarios (mockar FormData no teste do service e simples)

## Reutilizacao de interfaces

O endpoint POST `/movies` retorna a mesma estrutura que o GET — a interface `IMovieResponse`. O instrutor destaca que podemos reutilizar essa interface ao inves de criar uma nova, ja que as propriedades sao identicas. Isso mantem o codigo DRY e facilita a manutencao.

## Como o backend recebe

O backend precisa estar preparado para aceitar `multipart/form-data`. No caso da Movies API usada no curso, o endpoint POST `/movies` ja sabe parsear o multipart e extrair tanto os campos texto quanto o arquivo binario. Frameworks como Express (com multer), NestJS (com interceptors), e outros tem suporte nativo para isso.

## Fluxo completo

```
Componente (monta FormData)
    ↓
Service (httpClient.post com FormData)
    ↓
Angular (detecta FormData, adiciona headers automaticamente)
    ↓
HTTP Request (multipart/form-data com boundary)
    ↓
Backend (parseia multipart, extrai campos + arquivo)
    ↓
Response (IMovieResponse)
```
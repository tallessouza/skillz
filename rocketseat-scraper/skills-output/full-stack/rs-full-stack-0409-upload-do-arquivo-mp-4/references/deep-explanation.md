# Deep Explanation: Upload de Arquivo com Express e Multer

## Por que separar a configuração do Multer?

O instrutor destaca explicitamente essa decisão: "Eu poderia pegar tudo isso daqui que tá dentro aqui de configuração e colocar direto aqui dentro. Só que ao invés de fazer isso para ficar mais organizado, eu separei a configuração do Multer em um arquivo de configuração."

Essa separação segue o princípio de Single Responsibility:
- O arquivo de rotas cuida de **roteamento** e **middlewares**
- O arquivo de config cuida de **como** o Multer se comporta (destino, filtros, limites)
- Quando precisar mudar storage (de disco para S3, por exemplo), só muda o config

O padrão é criar `configs/upload.ts` com `export default` contendo a configuração completa, e no arquivo de rotas simplesmente fazer:

```typescript
import uploadConfig from "@/configs/upload"
const upload = multer(uploadConfig.multer)
```

## Ordem dos middlewares: autorização ANTES do upload

O instrutor aplica `verifyUserAuthorization` com `routes.use()` antes de definir a rota de upload. Isso é intencional:

1. `uploadsRoutes.use(verifyUserAuthorization("employee"))` — checa token e perfil
2. `uploadsRoutes.post("/", upload.single("file"), ...)` — só processa arquivo se autorizado

Se a ordem fosse invertida, um usuário não autorizado conseguiria enviar o arquivo para o disco antes de ser rejeitado — desperdício de I/O e potencial vetor de ataque.

## O fluxo completo do Multer como middleware

O `upload.single("file")` é um middleware que:
1. Intercepta a requisição antes do controller
2. Lê o stream do form-data
3. Extrai o campo com nome `"file"`
4. Salva no destino configurado (pasta `tmp/`)
5. Popula `req.file` com metadados (nome original, mimetype, path, tamanho)
6. Chama `next()` para o controller ter acesso a `req.file`

## Por que form-data e não JSON?

Arquivos binários não podem ser enviados como JSON. O formato `multipart/form-data` permite enviar tanto campos de texto quanto arquivos binários na mesma requisição. No Insomnia/Postman:
- Selecione **Form Data** (não JSON)
- O campo deve ter tipo **File** (não Text)
- O nome do campo (`file`) deve corresponder ao passado em `single("file")`

## Validação acidental: double check

O instrutor descobre acidentalmente que a validação de "usuário já cadastrado" funciona quando tenta criar um usuário existente. Ele chama isso de "double check" — uma verificação não planejada que confirma que validações anteriores estão funcionando. Isso reforça a importância de testar fluxos colaterais.

## Pasta temporária (`tmp/`)

Os arquivos são salvos em `tmp/` como etapa intermediária. O instrutor indica que na próxima aula esses arquivos serão "manipulados" — ou seja, a pasta `tmp/` é um staging area, não o destino final. Isso permite:
- Validar o arquivo antes de movê-lo para local definitivo
- Renomear com hash/UUID
- Fazer upload para cloud storage
- Deletar se a operação falhar

## Estrutura de controller seguindo padrão do projeto

O controller segue o padrão de classe com métodos assíncronos:

```typescript
class UploadController {
  async create(request: Request, response: Response) { ... }
}
export { UploadController }
```

Esse padrão é consistente com os demais controllers do projeto (ticket, session, etc.), mantendo a nomenclatura `create` para operações POST.
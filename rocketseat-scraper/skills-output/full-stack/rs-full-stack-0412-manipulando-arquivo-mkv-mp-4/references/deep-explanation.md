# Deep Explanation: Manipulando Arquivo em Upload

## Por que uma pasta temporaria?

O fluxo de upload segue um padrao de staging: o arquivo chega primeiro em uma pasta temporaria (`tmp`) e so e movido para a pasta definitiva (`uploads`) apos passar por todas as validacoes. Isso garante que:

1. **Arquivos invalidos nunca chegam a pasta final** — sao deletados da tmp
2. **O processo e atomico** — ou o arquivo esta na tmp (pendente) ou na uploads (validado)
3. **Falhas durante validacao nao deixam lixo** — o catch limpa a tmp

O instrutor enfatiza: "o que a gente tem que fazer agora e deletar o arquivo caso ele nao atenda aos criterios de validacao e mover o arquivo para a pasta de upload caso ele atenda".

## fs.promises vs fs sync

O Node.js oferece tres APIs para o filesystem:
- `fs.readFileSync()` — sincrono, bloqueia o event loop
- `fs.readFile(callback)` — assincrono com callback
- `fs.promises.readFile()` — assincrono com Promises/async-await

O instrutor usa exclusivamente `fs.promises` porque operacoes de IO sincronas bloqueiam o servidor inteiro durante a leitura/escrita.

## Metodos de verificacao: access vs stat

Ambos verificam se um arquivo existe, mas de formas diferentes:

- **`fs.promises.access(path)`** — verifica se o processo tem permissao de acesso ao arquivo. Lanca excecao se o arquivo nao existe ou nao tem permissao. Usado no `saveFile` para garantir que o arquivo realmente esta na pasta tmp antes de tentar mover.

- **`fs.promises.stat(path)`** — retorna metadados do arquivo (tamanho, data, tipo). Lanca excecao se o arquivo nao existe. Usado no `deleteFile` para verificar existencia antes de tentar deletar.

O instrutor explica: "esse stat aqui e so para a gente ver o status do arquivo, se esse arquivo esta disponivel ou nao. Se ele nao achar esse arquivo, ele tambem vai gerar uma excecao."

## rename nao renomeia

O instrutor faz questao de esclarecer: "`rename` nao e para renomear o arquivo, e para mudar ele de lugar". O metodo `fs.promises.rename(oldPath, newPath)` move o arquivo atomicamente de um caminho para outro no filesystem. E mais eficiente que copiar + deletar porque nao duplica os dados no disco.

## mkdir com recursive: true

A pasta `uploads` pode nao existir quando o primeiro arquivo for enviado. O instrutor usa:

```typescript
await fs.promises.mkdir(uploadConfig.uploads_folder, { recursive: true })
```

O `{ recursive: true }` tem dois efeitos:
1. Cria a pasta se nao existir
2. **Nao lanca erro se ja existir** — sem recursive, mkdir em pasta existente gera excecao

O instrutor demonstra: "veja que esta vazia a pasta por enquanto... se eu dar um send, ta vendo? Ele criou a pasta de uploads que nao tinha e ta la o arquivo."

## Por que instanciar fora do try/catch

O instrutor cria `const diskStorage = new DiskStorage()` antes do bloco try. A razao: "eu vou criar ele fora do try para ele ficar visivel e disponivel, tanto dentro desse escopo do try ou do catch". Se a instancia fosse criada dentro do try, o catch nao teria acesso a ela para chamar deleteFile.

## Fluxo completo de validacao + manipulacao

```
Arquivo chega via multer
  → Multer salva na pasta tmp (automatico)
  → Controller valida com Zod (tipo, tamanho)
  → Validacao OK?
      SIM → saveFile() move de tmp para uploads
      NAO → deleteFile() remove da tmp
  → Retorna filename ou erro
```

## .gitkeep — mantendo pastas vazias

O Git ignora pastas vazias por design. Se voce quer que a estrutura de pastas (ex: `uploads/`) exista no repositorio mesmo sem arquivos, crie um `.gitkeep` dentro:

```
uploads/.gitkeep
```

O instrutor nota que no caso deste projeto o codigo ja cria a pasta automaticamente, mas e uma "estrategia legal para voce aprender" e util em projetos onde a pasta precisa existir antes da primeira execucao.

## Estrategia de delete no catch

O padrao usado no controller e defensivo:

```typescript
catch (error) {
  if (error instanceof ZodError && request.file) {
    await storage.deleteFile(request.file.filename, "tmp")
  }
}
```

Duas condicoes sao verificadas:
1. **E erro de validacao Zod** — so deleta se o erro veio da validacao, nao de outro problema
2. **Existe um arquivo** — `request.file` pode ser undefined se o upload falhou antes do multer processar

Isso evita tentar deletar um arquivo que nunca existiu.
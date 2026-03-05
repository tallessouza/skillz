# Deep Explanation: Envio de Arquivos via Refit com Multipart

## Por que Multipart e nao JSON?

O instrutor explica de forma direta: "Como que eu envio um arquivo, uma foto pelo JSON? Nao tem como." JSON e um formato textual — serve para strings, numeros, booleanos. Arquivos binarios (fotos, PDFs, videos) precisam de outro formato de transporte.

O formato `multipart/form-data` resolve isso. O instrutor usa uma analogia com formularios fisicos: "Sabe esses formularios que a gente preenche? Nome, e ai voce preenche. Idade, voce preenche. Foto, voce anexa." O Multipart e exatamente isso — um formulario onde cada campo pode ser texto ou arquivo.

## A armadilha dos nomes de parametros

Um ponto critico que o instrutor enfatiza: no Multipart, os nomes dos campos do formulario precisam corresponder exatamente aos nomes esperados pela API. Diferente do JSON onde a serializacao cuida do mapeamento, no form-data os nomes sao literais.

Se a API espera `file` e voce nomeia `photo` no Refit, vai dar erro. A solucao e:
- Usar o mesmo nome no parametro do Refit
- Ou usar `[AliasAs("file")]` quando quiser um nome diferente no codigo

## Stream — leitura incremental

O `FileResult.OpenReadAsync()` retorna um Stream. O instrutor explica: "Um stream aqui e uma abstracao que vai ser um fluxo que vai ler o arquivo pouco a pouco." Isso e importante para arquivos grandes — ao inves de carregar a foto inteira na memoria, o stream permite envio progressivo.

## FileResult como abstracao unificada

Tanto a selecao de foto pela galeria quanto a captura pela camera retornam `FileResult`. O instrutor destaca que isso permite reutilizar o mesmo codigo: "Das duas formas a pessoa vai estar passando pra gente um FileResult, nada de especial."

O `FileResult` fornece:
- `OpenReadAsync()` — stream do conteudo
- `FileName` — nome original do arquivo
- `ContentType` — MIME type (image/jpeg, image/png, etc.)

## Arquitetura: UseCase entre ViewModel e API

O padrao seguido e: ViewModel → UseCase → Interface Refit (IUserApi). O UseCase encapsula a logica de criar o `StreamPart` e interpretar a resposta. A ViewModel apenas gerencia estado da UI (StatusPage) e exibe feedback.

## Registro no container de DI

O instrutor alerta: "Nao vai esquecer. Vem aqui no MauiProgram, e aqui a gente tem uma funcao chamada addUseCases." Todo UseCase novo precisa ser registrado com sua interface no container de injecao de dependencia, senao ocorrem erros em runtime.

## Nota sobre a jornada

O instrutor menciona que esta aula foca apenas na comunicacao — o salvamento real da imagem (em servicos de armazenamento do mercado) sera abordado em modulo separado, para aproveitar periodos gratuitos das ferramentas.
# Deep Explanation: Validação de Arquivo com Zod

## Por que validar uploads no servidor

Mesmo que o frontend restrinja tipos de arquivo, qualquer pessoa pode enviar uma requisição direta (via Insomnia, curl, etc.) com arquivos arbitrários. A validação no servidor é a última linha de defesa.

## O problema do arquivo temporário

Um ponto crucial que o instrutor destaca: **a validação não impede o arquivo de chegar na pasta temporária**. O multer (ou middleware de upload) salva o arquivo ANTES do controller executar. Isso significa que:

1. Arquivo chega → multer salva em `tmp/`
2. Controller executa → Zod valida
3. Se inválido → arquivo permanece em `tmp/` (problema!)
4. Solução (próxima aula): remover arquivo inválido de `tmp/` no catch

Essa é uma limitação arquitetural do fluxo upload-then-validate. O middleware de upload não conhece as regras de negócio.

## Por que Zod para validação de arquivos

O Zod é normalmente associado a validação de JSON/formulários, mas funciona perfeitamente para objetos de arquivo porque o `request.file` do multer é um objeto JavaScript comum com propriedades tipadas.

### O método `refine`

O `refine` é essencial aqui porque as validações built-in do Zod (`string`, `number`, `min`, `max`) não cobrem:
- "Este mimetype está na lista de permitidos?" → precisa de lógica customizada
- "Este tamanho está dentro do limite configurado?" → precisa comparar com valor externo

```javascript
z.string().refine(
  (value) => /* condição booleana */,
  "mensagem se falhar"
)
```

O primeiro argumento é uma função que recebe o valor e retorna boolean. O segundo é a mensagem de erro.

## Centralização da config

O instrutor enfatiza o princípio DRY através da config centralizada:

```javascript
const maxSize = 3 // MB
```

Este único número propaga para:
1. **Cálculo de bytes**: `maxSize * 1024 * 1024` → limite real
2. **Validação**: `size <= uploadConfig.maxSizeFile`
3. **Mensagem de erro**: `` `excede ${uploadConfig.maxSize}MB` ``

Se amanhã o limite mudar para 5MB, altera-se UM número e tudo funciona.

O mesmo princípio se aplica aos tipos aceitos:
```javascript
acceptedImageTypes: ["image/png", "image/jpeg", "image/jpg", "image/webp"]
```

Adicionar `"image/gif"` aqui automaticamente:
- Permite o upload de GIFs
- Atualiza a mensagem de erro para incluir GIF nos formatos permitidos

## O `.passthrough()` do Zod

O objeto `request.file` do multer contém muitas propriedades:
- `fieldname` — nome do campo no formulário
- `originalname` — nome original do arquivo
- `encoding` — encoding do arquivo
- `mimetype` — tipo MIME
- `destination` — pasta de destino
- `filename` — nome gerado
- `path` — caminho completo
- `size` — tamanho em bytes

Se o schema Zod define apenas `filename`, `mimetype` e `size`, o comportamento padrão é **rejeitar** propriedades extras. O `.passthrough()` diz ao Zod: "valide apenas o que eu defini, ignore o resto".

## Cuidado com nomes similares

O instrutor alerta sobre confusão entre:
- `fieldName` — nome do campo no formulário (ex: "avatar")
- `fileName` — nome do arquivo (ex: "foto.png")

São propriedades diferentes e confundi-las causa bugs silenciosos.

## Formas de mensagem de erro no Zod

O instrutor mostra múltiplas formas de passar mensagens:

```javascript
// Forma 1: string direta
z.string().min(1, "Arquivo é obrigatório")

// Forma 2: objeto com message
z.string().min(1, { message: "Arquivo é obrigatório" })

// Forma 3: no refine, string direta
.refine((val) => condition, "Mensagem de erro")

// Forma 4: no refine, objeto
.refine((val) => condition, { message: "Mensagem de erro" })
```

Todas funcionam — escolha a que preferir por consistência.
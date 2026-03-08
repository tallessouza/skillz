# Deep Explanation: Configuração de Upload de Arquivos com Multer

## Por que path.resolve e não concatenação de strings?

O instrutor Rodrigo enfatiza um ponto crucial: dependendo do sistema operacional, o separador de diretórios muda. No Linux/Mac é `/` (barra normal), no Windows pode ser `\` (barra invertida). Se você escrever manualmente `"../../tmp"`, pode funcionar no seu sistema mas quebrar em outro.

O `path.resolve` do Node.js resolve isso automaticamente. Ele constrói o caminho absoluto correto independente do SO. O `__dirname` fornece o diretório atual do arquivo como ponto de partida, e o `path.resolve` navega a partir dele.

Exemplo mental do instrutor:
- Arquivo está em `src/configs/upload.ts`
- `..` volta para `src/`
- `..` de novo volta para a raiz do projeto
- `tmp` entra na pasta temporária

## Fluxo tmp → uploads: por que duas pastas?

O instrutor explica que o arquivo primeiro vai para a pasta temporária (`TMP_FOLDER`). Isso é intencional:

1. **Recepção**: Multer salva o arquivo em `tmp/`
2. **Manipulação**: Você pode renomear, redimensionar, validar, converter
3. **Promoção**: Só depois de processado, o arquivo vai para `uploads/`

Isso evita que arquivos corrompidos, inválidos ou não processados fiquem na pasta final. É um padrão de staging — similar a como o git tem staging area antes do commit.

## Por que gerar hash para o nome do arquivo?

O instrutor destaca dois motivos:

1. **Evitar sobreposição**: Se dois usuários enviam `foto.jpg`, sem hash um sobrescreveria o outro. Com hash: `a1b2c3d4e5-foto.jpg` e `f6g7h8i9j0-foto.jpg` — únicos.

2. **Padronização**: O nome original pode conter caracteres especiais, espaços, acentos. O hash garante um prefixo limpo e previsível.

O `randomBytes(10).toString("hex")` gera 20 caracteres hexadecimais (cada byte = 2 hex chars), o que dá 16^20 combinações possíveis — colisão virtualmente impossível.

## Multer como middleware

O instrutor explica que o Multer é um **middleware**. Ele se encaixa entre a requisição e o controller. Quando uma rota recebe um arquivo, o Multer intercepta, salva no disco conforme a configuração, e disponibiliza os metadados do arquivo no objeto `request`.

O `diskStorage` especificamente salva no disco local (diferente de `memoryStorage` que mantém em buffer na RAM). Para APIs que processam o arquivo antes de enviar para cloud storage, `diskStorage` com pasta temporária é o padrão recomendado.

## Constantes em MAIÚSCULA

O instrutor cria todas as configurações como constantes em maiúscula (`TMP_FOLDER`, `UPLOADS_FOLDER`, `FILE_SIZE`, etc.) porque são **valores de referência** que não mudam durante a execução. É uma convenção que sinaliza imutabilidade e importância — qualquer desenvolvedor que ler o código entende que são configurações globais.

## Sobre versões do Multer

O instrutor chama atenção para a versão específica: `multer@1.4.5-lts.1`. O sufixo `-lts` indica Long Term Support. Ele recomenda usar exatamente esta versão para evitar incompatibilidades, e mostra como verificar a versão mais recente no npm.

A tipagem (`@types/multer@1.4.12`) é instalada como devDependency (`-D`) porque só é necessária durante desenvolvimento — em produção, o TypeScript já foi compilado para JavaScript.
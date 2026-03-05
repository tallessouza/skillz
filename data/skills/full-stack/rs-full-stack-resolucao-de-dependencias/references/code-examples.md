# Code Examples: Resolucao de Dependencias

## Exemplo 1: package.json com til (~)

Contexto do instrutor: recorte de um package.json mostrando o til.

```json
{
  "dependencies": {
    "package-name": "~4.17.20"
  }
}
```

**O que acontece:** O NPM permite atualizacoes automaticas de `4.17.20` para `4.17.21`, `4.17.22`, etc. Nunca atualiza para `4.18.0`.

**Quando usar:** Quando voce quer apenas correcoes de bugs automaticas e nenhuma funcionalidade nova.

## Exemplo 2: package.json com circunflexo (^)

```json
{
  "dependencies": {
    "package-name": "^4.17.20"
  }
}
```

**O que acontece:** O NPM permite atualizacoes para qualquer versao `4.x.x` — patches e minor updates. Nunca atualiza para `5.0.0`.

**Quando usar:** Padrao recomendado para a maioria dos pacotes. E o comportamento padrao quando voce roda `npm install pacote`.

## Exemplo 3: Instalacao com versao fixa via @

```bash
npm install dayjs@1.11.10
```

**O que acontece:** Instala exatamente a versao `1.11.10` do dayjs.

**Resultado no package.json:**
```json
{
  "dependencies": {
    "dayjs": "^1.11.10"
  }
}
```

Nota: O npm adiciona `^` por padrao. Para fixar sem simbolo, use `--save-exact`:

```bash
npm install dayjs@1.11.10 --save-exact
```

**Resultado:**
```json
{
  "dependencies": {
    "dayjs": "1.11.10"
  }
}
```

## Exemplo 4: Comparacao lado a lado

```json
{
  "dependencies": {
    "lib-conservadora": "~2.3.1",
    "lib-moderada": "^2.3.1",
    "lib-fixa": "2.3.1"
  }
}
```

| Dependencia | Aceita | Nao aceita |
|-------------|--------|------------|
| `~2.3.1` | `2.3.2`, `2.3.9` | `2.4.0`, `3.0.0` |
| `^2.3.1` | `2.3.2`, `2.4.0`, `2.99.0` | `3.0.0` |
| `2.3.1` | Nada — so essa versao | Qualquer outra |

## Exemplo 5: Versionando seu proprio pacote

```json
{
  "name": "meu-pacote",
  "version": "1.0.0"
}
```

| Mudanca feita | Nova versao | Porque |
|---------------|-------------|--------|
| Corrigiu bug no calculo | `1.0.1` | PATCH — correcao compativel |
| Adicionou novo endpoint | `1.1.0` | MINOR — funcionalidade nova compativel |
| Mudou formato do response | `2.0.0` | MAJOR — quebra compatibilidade |

## Exemplo 6: Pre-1.0 (edge case)

```json
{
  "dependencies": {
    "nova-lib": "^0.2.3"
  }
}
```

**Atencao:** Em versoes `0.x`, o `^` se comporta como `~`:
- Aceita: `0.2.4`, `0.2.5`
- Nao aceita: `0.3.0`

Isso porque o semver trata `0.x` como instavel — qualquer minor pode ter breaking changes.
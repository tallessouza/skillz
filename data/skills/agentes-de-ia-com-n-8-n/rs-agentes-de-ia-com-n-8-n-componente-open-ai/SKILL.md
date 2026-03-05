---
name: rs-agentes-ia-n8n-componente-open-ai
description: "Applies correct usage of the n8n OpenAI node for direct API calls when building automation workflows. Use when user asks to 'call OpenAI API', 'generate image in n8n', 'text to speech n8n', 'upload file openai', 'use OpenAI node', or 'connect n8n to ChatGPT'. Guides resource selection (text, image, audio, file) and model configuration. Make sure to use this skill whenever configuring the OpenAI node in n8n workflows. Not for the AI Agent node, LangChain components, or building agentic workflows."
---

# Componente OpenAI no n8n

> O no OpenAI e uma chamada direta de API — nao e um agente de IA. Selecione o resource correto (text, image, audio, file) e configure modelo e prompt.

## Conceito central

O no OpenAI no n8n faz chamadas diretas a API da OpenAI. E equivalente a usar o ChatGPT manualmente: envia prompt, recebe resposta. Nao tem raciocinio autonomo, nao tem tools, nao tem memoria — e uma chamada de API pura.

## Resources disponiveis

### 1. Text (Message a Model)
```
Resource: Text
Operation: Message a Model
Model: gpt-4, gpt-3.5-turbo, etc.
Messages: Add Message → role (user/system/assistant) + content
```

**Quando usar:** Classificacao de texto, resumo, extracao, qualquer tarefa que voce faria no ChatGPT.

### 2. Image (Generate)
```
Resource: Image
Operation: Create
Prompt: "crie uma imagem de um cachorro surfando"
Model: dall-e-3
```

**Quando usar:** Geracao de imagens via DALL-E.

### 3. Audio
```
Resource: Audio
Operation: Generate (TTS) | Transcribe | Translate
Voice: alloy, echo, fable, onyx, nova, shimmer
Speed: customizavel
```

**Quando usar:** Text-to-speech (TTS), transcricao de gravacoes, traducao de audio.

### 4. File
```
Resource: File
Operation: Upload | Delete
Purpose: assistants | fine-tuning
```

**Quando usar:** Upload de arquivos para Assistants da OpenAI ou para fine-tuning de modelos customizados.

## Heuristics

| Situacao | Acao |
|----------|------|
| Precisa de resposta de texto simples | Resource: Text, selecione modelo, add message com role user |
| Precisa gerar imagem | Resource: Image, coloque prompt descritivo |
| Precisa converter texto em voz | Resource: Audio, operation TTS, selecione voice |
| Precisa transcrever audio | Resource: Audio, operation Transcribe |
| Precisa treinar modelo customizado | Resource: File, purpose fine-tuning, upload dados |
| Precisa de raciocinio autonomo com tools | NAO use este no — use o AI Agent node |

## Anti-patterns

| Nunca faca | Faca em vez disso |
|------------|-------------------|
| Usar no OpenAI para criar agente com tools | Usar no AI Agent (LangChain) |
| Confundir OpenAI node com Assistant node | OpenAI = API direta, Assistant = comportamento diferente |
| Esquecer de selecionar o modelo | Sempre configure o modelo explicitamente |
| Usar text resource para gerar imagem | Selecione o resource Image |
| Enviar prompt sem definir role | Sempre defina role: user, system, ou assistant |

## Deep reference library

- [deep-explanation.md](references/deep-explanation.md) — Raciocínio completo do instrutor, analogias e edge cases
- [code-examples.md](references/code-examples.md) — Todos os exemplos de código expandidos com variações

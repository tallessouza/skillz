# Code Examples: Introducao ao CASL

## Exemplo basico da documentacao oficial (mostrado na aula)

```typescript
import { defineAbility } from '@casl/ability'

const ability = defineAbility((can) => {
  can('read', ['Post', 'Comment'])
  can('manage', 'Post', { authorId: 'me' })
  can('create', 'Comment')
})

// Checagem
ability.can('read', 'Post')    // true
ability.can('delete', 'Post')  // depende — true se authorId === 'me'
ability.can('update', 'User')  // false — nao foi definido, deny-by-default
```

## Setup com TypeScript e AbilityBuilder

```typescript
import { AbilityBuilder, createMongoAbility, MongoAbility } from '@casl/ability'

// Definir types para Actions e Subjects
type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage'
type Subjects = 'Post' | 'Comment' | 'User' | 'Organization' | 'all'
type AppAbility = MongoAbility<[Actions, Subjects]>

// Definir permissoes por role
function defineAbilitiesFor(user: { id: string; role: string }) {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(createMongoAbility)

  switch (user.role) {
    case 'admin':
      can('manage', 'all')
      cannot('delete', 'Organization') // admin pode tudo, menos deletar org
      break

    case 'member':
      can('read', ['Post', 'Comment'])
      can('create', ['Post', 'Comment'])
      can('manage', 'Post', { authorId: user.id })    // CRUD no proprio post
      can('manage', 'Comment', { authorId: user.id })  // CRUD no proprio comentario
      break

    case 'viewer':
      can('read', ['Post', 'Comment'])
      break
  }

  return build()
}
```

## Usando no frontend (React)

```typescript
// Construir ability para o usuario logado
const ability = defineAbilitiesFor(currentUser)

// Em um componente
function PostActions({ post }: { post: Post }) {
  return (
    <div>
      {ability.can('update', subject('Post', post)) && (
        <button>Editar</button>
      )}
      {ability.can('delete', subject('Post', post)) && (
        <button>Deletar</button>
      )}
    </div>
  )
}
```

## Usando no backend (Node/Express)

```typescript
// Middleware de autorizacao
function authorize(action: Actions, subjectType: Subjects) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ability = defineAbilitiesFor(req.user)

    if (ability.cannot(action, subjectType)) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    next()
  }
}

// Nas rotas
app.delete('/posts/:id', authorize('delete', 'Post'), async (req, res) => {
  // Checagem adicional com instancia (conditions)
  const post = await postRepository.findById(req.params.id)
  const ability = defineAbilitiesFor(req.user)

  if (ability.cannot('delete', subject('Post', post))) {
    return res.status(403).json({ error: 'Voce nao pode deletar este post' })
  }

  await postRepository.delete(post.id)
  return res.status(204).send()
})
```

## Exemplo de Fields (permissao granular por campo)

```typescript
const { can, build } = new AbilityBuilder(createMongoAbility)

// Usuario pode atualizar apenas a descricao do artigo, nao o titulo
can('update', 'Article', ['description', 'content'])

const ability = build()

ability.can('update', 'Article', 'description')  // true
ability.can('update', 'Article', 'title')         // false
```

## Exemplo de Conditions com sintaxe MongoDB

```typescript
const { can, build } = new AbilityBuilder(createMongoAbility)

// Usuario pode ler artigos publicados
can('read', 'Article', { published: true })

// OU artigos nao publicados que estao compartilhados com ele
can('read', 'Article', {
  published: false,
  sharedWith: { $in: [user.id] }
})

const ability = build()
```

## Separacao CASL vs Backend — exemplo completo

```typescript
// ============ CASL (autorizacao macro) ============
function defineAbilitiesFor(user: User) {
  const { can, build } = new AbilityBuilder(createMongoAbility)

  // Macro: usuario pode gerenciar seus proprios tweets
  can('manage', 'Tweet', { authorId: user.id })
  can('read', 'Tweet') // qualquer um pode ler

  return build()
}

// ============ Backend (regras de negocio) ============
class UpdateTweetUseCase {
  async execute(tweetId: string, userId: string, data: UpdateTweetDTO) {
    const tweet = await this.tweetRepository.findById(tweetId)

    // 1. Checagem CASL — autorizacao
    const ability = defineAbilitiesFor({ id: userId, role: 'member' })
    if (ability.cannot('update', subject('Tweet', tweet))) {
      throw new ForbiddenError('Sem permissao para editar este tweet')
    }

    // 2. Regra de negocio — no dominio, NAO no CASL
    if (tweet.likesCount > 0) {
      throw new BusinessRuleError('Tweet com likes nao pode ser editado')
    }

    if (tweet.createdAt < subDays(new Date(), 3)) {
      throw new BusinessRuleError('Tweet criado ha mais de 3 dias nao pode ser editado')
    }

    return this.tweetRepository.update(tweetId, data)
  }
}
```
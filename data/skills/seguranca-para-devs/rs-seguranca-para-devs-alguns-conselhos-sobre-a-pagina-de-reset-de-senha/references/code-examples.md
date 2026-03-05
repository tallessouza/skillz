# Code Examples: Seguranca na Pagina de Reset de Senha

## Rate Limit com Backoff Progressivo

```typescript
import rateLimit from "express-rate-limit";

// Rate limit basico
const resetPasswordLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    res.status(429).json({
      error: "Muitas tentativas de reset. Tente novamente em alguns minutos.",
    });
  },
});

// Backoff progressivo (implementacao manual)
const resetAttempts = new Map<string, { count: number; lastAttempt: Date }>();

function getBackoffDelay(attemptCount: number): number {
  if (attemptCount <= 5) return 0;
  if (attemptCount <= 10) return 60 * 1000;       // 1 minuto
  if (attemptCount <= 15) return 10 * 60 * 1000;  // 10 minutos
  return 60 * 60 * 1000;                           // 1 hora
}

async function checkRateLimit(ip: string): Promise<{ allowed: boolean; retryAfterMs?: number }> {
  const record = resetAttempts.get(ip);
  if (!record) {
    resetAttempts.set(ip, { count: 1, lastAttempt: new Date() });
    return { allowed: true };
  }

  const delay = getBackoffDelay(record.count);
  const elapsed = Date.now() - record.lastAttempt.getTime();

  if (elapsed < delay) {
    return { allowed: false, retryAfterMs: delay - elapsed };
  }

  record.count++;
  record.lastAttempt = new Date();
  return { allowed: true };
}
```

## Formulario Frontend com Confirmacao de Senha

```tsx
// React component para reset de senha
function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [requiresMfa, setRequiresMfa] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      setError("As senhas nao conferem.");
      return;
    }

    const response = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password, passwordConfirmation, mfaCode }),
    });

    const data = await response.json();

    if (data.requireMfa) {
      setRequiresMfa(true);
      return;
    }

    if (!response.ok) {
      setError(data.error);
      return;
    }

    // Redireciona para login — NAO autentica automaticamente
    window.location.href = data.redirectTo;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="password"
        placeholder="Nova senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirme a nova senha"
        value={passwordConfirmation}
        onChange={(e) => setPasswordConfirmation(e.target.value)}
        required
      />
      {requiresMfa && (
        <input
          type="text"
          placeholder="Codigo MFA"
          value={mfaCode}
          onChange={(e) => setMfaCode(e.target.value)}
          required
        />
      )}
      {error && <p className="error">{error}</p>}
      <button type="submit">Redefinir senha</button>
    </form>
  );
}
```

## Handler Completo do Backend

```typescript
async function resetPasswordHandler(req: Request, res: Response) {
  const { token, password, passwordConfirmation, mfaCode } = req.body;

  // 1. Validar token
  const resetRecord = await findValidResetToken(token);
  if (!resetRecord) {
    return res.status(400).json({ error: "Token invalido ou expirado" });
  }

  const user = await findUserById(resetRecord.userId);

  // 2. Verificar MFA se ativo
  if (user.mfaEnabled) {
    if (!mfaCode) {
      return res.status(400).json({
        error: "Codigo MFA obrigatorio",
        requireMfa: true,
      });
    }
    const mfaValid = await verifyTotpCode(user.mfaSecret, mfaCode);
    if (!mfaValid) {
      return res.status(401).json({ error: "Codigo MFA invalido" });
    }
  }

  // 3. Validar confirmacao de senha
  if (password !== passwordConfirmation) {
    return res.status(400).json({ error: "As senhas nao conferem" });
  }

  // 4. Atualizar senha
  const hashedPassword = await bcrypt.hash(password, 12);
  await updateUserPassword(user.id, hashedPassword);

  // 5. Invalidar token de reset (uso unico)
  await invalidateResetToken(token);

  // 6. Notificar usuario por e-mail
  await sendEmail({
    to: user.email,
    subject: "Sua senha foi alterada",
    body: `Sua senha foi alterada em ${new Date().toISOString()}.
           Se voce nao fez essa alteracao, entre em contato imediatamente.`,
  });

  // 7. Invalidar todas as sessoes ativas
  await invalidateAllUserSessions(user.id);

  // 8. Redirecionar para login (NAO autenticar)
  return res.json({
    message: "Senha alterada com sucesso. Faca login com sua nova senha.",
    redirectTo: "/login",
  });
}
```

## Invalidacao de Sessoes

```typescript
// Se usando JWT com blacklist
async function invalidateAllUserSessions(userId: string) {
  // Incrementar versao do token do usuario — invalida todos os JWTs anteriores
  await db.user.update({
    where: { id: userId },
    data: { tokenVersion: { increment: 1 } },
  });
}

// Se usando sessoes em banco/Redis
async function invalidateAllUserSessions(userId: string) {
  await redis.del(`sessions:${userId}:*`);
  // ou
  await db.session.deleteMany({ where: { userId } });
}
```

## E-mail de Notificacao

```typescript
async function sendPasswordChangedEmail(userEmail: string) {
  await sendEmail({
    to: userEmail,
    subject: "Alerta de seguranca: sua senha foi alterada",
    html: `
      <h2>Sua senha foi alterada</h2>
      <p>A senha da sua conta foi alterada em ${new Date().toLocaleString("pt-BR")}.</p>
      <p><strong>Se voce nao fez essa alteracao:</strong></p>
      <ol>
        <li>Acesse sua conta imediatamente e altere a senha</li>
        <li>Ative a autenticacao de dois fatores (MFA)</li>
        <li>Entre em contato com nosso suporte</li>
      </ol>
      <p>Se foi voce, pode ignorar este e-mail.</p>
    `,
  });
}
```
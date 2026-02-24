# Runbook de Produção

## Segurança

### Headers de Segurança (vercel.json)

| Header                      | Valor                                 | Proteção                   |
| --------------------------- | ------------------------------------- | -------------------------- |
| `X-Content-Type-Options`    | `nosniff`                             | Previne MIME sniffing      |
| `X-Frame-Options`           | `DENY`                                | Previne clickjacking       |
| `X-XSS-Protection`          | `1; mode=block`                       | Proteção XSS legada        |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | Força HTTPS (HSTS)         |
| `Content-Security-Policy`   | `default-src 'self'; ...`             | Previne injeção de scripts |
| `Referrer-Policy`           | `strict-origin-when-cross-origin`     | Controla header Referer    |

### Content Security Policy (CSP)

```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self'
```

**Nota:** `unsafe-inline` e `unsafe-eval` são necessários para Next.js funcionar corretamente.

### Proteções de Tenant

| Medida              | Implementação                                 |
| ------------------- | --------------------------------------------- |
| Whitelist           | Apenas tenant IDs pré-cadastrados são aceitos |
| Sanitização         | `tenant.replace(/[^a-z0-9-]/gi, "")`          |
| Cookie HttpOnly     | JavaScript não acessa o cookie                |
| Cookie Secure       | Apenas HTTPS em produção                      |
| SameSite=Strict     | Previne CSRF                                  |
| Sem info disclosure | Erros não expõem lista de tenants válidos     |

### Verificar Headers

```bash
# Verificar headers de segurança
curl -I https://seu-projeto.vercel.app

# Deve mostrar:
# x-content-type-options: nosniff
# x-frame-options: DENY
# strict-transport-security: max-age=31536000; includeSubDomains
# content-security-policy: default-src 'self'; ...
```

---

## Admin Page (CMS)

### Acesso Local

```bash
# Editar tenant-a
http://localhost:3000/admin?tenant=tenant-a

# Editar tenant-b
http://localhost:3000/admin?tenant=tenant-b
```

### Producao

**IMPORTANTE:** A pagina `/admin` nao possui autenticacao no exemplo.
Em producao, adicionar uma das opcoes:

1. **Autenticacao via middleware** - Verificar sessao antes de renderizar
2. **Proteger rota no edge** - Usar Vercel Edge Middleware
3. **Remover da build de producao** - Se nao for necessario CMS publico

### API

| Endpoint            | Metodo | Descricao                      |
| ------------------- | ------ | ------------------------------ |
| `/api/admin/config` | GET    | Retorna config do tenant atual |
| `/api/admin/config` | PUT    | Salva alteracoes no JSON       |

---

## Como Adicionar um Novo Tenant

### 1. Criar arquivo de configuração

Crie um novo arquivo em `cms/tenants/{tenant-id}.json`:

```json
{
  "id": "novo-tenant",
  "name": "Nome da Empresa",
  "logo": "/logos/novo-tenant.svg",
  "theme": {
    "primaryColor": "#hexcolor",
    "secondaryColor": "#hexcolor",
    "backgroundColor": "#ffffff",
    "textColor": "#171717",
    "borderRadius": "0.5rem"
  }
}
```

### 2. Adicionar à whitelist

Edite `apps/shell/src/lib/tenant.ts`:

```typescript
const ALLOWED_TENANTS = new Set([
  "tenant-a",
  "tenant-b",
  "default",
  "novo-tenant", // Adicionar aqui
]);
```

### 3. Configurar DNS (produção)

Adicione um CNAME no seu provedor DNS:

- Tipo: `CNAME`
- Nome: `novo-tenant`
- Conteúdo: `cname.vercel-dns.com`

### 4. Adicionar domínio no Vercel

1. Acesse Project Settings → Domains
2. Adicione: `novo-tenant.seu-dominio.com`

---

## Troubleshooting

### Tenant não está sendo resolvido

**Sintomas**: Usuário vê o tenant "default" ao invés do esperado.

**Verificações**:

1. Verifique se o tenant está na whitelist
2. Verifique se o arquivo JSON existe em `cms/tenants/`
3. Verifique se o DNS está configurado corretamente
4. Verifique se o cookie não está definido com outro tenant

**Comandos úteis**:

```bash
# Verificar DNS
dig tenant-a.seu-dominio.com

# Verificar cookie no navegador
# DevTools → Application → Cookies → shipay_tenant
```

### Tema não está sendo aplicado

**Sintomas**: Cores padrão aparecem ao invés das cores do tenant.

**Verificações**:

1. Inspecione as CSS Variables no DevTools
2. Verifique se o ThemeProvider está envolvendo o componente
3. Verifique se o JSON do tenant tem o campo `theme` correto

### Build falhando

**Sintomas**: CI/CD falha na etapa de build.

**Verificações**:

```bash
# Rodar localmente
pnpm install
pnpm build

# Verificar TypeScript
pnpm -r exec tsc --noEmit

# Verificar lint
pnpm -r lint
```

---

## Health Checks

### Endpoints de verificação

| Endpoint            | Esperado | Verifica             |
| ------------------- | -------- | -------------------- |
| `/`                 | 200 OK   | Página principal     |
| `/admin`            | 200 OK   | Página admin (CMS)   |
| `/api/tenant`       | 200 JSON | API de tenant        |
| `/api/admin/config` | 200 JSON | API de config        |
| `/demo`             | 200 OK   | Demo dos componentes |

### Script de verificação

```bash
#!/bin/bash
BASE_URL="https://seu-projeto.vercel.app"

# Verificar endpoint principal
curl -s -o /dev/null -w "%{http_code}" "$BASE_URL" | grep -q "200" && echo "✅ Main page OK" || echo "❌ Main page FAILED"

# Verificar API
curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/tenant" | grep -q "200" && echo "✅ API OK" || echo "❌ API FAILED"

# Verificar tenants (via query param)
for tenant in tenant-a tenant-b; do
  curl -s -o /dev/null -w "%{http_code}" "$BASE_URL?tenant=$tenant" | grep -q "200" && echo "✅ $tenant OK" || echo "❌ $tenant FAILED"
done
```

---

## Métricas e Monitoramento

### Vercel Analytics

Acessar: https://vercel.com/[org]/[project]/analytics

### Logs

```bash
# Ver logs em tempo real
vercel logs --follow

# Ver logs de um deploy específico
vercel logs [deployment-url]
```

---

## Rollback

### Via Vercel Dashboard

1. Acesse Deployments
2. Encontre o deploy anterior funcionando
3. Clique em "..." → "Promote to Production"

### Via CLI

```bash
# Listar deploys
vercel ls

# Promover deploy específico
vercel promote [deployment-url]
```

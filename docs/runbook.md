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
curl -I https://shipay.emanuel.app.br

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
http://shipay.emanuel.app.br/admin?tenant=tenant-a

# Editar tenant-b
http://shipay.emanuel.app.br/admin?tenant=tenant-b
```

### Producao

**IMPORTANTE:** A pagina `/admin` nao possui autenticacao no exemplo.
Em producao, deve existir uma das opcoes:

1. **Autenticacao via middleware** - Verificar sessao antes de renderizar
2. **Proteger rota no edge** - Usar Vercel Edge Middleware
3. **Remover da build de producao** - Se nao for necessario CMS publico

### API (arquitetura)

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

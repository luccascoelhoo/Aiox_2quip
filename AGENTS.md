# AGENTS.md - 2quip Intelligence Architecture

Este arquivo configura o comportamento esperado de agentes no ecossistema 2quip AIOX.

## Constitution

Siga `.aiox-core/2quip-constitution.md` como fonte de verdade (supersede `constitution.md` v1):
- Intelligence Architecture First
- CLI First
- Agent Authority
- Profissão-Agnóstico by Design
- Cognitive Self-Sustainability
- Story-Driven Development
- No Invention
- Quality First
- Absolute Imports

## Memory Protocol

Todo agente DEVE seguir `docs/2QUIP-MEMORY-PROTOCOL.md`:
- Consultar Pattern Learner ANTES de cada tarefa
- Executar `*memory-sync` ao final de cada sessão
- Registrar componentes novos via `*ids register`

## Workflow Obrigatorio

1. Inicie por uma story em `docs/stories/`
2. Implemente apenas o que os acceptance criteria pedem
3. Atualize checklist (`[ ]` -> `[x]`) e file list
4. Execute quality gates antes de concluir

## Quality Gates

```bash
npm run lint
npm run typecheck
npm test
```

## Estrutura Principal

- Core framework: `.aiox-core/`
- CLI: `bin/`
- Pacotes: `packages/`
- Testes: `tests/`
- Documentacao: `docs/`

## IDE/Agent Sync

- Sincronizar regras/agentes: `npm run sync:ide`
- Validar drift: `npm run sync:ide:check`
- Rodar paridade multi-IDE (Claude/Codex/Gemini): `npm run validate:parity`
- Sync Claude Code: `npm run sync:ide:claude`
- Sincronizar Gemini CLI: `npm run sync:ide:gemini`
- Validar Codex sync/integration: `npm run validate:codex-sync && npm run validate:codex-integration`
- Gerar skills locais do Codex: `npm run sync:skills:codex`
- Este repositorio usa **local-first**: prefira `.codex/skills` versionado no projeto
- Use `sync:skills:codex:global` apenas para testes fora deste repo

## Agent Shortcuts (Codex)

Preferencia de ativacao no Codex CLI:
1. Use `/skills` e selecione `aiox-<agent-id>` vindo de `.codex/skills` (ex.: `aiox-architect`)
2. Se preferir, use os atalhos abaixo (`@architect`, `/architect`, etc.)

Quando a mensagem do usuario for um atalho de agente, carregue o arquivo correspondente em `.aiox-core/development/agents/` (fallback: `.codex/agents/`), renderize o greeting via `generate-greeting.js` e assuma a persona ate receber `*exit`.

Atalhos aceitos por agente:

**Orchestration:**
- `@aiox-master`, `/aiox-master`, `/aiox-master.md` -> `.aiox-core/development/agents/aiox-master.md` (Orion Prime)

**Tech Core Squad:**
- `@architect`, `/architect`, `/architect.md` -> `.aiox-core/development/agents/architect.md`
- `@dev`, `/dev`, `/dev.md` -> `.aiox-core/development/agents/dev.md`
- `@devops`, `/devops`, `/devops.md` -> `.aiox-core/development/agents/devops.md`
- `@data-engineer`, `/data-engineer`, `/data-engineer.md` -> `.aiox-core/development/agents/data-engineer.md`
- `@qa`, `/qa`, `/qa.md` -> `.aiox-core/development/agents/qa.md`

**Product Squad:**
- `@pm`, `/pm`, `/pm.md` -> `.aiox-core/development/agents/pm.md`
- `@po`, `/po`, `/po.md` -> `.aiox-core/development/agents/po.md`
- `@sm`, `/sm`, `/sm.md` -> `.aiox-core/development/agents/sm.md`
- `@analyst`, `/analyst`, `/analyst.md` -> `.aiox-core/development/agents/analyst.md`

**Creative Squad:**
- `@ux-design-expert`, `/ux-design-expert`, `/ux-design-expert.md` -> `.aiox-core/development/agents/ux-design-expert.md`
- `@copywriter`, `/copywriter`, `/copywriter.md` -> `.aiox-core/development/agents/copywriter.md` (Versa)

**Strategic Squad:**
- `@strategist`, `/strategist`, `/strategist.md` -> `.aiox-core/development/agents/strategist.md` (Stratton)

**Security Squad:**
- `@hacker`, `/hacker`, `/hacker.md` -> `.aiox-core/development/agents/hacker.md` (Cipher)

**Utility:**
- `@squad-creator`, `/squad-creator`, `/squad-creator.md` -> `.aiox-core/development/agents/squad-creator.md`

Resposta esperada ao ativar atalho:
1. Confirmar agente ativado
2. Mostrar 3-6 comandos principais (`*help`, etc.)
3. Seguir na persona do agente

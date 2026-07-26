create table if not exists public.solicitacoes_atendimento (
    id uuid primary key default gen_random_uuid(),
    nome text not null,
    email text not null,
    interesse text,
    mensagem text,
    status text not null default 'pendente',
    criado_em timestamptz not null default now(),
    atualizado_em timestamptz not null default now(),
    constraint solicitacoes_atendimento_status_check
        check (status in ('pendente', 'autorizada', 'arquivada'))
);

create index if not exists idx_solicitacoes_atendimento_status_criado
on public.solicitacoes_atendimento (status, criado_em desc);

alter table public.solicitacoes_atendimento enable row level security;

drop policy if exists "solicitacoes_atendimento_insert_publico" on public.solicitacoes_atendimento;
create policy "solicitacoes_atendimento_insert_publico"
on public.solicitacoes_atendimento
for insert
to anon, authenticated
with check (status = 'pendente');

drop policy if exists "solicitacoes_atendimento_admin_select" on public.solicitacoes_atendimento;
create policy "solicitacoes_atendimento_admin_select"
on public.solicitacoes_atendimento
for select
to authenticated
using (true);

drop policy if exists "solicitacoes_atendimento_admin_update" on public.solicitacoes_atendimento;
create policy "solicitacoes_atendimento_admin_update"
on public.solicitacoes_atendimento
for update
to authenticated
using (true)
with check (status in ('pendente', 'autorizada', 'arquivada'));

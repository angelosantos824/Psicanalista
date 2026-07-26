-- Correcoes para permitir que o formulario publico de anamnese grave em pacientes.
-- Execute este arquivo no SQL Editor do Supabase.
--
-- Observacao importante:
-- este projeto usa login do paciente feito no frontend, nao Supabase Auth.
-- Por isso, o envio da anamnese chega ao banco como role "anon".

alter table public.pacientes
add column if not exists anamnese_completa jsonb,
add column if not exists anamnese jsonb,
add column if not exists nascimento date,
add column if not exists idade integer,
add column if not exists morada text;

alter table public.pacientes enable row level security;

drop policy if exists "pacientes_anamnese_select_publico" on public.pacientes;
create policy "pacientes_anamnese_select_publico"
on public.pacientes
for select
to anon
using (true);

drop policy if exists "pacientes_anamnese_update_publico" on public.pacientes;
create policy "pacientes_anamnese_update_publico"
on public.pacientes
for update
to anon
using (true)
with check (true);

drop policy if exists "pacientes_admin_acesso_total" on public.pacientes;
create policy "pacientes_admin_acesso_total"
on public.pacientes
for all
to authenticated
using (true)
with check (true);

grant select on public.pacientes to anon;
grant update on public.pacientes to anon;
grant select, insert, update, delete on public.pacientes to authenticated;

notify pgrst, 'reload schema';

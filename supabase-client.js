const SUPABASE_URL = 'https://ztxidiebqcydcdhnjvvc.supabase.co';
const SUPABASE_PUBLIC_KEY = 'sb_publishable_54DeRkbOo3SwBZSXZawFiA_i6FEnBqg';

// Chave publica anonima do Supabase. Mantenha as regras RLS configuradas
// no painel do Supabase e nunca coloque service role key no frontend.
if (!window.supabase) {
    console.error('Biblioteca Supabase nao encontrada. Confira o script CDN antes deste arquivo.');
    alert('Erro ao carregar a conexao com o Supabase. Recarregue a pagina ou verifique a internet.');
} else {
    window._supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
}

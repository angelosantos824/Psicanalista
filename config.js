// 1. Defina as constantes primeiro
const supabaseUrl = 'https://ztxidiebqcydcdhnjvvc.supabase.co';
const supabaseKey = 'sb_publishable_54DeRkbOo3SwBZSXZawFiA_i6FEnBqg';

// 2. Use as constantes dentro do createClient
// Certifique-se de que o script do Supabase está no seu HTML antes deste arquivo!
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);
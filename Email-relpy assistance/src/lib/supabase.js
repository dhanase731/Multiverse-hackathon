import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://sbcbuslrwwsntezxmpil.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_tDlXihbEgbBAFlvrIru8SA_Xtoj3jVn'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

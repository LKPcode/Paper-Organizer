import { createClient } from '@supabase/supabase-js'


const url = "https://bnpeplqscmasqlamkpey.supabase.co"
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJucGVwbHFzY21hc3FsYW1rcGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODYzMTQ5NzMsImV4cCI6MjAwMTg5MDk3M30.-gJzW2XHLVFJwWht67YYQ_l-XklLPirSdjauknFnTZo"

export const supabase = createClient(
  url,
  key
)



import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

async function inspectShop() {
    console.log('Checking shop_items...')
    const { data, error } = await supabase.from('shop_items').select('*')
    if (error) {
        console.error('Error:', error)
    } else {
        console.log('Items found:', data.length)
        console.log(JSON.stringify(data, null, 2))
    }
}

inspectShop()

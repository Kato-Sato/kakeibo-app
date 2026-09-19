import { supabase } from "@/lib/supabase";

export type Card = {
    id: number;
    name: string;
    payment_account_id: number;
}

export async function loadCards() {
    const { data, error } = await supabase
        .from("cards")
        .select("id, name, payment_account_id")
        .order("id");
    if (error) throw error;
    return (data as Card[]) ?? [];
}
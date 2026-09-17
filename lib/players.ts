import {supabase} from "@/lib/supabase";

export type Player = {
    id: string;
    name: string;
    role: string;
    latitude: number;
    longitude: number;
};

export async function joinGame(name: string) {
    const { data, error } = await supabase
        .from('players')
        .insert([
            {
                name,
                role: 'runner',
                latitude: 35.681236,
                longitude: 139.767125,
            },
        ])
        .select()
        .single();
    if (error) throw error;
    return data as Player;
}

export async function leaveGame(id: string) {
    const { data, error } = await supabase
        .from('players')
        .delete()
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data as Player;
}

export async function fetchPlayer(id: string){
    const { data, error } = await supabase
        .from('players')
        .select('id, name')
        .eq('id', id)
        .single();
    if (error) return null;
    return data as { id: string; name: string };
}

export async function updateLocation(id: string, lat: number, lng: number) {
    const { error } = await supabase
        .from('players')
        .update({
            latitude: lat,
            longitude: lng,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id);
    if(error) throw error;
}
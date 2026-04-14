import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Supabase Error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    let result;
    if (id) {
      // Upsert: update if id exists, or insert if not
      // Note: In Supabase, upsert requires the primary key or a unique constraint.
      // We'll use the 'id' field as the identifier.
      const { data: project, error } = await supabase
        .from('projects')
        .upsert({ id, ...updateData })
        .select()
        .single();

      if (error) throw error;
      result = project;
    } else {
      const { data: project, error } = await supabase
        .from('projects')
        .insert([updateData])
        .select()
        .single();

      if (error) throw error;
      result = project;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Supabase Error:', error);
    return NextResponse.json({ error: 'Failed to save project' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Supabase Error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}




import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src/data/projects.json');

export async function GET() {
  try {
    const jsonData = fs.readFileSync(dataFilePath, 'utf8');
    const projects = JSON.parse(jsonData);
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read projects data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const updatedProject = await request.json();
    const jsonData = fs.readFileSync(dataFilePath, 'utf8');
    let projects = JSON.parse(jsonData);

    const index = projects.findIndex((p) => p.id === updatedProject.id);
    if (index !== -1) {
      projects[index] = updatedProject;
    } else {
      projects.push(updatedProject);
    }

    fs.writeFileSync(dataFilePath, JSON.stringify(projects, null, 2));
    return NextResponse.json(updatedProject);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update projects data' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    const jsonData = fs.readFileSync(dataFilePath, 'utf8');
    let projects = JSON.parse(jsonData);

    projects = projects.filter((p) => p.id !== id);

    fs.writeFileSync(dataFilePath, JSON.stringify(projects, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}


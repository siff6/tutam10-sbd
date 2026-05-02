import connectDB from '@/lib/mongodb';
import Todo from '@/models/Todo'; 
import { NextResponse } from 'next/server';

export async function GET() {
  await connectDB();
  const todos = await Todo.find({});
  return NextResponse.json(todos);
}

export async function POST(request) {
  await connectDB();
  const { text } = await request.json();
  const newTodo = await Todo.create({ text });
  return NextResponse.json(newTodo, { status: 201 });
}
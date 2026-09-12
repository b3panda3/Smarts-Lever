import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { callGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { userId, message, lessonId, userLanguage } = await req.json();

    if (!userId || !message) {
      return NextResponse.json(
        { error: 'userId and message are required' },
        { status: 400 }
      );
    }

    // Save user message
    const userMsg = await db.chatMessage.create({
      data: {
        userId,
        lessonId: lessonId || null,
        role: 'user',
        content: message,
      },
    });

    // Get lesson context if available
    let lessonContext = '';
    if (lessonId) {
      const lesson = await db.lesson.findUnique({
        where: { id: lessonId },
        include: { curriculum: { include: { user: true } } },
      });
      if (lesson) {
        const subject = lesson.curriculum?.subject || 'this subject';
        const lang = userLanguage || lesson.curriculum?.user.language || 'Pidgin English';
        lessonContext = `The student is studying "${lesson.title}" in ${subject}. They learn in ${lang}. Here is the lesson content for context:\n\n${lesson.contentVernacular?.substring(0, 2000) || 'No content yet.'}`;
      }
    }

    // Get recent chat history for context
    const recentMessages = await db.chatMessage.findMany({
      where: { userId, lessonId: lessonId || undefined },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    const chatHistory = recentMessages
      .reverse()
      .map((m) => `${m.role}: ${m.content}`)
      .join('\n');

    const language = userLanguage || 'Pidgin English';

    const prompt = `You are a friendly and patient AI tutor named Smarts Lever. You help West African students understand complex subjects by explaining in ${language}.

${lessonContext}

Recent conversation:\n${chatHistory}

Student's question: ${message}

Respond helpfully in ${language}. Keep your explanation clear, use relatable examples, and be encouraging. Use markdown formatting for better readability. If the student asks something unrelated to the lesson, still help them but gently guide them back.`;

    const responseText = await callGemini(prompt);

    // Save assistant message
    const assistantMsg = await db.chatMessage.create({
      data: {
        userId,
        lessonId: lessonId || null,
        role: 'assistant',
        content: responseText,
      },
    });

    return NextResponse.json({
      message: {
        id: assistantMsg.id,
        userId: assistantMsg.userId,
        lessonId: assistantMsg.lessonId,
        role: assistantMsg.role,
        content: assistantMsg.content,
        createdAt: assistantMsg.createdAt,
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get response' },
      { status: 500 }
    );
  }
}

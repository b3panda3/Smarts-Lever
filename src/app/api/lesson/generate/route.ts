import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { callGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { curriculumId, lessonTitle } = await req.json();

    if (!curriculumId || !lessonTitle) {
      return NextResponse.json(
        { error: 'curriculumId and lessonTitle are required' },
        { status: 400 }
      );
    }

    const lesson = await db.lesson.findFirst({
      where: { curriculumId, title: lessonTitle },
    });

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // If already generated, return existing
    if (lesson.contentVernacular) {
      return NextResponse.json({ lesson });
    }

    const curriculum = await db.curriculum.findUnique({
      where: { id: curriculumId },
      include: { user: true },
    });

    if (!curriculum) {
      return NextResponse.json(
        { error: 'Curriculum not found' },
        { status: 404 }
      );
    }

    const language = curriculum.user.language || 'Pidgin English';
    const educationLevel = curriculum.user.educationLevel || 'secondary';
    const subject = curriculum.subject;

    const prompt = `You are an expert teacher who explains complex topics in ${language} for ${educationLevel} students in West Africa.

Subject: ${subject}
Topic: ${lessonTitle}
${lesson.description ? `Context: ${lesson.description}` : ''}

Create a comprehensive lesson in ${language}. The lesson should:
1. Explain the topic clearly using everyday ${language} expressions
2. Use relatable real-life examples from West African context
3. Include local slang or idioms where appropriate (with explanations)
4. Break complex concepts into simple, digestible parts
5. Use markdown formatting with headers, bullet points, and emphasis

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{
  "contentVernacular": "The full lesson content in markdown format",
  "slangNotes": "Explanation of any slang or idioms used (or empty string)",
  "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"],
  "references": ["Reference 1", "Reference 2"]
}`;

    const responseText = await callGemini(prompt);
    const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const lessonData = JSON.parse(cleaned);

    const updatedLesson = await db.lesson.update({
      where: { id: lesson.id },
      data: {
        contentVernacular: lessonData.contentVernacular || '',
        slangNotes: lessonData.slangNotes || null,
        keyTakeaways: JSON.stringify(lessonData.keyTakeaways || []),
        references: JSON.stringify(lessonData.references || []),
        status: 'in_progress',
      },
    });

    // Unlock the next lesson
    const nextLesson = await db.lesson.findFirst({
      where: {
        curriculumId,
        orderIndex: lesson.orderIndex + 1,
        status: 'locked',
      },
    });
    if (nextLesson) {
      await db.lesson.update({
        where: { id: nextLesson.id },
        data: { status: 'available' },
      });
    }

    return NextResponse.json({ lesson: updatedLesson });
  } catch (error) {
    console.error('Lesson generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate lesson' },
      { status: 500 }
    );
  }
}

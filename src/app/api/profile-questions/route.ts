import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { callGemini } from '@/lib/gemini';

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email');
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get previously asked questions to avoid repeats
    const askedQuestions = await db.profileQuestion.findMany({
      where: { userId: user.id },
      select: { question: true },
    });
    const askedTexts = askedQuestions.map((q) => q.question);

    // Get user progress info
    const curricula = await db.curriculum.findMany({
      where: { userId: user.id },
      include: { lessons: true },
    });
    const totalLessons = curricula.reduce((sum, c) => sum + c.lessons.length, 0);
    const completedLessons = curricula.reduce(
      (sum, c) => sum + c.lessons.filter((l) => l.status === 'completed').length,
      0
    );

    const prompt = `Generate one engaging profile-building question for a student on an educational platform called Smarts Lever.

Student info:
- Name: ${user.name || 'Not provided'}
- Country: ${user.country || 'West Africa'}
- Language: ${user.language || 'English'}
- Education level: ${user.educationLevel || 'Not specified'}
- User type: ${user.userType}
- Subjects studying: ${curricula.map((c) => c.subject).join(', ') || 'None yet'}
- Progress: ${completedLessons}/${totalLessons} lessons completed

Previously asked questions (do NOT repeat any):
${askedTexts.length > 0 ? askedTexts.join('; ') : 'None yet'}

Generate a question that helps build the student's learning profile. It should be friendly and brief.

Respond ONLY with the question text, nothing else.`;

    const question = await callGemini(prompt);

    // Save the question
    await db.profileQuestion.create({
      data: {
        userId: user.id,
        question: question.trim(),
      },
    });

    return NextResponse.json({ question: question.trim() });
  } catch (error) {
    console.error('Profile question error:', error);
    return NextResponse.json(
      { error: 'Failed to generate question' },
      { status: 500 }
    );
  }
}

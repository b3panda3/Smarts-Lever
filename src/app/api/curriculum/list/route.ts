import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email');
    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const curricula = await db.curriculum.findMany({
      where: { userId: user.id },
      include: {
        lessons: {
          orderBy: { orderIndex: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const result = curricula.map((c) => {
      const totalLessons = c.lessons.length;
      const completedLessons = c.lessons.filter(
        (l) => l.status === 'completed'
      ).length;
      const progress =
        totalLessons > 0
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0;

      return {
        id: c.id,
        userId: c.userId,
        title: c.title,
        subject: c.subject,
        description: c.description,
        modules: c.modules,
        status: c.status,
        progress,
        lessonCount: totalLessons,
        lessons: c.lessons.map((l) => ({
          id: l.id,
          title: l.title,
          description: l.description,
          orderIndex: l.orderIndex,
          status: l.status,
          hasContent: !!l.contentVernacular,
        })),
      };
    });

    return NextResponse.json({ curricula: result });
  } catch (error) {
    console.error('Curriculum list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

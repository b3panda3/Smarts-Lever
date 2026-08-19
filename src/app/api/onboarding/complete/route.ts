import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

async function callGemini(prompt: string): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY not configured');

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error: ${res.status} - ${errText}`);
  }

  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      userType,
      organization,
      ageGroup,
      city,
      state,
      country,
      language,
      educationLevel,
      subjects,
    } = body;

    if (!userId || !subjects || subjects.length === 0) {
      return NextResponse.json(
        { error: 'userId and subjects are required' },
        { status: 400 }
      );
    }

    // Update user profile
    await db.user.update({
      where: { id: userId },
      data: {
        userType: userType || 'individual',
        organization: organization || null,
        ageGroup: ageGroup || null,
        city: city || null,
        state: state || null,
        country: country || null,
        language: language || null,
        educationLevel: educationLevel || null,
        onboardingComplete: true,
      },
    });

    // Generate curriculum for each subject
    const curricula = [];

    for (const subject of subjects) {
      const curriculumPrompt = `You are an expert curriculum designer for West African education. Create a structured curriculum for "${subject}".

The student learns in ${language || 'English'} and is at ${educationLevel || 'secondary'} level.
They are in the ${ageGroup || '16-20'} age group, located in ${city || ''}, ${state || ''}, ${country || 'West Africa'}.
User type: ${userType || 'individual'}.

Generate a curriculum with 5-8 modules. For each module, provide a title and a brief 1-sentence description.

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{"title": "${subject} - Full Course", "description": "A brief description", "modules": [{"title": "Module Title", "description": "Module description"}]}`;

      const curriculumText = await callGemini(curriculumPrompt);
      const cleaned = curriculumText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const curriculumData = JSON.parse(cleaned);

      const curriculum = await db.curriculum.create({
        data: {
          userId,
          title: curriculumData.title || `${subject} Curriculum`,
          subject,
          description: curriculumData.description || null,
          modules: JSON.stringify(curriculumData.modules || []),
        },
      });

      // Create lesson stubs from modules
      const modules = curriculumData.modules || [];
      for (let i = 0; i < modules.length; i++) {
        await db.lesson.create({
          data: {
            curriculumId: curriculum.id,
            title: modules[i].title || `Module ${i + 1}`,
            description: modules[i].description || null,
            orderIndex: i,
            contentVernacular: '',
            status: i === 0 ? 'available' : 'locked',
          },
        });
      }

      curricula.push({
        id: curriculum.id,
        title: curriculum.title,
        subject: curriculum.subject,
        description: curriculum.description,
        moduleCount: modules.length,
        progress: 0,
      });
    }

    return NextResponse.json({ curricula });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to complete onboarding' },
      { status: 500 }
    );
  }
}

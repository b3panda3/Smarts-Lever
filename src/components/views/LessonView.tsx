'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import {
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  Loader2,
  MessageCircle,
  BookmarkCheck,
  BookMarked,
  Lightbulb,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useAppStore,
  type CurriculumItem,
  type LessonItem,
} from '@/store/useAppStore';
import { useToast } from '@/hooks/use-toast';

interface LessonWithContent extends LessonItem {
  contentVernacular: string;
  slangNotes?: string | null;
  keyTakeaways?: string | null;
  references?: string | null;
}

export function LessonView() {
  const {
    selectedCurriculum,
    selectedLesson,
    setView,
    selectLesson,
  } = useAppStore();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [curriculumLessons, setCurriculumLessons] = useState<LessonWithContent[]>([]);
  const [currentLesson, setCurrentLesson] = useState<LessonWithContent | null>(
    selectedLesson as LessonWithContent | null
  );

  useEffect(() => {
    if (selectedCurriculum?.id) {
      loadCurriculumDetail();
    }
  }, [selectedCurriculum?.id]);

  useEffect(() => {
    if (selectedLesson && !currentLesson) {
      setCurrentLesson(selectedLesson as LessonWithContent);
    }
  }, [selectedLesson]);

  const loadCurriculumDetail = async () => {
    if (!selectedCurriculum?.id) return;
    try {
      const res = await fetch(`/api/curriculum/${selectedCurriculum.id}`);
      const data = await res.json();
      if (res.ok) {
        setCurriculumLessons(data.lessons || []);
        // If we have a selected lesson, find it in the loaded lessons
        if (selectedLesson) {
          const found = data.lessons?.find(
            (l: LessonWithContent) => l.id === selectedLesson.id
          );
          if (found) {
            setCurrentLesson(found);
          }
        } else if (data.lessons?.length > 0) {
          setCurrentLesson(data.lessons[0]);
        }
      }
    } catch {
      toast({ title: 'Error loading curriculum', variant: 'destructive' });
    }
  };

  const generateLessonContent = async (lesson: LessonWithContent) => {
    if (!selectedCurriculum?.id) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/lesson/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          curriculumId: selectedCurriculum.id,
          lessonTitle: lesson.title,
        }),
      });
      const data = await res.json();
      if (res.ok && data.lesson) {
        setCurrentLesson(data.lesson);
        // Update in local list
        setCurriculumLessons((prev) =>
          prev.map((l) =>
            l.id === data.lesson.id ? { ...l, ...data.lesson } : l
          )
        );
      } else {
        toast({
          title: 'Generation failed',
          description: data.error || 'Could not generate lesson.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({ title: 'Error generating lesson', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevLesson = () => {
    if (!currentLesson || curriculumLessons.length === 0) return;
    const idx = curriculumLessons.findIndex((l) => l.id === currentLesson.id);
    if (idx > 0) {
      const prev = curriculumLessons[idx - 1];
      setCurrentLesson(prev);
      selectLesson(prev);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextLesson = () => {
    if (!currentLesson || curriculumLessons.length === 0) return;
    const idx = curriculumLessons.findIndex((l) => l.id === currentLesson.id);
    if (idx < curriculumLessons.length - 1) {
      const next = curriculumLessons[idx + 1];
      setCurrentLesson(next);
      selectLesson(next);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const currentIdx = curriculumLessons.findIndex(
    (l) => l.id === currentLesson?.id
  );
  const parsedTakeaways: string[] = (() => {
    try {
      return currentLesson?.keyTakeaways
        ? JSON.parse(currentLesson.keyTakeaways)
        : [];
    } catch {
      return [];
    }
  })();

  const parsedReferences: string[] = (() => {
    try {
      return currentLesson?.references
        ? JSON.parse(currentLesson.references)
        : [];
    } catch {
      return [];
    }
  })();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setView('dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Button>
          <span className="text-sm font-medium text-muted-foreground truncate max-w-xs">
            {selectedCurriculum?.subject}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView('chat')}
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            Ask AI
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-6">
        {/* Progress Indicator */}
        {curriculumLessons.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-muted-foreground">
                Module {currentIdx >= 0 ? currentIdx + 1 : 0} of{' '}
                {curriculumLessons.length}
              </span>
              <span className="font-medium">
                {Math.round(
                  ((currentIdx >= 0 ? currentIdx + 1 : 0) /
                    curriculumLessons.length) *
                    100
                )}
                %
              </span>
            </div>
            <Progress
              value={
                curriculumLessons.length > 0
                  ? ((currentIdx >= 0 ? currentIdx + 1 : 0) /
                      curriculumLessons.length) *
                    100
                  : 0
              }
              className="h-1.5"
            />
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="space-y-3 mt-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        ) : !currentLesson?.contentVernacular ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <BookMarked className="h-16 w-16 text-primary/20 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Ready to Learn?</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              This lesson will be generated in your preferred language by our AI.
              Click below to start.
            </p>
            <Button
              size="lg"
              onClick={() => generateLessonContent(currentLesson!)}
              disabled={!currentLesson}
            >
              <GraduationCap className="h-5 w-5 mr-2" />
              Generate Lesson
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key={currentLesson.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Lesson Title */}
            <div className="mb-6">
              <Badge variant="secondary" className="mb-3">
                {selectedCurriculum?.subject}
              </Badge>
              <h1 className="text-2xl sm:text-3xl font-bold">
                {currentLesson.title}
              </h1>
              {currentLesson.description && (
                <p className="text-muted-foreground mt-2">
                  {currentLesson.description}
                </p>
              )}
            </div>

            {/* Lesson Content */}
            <Card className="mb-6">
              <CardContent className="p-6 sm:p-8">
                <div className="prose prose-sm sm:prose max-w-none chat-content">
                  <ReactMarkdown>{currentLesson.contentVernacular}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>

            {/* Slang Notes */}
            {currentLesson.slangNotes && (
              <Card className="mb-6 border-amber-200 bg-amber-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span className="text-lg">🗣️</span>
                    Slang & Idiom Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {currentLesson.slangNotes}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Key Takeaways */}
            {parsedTakeaways.length > 0 && (
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    Key Takeaways
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {parsedTakeaways.map((takeaway, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <BookmarkCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-sm">{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* References */}
            {parsedReferences.length > 0 && (
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">References</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {parsedReferences.map((ref, i) => (
                      <li key={i} className="text-sm text-muted-foreground">
                        {i + 1}. {ref}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </main>

      {/* Floating Chat Button */}
      {currentLesson?.contentVernacular && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-20 right-4 sm:right-8 z-40"
        >
          <Button
            size="lg"
            className="rounded-full h-14 w-14 shadow-lg"
            onClick={() => setView('chat')}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </motion.div>
      )}

      {/* Bottom Navigation */}
      {curriculumLessons.length > 0 && (
        <div className="border-t border-border bg-background sticky bottom-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevLesson}
              disabled={currentIdx <= 0}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextLesson}
              disabled={currentIdx >= curriculumLessons.length - 1}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

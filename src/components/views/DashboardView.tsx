'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LogOut,
  BookOpen,
  MapPin,
  Languages,
  GraduationCap as EduIcon,
  ArrowRight,
  Loader2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BrandLogo } from '@/components/BrandLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useAppStore,
  type CurriculumItem,
  type LessonItem,
} from '@/store/useAppStore';
import { useToast } from '@/hooks/use-toast';

interface CurriculumWithLessons extends CurriculumItem {
  lessonCount: number;
  lessons: { id: string; title: string; status: string; hasContent: boolean; orderIndex: number }[];
}

export function DashboardView() {
  const { user, setView, setUser, selectCurriculum, selectLesson } = useAppStore();
  const { toast } = useToast();
  const [curricula, setCurricula] = useState<CurriculumWithLessons[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCurricula();
  }, []);

  const loadCurricula = async () => {
    if (!user?.email) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/curriculum/list?email=${user.email}`);
      const data = await res.json();
      if (res.ok && data.curricula) {
        setCurricula(data.curricula);
      }
    } catch {
      toast({
        title: 'Error loading curricula',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueLearning = async (curriculum: CurriculumWithLessons) => {
    selectCurriculum(curriculum);

    // Find the first available or in_progress lesson
    const nextLesson = curriculum.lessons.find(
      (l) => l.status === 'in_progress' || l.status === 'available'
    );

    if (nextLesson) {
      // Generate content if not yet generated
      if (!nextLesson.hasContent) {
        try {
          const genRes = await fetch('/api/lesson/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              curriculumId: curriculum.id,
              lessonTitle: nextLesson.title,
            }),
          });
          const genData = await genRes.json();
          if (genRes.ok && genData.lesson) {
            selectLesson(genData.lesson as LessonItem);
            setView('lesson');
            return;
          }
        } catch {
          // Fall through to open lesson anyway
        }
      }

      const fullLesson: LessonItem = {
        id: nextLesson.id,
        curriculumId: curriculum.id,
        title: nextLesson.title,
        orderIndex: nextLesson.orderIndex,
        contentVernacular: nextLesson.hasContent ? '(Content loaded)' : '',
        status: nextLesson.status,
      };
      selectLesson(fullLesson);
      setView('lesson');
    } else {
      toast({
        title: 'All done!',
        description: 'You\'ve completed all lessons in this curriculum.',
      });
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView('landing');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <BrandLogo className="h-9" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Greeting + Profile Summary */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Welcome back, {user?.name?.split(' ')[0] || 'Learner'} 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Continue where you left off or explore new subjects.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Profile Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {user?.language && (
              <Badge variant="secondary" className="gap-1">
                <Languages className="h-3 w-3" />
                {user.language}
              </Badge>
            )}
            {user?.country && (
              <Badge variant="secondary" className="gap-1">
                <MapPin className="h-3 w-3" />
                {user.country}
              </Badge>
            )}
            {user?.educationLevel && (
              <Badge variant="secondary" className="gap-1">
                <EduIcon className="h-3 w-3" />
                {user.educationLevel}
              </Badge>
            )}
          </div>
        </div>

        {/* Curricula Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : curricula.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="max-w-lg mx-auto text-center">
              <CardContent className="p-8">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold mb-2">No Curricula Yet</h2>
                <p className="text-muted-foreground mb-6">
                  Complete your onboarding to get AI-generated curricula tailored to your subjects and language.
                </p>
                <Button onClick={() => setView('onboarding')}>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Complete Setup
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {curricula.map((curriculum, i) => (
              <motion.div
                key={curriculum.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full card-hover flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      {curriculum.progress === 100 && (
                        <Badge variant="default" className="bg-amber-500 text-white">
                          Completed
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg mt-3">{curriculum.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {curriculum.lessonCount} modules
                    </p>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{curriculum.progress}%</span>
                      </div>
                      <Progress value={curriculum.progress} className="h-2" />
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => handleContinueLearning(curriculum)}
                    >
                      Continue Learning
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

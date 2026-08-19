'use client';

import { motion } from 'framer-motion';
import {
  BookOpen,
  Brain,
  Globe,
  BarChart3,
  ArrowRight,
  ChevronDown,
  Sparkles,
  GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAppStore } from '@/store/useAppStore';

const features = [
  {
    icon: Globe,
    title: 'Vernacular Teaching',
    description:
      'Learn in Pidgin, Yoruba, Hausa, Twi, Wolof, and more. Complex topics explained in the language you truly understand.',
  },
  {
    icon: Brain,
    title: 'AI-Powered Curriculum',
    description:
      'Our AI generates personalized learning paths tailored to your level, language, and goals. No one-size-fits-all.',
  },
  {
    icon: Sparkles,
    title: 'Real-Life Examples',
    description:
      'Every lesson uses examples from everyday West African life — from market maths to transport physics.',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description:
      'Track your learning journey with visual progress indicators. Know where you are and what comes next.',
  },
];

const problemStats = [
  { value: '40%', label: 'of West African students struggle with English-only instruction' },
  { value: '250M+', label: 'people speak vernacular languages across West Africa' },
  { value: '3x', label: 'better retention when learning in your mother tongue' },
  { value: '15+', label: 'major West African languages supported' },
];

export function LandingView() {
  const { setView } = useAppStore();

  const scrollToProblem = () => {
    document.getElementById('problem-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-gradient">Smarts Lever</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => setView('login')}
              className="text-sm"
            >
              Sign In
            </Button>
            <Button
              onClick={() => setView('signup')}
              className="text-sm"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 via-background to-amber-50/50" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="text-center max-w-3xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                Powered by AI for Social Impact
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
                Learn Anything,{' '}
                <span className="text-gradient">In Your Language</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                Breaking down complex subjects into vernacular West African
                languages. From Mathematics to Law — understand deeply,
                learn faster, in the tongue that speaks to you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  onClick={() => setView('signup')}
                  className="text-base px-8 h-12 rounded-full"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={scrollToProblem}
                  className="text-base px-8 h-12 rounded-full"
                >
                  Learn More
                  <ChevronDown className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>

            {/* Language Tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-2 mt-12"
            >
              {['Pidgin English', 'Yoruba', 'Hausa', 'Igbo', 'Twi', 'Wolof', 'Fanti', 'Bambara', 'French', 'More...'].map(
                (lang) => (
                  <span
                    key={lang}
                    className="px-3 py-1 rounded-full bg-card border border-border text-sm text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors cursor-default"
                  >
                    {lang}
                  </span>
                )
              )}
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Why Smarts Lever?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                We combine AI with cultural understanding to make education
                truly accessible for every West African student.
              </p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full card-hover border-border/60">
                    <CardContent className="p-6">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Problem Statement Section */}
        <section id="problem-section" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto text-center mb-14"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                The Education Gap in West Africa
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Over 250 million people across West Africa speak vernacular
                languages daily, yet education is overwhelmingly delivered in
                English or French. This creates a barrier that prevents millions
                from truly understanding critical subjects. Smarts Lever bridges
                this gap by using AI to teach hard subjects in the language
                students actually think in.
              </p>
            </motion.div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {problemStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="text-center border-border/60">
                    <CardContent className="p-6">
                      <div className="text-3xl sm:text-4xl font-extrabold text-primary mb-2">
                        {stat.value}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                How It Works
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                {
                  step: '1',
                  title: 'Tell Us About You',
                  desc: 'Select your language, subjects, and education level. We personalize everything.',
                },
                {
                  step: '2',
                  title: 'AI Generates Your Curriculum',
                  desc: 'Our AI crafts a learning path with modules tailored to your language and context.',
                },
                {
                  step: '3',
                  title: 'Learn & Ask Questions',
                  desc: 'Read lessons in your language, ask the AI tutor anything you don\'t understand.',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="text-center"
                >
                  <div className="h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="bg-primary text-primary-foreground border-0 overflow-hidden">
                <CardContent className="p-8 sm:p-12 text-center">
                  <BookOpen className="h-10 w-10 mx-auto mb-4 opacity-90" />
                  <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                    Ready to Learn In Your Language?
                  </h2>
                  <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
                    Join thousands of students across West Africa who are
                    learning better in their mother tongue.
                  </p>
                  <Button
                    size="lg"
                    onClick={() => setView('signup')}
                    className="bg-white text-primary hover:bg-white/90 text-base px-8 h-12 rounded-full"
                  >
                    Start Learning Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="font-semibold">Smarts Lever</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Built for Wema Hackaholics 2026 — Social Impact Track
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            Bridging the education gap in West Africa, one lesson at a time.
          </p>
        </div>
      </footer>
    </div>
  );
}

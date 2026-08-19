'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Plus,
  X,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { useToast } from '@/hooks/use-toast';

const USER_TYPES = [
  { value: 'individual', label: 'Individual Learner', icon: '🎓' },
  { value: 'teacher', label: 'Teacher', icon: '👨‍🏫' },
  { value: 'school', label: 'School', icon: '🏫' },
  { value: 'government', label: 'Government / NGO', icon: '🏛️' },
  { value: 'group', label: 'Study Group', icon: '👥' },
];

const AGE_GROUPS = ['10-15', '16-20', '21-30', '31-40', '40+'];

const EDUCATION_LEVELS = [
  'Primary',
  'Secondary',
  'University',
  'Graduate',
  'Professional',
];

const WEST_AFRICAN_COUNTRIES = [
  'Nigeria',
  'Ghana',
  'Senegal',
  "Cote d'Ivoire",
  'Togo',
  'Benin',
  'Niger',
  'Mali',
  'Burkina Faso',
  'Liberia',
  'Sierra Leone',
  'Guinea',
  'Gambia',
  'Cape Verde',
];

const LANGUAGES = [
  'English',
  'Pidgin English',
  'Yoruba',
  'Hausa',
  'Igbo',
  'Twi',
  'Fanti',
  'Wolof',
  'French',
  'Bambara',
  'Fula',
  'Ewe',
  'Ga',
  'Akan',
  'Zarma',
  'Tamasheq',
];

const SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'English Language',
  'Literature',
  'History',
  'Government',
  'Economics',
  'Law',
  'Computer Science',
  'Accounting',
  'Geography',
  'Further Maths',
  'Civic Education',
  'Agricultural Science',
  'Technical Drawing',
  'Commerce',
  'Christian Religious Studies',
  'Islamic Religious Studies',
];

const STEP_TITLES = [
  'Who are you?',
  'Your Profile',
  'Your Location',
  'Your Language',
  'Choose Subjects',
];

const STEP_DESCRIPTIONS = [
  'Tell us your learner type so we can personalize your experience.',
  'A bit more about you to tailor the content.',
  'Where are you learning from? This helps with local examples.',
  'Select the language you learn best in.',
  'Pick the subjects you want to master. AI will create your curriculum.',
];

export function OnboardingView() {
  const {
    user,
    onboardingStep,
    onboardingData,
    setOnboardingStep,
    setOnboardingData,
    setView,
    setLoading,
    isLoading,
  } = useAppStore();
  const { toast } = useToast();

  const [customLanguage, setCustomLanguage] = useState('');
  const [showCustomLanguage, setShowCustomLanguage] = useState(false);
  const [customSubject, setCustomSubject] = useState('');
  const [showCustomSubject, setShowCustomSubject] = useState(false);

  const nextStep = () => {
    if (onboardingStep < 4) {
      setOnboardingStep(onboardingStep + 1);
    }
  };

  const prevStep = () => {
    if (onboardingStep > 0) {
      setOnboardingStep(onboardingStep - 1);
    }
  };

  const handleAddLanguage = () => {
    if (customLanguage.trim()) {
      setOnboardingData({ language: customLanguage.trim() });
      setCustomLanguage('');
      setShowCustomLanguage(false);
    }
  };

  const handleAddSubject = () => {
    if (customSubject.trim()) {
      const trimmed = customSubject.trim();
      if (!onboardingData.subjects.includes(trimmed)) {
        setOnboardingData({
          subjects: [...onboardingData.subjects, trimmed],
        });
      }
      setCustomSubject('');
      setShowCustomSubject(false);
    }
  };

  const toggleSubject = (subject: string) => {
    const current = onboardingData.subjects;
    if (current.includes(subject)) {
      setOnboardingData({ subjects: current.filter((s) => s !== subject) });
    } else {
      setOnboardingData({ subjects: [...current, subject] });
    }
  };

  const handleComplete = async () => {
    if (onboardingData.subjects.length === 0) {
      toast({
        title: 'Select at least one subject',
        description: 'You need to pick a subject to learn.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || '',
          email: user?.email || '',
          ...onboardingData,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: 'Onboarding failed',
          description: data.error || 'Please try again.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      toast({
        title: 'Curriculum created!',
        description: `Generated ${data.curricula?.length || 0} curricula for you.`,
      });

      setView('dashboard');
    } catch {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const stepVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold text-gradient">Smarts Lever</span>
          </div>
          {onboardingStep > 0 && (
            <Button variant="ghost" size="sm" onClick={prevStep}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b border-border bg-muted/30">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: '0%' }}
                  animate={{
                    width: i < onboardingStep + 1 ? '100%' : '0%',
                  }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Step {onboardingStep + 1} of 5
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={onboardingStep}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                  {STEP_TITLES[onboardingStep]}
                </h1>
                <p className="text-muted-foreground">
                  {STEP_DESCRIPTIONS[onboardingStep]}
                </p>
              </div>

              {/* Step 1: User Type */}
              {onboardingStep === 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {USER_TYPES.map((type) => (
                    <Card
                      key={type.value}
                      className={`cursor-pointer card-hover transition-all ${
                        onboardingData.userType === type.value
                          ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                          : 'hover:border-primary/30'
                      }`}
                      onClick={() =>
                        setOnboardingData({ userType: type.value })
                      }
                    >
                      <CardContent className="p-5 flex items-center gap-4">
                        <span className="text-2xl">{type.icon}</span>
                        <span className="font-medium">{type.label}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Step 2: Profile Details */}
              {onboardingStep === 1 && (
                <div className="space-y-5">
                  {(onboardingData.userType === 'school' ||
                    onboardingData.userType === 'government' ||
                    onboardingData.userType === 'group') && (
                    <div className="space-y-2">
                      <Label>Organization / School Name</Label>
                      <Input
                        placeholder="e.g. Lagos State University"
                        value={onboardingData.organization || ''}
                        onChange={(e) =>
                          setOnboardingData({ organization: e.target.value })
                        }
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label>Age Group</Label>
                    <Select
                      value={onboardingData.ageGroup || ''}
                      onValueChange={(v) => setOnboardingData({ ageGroup: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your age group" />
                      </SelectTrigger>
                      <SelectContent>
                        {AGE_GROUPS.map((ag) => (
                          <SelectItem key={ag} value={ag}>
                            {ag}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Education Level</Label>
                    <Select
                      value={onboardingData.educationLevel || ''}
                      onValueChange={(v) =>
                        setOnboardingData({ educationLevel: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your education level" />
                      </SelectTrigger>
                      <SelectContent>
                        {EDUCATION_LEVELS.map((el) => (
                          <SelectItem key={el} value={el}>
                            {el}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 3: Location */}
              {onboardingStep === 2 && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input
                        placeholder="e.g. Lagos"
                        value={onboardingData.city || ''}
                        onChange={(e) =>
                          setOnboardingData({ city: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>State / Region</Label>
                      <Input
                        placeholder="e.g. Lagos State"
                        value={onboardingData.state || ''}
                        onChange={(e) =>
                          setOnboardingData({ state: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Select
                      value={onboardingData.country || ''}
                      onValueChange={(v) => setOnboardingData({ country: v })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        {WEST_AFRICAN_COUNTRIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 4: Language */}
              {onboardingStep === 3 && (
                <div className="space-y-5">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {LANGUAGES.map((lang) => (
                      <Card
                        key={lang}
                        className={`cursor-pointer card-hover ${
                          onboardingData.language === lang
                            ? 'border-primary ring-2 ring-primary/20 bg-primary/5'
                            : 'hover:border-primary/30'
                        }`}
                        onClick={() => setOnboardingData({ language: lang })}
                      >
                        <CardContent className="p-4 text-center">
                          <span className="text-sm font-medium">{lang}</span>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {showCustomLanguage ? (
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Enter your language"
                        value={customLanguage}
                        onChange={(e) => setCustomLanguage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddLanguage()}
                      />
                      <Button size="icon" onClick={handleAddLanguage}>
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setShowCustomLanguage(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCustomLanguage(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add custom language
                    </Button>
                  )}

                  {onboardingData.language && (
                    <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Selected: </span>
                        <span className="font-medium text-primary">
                          {onboardingData.language}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Subject Selection */}
              {onboardingStep === 4 && (
                <div className="space-y-5">
                  <div className="flex flex-wrap gap-2">
                    {SUBJECTS.map((subject) => {
                      const isSelected = onboardingData.subjects.includes(subject);
                      return (
                        <Badge
                          key={subject}
                          variant={isSelected ? 'default' : 'outline'}
                          className={`cursor-pointer px-4 py-2 text-sm transition-all ${
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'hover:bg-primary/10 hover:text-primary'
                          }`}
                          onClick={() => toggleSubject(subject)}
                        >
                          {subject}
                        </Badge>
                      );
                    })}
                  </div>

                  {showCustomSubject ? (
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Enter a custom subject"
                        value={customSubject}
                        onChange={(e) => setCustomSubject(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddSubject()}
                      />
                      <Button size="icon" onClick={handleAddSubject}>
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setShowCustomSubject(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCustomSubject(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add custom subject
                    </Button>
                  )}

                  {onboardingData.subjects.length > 0 && (
                    <div className="p-4 bg-muted/50 rounded-lg border">
                      <p className="text-sm font-medium mb-2">
                        Selected Subjects ({onboardingData.subjects.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {onboardingData.subjects.map((s) => (
                          <Badge
                            key={s}
                            variant="secondary"
                            className="gap-1"
                          >
                            {s}
                            <button
                              className="ml-1 hover:text-destructive"
                              onClick={() => toggleSubject(s)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
            </motion.div>
            <h2 className="text-xl font-bold mb-2">Crafting Your Curriculum</h2>
            <p className="text-muted-foreground">
              AI is creating personalized learning paths for you...
            </p>
            <div className="mt-4 flex items-center justify-center gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-2 w-2 rounded-full bg-primary"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Footer Actions */}
      <div className="border-t border-border bg-background sticky bottom-0">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => setView('landing')}>
            Skip for now
          </Button>
          {onboardingStep < 4 ? (
            <Button onClick={nextStep}>
              Next
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleComplete} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                'Start Learning'
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

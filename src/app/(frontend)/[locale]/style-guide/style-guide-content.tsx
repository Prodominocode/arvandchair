'use client'

import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Scene } from '@/components/three/Scene'
// Toaster اکنون یک‌بار در layout.tsx سراسری mount می‌شود (فاز ۳)؛ اینجا دوباره mount نمی‌شود.

const COLOR_TOKENS = [
  { token: '--color-arvand-gold', className: 'bg-arvand-gold', hex: '#D2B67F' },
  { token: '--color-arvand-slate', className: 'bg-arvand-slate', hex: '#6D6F71' },
  { token: '--color-arvand-ink', className: 'bg-arvand-ink', hex: '#2B2A28' },
  { token: '--color-surface-white', className: 'border bg-surface-white', hex: '#FFFFFF' },
  { token: '--color-surface-mist', className: 'bg-surface-mist', hex: '#ececec' },
  { token: '--color-success', className: 'bg-success', hex: '#4B7B4E' },
  { token: '--color-warning', className: 'bg-warning', hex: '#B8863B' },
  { token: '--color-danger', className: 'bg-danger', hex: '#B3453A' },
] as const

const TYPE_SCALE = [
  'text-xs',
  'text-sm',
  'text-base',
  'text-lg',
  'text-xl',
  'text-2xl',
  'text-3xl',
  'text-4xl',
  'text-5xl',
  'text-6xl',
] as const

const RADIUS_SCALE = [
  'rounded-sm',
  'rounded-md',
  'rounded-lg',
  'rounded-xl',
  'rounded-2xl',
] as const

const SHADOW_SCALE = ['shadow-xs', 'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl'] as const

const SPACING_SCALE = [1, 2, 3, 4, 6, 8, 12, 16] as const

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="py-section-y-sm">
      <h2 className="text-arvand-ink mb-6 text-3xl font-semibold">{title}</h2>
      {children}
    </section>
  )
}

export function StyleGuideContent() {
  const t = useTranslations('StyleGuide')

  return (
    <TooltipProvider>
      <div className="px-container-x py-section-y-md mx-auto max-w-5xl">
        <header className="mb-4">
          <p className="bg-secondary text-secondary-foreground mb-2 inline-block rounded-full px-3 py-1 text-xs font-medium">
            noindex — internal only
          </p>
          <h1 className="text-arvand-ink text-4xl font-bold">{t('title')}</h1>
          <p className="text-foreground mt-2 max-w-2xl">{t('subtitle')}</p>
        </header>

        <Separator className="my-6" />

        {/* رنگ‌ها */}
        <Section id="colors" title={t('sections.colors')}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {COLOR_TOKENS.map((color) => (
              <Card key={color.token} className="overflow-hidden py-0">
                <div className={`h-20 w-full ${color.className}`} />
                <CardContent className="space-y-1 p-3">
                  <p className="text-foreground font-mono text-xs">{color.token}</p>
                  <p className="text-muted-foreground font-mono text-xs">{color.hex}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        {/* تایپوگرافی */}
        <Section id="typography" title={t('sections.typography')}>
          <div className="space-y-3">
            {TYPE_SCALE.map((size) => (
              <div key={size} className="flex items-baseline gap-4">
                <span className="text-muted-foreground w-20 shrink-0 font-mono text-xs">
                  {size}
                </span>
                <p className={`${size} text-arvand-ink`}>{t('typographySample')}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-6 text-base">
            <span className="font-normal">Regular 400</span>
            <span className="font-medium">Medium 500</span>
            <span className="font-semibold">Semibold 600</span>
            <span className="font-bold">Bold 700</span>
          </div>
        </Section>

        {/* فاصله‌گذاری */}
        <Section id="spacing" title={t('sections.spacing')}>
          <div className="space-y-2">
            {SPACING_SCALE.map((step) => (
              <div key={step} className="flex items-center gap-3">
                <span className="text-muted-foreground w-10 shrink-0 font-mono text-xs">
                  {step * 4}px
                </span>
                <div className={`bg-arvand-gold h-3`} style={{ width: `${step * 4}px` }} />
              </div>
            ))}
          </div>
          <p className="text-muted-foreground mt-4 font-mono text-xs">
            py-section-y-sm (48px) / py-section-y-md (80px) / py-section-y-lg (128px) /
            px-container-x (24px) / max-w-container (1440px)
          </p>
        </Section>

        {/* شعاع گوشه */}
        <Section id="radius" title={t('sections.radius')}>
          <div className="flex flex-wrap gap-4">
            {RADIUS_SCALE.map((radius) => (
              <div key={radius} className="flex flex-col items-center gap-2">
                <div className={`bg-surface-mist size-16 ${radius}`} />
                <span className="text-muted-foreground font-mono text-xs">{radius}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* سایه */}
        <Section id="shadow" title={t('sections.shadow')}>
          <div className="flex flex-wrap gap-6">
            {SHADOW_SCALE.map((shadow) => (
              <div key={shadow} className="flex flex-col items-center gap-2">
                <div className={`bg-surface-white size-16 rounded-lg ${shadow}`} />
                <span className="text-muted-foreground font-mono text-xs">{shadow}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* موشن */}
        <Section id="motion" title={t('sections.motion')}>
          <p className="text-muted-foreground mb-4 text-sm">{t('motionNote')}</p>
          <div className="flex flex-wrap gap-4">
            {(['duration-fast', 'duration-base', 'duration-slow'] as const).map((duration) => (
              <div
                key={duration}
                className={`bg-secondary text-secondary-foreground flex size-24 items-center justify-center rounded-lg font-mono text-xs transition-colors ${duration} ease-emphasis hover:bg-arvand-gold`}
              >
                {duration}
              </div>
            ))}
          </div>
          <p className="text-muted-foreground mt-4 font-mono text-xs">
            ease-emphasis: cubic-bezier(0.22, 1, 0.36, 1) — src/lib/motion/scroll-tokens.ts (قرارداد
            GSAP)
          </p>
        </Section>

        {/* کامپوننت‌های پایه */}
        <Section id="components" title={t('sections.components')}>
          <div className="space-y-8">
            <div>
              <h3 className="mb-3 text-lg font-semibold">Button</h3>
              <div className="flex flex-wrap items-center gap-3">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
                <Button size="sm">Small</Button>
                <Button size="lg">Large</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold">Badge</h3>
              <div className="flex flex-wrap gap-3">
                <Badge>{t('badges.newArrival')}</Badge>
                <Badge className="bg-success text-success-foreground">{t('badges.inStock')}</Badge>
                <Badge className="bg-warning text-warning-foreground">
                  {t('badges.quoteOnly')}
                </Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold">Card</h3>
              <Card className="max-w-sm">
                <CardHeader>
                  <CardTitle>صندلی اداری مدل آرا</CardTitle>
                  <CardDescription>پایه‌ی آلومینیومی، پارچه‌ی مش تنفس‌پذیر</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge className="bg-success text-success-foreground">
                    {t('badges.inStock')}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold">Form</h3>
              <div className="grid max-w-sm gap-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="sg-name">{t('formDemo.nameLabel')}</Label>
                  <Input id="sg-name" placeholder={t('formDemo.namePlaceholder')} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="sg-category">{t('formDemo.categoryLabel')}</Label>
                  <Select>
                    <SelectTrigger id="sg-category" className="w-full">
                      <SelectValue placeholder={t('formDemo.categoryPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chairs">{t('formDemo.categoryChairs')}</SelectItem>
                      <SelectItem value="desks">{t('formDemo.categoryDesks')}</SelectItem>
                      <SelectItem value="office-furniture">
                        {t('formDemo.categoryOfficeFurniture')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="sg-message">{t('formDemo.messageLabel')}</Label>
                  <Textarea id="sg-message" placeholder={t('formDemo.messagePlaceholder')} />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="sg-checkbox" />
                  <Label htmlFor="sg-checkbox">Checkbox</Label>
                </div>
                <RadioGroup defaultValue="a" className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="a" id="sg-radio-a" />
                    <Label htmlFor="sg-radio-a">Option A</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="b" id="sg-radio-b" />
                    <Label htmlFor="sg-radio-b">Option B</Label>
                  </div>
                </RadioGroup>
                <div className="flex items-center gap-2">
                  <Switch id="sg-switch" />
                  <Label htmlFor="sg-switch">Switch</Label>
                </div>
                <Button onClick={() => toast(t('toast.message'))}>{t('toast.trigger')}</Button>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold">Tabs</h3>
              <Tabs defaultValue="tab-1" className="max-w-sm">
                <TabsList>
                  <TabsTrigger value="tab-1">Tab 1</TabsTrigger>
                  <TabsTrigger value="tab-2">Tab 2</TabsTrigger>
                </TabsList>
                <TabsContent value="tab-1" className="text-foreground text-sm">
                  محتوای تب اول.
                </TabsContent>
                <TabsContent value="tab-2" className="text-foreground text-sm">
                  محتوای تب دوم.
                </TabsContent>
              </Tabs>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold">Accordion</h3>
              <Accordion type="single" collapsible className="max-w-sm">
                <AccordionItem value="item-1">
                  <AccordionTrigger>سوال نمونه‌ی اول</AccordionTrigger>
                  <AccordionContent>پاسخ نمونه برای تست باز/بسته‌شدن Accordion.</AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>سوال نمونه‌ی دوم</AccordionTrigger>
                  <AccordionContent>پاسخ نمونه‌ی دیگر.</AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">{t('dialog.trigger')}</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('dialog.title')}</DialogTitle>
                    <DialogDescription>{t('dialog.description')}</DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">{t('dialog.cancel')}</Button>
                    </DialogClose>
                    <Button variant="destructive">{t('dialog.confirm')}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost">Tooltip</Button>
                </TooltipTrigger>
                <TooltipContent>یک راهنمای کوتاه</TooltipContent>
              </Tooltip>
            </div>

            <div>
              <h3 className="mb-3 text-lg font-semibold">Skeleton</h3>
              <div className="max-w-sm space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>
        </Section>

        {/* صحنه‌ی سه‌بعدی */}
        <Section id="scene3d" title={t('sections.scene3d')}>
          <p className="text-muted-foreground mb-4 max-w-xl text-sm">{t('scene3dNote')}</p>
          <Scene
            fallbackSrc="/images/placeholder-3d.svg"
            fallbackAlt="جای‌گذار صحنه‌ی سه‌بعدی"
            className="max-w-sm"
          />
        </Section>
      </div>
    </TooltipProvider>
  )
}

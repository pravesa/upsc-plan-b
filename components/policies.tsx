'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Reveal } from '@/components/ui/reveal';

const termItems = [
  {
    title: 'About Us',
    body: 'PLAN B provides educational content, recorded session, and career guidance programs for UPSC aspirants and students.',
  },
  {
    title: 'Use of Services',
    body: 'Provide accurate info · Do not misuse or copy content · Do not share or distribute purchased materials · For personal learning only',
  },
  {
    title: 'Intellectual Property',
    body: 'You may NOT record, redistribute, resell, or copy any materials',
  },
  {
    title: 'Payments',
    body: 'All prices in INR (₹) · Payments are processed securely via payment gateways · Access is provided only after successful payment',
  },
  {
    title: 'Access to Recorded Sessions',
    body: 'Access is provided digitally · You are responsible for your internet/device · We are not liable for technical issues on your side',
  },
  {
    title: 'No Guarantees',
    body: 'We do NOT guarantee job placement, income, UPSC selection, or results. Outcomes depend on individual effort.',
  },
  {
    title: 'Limitation of Liability',
    body: 'PLAN B shall not be liable for Indirect losses, Career decisions made by users and	Technical interruptions beyond our control.',
  },
  {
    title: 'Changes to Terms',
    body: 'We may update these terms anytime. Continued use means acceptance of new terms.',
  },
  {
    title: 'Contact',
    body: 'For any inquiries or support, please contact us at dmsupotplanb@gmail.com.',
  },
];

export default function Policies() {
  return (
    <section id='policy' className='bg-background py-24 px-6'>
      <div className='max-w-3xl mx-auto'>
        {/* Header */}
        <Reveal className='text-center mb-12'>
          <p className='text-primary font-bold text-xs tracking-[0.18em] uppercase mb-4'>
            Transparency
          </p>
          <h2
            className='font-serif font-black'
            style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
          >
            Policies &amp; Terms
          </h2>
        </Reveal>

        {/* Accordion */}
        <Reveal delay={0.1}>
          <Accordion type='single' collapsible className='flex flex-col gap-3'>
            {/* Refund Policy */}
            <AccordionItem
              value='refund'
              className='bg-muted/50 border border-muted-foreground/20 rounded-4xl overflow-hidden px-6 data-[state=open]:border-primary/50'
            >
              <AccordionTrigger className='font-semibold text-base text-foreground py-5 hover:no-underline hover:text-primary transition-colors [&>svg]:text-muted-foreground/75 [&[data-state=open]>svg]:text-primary'>
                📦 Refund Policy
              </AccordionTrigger>
              <AccordionContent className='pb-6 text-muted-foreground/75 text-md leading-relaxed'>
                <p className='mb-3'>
                  At PLAN B, we provide digital educational products, recorded
                  sessions that are delivered instantly after purchase.
                </p>
                <p className='font-semibold text-muted-foreground mb-3'>
                  Because of the nature of digital content, all sales are final.
                </p>
                <ul className='ml-5 list-disc text-muted-foreground/75 flex flex-col gap-1'>
                  <li>Access to content is granted immediately upon payment</li>
                  <li>Materials can be viewed instantly after purchase</li>
                  <li>No refunds will be issued once payment is completed</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            {/* Terms & Conditions */}
            <AccordionItem
              value='terms'
              className='bg-muted/50 border border-muted-foreground/20 last:border-b rounded-4xl overflow-hidden px-6 data-[state=open]:border-primary/50'
            >
              <AccordionTrigger className='font-semibold text-base text-foreground py-5 hover:no-underline hover:text-primary transition-colors [&>svg]:text-muted-foreground/75 [&[data-state=open]>svg]:text-primary'>
                📋 Terms &amp; Conditions
              </AccordionTrigger>
              <AccordionContent className='pb-6 text-muted-foreground/75 text-md leading-relaxed'>
                <p className='mb-3'>
                  By accessing or purchasing our products/services, you agree to
                  the following:
                </p>
                <div className='flex flex-col gap-2'>
                  {termItems.map((item) => (
                    <div
                      key={item.title}
                      className='bg-muted/50 rounded-xl p-3'
                    >
                      <p className='font-semibold text-muted-foreground mb-1 text-sm'>
                        {item.title}
                      </p>
                      <p className='text-muted-foreground/75 leading-normal'>
                        {item.body}
                      </p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}

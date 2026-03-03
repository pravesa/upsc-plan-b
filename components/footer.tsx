const EMAIL = 'dmsupotplanb@gmail.com';

export default function Footer() {
  return (
    <footer className='bg-background border-t border-foreground/6 py-10 px-6'>
      <div className='max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-foreground/28 text-sm'>
        <div className='flex items-center gap-2'>
          <span className='text-[1.2rem] font-black text-foreground'>
            PLAN <span className='text-primary'>B</span>
          </span>
          <span className='text-foreground/18'>·</span>
          <span>Pathfinder Session</span>
        </div>
        <p>© 2024 PLAN B. All rights reserved. All sales final.</p>
        <a
          href={`mailto:${EMAIL}`}
          className='text-foreground/28 hover:text-foreground transition-colors'
        >
          {EMAIL}
        </a>
      </div>
    </footer>
  );
}

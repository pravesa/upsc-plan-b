const EMAIL = 'dmsupotplanb@gmail.com';

export default function Footer() {
  return (
    <footer className='bg-background border-t border-muted-foreground/10 py-10 px-6'>
      <div className='max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-muted-foreground/50 text-sm'>
        <div className='flex items-center gap-2'>
          <span className='text-xl font-black text-foreground'>
            PLAN <span className='text-primary'>B</span>
          </span>
          <span className='text-muted-foreground/75'>·</span>
          <span>Pathfinder Session</span>
        </div>
        <p>
          © {new Date().getFullYear()} PLAN B. All rights reserved. All sales
          final.
        </p>
        <a
          href={`mailto:${EMAIL}`}
          className='hover:text-foreground transition-colors'
        >
          {EMAIL}
        </a>
      </div>
    </footer>
  );
}

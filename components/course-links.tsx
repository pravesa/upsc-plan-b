const COURSES = [
  {
    category: 'Data Analytics',
    links: [
      { name: 'Code Basics', url: 'https://codebasics.io/' },
      { name: 'Grow Data Skills', url: 'https://growdataskills.com/' },
    ],
  },
  {
    category: 'Data Engineering',
    links: [
      { name: 'Triple R', url: 'https://www.triple-r.in/' },
      { name: 'Trendy Tech', url: 'https://trendytech.in/' },
    ],
  },
  {
    category: 'Digital Marketing',
    links: [
      { name: 'My Captain', url: 'https://mycaptain.in/' },
      { name: 'Digital Scholar', url: 'https://digitalscholar.in/' },
    ],
  },
  {
    category: 'Fullstack Development',
    links: [{ name: 'DCT Academy', url: 'https://www.dctacademy.com/' }],
  },
  {
    category: 'Product Management',
    links: [
      { name: 'Airtribe', url: 'https://www.airtribe.live/' },
      { name: 'Growjunction', url: 'https://www.growjunction.com/' },
      { name: 'Nextleap', url: 'https://nextleap.app/' },
      { name: 'Upraised', url: 'https://www.upraised.co/careers' },
    ],
  },
  {
    category: 'UX / UI Design',
    links: [{ name: 'UX Mint', url: 'https://www.uxmint.in/' }],
  },
  {
    category: 'IT Sales / Inside Sales',
    links: [],
    note: 'To enquire about online courses, send your contact number and email to santhanakrishnane5@gmail.com',
  },
];

export function CourseLinks() {
  return (
    <div className='w-full max-w-4xl mx-auto mt-14'>
      {/* Header */}
      <div className='mb-8'>
        <p className='text-primary font-bold text-xs tracking-[0.18em] uppercase mb-2'>
          What&apos;s Next
        </p>
        <h2 className='text-xl font-black'>Recommended Upskilling Resources</h2>
        <p className='text-muted-foreground text-sm mt-1'>
          Curated platforms to help you build your backup career.
        </p>
      </div>

      {/* Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        {COURSES.map((section) => (
          <div
            key={section.category}
            className='bg-card border border-foreground/10 rounded-2xl p-5'
          >
            {/* Category */}
            <p className='text-xs font-bold tracking-widest uppercase text-primary mb-3'>
              {section.category}
            </p>

            {/* Links */}
            {section.links.length > 0 && (
              <div className='flex flex-col gap-2'>
                {section.links.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center justify-between group text-sm text-foreground/80 hover:text-primary transition-colors'
                  >
                    <span>{link.name}</span>
                    <span className='text-foreground/30 group-hover:text-primary transition-colors text-xs'>
                      ↗
                    </span>
                  </a>
                ))}
              </div>
            )}

            {/* Note (IT Sales) */}
            {section.note && (
              <p className='text-muted-foreground text-xs leading-relaxed'>
                {section.note.split('santhanakrishnane5@gmail.com')[0]}
                <a
                  href='mailto:santhanakrishnane5@gmail.com'
                  className='text-primary hover:text-primary/70 transition-colors'
                >
                  santhanakrishnane5@gmail.com
                </a>
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

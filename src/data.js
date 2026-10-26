const GH = 'https://github.com/RitalALghates'

export const profile = {
  name: 'Rital Alghates',
  arabicName: 'ريتال الغيهات',
  role: 'Software Engineer · Full-Stack Developer · UI/UX Designer',
  location: 'Jeddah, Saudi Arabia',
  github: GH,
  linkedin: 'https://www.linkedin.com/in/rital-al-ghates-8212b7317/',
  summary:
    'Software Engineering graduate (First Class Honors) from the University of Jeddah. I design and build thoughtful, bilingual digital products — from polished web apps to Android apps and 3D games.',
}

export const projects = [
  {
    id: 'urbanflow',
    title: 'UrbanFlow',
    subtitle: 'أوربان فلو',
    kind: 'Web simulator',
    image: './projects/urbanflow.png',
    description:
      'An interactive urban mobility simulator for testing pedestrian bridges and smart parking allocation, with before-and-after comparisons and Arabic / English support.',
    tags: ['JavaScript', 'Simulation', 'Smart Cities', 'RTL'],
    demo: 'https://ritalalghates.github.io/UrbanFlow/',
    repo: `${GH}/UrbanFlow`,
    demoLabel: 'Live demo',
  },
  {
    id: 'bookportal',
    title: 'BookPortal',
    subtitle: 'Share textbooks. Save money.',
    kind: 'Full-stack web app',
    image: './projects/bookportal.png',
    description:
      'A textbook lending and exchange platform for students: live catalogue with search and filters, validated listing form with cover upload, request dialogs and a warm library-inspired design system.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'Express'],
    demo: 'https://ritalalghates.github.io/BookPortal/',
    repo: `${GH}/BookPortal`,
    demoLabel: 'Live demo',
  },
  {
    id: 'events-platform',
    title: 'Events Platform',
    subtitle: 'منصة الفعاليات',
    kind: 'Bilingual website',
    image: './projects/events-website.png',
    description:
      'Discover and book cultural and entertainment events in Saudi Arabia. A cinematic slider, live search, favourites, accounts and ticket booking — in Arabic and English.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Bilingual'],
    demo: 'https://ritalalghates.github.io/Events-website/',
    repo: `${GH}/Events-website`,
    demoLabel: 'Live demo',
  },
  {
    id: 'eventbook',
    title: 'EventBook',
    subtitle: 'منصة الفعاليات · RTL',
    kind: 'Responsive web app',
    image: './projects/events-platform.png',
    description:
      'A clean, responsive Arabic (RTL) platform to explore and book local events. Filter by city and category, view event details and book in a few taps.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsive'],
    demo: 'https://ritalalghates.github.io/Events-platform/',
    repo: `${GH}/Events-platform`,
    demoLabel: 'Live demo',
  },
  {
    id: 'activetech',
    title: 'Active Tech',
    subtitle: 'Tech events, communities & chat',
    kind: 'Android app',
    image: './projects/activetech.png',
    description:
      'An Android app built with Java and Firebase to discover tech events, join communities and chat. Try the interactive phone demo in the browser or install the APK.',
    tags: ['Java', 'Android', 'Firebase', 'Firestore'],
    demo: 'https://ritalalghates.github.io/activetech-app/',
    repo: `${GH}/activetech-app`,
    demoLabel: 'Live demo',
  },
  {
    id: 'treasure-escape',
    title: 'Treasure Escape',
    subtitle: 'A small ocean. A grand adventure.',
    kind: '3D game',
    image: './projects/treasure-escape.png',
    description:
      'A single-player 3D adventure: sail to an abandoned ship, face the spider guardian and sneak home — but the louder you are, the closer the shark gets. Built in Unity and C# with Blender models.',
    tags: ['Unity', 'C#', 'Blender', 'Game AI'],
    demo: `${GH}/TreasureEscape-Windows-Game/releases/latest`,
    repo: `${GH}/TreasureEscape-Windows-Game`,
    demoLabel: 'Play the game',
  },
]

export const skills = [
  'React',
  'JavaScript',
  'HTML & CSS',
  'Node.js',
  'Java',
  'Android',
  'Firebase',
  'Python',
  'Flask',
  'Flutter',
  'Unity · C#',
  'Blender',
  'UI/UX Design',
  'SQL',
  'Git & GitHub',
  'Three.js',
]

export const journey = [
  {
    date: 'Oct 2026',
    title: 'AI in Game Design & Development',
    place: 'Saudi Digital Academy × Alfaisal University',
    text: 'Bootcamp project: Treasure Escape, a 3D adventure with a shark that adapts to the player’s noise.',
  },
  {
    date: 'Jul 2026',
    title: 'B.Sc. Software Engineering — First Class Honors',
    place: 'University of Jeddah',
    text: 'Graduated, and presented the senior project Muntalaq: an AI-powered academic mentorship platform.',
  },
  {
    date: 'Nov 2025',
    title: 'Hajj Logistics Hackathon 2025',
    place: 'With the Ministry of Hajj and Umrah',
    text: 'Four intense days building technology solutions to improve the experience of the Guests of Allah. Also joined the KAUST Academy Energy Transition specialization.',
  },
  {
    date: '2025',
    title: 'LEAP 2025 · Launchpad Bootcamp · Excel certification',
    place: 'Conference, entrepreneurship bootcamp and Doroob',
    text: 'Reached the second phase of Launchpad, attended LEAP, and earned a Microsoft Excel certificate.',
  },
]

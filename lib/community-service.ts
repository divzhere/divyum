export const rotaractRoles = [
  {
    title: "Team Leader",
    period: "July–September 2017",
    dateTime: "2017-07/2017-09",
    description:
      "I began by leading a team of general body members and learning how the club worked from the ground up.",
  },
  {
    title: "Team Coordinator",
    period: "September–December 2017",
    dateTime: "2017-09/2017-12",
    description:
      "I moved into a coordinating role, supporting team leaders and helping several volunteer teams work together.",
  },
  {
    title: "Joint Secretary",
    period: "January–June 2018",
    dateTime: "2018-01/2018-06",
    description:
      "I helped the club run day to day, including membership records, committee appointments, attendance, dues and club documents.",
  },
  {
    title: "President",
    period: "June 2018–June 2019",
    dateTime: "2018-06/2019-06",
    description:
      "I presided over the club and Board of Directors, coached committees and represented an 800+ member nonprofit across the Tricity.",
  },
] as const;

export const rotaractStructure = [
  {
    title: "President",
    detail: "Presided over the club and Board of Directors",
    count: "1",
  },
  {
    title: "Board of Directors",
    detail: "Governed the club through its constitution",
    count: "Board",
  },
  {
    title: "Team coordinators",
    detail: "Each supported 7–8 team leaders",
    count: "1:7–8",
  },
  {
    title: "Team leaders",
    detail: "Led the club's volunteer teams",
    count: "40–50",
  },
  {
    title: "General body members",
    detail: "10–15 members worked in each team",
    count: "10–15",
  },
] as const;

export const rotaractEvents = [
  {
    title: "Annual recruitment",
    period: "Every September",
    description:
      "We conducted group discussions and personal interviews for 1,500–2,000 people aged 18–30, followed by an orientation and full-body meeting for the selected members.",
  },
  {
    title: "Pirates of the City",
    period: "Annual fundraiser",
    description:
      "A Chandigarh-wide treasure hunt for teams of two to five. Participants followed clues across the city, while sponsorships and ticket sales funded service work.",
  },
  {
    title: "Roshni",
    period: "Diwali fundraiser",
    description:
      "Rotaractors painted diyas with people at old-age homes, orphanages and childcare centres. We sold the decorated diyas and directed the proceeds to charitable causes.",
  },
  {
    title: "Christmas at our Happy Schools",
    period: "Every December",
    description:
      "We spent Christmas with children at the schools and care centres we supported, with activities, performances and gifts.",
  },
  {
    title: "Kids' Olympics",
    period: "Annual flagship event",
    description:
      "A day of outdoor sports and talent activities for children from schools, childcare centres and orphanages. Later editions continued the format at scale, including one with more than 520 participants.",
    sourceLabel: "Times of India archive",
    sourceUrl:
      "https://timesofindia.indiatimes.com/entertainment/events/chandigarh/talent-hunt-outdoor-activities-mark-kids-olympics/articleshow/74306511.cms",
  },
  {
    title: "Salsa Slam",
    period: "Valentine week fundraiser",
    description:
      "A Chandigarh-level charity salsa workshop and social. Different editions raised money for community causes, including support for acid-attack survivors.",
    sourceLabel: "Event archive",
    sourceUrl: "https://www.whatshot.in/chandigarh/salsa-slam-e-368345",
  },
  {
    title: "More ways to raise funds",
    period: "Across the tenure",
    description:
      "We also organised gaming, bowling and futsal events to bring people together and fund the club's community programmes.",
  },
] as const;

export const rotaractInitiatives = [
  {
    title: "Happy School",
    description:
      "We adopted ten schools during my tenure and worked on classrooms, seating, lights, fans, washrooms, libraries and sports equipment so children had a safer, more encouraging place to learn.",
    sources: [
      {
        label: "The Better India",
        url: "https://thebetterindia.com/87741/rotaract-club-chandigarh-happy-schools-project/",
      },
      {
        label: "Project update",
        url: "https://x.com/rcch3080/status/1153722778018668544?s=20",
      },
    ],
  },
  {
    title: "Apni Pathshala",
    description:
      "An adult-literacy programme that trained volunteers and brought regular classes and literacy outreach into underserved communities.",
  },
  {
    title: "Child Development",
    description:
      "Volunteers ran regular learning, sports and creative activities with children at our Happy Schools.",
  },
  {
    title: "Interact",
    description:
      "We helped schools in Chandigarh open and mentor Interact clubs, giving school students an early route into service and leadership.",
  },
  {
    title: "International Services",
    description:
      "We built the Himalayan Challenge website and collaborated with Rotaract clubs across India on service projects. We also helped clubs understand the Kids' Olympics format so they could run it in their own cities.",
  },
  {
    title: "Menstrual Hygiene",
    description:
      "Dr Sneha Rooh trained our volunteers, who then led menstrual-hygiene conversations in underserved settlements with a more informed and humane approach.",
  },
  {
    title: "Cleanliness and Waste Management",
    description:
      "Volunteer teams organised cleanliness activities around Chandigarh and used them to build practical awareness about waste.",
  },
  {
    title: "Animal Welfare",
    description:
      "We worked on animal-welfare and vegan-awareness initiatives, including the two-day Vegan Food Carnival at UIET, Panjab University, on 14–15 April 2018.",
  },
] as const;

export const rotaractCommittees = [
  ["RotaTech", "Technology for the club and its projects"],
  ["Canvas", "Art, event ambience and Happy School wall painting"],
  ["Content Writers", "Social writing and public communication"],
  ["Designing Team", "Graphic and print design"],
  ["Snapshot", "Event and project photography"],
  ["Public Relations", "Press and media relationships"],
  ["RH Theatre", "Theatre events and nukkad nataks"],
  ["RH Band", "Music and live performances"],
  ["Happy Feet", "Dance events and performances"],
  ["Eloquence", "Speakers, hosts and event anchors"],
  ["Marketing", "Sponsorships, partnerships and CSR work"],
] as const;

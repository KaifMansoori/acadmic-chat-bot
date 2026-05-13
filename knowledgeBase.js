/**
 * MODULE: Knowledge Base (KB)
 * This file serves as the primary data source for academic streams, 
 * career paths, and suggested courses. It is used by the AI model 
 * to provide structured and accurate guidance.
 */

const knowledgeBase = {
  // Categorization of academic paths based on high school streams
  streams: {
    science: {
      name: "Science",
      paths: [
        { title: "Engineering", courses: ["B.Tech", "Computer Science", "Mechanical"], description: "For those who love building things and problem-solving." },
        { title: "Medical", courses: ["MBBS", "BDS", "Pharmacy"], description: "For those interested in healthcare and biological sciences." },
        { title: "Research", courses: ["B.Sc Physics", "Astrophysics", "Biotechnology"], description: "For future scientists and researchers." },
        { title: "Data Science", courses: ["Statistics", "AI & ML", "Data Analytics"], description: "For those who love working with numbers and technology." }
      ]
    },
    commerce: {
      name: "Commerce",
      paths: [
        { title: "Accounting", courses: ["CA (Chartered Accountant)", "B.Com", "CFA"], description: "For those interested in finance and taxation." },
        { title: "Management", courses: ["BBA", "MBA", "Event Management"], description: "For future leaders and business managers." },
        { title: "Banking", courses: ["B.Com Finance", "Investment Banking", "Actuarial Science"], description: "For careers in banks and financial institutions." },
        { title: "Marketing", courses: ["Digital Marketing", "Public Relations", "Sales"], description: "For creative minds interested in business growth." }
      ]
    },
    arts: {
      name: "Arts",
      paths: [
        { title: "Design", courses: ["B.Des", "Graphic Design", "Architecture"], description: "For creative students interested in visual arts." },
        { title: "Law", courses: ["BA LLB", "Corporate Law", "Legal Studies"], description: "For those interested in justice and legal systems." },
        { title: "Media", courses: ["Journalism", "Mass Communication", "Filmmaking"], description: "For those who want to work in news or entertainment." },
        { title: "Psychology", courses: ["BA Psychology", "Counseling", "Social Work"], description: "For those interested in human behavior and mental health." }
      ]
    }
  },
  // Global resources available for all students
  general_resources: [
    "Khan Academy for all levels",
    "Coursera for specialized certifications",
    "edX for university courses"
  ]
};

module.exports = knowledgeBase;


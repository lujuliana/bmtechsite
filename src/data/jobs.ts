// export type careersLocale = 'en' | 'ja';

export interface Jobs {
  slug: string;
  title: string;
  location: string;
  employmentType: string;
  overview: string;
  responsibilities: string[];
  requirements: string[];
  preferred: string[];
}

export const jobs: Jobs[] = [
  // QA manager
  {
    slug: "quality-assurance-engineer",
    title: "Quality Assurance Engineer",
    location: "Dallas, TX",
    employmentType: "Full-time",
    overview:
      "BMTech is seeking a Quality Assurance Manager or Quality Assurance Engineer to help ensure the quality and reliability of our battery management and energy storage products. In this role, you will collaborate with engineering, manufacturing, and cross-functional teams to support new product development, drive continuous improvement, and maintain high-quality standards throughout the product lifecycle.",
    responsibilities: [
      "Lead quality assurance activities throughout new product development.",
      "Identify quality issues, perform root cause analysis, and implement corrective and preventive actions.",
      "Coordinate with engineering and manufacturing to review and implement design changes.",
      "Monitor product quality metrics and drive continuous improvement initiatives.",
      "Support Advanced Product Quality Planning(APQP) and R& D quality assurance activities.",
      "Maintain quality documentation, issue tracking, and engineering change records.",
      "Conduct quality reviews and help establish quality standards and best practices.",
      "Collaborate with cross - functional teams to support company quality initiatives.",
    ],
    requirements: [
      "Bachelor's degree in engineering or a related technical field.",
      "3+ years of experience in quality assurance or quality management within automotive electronics, battery systems, energy storage, or a related industry.",
      "Experience with IATF 16949, ISO 9001, APQP, and quality auditing.",
      "Knowledge of battery systems, inverters, energy storage systems, or other power electronics.",
      "Experience with product testing, failure analysis, and quality improvement methodologies.",
      "Strong analytical, organizational, and problem-solving skills.",
      "Excellent communication skills and the ability to work effectively in a cross-functional environment.",
    ],
    preferred: [
      "Experience with photovoltaic (PV) or energy storage products.",
      "Experience handling customer quality issues and preparing 8D reports.",
      "Mandarin Chinese language proficiency. ",
    ],
  },
  // business analytics
  {
    slug: "business-analytics-specialist",
    title: "Business Analytics Specialist",
    location: "Dallas, TX",
    employmentType: "Full-time",
    overview:
      "BMTech is seeking a Business Analytics Specialist to transform data into actionable insights that drive business decisions. In this role, you will work with cross-functional teams to develop analytical solutions, improve business processes, and support strategic initiatives across the organization.",
    responsibilities: [
      "Design, maintain, and query relational databases to ensure data accuracy and integrity.",
      "Develop dashboards, reports, and data visualizations to communicate business insights.",
      "Integrate data from multiple internal and external sources to support analytics initiatives.",
      "Work across cross-functional teams to solve business challenges using data-driven solutions.",
      "Present analytical findings and recommendations to technical and non-technical stakeholders.",
      "Support business planning and executive decision-making through reporting, performance analysis, and forecasting.",
      "Identify opportunities to improve processes, reporting, and data quality.",
    ],
    requirements: [
      "Bachelor's degree in Business, Analytics, Computer Science, Engineering, Mathematics, Statistics, Economics, Finance, or a related quantitative field.",
      "2+ years of experience in business analytics, data analysis, or a related role.",
      "Experience with SQL and relational databases.",
      "Experience using Microsoft Excel and other Microsoft Office applications.",
      "Strong analytical, problem-solving, and communication skills.",
      "Ability to work collaboratively across cross-functional teams and communicate insights to both technical and non-technical audiences.",
    ],
    preferred: [
      "Experience with Python for data analysis or automation.",
      "Experience with business intelligence and data visualization tools such as Tableau or Power BI.",
      "Experience with database management and ETL or data integration processes.",
      "Master's degree in Business Analytics, Data Analytics, Statistics, Economics, Finance, Engineering, or a related field.",
      "Mandarin Chinese language proficiency.",
    ],
  },
  // SWE
  {
    slug: "software-engineer",
    title: "Software Engineer",
    location: "Dallas, TX",
    employmentType: "Full-time",
    overview:
      "BMTech is seeking a Software Engineer to join our engineering team developing embedded software for advanced battery management systems (BMS). This is an excellent opportunity for recent graduates and early-career engineers to gain hands-on experience designing, testing, and optimizing embedded software while working alongside experienced engineers in the clean energy industry.",
    responsibilities: [
      "Develop and maintain embedded software for battery management systems using C.",
      "Design, implement, test, and debug firmware for microcontroller-based platforms.",
      "Develop and execute unit tests and support software validation activities.",
      "Collaborate with hardware, test, and manufacturing teams to integrate and troubleshoot embedded systems.",
      "Participate in code reviews and contribute to software quality and continuous improvement.",
      "Create and maintain technical documentation, including design specifications and test reports.",
      "Support hardware-in-the-loop (HIL) testing and system integration.",
      "Stay current with embedded software development tools and industry best practices. ",
    ],
    requirements: [
      "Bachelor's degree in Computer Science, Computer Engineering, Electrical Engineering, or a related technical field.",
      "Experience with C programming through coursework, academic projects, internships, or professional work.",
      "Solid understanding of data structures, algorithms, computer architecture, and operating systems.",
      "Experience using Git or other version control systems.",
      "Strong analytical, problem-solving, and communication skills.",
      "Ability to work effectively both independently and in a collaborative team environment. ",
    ],
    preferred: [
      "Coursework, internship, or project experience with ARM, STM32, AVR, PIC, or similar microcontrollers.",
      "Familiarity with embedded debugging tools and communication protocols such as UART, SPI, I²C, and CAN.",
      "Exposure to real-time operating systems (RTOS) such as FreeRTOS.",
      "Programming experience with Python or MATLAB.",
      "Familiarity with Linux development environments.",
      "Coursework, internship, or project experience with battery management systems (BMS), power electronics, or energy storage technologies.",
      "Mandarin Chinese language proficiency.",
    ],
  },
];

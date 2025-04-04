export const knowledgeBaseData = [
  {
    category: 'Accounts & Access',
    articles: [
      {
        title: 'Reset Your Password or Unlock Your Account',
        summary: 'Use the CSUDH Self-Service Password Reset (SSPR) portal to reset or unlock your Toro account.',
        details: `If you've forgotten your password or are locked out of your account, use the SSPR portal to reset it securely.`,
        links: [{ label: 'Go to SSPR Portal', url: 'https://password.csudh.edu' }],
      },
      {
        title: 'Retrieve Your Username or Employee ID',
        summary: 'Need your username? Use this lookup if you’re a new employee or applicant.',
        details: `You’ll need at least 4 of the 5 required pieces of personal info. The lookup is a two-step verification process.`,
        links: [{ label: 'Retrieve Username', url: 'https://www.csudh.edu/username-lookup' }],
      },
      {
        title: 'Request Login for New or Returning Employees',
        summary: 'Managers can request login credentials for new hires.',
        details: `This process must be initiated by a resource or hiring manager through ServiceNow.`,
        links: [{ label: 'Submit Request via ServiceNow', url: 'https://csudh.service-now.com' }],
      },
      {
        title: 'Create a Strong Password',
        summary: 'Tips for building strong, secure passwords.',
        details: `Passwords must now be 12 characters minimum. Consider using passphrases with mixed case, numbers, and special characters. Passwords expire every 180 days.`,
      },
      {
        title: 'Set Up or Change SSPR Security Questions',
        summary: 'Register or update your backup phone/email/security questions.',
        details: `Keeping your recovery info up to date helps avoid lockouts.`,
        links: [{ label: 'Manage SSPR Settings', url: 'https://password.csudh.edu' }],
      },
    ],
  },

  {
    category: 'Business Applications & Reporting',
    articles: [
      {
        title: 'PeopleSoft Access & Forms',
        summary: 'Forms for requesting access to PeopleSoft modules.',
        details: `Access is available to faculty, staff, and student workers who require it for job responsibilities.`,
        links: [{ label: 'Access Request Forms', url: 'https://www.csudh.edu/peoplesoft/forms' }],
      },
      {
        title: 'myCSUDH Overview',
        summary: 'Your portal to student, faculty, and staff self-service tools.',
        details: `Access student records, financial info, course registration, and more.`,
        links: [{ label: 'Go to myCSUDH', url: 'https://my.csudh.edu' }],
      },
      {
        title: 'Employee Email (Outlook)',
        summary: 'Send and receive official campus communications.',
        details: `All employees receive Outlook-based email accounts through Microsoft 365.`,
        links: [{ label: 'Access Webmail', url: 'https://outlook.office365.com' }],
      },
      {
        title: 'Toropay (Student Payments)',
        summary: 'Secure student account billing and payments.',
        details: `Toropay provides real-time access to tuition billing and payment history.`,
        links: [{ label: 'Access Toropay', url: 'https://toropay.csudh.edu' }],
      },
    ],
  },

  {
    category: 'Communication & Collaboration',
    articles: [
      {
        title: 'Microsoft Teams',
        summary: 'Chat and collaborate across campus using Teams.',
        details: `Microsoft Teams is part of Office 365 and offers instant messaging, video conferencing, and file sharing.`,
        links: [{ label: 'Open Microsoft Teams', url: 'https://teams.microsoft.com' }],
      },
      {
        title: 'Zoom Meetings',
        summary: 'Host video meetings, webinars, and record lectures.',
        details: `Zoom supports classes, office hours, remote meetings, and lecture capture across platforms.`,
        links: [{ label: 'Log in to Zoom', url: 'https://csudh.zoom.us' }],
      },
      {
        title: 'LinkedIn Learning',
        summary: 'Access expert-led tutorials for software and skills.',
        details: `All students, faculty, and staff have free access to LinkedIn Learning. Log in using your CSUDH credentials.`,
        links: [{ label: 'Start Learning', url: 'https://www.linkedin.com/learning-login/' }],
      },
      {
        title: 'Clearspan Communicator',
        summary: 'Use your campus extension on a mobile device.',
        details: `Route and receive campus calls through your device. No need to forward from your office line.`,
        links: [{ label: 'Clearspan Web Portal', url: 'https://csudh.clearspancloud.com' }],
      },
    ],
  },

  {
    category: 'Hardware & Software',
    articles: [
      {
        title: 'Adobe Creative Cloud',
        summary: 'Get access to Photoshop, Illustrator, InDesign and more.',
        details: `CSUDH provides Creative Cloud licenses to students, faculty, and staff for creative and academic work.`,
        links: [{ label: 'Download Adobe CC', url: 'https://www.csudh.edu/adobe' }],
      },
      {
        title: 'Technology Checkout Program',
        summary: 'Borrow laptops, webcams, and more.',
        details: `Students can check out equipment needed for class assignments or remote learning.`,
        links: [{ label: 'Tech Checkout Info', url: 'https://www.csudh.edu/it/checkout' }],
      },
      {
        title: 'Microsoft 365 Access',
        summary: 'Install Word, Excel, PowerPoint, Outlook, and more.',
        details: `Available to all active CSUDH students and employees.`,
        links: [{ label: 'Install Office', url: 'https://portal.office.com' }],
      },
    ],
  },

  {
    category: 'IT Continuity Resources',
    articles: [
      {
        title: 'Secure VPN Access (GlobalProtect)',
        summary: 'Use CSUDH VPN to access campus resources remotely.',
        details: `The secure VPN allows employees to safely access university systems from home.`,
        links: [{ label: 'Download GlobalProtect', url: 'https://www.csudh.edu/vpn' }],
      },
      {
        title: 'Remote Desktop',
        summary: 'Work remotely as if you’re on your campus desktop.',
        details: `Use Remote Desktop in combination with VPN to access files, software, and resources securely.`,
        links: [{ label: 'Remote Desktop Setup', url: 'https://www.csudh.edu/remote-access' }],
      },
    ],
  },

  {
    category: 'Network',
    articles: [
      {
        title: 'Campus Wi-Fi (Eduroam)',
        summary: 'Connect to wireless internet using your CSUDH credentials.',
        details: `Select the 'eduroam' network and sign in with your full ToroMail address.`,
        links: [{ label: 'Wi-Fi Setup Instructions', url: 'https://www.csudh.edu/wifi' }],
      },
      {
        title: 'Ethernet Access',
        summary: 'Use a wired connection in campus offices.',
        details: `Ethernet offers the most stable connection and is recommended for critical use cases.`,
        links: [{ label: 'Submit Ethernet Request', url: 'https://csudh.service-now.com' }],
      },
      {
        title: 'Network Authentication Help',
        summary: 'Learn about access requirements and validation steps.',
        details: `Understand the terms: authentication, validation key, and what to expect when accessing secure networks.`,
      },
    ],
  },

  {
    category: 'Security',
    articles: [
      {
        title: 'Set Up Multi-Factor Authentication (MFA)',
        summary: 'Protect your account with Duo multi-factor authentication.',
        details: `Duo MFA is required for secure logins to Toro systems. Approve login requests via push notification, code, or token.`,
        links: [{ label: 'Duo Setup Guide', url: 'https://www.csudh.edu/duo' }],
      },
      {
        title: 'Recognize Phishing Attempts',
        summary: 'Tips to avoid fraudulent emails and scams.',
        details: `Phishing emails try to steal login info or personal data. Never click suspicious links or download unexpected attachments.`,
        links: [{ label: 'Report Phishing', url: 'https://csudh.service-now.com' }],
      },
      {
        title: 'Proofpoint Email Security',
        summary: 'Spam filtering system protecting university email.',
        details: `Proofpoint inspects emails for malware and phishing. Use the Web App to review quarantined messages.`,
        links: [{ label: 'Access Proofpoint', url: 'https://login.proofpoint.com' }],
      },
      {
        title: 'Security Awareness Training',
        summary: 'Take online training to protect university systems.',
        details: `All staff are encouraged to complete short modules on safe data handling and cyber hygiene.`,
        links: [{ label: 'Start Training', url: 'https://csudh.securityeducation.com' }],
      },
      {
        title: 'Request a Duo Token',
        summary: 'Get a hardware token for Duo authentication.',
        details: `Submit a request to have a token shipped to your address.`,
        links: [{ label: 'Request Duo Token', url: 'https://csudh.service-now.com' }],
      },
    ],
  },

  {
    category: 'Teaching & Learning',
    articles: [
      {
        title: 'Canvas Learning Management System',
        summary: 'Use Canvas to manage coursework, assignments, and grades.',
        details: `Canvas is CSUDH’s official LMS. Students and instructors can access course materials, submit assignments, and communicate online.`,
        links: [{ label: 'Log in to Canvas', url: 'https://canvas.csudh.edu' }],
      },
      {
        title: 'Blackboard (Archived Content)',
        summary: 'Access Blackboard for courses from previous terms.',
        details: `Some past courses still reside in Blackboard. Use it to review old materials as needed.`,
        links: [{ label: 'Visit Blackboard', url: 'https://blackboard.csudh.edu' }],
      },
      {
        title: 'LinkedIn Learning for Faculty & Students',
        summary: 'Explore instructional technology and course design tips.',
        details: `Use tutorials to learn educational tools like Canvas, Zoom, and Microsoft Teams.`,
        links: [{ label: 'Start LinkedIn Learning', url: 'https://www.linkedin.com/learning-login/' }],
      },
    ],
  },

  {
    category: 'TV & Media Production',
    articles: [
      {
        title: 'Digital Media Services',
        summary: 'Support for lecture recording and digital content creation.',
        details: `Faculty can request help with media production, classroom capture, and editing assistance.`,
        links: [{ label: 'Request Media Support', url: 'https://csudh.service-now.com' }],
      },
      {
        title: 'Campus TV Studio Booking',
        summary: 'Reserve time to record in the CSUDH studio.',
        details: `Faculty and departments can reserve studio space for professional recordings.`,
        links: [{ label: 'Studio Booking Request', url: 'https://csudh.service-now.com' }],
      },
      {
        title: 'Live Event Production',
        summary: 'Plan and coordinate live streaming or broadcast for events.',
        details: `Submit a request for media services to support on-campus or virtual events.`,
        links: [{ label: 'Request Event Coverage', url: 'https://csudh.service-now.com' }],
      },
    ],
  },

  {
    category: 'University Printing Services',
    articles: [
      {
        title: 'How to Use ToroPrint',
        summary: 'A guide to placing print orders using the CSUDH ToroPrint digital storefront.',
        details: `ToroPrint is CSUDH's online ordering portal for printing services. Use your internal department code to pay online.

Personal jobs must be paid with cash or check at the print shop.`,
        links: [{ label: 'Visit ToroPrint', url: 'https://www.csudh.edu/toroprint' }],
      },
      {
        title: 'Place a Print Order via ToroPrint',
        summary: 'Step-by-step guide for placing orders through the digital storefront.',
        details: `Prepare project dimensions, color options, and quantity before ordering.`,
        links: [{ label: 'Go to ToroPrint', url: 'https://www.csudh.edu/toroprint' }],
      },
      {
        title: 'Order Business Cards in ToroPrint',
        summary: 'Instructions for ordering professional business cards.',
        details: `Enter your contact info in the templated fields and preview before submitting.`,
        links: [{ label: 'Order Business Cards', url: 'https://www.csudh.edu/toroprint' }],
      },
      {
        title: 'ToroPrint Video Tutorials',
        summary: 'Watch short videos on how to place orders using ToroPrint.',
        details: `Covers how to order exams, banners, and business cards.`,
        links: [
          { label: 'View Tutorials on YouTube', url: 'https://www.youtube.com/results?search_query=CSUDH+Toroprint' },
        ],
      },
      {
        title: 'University Printing Services - FAQ',
        summary: 'Common issues and account questions.',
        details: `If you can't log in to ToroPrint, submit a ticket.\nTo authorize Dept ID payments, have your ARM submit a request.`,
        links: [{ label: 'Submit ServiceNow Ticket', url: 'https://csudh.service-now.com' }],
      },
      {
        title: 'Wepa Printing for Students',
        summary: 'Campus-wide self-service printing with Wepa.',
        details: `Upload from any device or print at campus kiosks. Supports web and mobile uploads.`,
        links: [{ label: 'Learn More about Wepa', url: 'https://www.wepanow.com/' }],
      },
    ],
  },
];

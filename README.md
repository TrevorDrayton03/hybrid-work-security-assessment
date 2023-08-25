# Hybrid Work Security Assessment

This application assesses compliance of TRU staff's personal devices with TRU's HIPS (Host-Based Intrustion Prevention System) to allow staff to connect remotely 
to TRU's network for the Hybrid Work Program. It accomplishes this task by making network requests to an apache server, which interfaces
with a HIPS server, for each HIPS rule.
The HIPS rules assess the user's device and return a response status based on the result of the assessment. 
 

## Features:
- Gets instructions from a rules_config.json file and stores them in state for rule evaluation.
- Logs each assessment to a database.
- A device-friendly, responsive design.
- Ensures cross-browser compatibility.
- Learnable and easy to use (UX).
- Complies with ES6 standards for code readability, maintainability, and modern features.
- Robust error handling.
- The code is well documented, modular, cohesive, testable, and reusable. 

## Libraries/Dependencies:
- Node.js: JavaScript runtime environment.
- React: JavaScript library for building user interfaces.
- Bootstrap & React-Bootstrap: Popular CSS framework for responsive and mobile-first web development.
- MariaDB: Database management system for storing the data of the security check assessments.
- Express: Web application framework for building server side applications in Node.js.
- react-scripts: Configuration and scripts for running a React application in development and production environments.
- uuid: Library for generating unique identifiers (UUIDs) for each user.
- whatwg-fetch: Polyfill that provides a global fetch function for making web requests in browsers that do not support the native Fetch API.
- react-icons: Library of icons for React applications, used for the copy UUID button.
 
## Web Vital Statistics:
- FCP (First Contentful Paint): 800ms to 1200ms
- TTFB (Time to First Byte): 100ms to 300ms
- FID (First Input Delay): 10ms to 100ms

## Documentation
- [User Stories.docx](https://github.com/TrevorDrayton03/hybrid-work-security-assessment/files/12443731/User.Stories.docx)
- [ITS User Guide.docx](https://github.com/TrevorDrayton03/hybrid-work-security-assessment/files/12443732/ITS.User.Guide.docx)
- [Appendix A - Glossary.docx](https://github.com/TrevorDrayton03/hybrid-work-security-assessment/files/12443733/Appendix.A.-.Glossary.docx)


Thompson Rivers University, Co-op

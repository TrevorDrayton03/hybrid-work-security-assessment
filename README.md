# Hybrid Work Security Assessment

It is with TRU's (Thompson Rivers University's) permission that I make this public on GitHub.

The Hybrid Work Security Assessment (HWSA) checks if individual devices (clients) meet TRU's security standards. Passing the HWSA is a mandatory requirement for joining the Hybrid Work Program. 

HIPS rules are checked regularly and asynchronously from a separate process. The HWSA is specifically designed to interact flexibly with this process, allowing it to be easily reconfigured when the process undergoes changes.
 
## Documentation
- [User Stories.docx](https://github.com/TrevorDrayton03/hybrid-work-security-assessment/files/12443731/User.Stories.docx)
- [ITS User Guide.docx](https://github.com/TrevorDrayton03/hybrid-work-security-assessment/files/12443732/ITS.User.Guide.docx)
- [Appendix A - Glossary.docx](https://github.com/TrevorDrayton03/hybrid-work-security-assessment/files/12443733/Appendix.A.-.Glossary.docx)

## Features
- Gets instructions from a rules_config.json file and stores them in state for rule evaluation.
- Logs each assessment to a database.
- A device-friendly, responsive design.
- Learnable and easy to use.
- Complies with ES6 standards for code readability, maintainability, and modern features.
- Robust error handling and data sanitization.
- Well documented, modular, cohesive, and testable. 

## Libraries/Dependencies
- Node.js: JavaScript runtime environment.
- React: JavaScript library for building user interfaces.
- Bootstrap & React-Bootstrap: Popular CSS framework for responsive and mobile-first web development.
- MariaDB: Database management system for storing the data of the security check assessments.
- Express: Web application framework for building server side applications in Node.js.
- react-scripts: Configuration and scripts for running a React application in development and production environments.
- uuid: Library for generating unique identifiers (UUIDs) for each user.
- whatwg-fetch: Polyfill that provides a global fetch function for making web requests in browsers that do not support the native Fetch API.
- react-icons: Library of icons for React applications, used for the copy UUID button.
 
## Web Vital Statistics
- FCP (First Contentful Paint): 800ms to 1200ms
- TTFB (Time to First Byte): 100ms to 300ms
- FID (First Input Delay): 10ms to 100ms



Thompson Rivers University, Co-op

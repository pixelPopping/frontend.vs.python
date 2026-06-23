# Space Mission Planner

Full-stack application built with:

- React
- Flask
- MongoDB
- JWT Authentication
- Axios
- REST API

Features:
- User registration
- Login with JWT
- Captain/Crew roles
- Mission creation
- Mission acceptance workflow
- SpaceX mission resources
- Automatic fallback data when external APIs are unavailable


Testing Environment

The frontend application was tested using Vitest and
React Testing Library.

A total of 50 automated tests were created covering:

- Authentication
- Protected routes
- Dashboard pages
- Forms and validation
- Mission management components
- Navigation

Current test results:

Passed: 35
Failed: 15

The remaining failures are mainly related to test mocks
and configuration rather than application functionality.
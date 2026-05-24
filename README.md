# TrueSplit 💸
Full Stack Expense Splitting app with greedy debt Settlement algorithm

## Features
- Create groups and invite members via invite code
- Add expenses with equal/custom splits
- Greedy algorithm to minimize settlement transactions
- Email notifications on new expenses
- Activity feed per group

## Live Demo
[https://truesplit.vercel.app](https://truesplit.vercel.app)


## Tech Stack
- Frontend: React+vite
- Backend: NodeJs, Express , Nodemailer 
- Database: MongoDB

## Getting Started

### Prerequisites
node

### Installation
Step by step commands to run locally:
1. Clone the repo
2. cd into server, npm install
3. Create .env file in /server with the variable listed below
4. npm run dev

### Environment Variables
MONGO_URI
REFRESH_TOKEN_SECRET_KEY
REFRESH_TOKEN_EXPIRESIN
ACCESS_TOKEN_SECRET_KEY
ACCESS_TOKEN_EXPIRESIN
MAIL_USER
MAIL_PASS


## API Documentation
See [SYSTEM_DESIGN.md](./SYSTEM_DESIGN.md) for full API design and system architecture.

## Author
Garvit goyal 

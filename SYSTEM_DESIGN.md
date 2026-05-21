## Overview

TrueSplit is the full stack expense splitting application that helps group of people manage shared expenses and settle debt farirly. 
User can create groups, add expenses with flexible split options, and the app automatically calculates the minimum number of transactions needed to settle all debts using a greedy graph algorithm.
After every action user get notified through email like if someone in a group A has add an expense then all member of group will be notified about it.
Built for friends , roommates, family and travel group who want a simple way to track who owes whom without manual calculations.

## Tech Stack
| Layer | Technology | Why |
|---|---|---|            
Frontend       |        React+Vite          |  Fast dev server, component based UI          
Backend        |       NodeJs+ express      |  Javascript across Full stack, lightweight
Database       |         MongoDB            |  Flexible schema for variable expense splits
Auth           |         JWT                |  Stateless auth, refresh tokens for security
Email          |        Nodemailer          |  Free email notifications via Gmail SMTP


## Settlement Algorithm

### Problem
Without an algorithm, N people settling expenses could require N square (n^2) transactions in the worst case. TrueSplit minimizes this using a greedy approach.

### How it works

**Step 1 - Balance Map**
Loop through every expense. The person who paid gets credited and every person in splits gets debited.
Result is a map of { userId: netBalance }

**Step 2 - Separate**
Users with positive balance are Creditors (owed money)
Users with negative balance are debtors (owe money)
Both arrays are sorted by amount for optimal matching.

**Step 3 - Greedy Matching**
Match largest creditors with largest debtors.
Settle Math.min(creditor.amount, debtor.amount).
Repeat until all balances are 0.

### Time Complexity
- Balance map: O(E*S) (E = number of expenses , S= number of slits user)
- Sorting: O(NlogN)   (N= number of transactions) 
- Matching: O(N)
- Total: O(E*S + NlogN)

### Why Greedy
Greedy works here because settling the largest imbalances first reduces the number of remaining transactions at each step.



## API Design

### Auth
| Method | Route | Description | Auth Required |
|---|---|---|---|
| POST | /api/auth/register | Create a new user account | No |
| POST | /api/auth/login | Login and get access token | No |
| POST | /api/auth/logout | To Logout user | No |
| POST | /api/auth/refresh | To Refresh refresh token | No |
| GET | /api/auth/me | to get user details | Yes |
...

### Groups
| Method | Route | Description | Auth Required |
|---|---|---|---|
| POST | /api/group/ | create a new group | YES |
| GET | /api/group/ | Get all group of a user | YES |
| GET | /api/group/:id | Get group by its id | YES |
| POST | /api/group/join | Join the group | YES |
...

### Expenses
| Method | Route | Description | Auth Required |
|---|---|---|---|
| POST | /api/expense/add | create a new expense | YES |
| GET | /api/expense/groupExpenses/:groupId |Get all expense in the group | YES |
| GET | /api/expense/:expenseId | Get expense from expenseId| YES |
| DELETE | /api/expense/:expenseId | Delete the expense with id->expenseId | YES |
...

### Settlement
| Method | Route | Description | Auth Required |
|---|---|---|---|
| GET | /api/settlement/:groupId | Get all settlement transactions | YES |

...

### Activity
| Method | Route | Description | Auth Required |
|---|---|---|---|
| GET | /api/activity/:groupId | Get all activity detalis of particular  | YES |
...


## Scalability & Limitations

### Current Limitations & Fixes

**1 - Settlement Calculation at Scale**
Currently fetches all expenses on every request...
Fix: After calculating the results ,i will store the result in redis with the groupId as a key.So , whenever the user opens the group it does not have to calcuate settlements again and again . 
But if some expense added or deleted or any other changes occur, then i have to recalculate the result by invalidating the current value, which is also known as cache invalidation.

**2 - Synchronous Email Sending**
Currently emails are sent inside the request cycle...
Fix: Fix will be job Queue. Instead of sending the email immediately, i will store it in a job queue (like BullMQ) and return the response instantly. A Background worker picks it up and sends the user email separately. If user get the response say after(500ms-2second) then with the help of job queue these time will be reduce upto 50ms.

**3 - High Concurrent Traffic**
Currently a single server handles all requests...
Fix: if 1000 users hit the server at the same time my app get internal sevrver error as it will get crashed. I will add Rate limiter as it limits how many requests one IP can make per minute to prevent abuse. And if i am using aws or google cloud service i can easily scale up my server according to the usage this is also known as  horizonatal scaling
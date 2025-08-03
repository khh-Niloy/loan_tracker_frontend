# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev --turbopack`: Start development server with Turbopack for faster builds
- `npm run build`: Build production version
- `npm run start`: Start production server
- `npm run lint`: Run ESLint to check code quality

## Project Architecture

This is a Next.js 15 loan tracking application built with TypeScript, Redux Toolkit, and Tailwind CSS. The app allows users to track loans they've given (receivables) and loans they've taken (payables).

### Key Architecture Components

**State Management:**
- Redux Toolkit with RTK Query for API calls and caching
- Store configured in `src/lib/redux/store.ts` with auth slice and loan API
- Authentication state persisted to localStorage via `authSlice.ts`
- API endpoints managed through `loanApi.ts` with automatic cache invalidation

**API Integration:**
- Backend API base URL: `https://loan-tracker-blond.vercel.app/api/v1`
- JWT authentication with Bearer tokens in request headers
- Main endpoints: user creation, loan CRUD operations, receivables/payables lists
- Response transformation handles nested API response structure

**Component Structure:**
- Root layout with Redux and Auth providers in `layout.tsx`
- Key components: `HomePage.tsx`, `PayableList.tsx`, `ReceivableList.tsx`
- Authentication pages under `src/app/auth/`
- Global toast notifications via react-hot-toast

**Data Models:**
- Core interfaces defined in `src/interfaces/interface.ts`
- Redux-specific types in `src/interfaces/redux/redux.interface.ts`
- Main entity: `Loan` with fields for transaction tracking, amounts, and user details

### Directory Structure

- `src/app/`: Next.js App Router pages and layouts
- `src/components/`: Reusable React components
- `src/lib/redux/`: Redux store, slices, and API definitions
- `src/interfaces/`: TypeScript type definitions
- `src/hooks/`: Custom React hooks (currently empty)

### Key Features

- User registration and JWT-based authentication
- Create and track loans with amount, reason, and contact details
- View separate lists for money owed to you (receivables) vs money you owe (payables)
- Update loan payments with partial or full payment options
- Automatic cache invalidation ensures data consistency across views
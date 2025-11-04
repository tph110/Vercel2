# SkinDoc AI - Dermatoscope Image Analysis Platform

## Overview

SkinDoc AI is a medical imaging platform for skin cancer detection using AI-powered dermatoscope image analysis. The application allows users to upload dermatoscope photos and receive instant professional-grade assessments of skin cancer risk levels using machine learning models hosted on Hugging Face.

The platform is built as a full-stack web application with a React frontend and Express backend, designed with a clean, medical-grade interface following Apple Human Interface Guidelines adapted for healthcare contexts. The system prioritizes clinical precision, clarity, and trustworthiness in its user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### November 3, 2025 - Full Application Implementation
- Implemented complete backend API integration with Hugging Face Skindoc/dermai model
- Added `/api/analyze` endpoint using Multer for image uploads (10MB limit, image validation)
- Integrated @gradio/client for proper Hugging Face Space communication
- Added comprehensive error handling with user-friendly messages
- Implemented timeout protection (60s) and API inspection logging
- Connected frontend to real API, removed all mock data
- Enhanced response parsing to handle multiple Gradio response formats
- Added MIME type detection for uploaded images (PNG/JPEG)
- Implemented medical disclaimer in results panel
- Application now fully functional for end-to-end skin cancer risk detection

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with custom design system based on Apple HIG principles

**UI Component Library**: Shadcn/ui (Radix UI primitives)
- Provides accessible, customizable components
- New York style variant selected for clean, professional aesthetic
- Custom theming with CSS variables for consistent medical interface design

**Design System Principles**:
- Typography: Inter font family for clarity and professionalism
- Spacing: Consistent Tailwind units (2, 4, 6, 8, 12, 16, 20)
- Layout: Responsive grid system - two-column desktop (upload 45%, results 55%), stacked mobile
- Color Scheme: Neutral base colors with clinical precision focus
- Generous whitespace for reduced cognitive load in medical contexts

**Key Components**:
- `Header`: Fixed navigation with branding and app identity
- `UploadZone`: Drag-and-drop image upload interface with preview
- `ResultsPanel`: Display of analysis results with risk levels, confidence scores, and detailed findings

### Backend Architecture

**Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ESM module system
- **File Uploads**: Multer middleware with memory storage (10MB limit, image-only validation)
- **API Design**: RESTful endpoints with stateless request handling

**Core API Endpoint**:
- `POST /api/analyze`: Accepts multipart/form-data image uploads, processes through ML model, returns analysis results

**Stateless Processing Model**:
- No persistent storage or database required
- Images processed in-memory and immediately discarded after analysis
- Results returned synchronously to client without server-side caching

**Error Handling**:
- File type validation at upload middleware level
- Timeout protection (30-second limit on external API calls)
- Graceful error responses with user-friendly messages

### Data Schema

**AnalysisResult Type** (defined in shared/schema.ts):
```typescript
{
  riskLevel: 'low' | 'medium' | 'high',
  confidence: number,
  findings: string[],
  timestamp: string
}
```

Validated using Zod schema for type safety across frontend and backend.

### Development Tooling

- **TypeScript**: Strict mode enabled for type safety
- **Path Aliases**: Simplified imports (`@/`, `@shared/`, `@assets/`)
- **Build Process**: 
  - Frontend: Vite build to `dist/public`
  - Backend: esbuild bundling to `dist/index.js`
- **Development Server**: Concurrent Vite dev server with Express backend proxy
- **Code Quality**: TSC type checking without emit

## External Dependencies

### Third-Party Services

**Hugging Face Inference API**:
- **Space**: `Skindoc/dermai`
- **Purpose**: Machine learning model for dermatoscope image classification and skin cancer detection
- **Integration Method**: @gradio/client library for proper queue-based inference
- **Implementation**: `server/huggingface.ts`
- **Timeout**: 60-second maximum for connection and prediction
- **Authentication**: No API key required (public space)
- **Response Parsing**: Handles multiple Gradio response formats with robust fallbacks
- **Error Handling**: Specific error messages for timeouts, queue issues, and API failures

### Database

**Current State**: No database configured
- Application is fully stateless
- Drizzle ORM dependencies present but not actively used
- Database configuration references PostgreSQL via `drizzle.config.ts`
- `DATABASE_URL` environment variable expected but not required for current functionality

**Note**: The presence of Drizzle and `@neondatabase/serverless` suggests potential future expansion for persistent storage of analysis history, user accounts, or other features.

### UI Framework Dependencies

**Radix UI Primitives**: Complete suite of accessible, unstyled components
- Dialog, Dropdown, Popover, Toast, and 20+ other primitive components
- Provides keyboard navigation, focus management, and ARIA compliance

**Supporting Libraries**:
- `class-variance-authority`: Type-safe component variant management
- `tailwind-merge`: Intelligent Tailwind class merging
- `clsx`: Conditional className construction
- `date-fns`: Date formatting utilities
- `lucide-react`: Icon library (consistent with Apple HIG aesthetic)

### Build and Development Tools

- **Vite Plugins**: 
  - `@vitejs/plugin-react`: React Fast Refresh support
  - `@replit/vite-plugin-runtime-error-modal`: Development error overlay
  - `@replit/vite-plugin-cartographer`: Replit-specific tooling
  - `@replit/vite-plugin-dev-banner`: Development environment banner
- **PostCSS**: Tailwind CSS processing with Autoprefixer
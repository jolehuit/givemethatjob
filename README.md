# GiveMeThatJob 🎯

> **⚠️ DISCLAIMER: This is a research project and is NOT actively maintained. The application is NOT 100% functional and should be used for educational/research purposes only.**

## Overview

GiveMeThatJob is an experimental AI-powered interview preparation platform that allows users to practice job interviews with realistic AI recruiters. The project explores the intersection of AI avatars, real-time video communication, and automated feedback systems.

## 🚀 Features (Partially Implemented)

- **AI-Powered Mock Interviews**: Practice with AI avatars that simulate real recruiters
- **Job-Specific Preparation**: Paste a job URL to generate tailored interview questions
- **Video Recording & Analysis**: Record interviews and receive AI-powered feedback
- **Performance Analytics**: Track progress with detailed scoring and insights
- **Multi-language Support**: Practice in English or French
- **Subscription Tiers**: Free and Pro plans with different feature sets

## 🛠 Tech Stack

- **Frontend**: Next.js 13.5, React 18.2, TypeScript
- **Styling**: Tailwind CSS, Framer Motion, shadcn/ui
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **AI Services**: 
  - Tavus API (AI Avatar interviews)
  - Gemini API (Video analysis)
- **Video**: Daily.co (WebRTC)
- **Payments**: RevenueCat (Subscription management)
- **Storage**: Supabase Storage, AWS S3

### Known Limitations

- Video analysis features are experimental
- Payment processing is not production-ready
- Some UI elements are placeholders

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Required API keys :

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Tavus API (AI Avatars)
TAVUS_API_KEY=your_tavus_api_key
TAVUS_RECRUITER_PERSONA_ID=your_persona_id
TAVUS_RECRUITER_REPLICA_ID=your_replica_id

# Gemini API (Video Analysis)
GEMINI_API_KEY=your_gemini_api_key

# RevenueCat (Payments)
REVENUECAT_API_KEY=your_revenuecat_api_key

# AWS S3 (Optional)
NEXT_PUBLIC_AWS_S3_BUCKET=your_bucket_name
NEXT_PUBLIC_AWS_REGION=your_aws_region

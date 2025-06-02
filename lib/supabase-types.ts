export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          created_at: string
          interviews_completed: number
          average_score: number
          subscription_tier: string | null
          subscription_start_date: string | null
          subscription_end_date: string | null
        }
        Insert: {
          id: string
          name: string
          email: string
          created_at?: string
          interviews_completed?: number
          average_score?: number
          subscription_tier?: string | null
          subscription_start_date?: string | null
          subscription_end_date?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          created_at?: string
          interviews_completed?: number
          average_score?: number
          subscription_tier?: string | null
          subscription_start_date?: string | null
          subscription_end_date?: string | null
        }
      }
      interviews: {
        Row: {
          id: string
          user_id: string
          created_at: string
          job_url: string
          job_title: string
          company: string
          cv_path: string | null
          interview_type: string
          status: "in_progress" | "completed" | "cancelled"
          score: number
          language: string
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          job_url: string
          job_title: string
          company: string
          cv_path?: string | null
          interview_type: string
          status?: "in_progress" | "completed" | "cancelled"
          score?: number
          language: string
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          job_url?: string
          job_title?: string
          company?: string
          cv_path?: string | null
          interview_type?: string
          status?: "in_progress" | "completed" | "cancelled"
          score?: number
          language?: string
        }
      }
      questions: {
        Row: {
          id: string
          interview_id: string
          question_text: string
          answer_text: string | null
          asked_at: string
          answered_at: string | null
          score: number | null
          feedback: string | null
        }
        Insert: {
          id?: string
          interview_id: string
          question_text: string
          answer_text?: string | null
          asked_at?: string
          answered_at?: string | null
          score?: number | null
          feedback?: string | null
        }
        Update: {
          id?: string
          interview_id?: string
          question_text?: string
          answer_text?: string | null
          asked_at?: string
          answered_at?: string | null
          score?: number | null
          feedback?: string | null
        }
      }
      feedback: {
        Row: {
          id: string
          interview_id: string
          created_at: string
          overall_score: number
          strengths: string[]
          weaknesses: string[]
          verbal_communication: number
          non_verbal_communication: number
          content_quality: number
          question_understanding: number
          improvement_suggestions: string
        }
        Insert: {
          id?: string
          interview_id: string
          created_at?: string
          overall_score: number
          strengths: string[]
          weaknesses: string[]
          verbal_communication: number
          non_verbal_communication: number
          content_quality: number
          question_understanding: number
          improvement_suggestions: string
        }
        Update: {
          id?: string
          interview_id?: string
          created_at?: string
          overall_score?: number
          strengths?: string[]
          weaknesses?: string[]
          verbal_communication?: number
          non_verbal_communication?: number
          content_quality?: number
          question_understanding?: number
          improvement_suggestions?: string
        }
      }
    }
  }
}
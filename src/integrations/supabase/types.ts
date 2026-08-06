export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      daily_schedule: {
        Row: {
          id: number
          last_message_date: string | null
          message_index: number | null
          next_message_time: string | null
          sent_count_today: number | null
        }
        Insert: {
          id?: number
          last_message_date?: string | null
          message_index?: number | null
          next_message_time?: string | null
          sent_count_today?: number | null
        }
        Update: {
          id?: number
          last_message_date?: string | null
          message_index?: number | null
          next_message_time?: string | null
          sent_count_today?: number | null
        }
        Relationships: []
      }
      learning_stats: {
        Row: {
          avg_score: number | null
          date: string | null
          id: number
          messages_received: number | null
          quiz_taken: number | null
          tags_covered: string[] | null
          user_id: string
        }
        Insert: {
          avg_score?: number | null
          date?: string | null
          id?: number
          messages_received?: number | null
          quiz_taken?: number | null
          tags_covered?: string[] | null
          user_id: string
        }
        Update: {
          avg_score?: number | null
          date?: string | null
          id?: number
          messages_received?: number | null
          quiz_taken?: number | null
          tags_covered?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          article: string | null
          best_practice: string | null
          casus: string | null
          content: string
          created_at: string | null
          id: number
          is_active: boolean | null
          reference: string | null
          scheduled_hour: string | null
          source: string | null
          subject: string
          tag: string | null
          updated_at: string | null
        }
        Insert: {
          article?: string | null
          best_practice?: string | null
          casus?: string | null
          content: string
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          reference?: string | null
          scheduled_hour?: string | null
          source?: string | null
          subject: string
          tag?: string | null
          updated_at?: string | null
        }
        Update: {
          article?: string | null
          best_practice?: string | null
          casus?: string | null
          content?: string
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          reference?: string | null
          scheduled_hour?: string | null
          source?: string | null
          subject?: string
          tag?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notes: {
        Row: {
          color: string | null
          content: string
          created_at: string | null
          id: string
          title: string
          user_id: string
        }
        Insert: {
          color?: string | null
          content: string
          created_at?: string | null
          id?: string
          title: string
          user_id: string
        }
        Update: {
          color?: string | null
          content?: string
          created_at?: string | null
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      objectives: {
        Row: {
          created_at: string | null
          due_date: string | null
          id: number
          progress: number | null
          status: string | null
          subject: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          due_date?: string | null
          id?: number
          progress?: number | null
          status?: string | null
          subject?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          due_date?: string | null
          id?: number
          progress?: number | null
          status?: string | null
          subject?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone_number: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone_number?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quiz_results: {
        Row: {
          date_taken: string | null
          id: number
          quiz_id: number
          score: number | null
          time_spent: number | null
          user_id: string
        }
        Insert: {
          date_taken?: string | null
          id?: number
          quiz_id: number
          score?: number | null
          time_spent?: number | null
          user_id: string
        }
        Update: {
          date_taken?: string | null
          id?: number
          quiz_id?: number
          score?: number | null
          time_spent?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_results_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          casus: string | null
          category: string | null
          created_at: string | null
          difficulty: number | null
          id: number
          questions: Json | null
          title: string
        }
        Insert: {
          casus?: string | null
          category?: string | null
          created_at?: string | null
          difficulty?: number | null
          id?: number
          questions?: Json | null
          title: string
        }
        Update: {
          casus?: string | null
          category?: string | null
          created_at?: string | null
          difficulty?: number | null
          id?: number
          questions?: Json | null
          title?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_logs: {
        Row: {
          attempts: number
          content: string
          created_at: string
          error_message: string | null
          id: string
          phone_number: string
          provider: string | null
          status: string
          subject: string
        }
        Insert: {
          attempts?: number
          content: string
          created_at?: string
          error_message?: string | null
          id?: string
          phone_number: string
          provider?: string | null
          status: string
          subject: string
        }
        Update: {
          attempts?: number
          content?: string
          created_at?: string
          error_message?: string | null
          id?: string
          phone_number?: string
          provider?: string | null
          status?: string
          subject?: string
        }
        Relationships: []
      }
      whatsapp_templates: {
        Row: {
          content_template: string
          created_at: string
          id: string
          is_default: boolean | null
          name: string
          theme: string
        }
        Insert: {
          content_template: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          name: string
          theme: string
        }
        Update: {
          content_template?: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          name?: string
          theme?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const

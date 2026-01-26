export type Json =
  | boolean
  | Json[]
  | null
  | number
  | string
  | { [key: string]: Json | undefined };

export type Database = {
  graphql_public: {
    CompositeTypes: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
  };
  public: {
    CompositeTypes: {
      [_ in never]: never;
    };
    Enums: {
      invitation_status: "accepted" | "cancelled" | "expired" | "pending";
      team_role: "developer" | "owner" | "scrum_master";
    };
    Functions: {
      accept_invitation: { Args: { p_token: string }; Returns: Json };
      create_team_with_owner: {
        Args: { p_description?: string; p_name: string; p_slug: string };
        Returns: Json;
      };
      get_team_role: {
        Args: { p_team_id: string };
        Returns: Database["public"]["Enums"]["team_role"];
      };
      is_team_member: { Args: { p_team_id: string }; Returns: boolean };
    };
    Tables: {
      team_invitations: {
        Insert: {
          accepted_at?: null | string;
          created_at?: string;
          email: string;
          expires_at?: string;
          id?: string;
          invited_by: string;
          role?: Database["public"]["Enums"]["team_role"];
          status?: Database["public"]["Enums"]["invitation_status"];
          team_id: string;
          token?: string;
        };
        Relationships: [
          {
            columns: ["invited_by"];
            foreignKeyName: "team_invitations_invited_by_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "users";
          },
          {
            columns: ["team_id"];
            foreignKeyName: "team_invitations_team_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "teams";
          },
        ];
        Row: {
          accepted_at: null | string;
          created_at: string;
          email: string;
          expires_at: string;
          id: string;
          invited_by: string;
          role: Database["public"]["Enums"]["team_role"];
          status: Database["public"]["Enums"]["invitation_status"];
          team_id: string;
          token: string;
        };
        Update: {
          accepted_at?: null | string;
          created_at?: string;
          email?: string;
          expires_at?: string;
          id?: string;
          invited_by?: string;
          role?: Database["public"]["Enums"]["team_role"];
          status?: Database["public"]["Enums"]["invitation_status"];
          team_id?: string;
          token?: string;
        };
      };
      team_members: {
        Insert: {
          id?: string;
          joined_at?: string;
          role?: Database["public"]["Enums"]["team_role"];
          team_id: string;
          user_id: string;
        };
        Relationships: [
          {
            columns: ["team_id"];
            foreignKeyName: "team_members_team_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "teams";
          },
          {
            columns: ["user_id"];
            foreignKeyName: "team_members_user_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "users";
          },
        ];
        Row: {
          id: string;
          joined_at: string;
          role: Database["public"]["Enums"]["team_role"];
          team_id: string;
          user_id: string;
        };
        Update: {
          id?: string;
          joined_at?: string;
          role?: Database["public"]["Enums"]["team_role"];
          team_id?: string;
          user_id?: string;
        };
      };
      teams: {
        Insert: {
          created_at?: string;
          created_by: string;
          description?: null | string;
          id?: string;
          name: string;
          slug: string;
          updated_at?: string;
        };
        Relationships: [
          {
            columns: ["created_by"];
            foreignKeyName: "teams_created_by_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "users";
          },
        ];
        Row: {
          created_at: string;
          created_by: string;
          description: null | string;
          id: string;
          name: string;
          slug: string;
          updated_at: string;
        };
        Update: {
          created_at?: string;
          created_by?: string;
          description?: null | string;
          id?: string;
          name?: string;
          slug?: string;
          updated_at?: string;
        };
      };
      users: {
        Insert: {
          avatar_url?: null | string;
          created_at?: string;
          display_name?: null | string;
          email: string;
          id: string;
          updated_at?: string;
        };
        Relationships: [];
        Row: {
          avatar_url: null | string;
          created_at: string;
          display_name: null | string;
          email: string;
          id: string;
          updated_at: string;
        };
        Update: {
          avatar_url?: null | string;
          created_at?: string;
          display_name?: null | string;
          email?: string;
          id?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      invitation_status: ["pending", "accepted", "expired", "cancelled"],
      team_role: ["owner", "scrum_master", "developer"],
    },
  },
} as const;

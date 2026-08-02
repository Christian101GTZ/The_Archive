/**
 * AuthContext.jsx — Login state for the whole app
 *
 * Keeps track of who is logged in. It loads the current Supabase session,
 * updates it when the user logs in or out, and provides sign up / sign in /
 * sign out actions. Any component can read this with the useAuth() hook.
 */
import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";
import { supabase } from "../services/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Unable to load authentication session:", error.message);
      }

      const currentSession = data?.session ?? null;

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setAuthLoading(false);
    }

    loadSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    return { data, error };
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    return { data, error };
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();

    return { error };
  }

  const value = {
    session,
    user,
    authLoading,
    signUp,
    signIn,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }

  return context;
}
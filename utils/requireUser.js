import { supabase } from "../lib/supabase";

export async function requireUser(router) {
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  if (!user) {
    router.push("/login");
    return false;
  }

  return true;
}

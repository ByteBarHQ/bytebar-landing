/* ByteBar Library — environment config.
   Accounts ride the simulator's existing Supabase project (SPEC §4.2):
   same project URL + anon key the sim ships with (quiz-saas/supabase.config.json).
   The anon key is a public client key; all data access is governed by RLS.
   Bunny is intentionally EMPTY — the streaming account is created later;
   the stream map (streams.js) and the signing stub (library.js) are built
   so filling these in is the only change needed. */
window.BB_LIBRARY_CONFIG = {
  supabaseUrl: "https://duutviqszajmmoskvdfy.supabase.co",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1dXR2aXFzemFqbW1vc2t2ZGZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0MDc2NTUsImV4cCI6MjEwNzk4MzY1NX0.1QN33pm_ncOHxTtY3_NUI1j2BcihogfBVsvf_C2OMO4",
  supabaseJs: "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js",
  /* Edge Function that will mint short-lived signed video URLs after an
     entitlement check (SPEC §4.2). NOT deployed yet — library.js falls back
     to the static stream map until it exists. */
  signFunction: "library-sign-url",
  bunny: {
    libraryId: "",        // Bunny Stream library id (later)
    cdnHost: "",          // e.g. vz-xxxx.b-cdn.net (later)
    tokenAuthKey: ""      // NEVER ships to production client code — signing
                          // happens server-side in the Edge Function only.
  },
  simulatorUrl: "https://sim.bytebarhq.com",
  progressTable: "library_progress"
};

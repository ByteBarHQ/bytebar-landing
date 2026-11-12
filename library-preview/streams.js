/* ByteBar Library — stream map: book slug -> chapter n -> stream source.
   Starts (nearly) EMPTY by design: chapters render as "being built" until
   their Library Edition file banks and an entry lands here. The one banked
   unit — Security+ Start Here — points at the staging media copy.
   Entry shapes:
     { type: "file",  src: "media/secplus/00-start-here.mp4", poster: "…jpg", dur: 194 }
     { type: "bunny", videoId: "…" }   // resolved via the signing stub later
   `dur` is seconds (Library Edition measured runtime) and is used for the
   "min left" math until real per-chapter runtimes replace it everywhere. */
window.BB_STREAMS = {
  "secplus": {
    0: { type: "file", src: "media/secplus/00-start-here.mp4", poster: "media/secplus/00-start-here.jpg", dur: 194 }
  }
};

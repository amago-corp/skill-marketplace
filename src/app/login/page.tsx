import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-800 bg-gray-900/60 p-8 text-center shadow-2xl">
        <h1 className="text-2xl font-semibold text-white">amago hub</h1>
        <p className="mt-2 text-sm text-gray-400">사내 에이전트/스킬 마켓 — 로그인 후 접근 가능합니다.</p>
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
          className="mt-8"
        >
          <button
            type="submit"
            className="w-full rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-gray-900 transition hover:bg-gray-200"
          >
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  );
}

interface ProviderIconProps {
  provider: string;
  className?: string;
}

const GITHUB_ICON = (
  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
);

const BITBUCKET_ICON = (
  <path d="M.778 1.211a.768.768 0 0 0-.768.892l3.263 19.81c.084.5.515.868 1.022.873H19.95a.772.772 0 0 0 .77-.646l3.27-20.03a.768.768 0 0 0-.768-.891zM14.52 15.53H9.522L8.17 8.466h7.561z" />
);

// fallback: Git 아이콘
const GIT_ICON = (
  <path d="M23.546 10.93L13.067.452a1.55 1.55 0 0 0-2.188 0L8.708 2.627l2.76 2.76a1.838 1.838 0 0 1 2.327 2.341l2.66 2.66a1.838 1.838 0 1 1-1.103 1.06l-2.48-2.48v6.53a1.838 1.838 0 1 1-1.512-.065V8.8a1.838 1.838 0 0 1-.998-2.41L7.629 3.654.452 10.832a1.55 1.55 0 0 0 0 2.188l10.48 10.477a1.55 1.55 0 0 0 2.186 0l10.43-10.38a1.55 1.55 0 0 0 0-2.188z" />
);

const PROVIDER_CONFIG: Record<string, { icon: React.ReactNode; label: string }> = {
  github: { icon: GITHUB_ICON, label: "GitHub" },
  bitbucket: { icon: BITBUCKET_ICON, label: "Bitbucket" },
};

export function ProviderIcon({ provider, className = "h-4 w-4" }: ProviderIconProps) {
  const config = PROVIDER_CONFIG[provider];
  const icon = config?.icon ?? GIT_ICON;

  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      {icon}
    </svg>
  );
}

export function getProviderLabel(provider: string): string {
  return PROVIDER_CONFIG[provider]?.label ?? provider;
}

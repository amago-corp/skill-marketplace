import { RepositoryProviderAdapter } from "./types";
import { GitHubProvider } from "./github";
import { BitbucketProvider } from "./bitbucket";

const providers = new Map<string, RepositoryProviderAdapter>();

export function registerProvider(provider: RepositoryProviderAdapter): void {
  providers.set(provider.name, provider);
}

export function getProvider(name: string): RepositoryProviderAdapter {
  const provider = providers.get(name);
  if (!provider) {
    throw new Error(`Unknown repository provider: ${name}`);
  }
  return provider;
}

export function getAllProviders(): RepositoryProviderAdapter[] {
  return Array.from(providers.values());
}

export function detectProviderFromUrl(
  url: string
): RepositoryProviderAdapter | undefined {
  for (const provider of providers.values()) {
    if (provider.urlPattern.test(url)) return provider;
  }
  return undefined;
}

// 기본 provider 등록
registerProvider(new GitHubProvider());
registerProvider(new BitbucketProvider());

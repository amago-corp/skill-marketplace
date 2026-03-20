import { describe, it, expect, vi } from "vitest";
import {
  getProvider,
  getAllProviders,
  detectProviderFromUrl,
} from "./registry";

describe("registry", () => {
  describe("getProvider", () => {
    it("github provider 반환", () => {
      const provider = getProvider("github");
      expect(provider.name).toBe("github");
    });

    it("bitbucket provider 반환", () => {
      const provider = getProvider("bitbucket");
      expect(provider.name).toBe("bitbucket");
    });

    it("미등록 provider는 Error throw", () => {
      expect(() => getProvider("unknown")).toThrow(
        "Unknown repository provider: unknown"
      );
    });
  });

  describe("getAllProviders", () => {
    it("등록된 provider 2개 반환", () => {
      const providers = getAllProviders();
      expect(providers.length).toBe(2);
    });
  });

  describe("detectProviderFromUrl", () => {
    it("GitHub URL 감지", () => {
      const provider = detectProviderFromUrl("https://github.com/owner/repo");
      expect(provider?.name).toBe("github");
    });

    it("Bitbucket URL 감지", () => {
      const provider = detectProviderFromUrl(
        "https://git.example.com/scm/PROJ/repo.git"
      );
      expect(provider?.name).toBe("bitbucket");
    });

    it("미지 URL은 undefined 반환", () => {
      const provider = detectProviderFromUrl("https://unknown.com/repo");
      expect(provider).toBeUndefined();
    });
  });

  describe("registerProvider (커스텀)", () => {
    it("커스텀 provider 등록 후 조회 가능", async () => {
      vi.resetModules();
      const { registerProvider, getProvider: getP } = await import(
        "./registry"
      );
      const customProvider = {
        name: "custom",
        displayName: "Custom",
        urlPattern: /custom\.com/,
        parseUrl: () => null,
        getSkillDirectories: async () => [],
        getSkillContent: async () => null,
        buildSourceUrl: () => "",
        validateRepository: async () => ({ valid: true }),
      };
      registerProvider(customProvider as any);
      expect(getP("custom").name).toBe("custom");
    });
  });
});

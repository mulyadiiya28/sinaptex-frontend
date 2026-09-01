import { apiClient } from "@/lib/api-client";
import { MatchResult } from "./matching.schema";

// GET /matching/:opportunityId/run (OpenAPI & README engine)
export const matchingApi = {
  run: async (opportunityId: string): Promise<MatchResult[]> => {
    const raw = await apiClient.get<unknown>(`/api/v1/matching/${opportunityId}/run`);
    if (!raw) return [];

    let items: unknown[] = [];
    if (Array.isArray(raw)) {
      items = raw;
    } else if (typeof raw === "object" && raw !== null && "matches" in raw && Array.isArray((raw as { matches: unknown[] }).matches)) {
      items = (raw as { matches: unknown[] }).matches;
    }

    return items.map((rawItem) => {
      const item = rawItem as {
        opportunityId?: string;
        matchId?: string;
        opportunity?: {
          id?: string;
          party?: {
            id?: string;
            name?: string;
            logoUrl?: string;
            avatarUrl?: string;
            verificationStatus?: string;
          };
        };
        matchScore?: number;
        rankingScore?: number;
        finalScore?: number;
        breakdown?: {
          capability?: number;
          category?: number;
          budget?: number;
          location?: number;
          keywords?: number;
        };
        matchBreakdown?: {
          capability?: number;
          category?: number;
          budget?: number;
          location?: number;
          keywords?: number;
        };
        rankingBreakdown?: {
          reputation?: number;
          response?: number;
          completion?: number;
          activity?: number;
          verification?: number;
          boost?: number;
          penalty?: number;
        };
        counterparty?: {
          id?: string;
          partyId?: string;
          name?: string;
          avatarUrl?: string | null;
          verificationStatus?: string;
        };
      };

      const oppId = item.opportunityId || item.opportunity?.id || item.matchId || "";
      const matchScore = item.matchScore ?? 0;
      const rankingScore = item.finalScore ?? item.rankingScore ?? matchScore;
      const breakdown = item.breakdown ?? item.matchBreakdown;
      const rankingBreakdown = item.rankingBreakdown;

      const partyName =
        item.counterparty?.name ||
        item.opportunity?.party?.name ||
        "Calon Mitra";

      const partyId =
        item.counterparty?.partyId ||
        item.opportunity?.party?.id ||
        item.counterparty?.id ||
        oppId;

      const avatarUrl =
        item.counterparty?.avatarUrl ||
        item.opportunity?.party?.logoUrl ||
        item.opportunity?.party?.avatarUrl ||
        null;

      const verificationStatus =
        item.counterparty?.verificationStatus ||
        item.opportunity?.party?.verificationStatus;

      return {
        opportunityId: oppId,
        matchScore: Number(matchScore),
        rankingScore: Number(rankingScore),
        breakdown,
        rankingBreakdown,
        counterparty: {
          partyId,
          name: partyName,
          avatarUrl,
          verificationStatus,
        },
      };
    });
  },
};


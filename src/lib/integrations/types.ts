/**
 * Social Media & Ads API Integration Types
 */

export type ProviderId = 'meta' | 'youtube' | 'tiktok' | 'meta_ads';

export type ConnectionStatus =
  | 'connected'     // Valid credentials & verified
  | 'sandbox'       // Mock / Simulation mode for development & testing
  | 'disconnected'  // Not configured yet
  | 'error'         // Sync failed or token expired
  | 'stale';        // Last sync > 24 hours ago

export interface IntegrationConnectionState {
  providerId: ProviderId;
  name: string;
  category: 'social' | 'ads';
  targetAccount: string;
  status: ConnectionStatus;
  lastSyncedAt: string | null;
  lastError: string | null;
  accountDetails?: {
    id: string;
    username: string;
    followerCount?: number;
  };
  supportedMetrics: string[];
  unsupportedMetrics: string[];
}

export interface SyncResult {
  providerId: ProviderId;
  success: boolean;
  timestamp: string;
  recordsSynced: number;
  summary: string;
  error?: string;
}

export interface SyncAuditEntry {
  id: string;
  providerId: ProviderId;
  timestamp: string;
  status: 'success' | 'failed';
  message: string;
  details?: Record<string, unknown>;
}

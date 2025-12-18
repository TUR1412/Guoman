import { describe, expect, it } from 'vitest';
import {
  createFavoritesBackupPayload,
  parseFavoritesBackup,
  serializeFavoritesBackup,
} from './favoritesBackup';

describe('favoritesBackup', () => {
  it('creates payload with stable fields', () => {
    const payload = createFavoritesBackupPayload([3, 2, 2, '1'], { exportedAt: '2025-12-18' });
    expect(payload).toEqual({
      schemaVersion: 1,
      exportedAt: '2025-12-18',
      favoriteIds: [1, 2, 3],
    });
  });

  it('serializes as pretty JSON', () => {
    const json = serializeFavoritesBackup(new Set([2, 1]), { exportedAt: '2025-12-18T00:00:00Z' });
    expect(json).toContain('"schemaVersion": 1');
    expect(json).toContain('"exportedAt": "2025-12-18T00:00:00Z"');
    expect(json).toContain('"favoriteIds": [');
  });

  it('parses modern payload', () => {
    const res = parseFavoritesBackup(
      JSON.stringify({ schemaVersion: 1, exportedAt: 't', favoriteIds: [2, 1, 1] }),
    );
    expect(res).toEqual({ schemaVersion: 1, exportedAt: 't', favoriteIds: [1, 2] });
  });

  it('parses legacy array format', () => {
    const res = parseFavoritesBackup(JSON.stringify([3, '2', 0, null, 2]));
    expect(res).toEqual({ schemaVersion: null, exportedAt: null, favoriteIds: [2, 3] });
  });
});

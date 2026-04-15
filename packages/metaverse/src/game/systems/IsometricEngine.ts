import { GAME_CONFIG } from '../config';

export class IsometricEngine {
  static readonly TILE_WIDTH = GAME_CONFIG.TILE_WIDTH;
  static readonly TILE_HEIGHT = GAME_CONFIG.TILE_HEIGHT;

  static cartToIso(col: number, row: number): { x: number; y: number } {
    return {
      x: (col - row) * (this.TILE_WIDTH / 2),
      y: (col + row) * (this.TILE_HEIGHT / 2),
    };
  }

  static isoToCart(screenX: number, screenY: number): { col: number; row: number } {
    const halfW = this.TILE_WIDTH / 2;
    const halfH = this.TILE_HEIGHT / 2;
    return {
      col: Math.floor((screenX / halfW + screenY / halfH) / 2),
      row: Math.floor((screenY / halfH - screenX / halfW) / 2),
    };
  }

  static getDepth(col: number, row: number, layer: number = 0): number {
    return (col + row) * 10 + layer;
  }

  static isValidTile(col: number, row: number): boolean {
    return col >= 0 && col < GAME_CONFIG.MAP_COLS && row >= 0 && row < GAME_CONFIG.MAP_ROWS;
  }

  static getMapCenterIso(): { x: number; y: number } {
    const centerCol = GAME_CONFIG.MAP_COLS / 2;
    const centerRow = GAME_CONFIG.MAP_ROWS / 2;
    return this.cartToIso(centerCol, centerRow);
  }
}

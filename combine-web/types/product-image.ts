export type UploadStatus =
  | "idle"
  | "uploading"
  | "uploaded"
  | "failed";

export interface ProductImageItem {
  id: string;

  url: string;

  publicId: string | null;

  file?: File;

  isNew: boolean;

  name?: string;

  // 当前排序
  sortOrder: number;

  // 是否准备删除（Save 后才真正删除）
  deleted?: boolean;

  // Upload V3（Phase 4）
  status?: UploadStatus;

  progress?: number;

  error?: string;
}
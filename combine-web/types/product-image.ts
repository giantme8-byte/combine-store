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
}
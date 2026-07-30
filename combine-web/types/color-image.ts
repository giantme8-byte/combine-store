export type ColorImageItem = {
  id: string;
  name: string;
  url: string;
  publicId: string | null;

  file?: File;      // ← 新增

  isNew: boolean;
  sortOrder: number;
  deleted?: boolean;
}
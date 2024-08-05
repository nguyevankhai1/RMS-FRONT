export interface Role {
  applicationId: number | null;
  code: string;
  description: string;
  id: number;
  name: string;
  parentId: number | null;
  priority: number;
  status: number | null;
}

export interface CustomTreeItem extends Role {
  children: CustomTreeItem[];
  label: string;
}

export interface CustomCheckedValue {
  treeItems: CustomTreeItem[];
  remainingTreeItems: CustomTreeItem[];
}

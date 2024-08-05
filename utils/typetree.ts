export interface MyTreeData {
  applicationId: string | null;
  code: string;
  description: string;
  id: string;
  name: string;
  parentId: string | null;
  priority: number;
  status: number | null;
  path?: string;

  opended?: boolean;
  selected?: boolean;
  delete?: boolean;
  isHover?: boolean;
  rename?: boolean;
  children?: MyTreeData[];
}

export interface MyInnerTreeData extends MyTreeData {
  anchorID?: string;
}

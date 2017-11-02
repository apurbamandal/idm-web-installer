export class Category {
  id: string;
  name: string;
  type: string;
}

export enum ApprovalType {
  "NONE" = 0,
  "CUSTOM" = 1,
  "SERIAL" = 2,
  "QUORUM" = 3,
  "Same as Grant Approval" = 4,
  "Retain Existing Approval Process" = 5
}

export class Resource {
  id: string;
  name: string;
  description: string;
  categories: Category[];
  owners: any;
  subContainer: string;
  status: number;
  localizedNames: any[];
  localizedDescriptions: any[];
  // grant approval
  approvalRequired: boolean;
  approvalIsStandard: boolean;
  approvalApprovers: any;
  approvalQuorum: number;
  approvalRequestDef: string;
  approvalRequestDefName: string;
  approvalRequestDefs: any[];
  approvalType: ApprovalType;
  // revoke approval
  revokeRequired: boolean;
  revokeApprovalIsStandard: boolean;
  revokeApprovers: any;
  revokeQuorum: number;
  revokeRequestDef: string;
  revokeRequestDefName: string;
  revokeRequestDefs: any[];
  revokeApprovalType: ApprovalType;
}

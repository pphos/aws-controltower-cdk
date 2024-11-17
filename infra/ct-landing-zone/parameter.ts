import { Environment } from "aws-cdk-lib";

export interface AppParameter {
  env?: Environment;
  envName: string;
  /**
   * AWS Control Tower Landing Zone Parameter
   *
   * The following email addresses are loaded from environment variables, so they are not listed in the parameters:
   *  - Security Account Email
   *  - Logging Account Email
   */
  ctVersion: string;
  ctGovernedRegions: string[];
  ctEnableCentlizedLogging: boolean;
}

export const prodParameter: AppParameter = {
  envName: "Prod",
  ctVersion: "3.3",
  ctGovernedRegions: ["ap-northeast-1", "us-east-1"],
  ctEnableCentlizedLogging: true,
};

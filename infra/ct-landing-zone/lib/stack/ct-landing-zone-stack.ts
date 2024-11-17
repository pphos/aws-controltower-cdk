import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Iam } from "../construct/iam";
import { Organizations } from "../construct/organizations";
import { LandingZone } from "../construct/landingzone";

export interface CtLandingZoneStackProps extends StackProps {
  ctSecurityAccountEmail: string;
  ctLoggingAccountEmail: string;
  ctVersion: string;
  ctGovernedRegions: string[];
  ctEnableCentlizedLogging: boolean;
}

export class CtLandingZoneStack extends Stack {
  constructor(scope: Construct, id: string, props: CtLandingZoneStackProps) {
    super(scope, id, props);

    /**
     * Preparation
     * ref: https://docs.aws.amazon.com/ja_jp/controltower/latest/userguide/lz-apis-cfn-setup.html
     */
    new Iam(this, "Iam");
    const organization = new Organizations(this, "Organizations", {
      loggingAccountEmail: props.ctLoggingAccountEmail,
      securityAccountEmail: props.ctSecurityAccountEmail,
    });

    /**
     * Create AWS Control Tower Landing Zone
     * ref: https://docs.aws.amazon.com/ja_jp/controltower/latest/userguide/lz-apis-cfn-launch.html
     */
    new LandingZone(this, "LandingZone", {
      version: props.ctVersion,
      governedRegions: props.ctGovernedRegions,
      centralizedLoggingAccountId: organization.loggingAccountId,
      enableCentlizedLogging: props.ctEnableCentlizedLogging,
      securityAccountId: organization.securityAccountId,
    });
  }
}

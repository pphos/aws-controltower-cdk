import { aws_controltower as controltower, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

export interface LandingZoneConstructProps {
  version: string;
  governedRegions: string[];
  centralizedLoggingAccountId: string;
  enableCentlizedLogging: boolean;
  securityAccountId: string;
}

export class LandingZone extends Construct {
  constructor(scope: Construct, id: string, props: LandingZoneConstructProps) {
    super(scope, id);

    const manifest = {
      governedRegions: props.governedRegions,
      organizationStructure: {
        security: {
          name: "Security",
        },
        sandbox: {
          name: "Sandbox",
        },
      },
      centlizedLogging: {
        accountId: props.centralizedLoggingAccountId,
        configurations: {
          loggingBucket: {
            retentionDays: 365,
          },
          accessLoggingBucket: {
            retentionDays: 3650,
          },
        },
        enabled: props.enableCentlizedLogging,
      },
      securityRoles: {
        accountId: props.securityAccountId,
      },
      accessManagement: true,
    };

    // LandingZone
    new controltower.CfnLandingZone(this, "LandingZone", {
      version: props.version,
      manifest: manifest,
    });
  }
}

import { aws_controltower as controltower } from "aws-cdk-lib";
import { Construct, IDependable } from "constructs";

export interface LandingZoneConstructProps {
  version: string;
  governedRegions: string[];
  centralizedLoggingAccountId: string;
  enableCentlizedLogging: boolean;
  securityAccountId: string;
}

export class LandingZone extends Construct {
  public readonly landingZone: controltower.CfnLandingZone;

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
      centralizedLogging: {
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
      accessManagement: {
        enabled: false,
      },
    };

    this.landingZone = new controltower.CfnLandingZone(this, "LandingZone", {
      version: props.version,
      manifest: manifest,
    });
  }

  public addDependencies(dependencies: IDependable[]): this {
    dependencies.forEach((dependency) => {
      this.landingZone.node.addDependency(dependency);
    });
    return this;
  }
}

import { aws_iam as iam, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";

export class Iam extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // AWSControlTowerAdmin
    const ctAdminPolicyJSON = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: "ec2:DescribeAvailabilityZones",
          Resource: "*",
        },
      ],
    };

    const ctAdminManagedPolicy = new iam.ManagedPolicy(this, "CtAdminPolicy", {
      managedPolicyName: "AWSControlTowerAdminPolicy",
      document: iam.PolicyDocument.fromJson(ctAdminPolicyJSON),
    });

    new iam.Role(this, "CtAdminRole", {
      roleName: "AWSControlTowerAdmin",
      assumedBy: new iam.ServicePrincipal("controltower.amazonaws.com"),
      path: "/service-role/",
    }).addManagedPolicy(ctAdminManagedPolicy);

    // AWSControlTowerCloudTrail
    const ctCloudTrailPolicyJSON = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: ["logs:CreateLogStream", "logs:PutLogEvents"],
          Resource: `arn:${
            Stack.of(this).partition
          }:logs:*:*:log-group:aws-controltower/CloudTrailLogs:*`,
        },
      ],
    };

    const ctCloudTrailManagedPolicy = new iam.ManagedPolicy(
      this,
      "CtCloudTrailPolicy",
      {
        managedPolicyName: "AWSControlTowerCloudTrailPolicy",
        document: iam.PolicyDocument.fromJson(ctCloudTrailPolicyJSON),
      }
    );

    new iam.Role(this, "CtCloudTrailRole", {
      roleName: "AWSControlTowerCloudTrailRole",
      assumedBy: new iam.ServicePrincipal("cloudtrail.amazonaws.com"),
      path: "/service-role/",
    }).addManagedPolicy(ctCloudTrailManagedPolicy);

    // AWSControlTowerConfigAggregatorRoleForOrganizations
    new iam.Role(this, "CtConfigAggregatorRoleForOrg", {
      roleName: "AWSControlTowerConfigAggregatorRoleForOrganizations",
      assumedBy: new iam.ServicePrincipal("config.amazonaws.com"),
      path: "/service-role/",
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSConfigRoleForOrganizations"
        ),
      ],
    });

    // AWSControlTowerStackSet
    const ctStackSetJSON = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: "sts:AssumeRole",
          Resource: `arn:${
            Stack.of(this).partition
          }:iam::*:role/AWSControlTowerExecution`,
        },
      ],
    };

    const ctStackSetManagedPolicy = new iam.ManagedPolicy(
      this,
      "CtStackSetPolicy",
      {
        managedPolicyName: "AWSControlTowerStackSetRolePolicy",
        document: iam.PolicyDocument.fromJson(ctStackSetJSON),
      }
    );

    new iam.Role(this, "CtStackSetRole", {
      roleName: "AWSControlTowerStackSetRole",
      assumedBy: new iam.ServicePrincipal("cloudformation.amazonaws.com"),
      path: "/service-role/",
    }).addManagedPolicy(ctStackSetManagedPolicy);
  }
}

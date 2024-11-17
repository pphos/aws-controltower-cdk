import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { CtLandingZoneStack } from "../lib/stack/ct-landing-zone-stack";
import { prodParameter } from "../parameter";

test("Snapshot test for CtLandingZone Stack", () => {
  const app = new App();
  const stack = new CtLandingZoneStack(app, "Prod-CtLandingZoneStack", {
    env: {
      account: prodParameter.env?.account || process.env.CDK_DEFAULT_ACCOUNT,
      region: prodParameter.env?.region || process.env.CDK_DEFAULT_REGION,
    },
    crossRegionReferences: true,
    tags: {
      Environment: "Production",
    },
    ctSecurityAccountEmail: "username+aws-audit@example.com",
    ctLoggingAccountEmail: "username+aws-log-archive@example.com",
    ctVersion: prodParameter.ctVersion,
    ctGovernedRegions: prodParameter.ctGovernedRegions,
    ctEnableCentlizedLogging: prodParameter.ctEnableCentlizedLogging,
  });

  // test with snapshot
  expect(Template.fromStack(stack)).toMatchSnapshot();
});

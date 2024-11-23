#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { CtLandingZoneStack } from "../lib/stack/ct-landing-zone-stack";
import { prodParameter } from "../parameter";

if (!process.env.CT_SECURITY_ACCOUNT_EMAIL) {
  throw new Error("CT_SECURITY_ACCOUNT_EMAIL is not set");
}
if (!process.env.CT_LOGGING_ACCOUNT_EMAIL) {
  throw new Error("CT_LOGGING_ACCOUNT_EMAIL is not set");
}

const app = new cdk.App();

// Create stack for "Prod" environment.
new CtLandingZoneStack(app, "Prod-CtLandingZone", {
  description: "AWS Control Tower Landing Zone",
  env: {
    account: prodParameter.env?.account || process.env.CDK_DEFAULT_ACCOUNT,
    region: prodParameter.env?.region || process.env.CDK_DEFAULT_REGION,
  },
  tags: {
    Environment: "Prod",
  },
  ctSecurityAccountEmail: process.env.CT_SECURITY_ACCOUNT_EMAIL,
  ctLoggingAccountEmail: process.env.CT_LOGGING_ACCOUNT_EMAIL,
  ctVersion: prodParameter.ctVersion,
  ctGovernedRegions: prodParameter.ctGovernedRegions,
  ctEnableCentlizedLogging: prodParameter.ctEnableCentlizedLogging,
});

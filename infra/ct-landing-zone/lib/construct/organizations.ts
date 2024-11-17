import { aws_organizations as organizations, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

interface OrganizationsConstructProps extends StackProps {
  loggingAccountEmail: string;
  securityAccountEmail: string;
}

export class Organizations extends Construct {
  public readonly loggingAccountId: string;
  public readonly securityAccountId: string;

  constructor(
    scope: Construct,
    id: string,
    props: OrganizationsConstructProps
  ) {
    super(scope, id);

    // Organization
    const org = new organizations.CfnOrganization(this, "Organization", {
      featureSet: "ALL",
    });

    // Logging Account
    const loggingAccount = new organizations.CfnAccount(
      this,
      "LoggingAccount",
      {
        accountName: "log-archive",
        email: props.loggingAccountEmail,
      }
    );
    this.loggingAccountId = loggingAccount.attrAccountId;

    // Security Account
    const securityAccount = new organizations.CfnAccount(
      this,
      "SecurityAccount",
      {
        accountName: "audit",
        email: props.securityAccountEmail,
      }
    );
    this.securityAccountId = securityAccount.attrAccountId;
  }
}

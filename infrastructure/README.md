# SharkPark Infrastructure

Planned AWS resources (CDK / SST):

- DynamoDB tables:
  - sharkpark-lots
  - sharkpark-events
- S3 bucket: sharkpark-archive
- Cognito User Pool + CSULB SSO (SAML/OIDC)
- API Gateway -> Lambda (NestJS) OR ECS Fargate for long-running
- CloudWatch logs
- Environments:
  - dev
  - staging
  - prod

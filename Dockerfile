FROM public.ecr.aws/docker/library/node:22.11.0

# Install node package
RUN npm install -g aws-cdk
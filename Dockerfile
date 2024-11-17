FROM public.ecr.aws/docker/library/node:22.11.0

RUN apt-get update && apt-get install -y \
  vim

# Install aws cli
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
  && unzip awscliv2.zip \
  && ./aws/install \
  && rm -rf awscliv2.zip aws

# Install node package
RUN npm install -g aws-cdk
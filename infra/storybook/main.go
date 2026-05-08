package main

import (
	"os"

	"github.com/aws/aws-cdk-go/awscdk/v2"
	"github.com/aws/jsii-runtime-go"
)

func main() {
	defer jsii.Close()

	app := awscdk.NewApp(nil)

	NewStorybookStack(app, "M2S2DesignSystemStorybookStack", &StorybookStackProps{
		StackProps: awscdk.StackProps{
			Env: &awscdk.Environment{
				Account: jsii.String(os.Getenv("CDK_DEFAULT_ACCOUNT")),
				Region:  jsii.String("us-east-1"), // CloudFront certs must be us-east-1
			},
		},
		BucketName:     os.Getenv("S3_WEB_BUCKET"),
		OaiId:          os.Getenv("CLOUDFRONT_OAI_ID"),
		CertificateArn: os.Getenv("STORYBOOK_CERT_ARN"),
		DomainName:     "storybook.m2s2.io",
	})

	app.Synth(nil)
}

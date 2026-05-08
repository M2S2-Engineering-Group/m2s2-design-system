package main

import (
	"github.com/aws/aws-cdk-go/awscdk/v2"
	"github.com/aws/aws-cdk-go/awscdk/v2/awscertificatemanager"
	"github.com/aws/aws-cdk-go/awscdk/v2/awscloudfront"
	"github.com/aws/aws-cdk-go/awscdk/v2/awscloudfrontorigins"
	"github.com/aws/aws-cdk-go/awscdk/v2/awss3"
	"github.com/aws/constructs-go/constructs/v10"
	"github.com/aws/jsii-runtime-go"
)

type StorybookStackProps struct {
	awscdk.StackProps
	BucketName     string
	OaiId          string
	CertificateArn string
	DomainName     string
}

func NewStorybookStack(scope constructs.Construct, id string, props *StorybookStackProps) awscdk.Stack {
	stack := awscdk.NewStack(scope, &id, &props.StackProps)

	bucket := awss3.Bucket_FromBucketName(
		stack, jsii.String("WebBucket"), jsii.String(props.BucketName),
	)

	oai := awscloudfront.OriginAccessIdentity_FromOriginAccessIdentityId(
		stack, jsii.String("OAI"), jsii.String(props.OaiId),
	)

	cert := awscertificatemanager.Certificate_FromCertificateArn(
		stack, jsii.String("StorybookCert"), jsii.String(props.CertificateArn),
	)

	origin := awscloudfrontorigins.NewS3Origin(bucket, &awscloudfrontorigins.S3OriginProps{
		OriginAccessIdentity: oai,
		OriginPath:           jsii.String("/design-system-storybook"),
	})

	distro := awscloudfront.NewDistribution(stack, jsii.String("StorybookDistro"), &awscloudfront.DistributionProps{
		Comment:           jsii.String("M2S2 Design System Storybook — storybook.m2s2.io"),
		DefaultRootObject: jsii.String("index.html"),
		DomainNames:       jsii.Strings(props.DomainName),
		Certificate:       cert,
		PriceClass:        awscloudfront.PriceClass_PRICE_CLASS_100,
		DefaultBehavior: &awscloudfront.BehaviorOptions{
			Origin:               origin,
			ViewerProtocolPolicy: awscloudfront.ViewerProtocolPolicy_REDIRECT_TO_HTTPS,
			AllowedMethods:       awscloudfront.AllowedMethods_ALLOW_GET_HEAD_OPTIONS(),
			CachedMethods:        awscloudfront.CachedMethods_CACHE_GET_HEAD_OPTIONS(),
		},
		ErrorResponses: &[]*awscloudfront.ErrorResponse{
			{
				HttpStatus:         jsii.Number(403),
				ResponseHttpStatus: jsii.Number(200),
				ResponsePagePath:   jsii.String("/index.html"),
				Ttl:                awscdk.Duration_Seconds(jsii.Number(30)),
			},
			{
				HttpStatus:         jsii.Number(404),
				ResponseHttpStatus: jsii.Number(200),
				ResponsePagePath:   jsii.String("/index.html"),
				Ttl:                awscdk.Duration_Seconds(jsii.Number(30)),
			},
		},
	})

	awscdk.NewCfnOutput(stack, jsii.String("StorybookCFDomain"), &awscdk.CfnOutputProps{
		ExportName:  jsii.String("M2S2DesignSystemStorybookCFDomain"),
		Value:       distro.DomainName(),
		Description: jsii.String("CloudFront domain — add as CNAME for storybook.m2s2.io in CloudFlare"),
	})

	awscdk.NewCfnOutput(stack, jsii.String("StorybookDistroId"), &awscdk.CfnOutputProps{
		ExportName: jsii.String("M2S2DesignSystemStorybookDistroId"),
		Value:      distro.DistributionId(),
	})

	return stack
}

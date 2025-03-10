import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Terms and Conditions</CardTitle>
          <CardDescription>
            Last updated: July 1, 2023
          </CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none dark:prose-invert">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Kin•Do. These Terms and Conditions govern your use of our website and services.
            By accessing or using Kin•Do, you agree to be bound by these Terms.
          </p>
          
          <h2>2. Definitions</h2>
          <p>
            <strong>&quot;Service&quot;</strong> refers to the Kin•Do application, website, and related services.
            <br />
            <strong>&quot;User&quot;</strong> refers to individuals who register and use our Service.
            <br />
            <strong>&quot;Content&quot;</strong> refers to any information, text, graphics, or other materials uploaded, downloaded, or appearing on the Service.
          </p>
          
          <h2>3. Account Registration</h2>
          <p>
            To use certain features of the Service, you must register for an account. You agree to provide accurate information and keep it updated. You are responsible for maintaining the confidentiality of your account credentials.
          </p>
          
          <h2>4. User Conduct</h2>
          <p>
            You agree not to use the Service for any illegal purposes or in violation of any applicable laws. You will not upload or share content that is harmful, offensive, or infringes on the rights of others.
          </p>
          
          <h2>5. Subscription and Billing</h2>
          <p>
            Some features of the Service require a paid subscription. Billing occurs on a recurring basis according to your selected plan. You can cancel your subscription at any time, but refunds are subject to our refund policy.
          </p>
          
          <h2>6. Privacy</h2>
          <p>
            Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information.
          </p>
          
          <h2>7. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are owned by Kin•Do and are protected by international copyright, trademark, and other intellectual property laws.
          </p>
          
          <h2>8. Termination</h2>
          <p>
            We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.
          </p>
          
          <h2>9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Kin•Do shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the Service.
          </p>
          
          <h2>10. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. We will provide notice of significant changes. Your continued use of the Service after such modifications constitutes your acceptance of the updated Terms.
          </p>
          
          <h2>11. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at support@kindo.com.
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 
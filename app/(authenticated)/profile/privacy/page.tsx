import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Privacy Policy</CardTitle>
          <CardDescription>
            Last updated: July 1, 2023
          </CardDescription>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none dark:prose-invert">
          <h2>1. Introduction</h2>
          <p>
            At Kin•Do, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
          </p>
          
          <h2>2. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us when you:
          </p>
          <ul>
            <li>Create an account</li>
            <li>Fill out forms</li>
            <li>Communicate with us</li>
            <li>Use our services</li>
          </ul>
          <p>
            This information may include:
          </p>
          <ul>
            <li>Name, email address, and other contact information</li>
            <li>Account credentials</li>
            <li>Profile information</li>
            <li>Content you upload or create</li>
            <li>Payment information</li>
          </ul>
          
          <h2>3. Automatically Collected Information</h2>
          <p>
            When you use our service, we may automatically collect certain information, including:
          </p>
          <ul>
            <li>Device information (type, operating system, browser)</li>
            <li>IP address</li>
            <li>Usage data</li>
            <li>Cookies and similar technologies</li>
          </ul>
          
          <h2>4. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions</li>
            <li>Send notifications and updates</li>
            <li>Respond to your requests and inquiries</li>
            <li>Monitor and analyze usage patterns</li>
            <li>Protect against unauthorized access</li>
          </ul>
          
          <h2>5. Sharing Your Information</h2>
          <p>
            We may share your information with:
          </p>
          <ul>
            <li>Service providers who perform services on our behalf</li>
            <li>Other users, as directed by you</li>
            <li>Legal authorities when required by law</li>
            <li>Business partners in connection with a merger, acquisition, or sale</li>
          </ul>
          
          <h2>6. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.
          </p>
          
          <h2>7. Your Choices</h2>
          <p>
            You can:
          </p>
          <ul>
            <li>Update or correct your account information</li>
            <li>Opt-out of marketing communications</li>
            <li>Request deletion of your account</li>
            <li>Adjust your cookie preferences</li>
          </ul>
          
          <h2>8. Children&apos;s Privacy</h2>
          <p>
            Our service is not intended for children under 13. We do not knowingly collect information from children under 13.
          </p>
          
          <h2>9. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
          </p>
          
          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at privacy@kindo.com.
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 
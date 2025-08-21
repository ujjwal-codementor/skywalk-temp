import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import SignaturePad from '../components/SignaturePad';
import { FileText, Download, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface FormData {
  fullName: string;
  email: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  signedPdfUrl?: string;
  error?: string;
}

const SubscribePage: NextPage = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: ''
  });
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!signatureData) {
      // We'll handle this in the submit function
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!signatureData) {
      setApiResponse({
        success: false,
        message: 'Please provide your signature before submitting.',
        error: 'Signature required'
      });
      return;
    }

    setIsSubmitting(true);
    setApiResponse(null);

    try {
      const response = await axios.post('/api/sign-agreement', {
        fullName: formData.fullName,
        email: formData.email,
        signature: signatureData,
        timestamp: new Date().toISOString()
      });

      if (response.data.success) {
        setApiResponse({
          success: true,
          message: 'Agreement signed successfully!',
          signedPdfUrl: response.data.signedPdfUrl
        });
        
        // Reset form on success
        setFormData({ fullName: '', email: '' });
        setSignatureData(null);
      } else {
        setApiResponse({
          success: false,
          message: response.data.message || 'Failed to sign agreement',
          error: response.data.error
        });
      }
    } catch (error: any) {
      console.error('Error signing agreement:', error);
      setApiResponse({
        success: false,
        message: error.response?.data?.message || 'An error occurred while signing the agreement',
        error: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const downloadAgreement = () => {
    window.open('/agreements/service-agreement-v1.pdf', '_blank');
  };

  return (
    <>
      <Head>
        <title>Sign Service Agreement - Furniture Touch-Up Subscription</title>
        <meta name="description" content="Sign your furniture touch-up subscription service agreement" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Furniture Touch-Up Subscription
            </h1>
            <p className="text-lg text-gray-600">
              Review and sign your service agreement to get started
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Agreement Preview */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Service Agreement
                  </CardTitle>
                  <CardDescription>
                    Review the complete terms and conditions before signing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">What's Included:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Scratch repair and minor dents</li>
                      <li>• Edge and corner touch-ups</li>
                      <li>• Light polish and finish restoration</li>
                      <li>• Professional furniture care</li>
                    </ul>
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={downloadAgreement}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Preview Agreement (PDF)
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Why Choose Us?</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-green-700 space-y-2">
                    <li>✓ Professional furniture restoration experts</li>
                    <li>✓ Convenient in-home service</li>
                    <li>✓ Flexible subscription plans</li>
                    <li>✓ Satisfaction guaranteed</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Signing Form */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sign Agreement & Subscribe</CardTitle>
                  <CardDescription>
                    Fill in your details and sign below to complete your subscription
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className={errors.fullName ? 'border-red-500' : ''}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-red-600">{errors.fullName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email address"
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Digital Signature *</Label>
                      <SignaturePad
                        onSignatureChange={setSignatureData}
                        width={400}
                        height={200}
                      />
                      {!signatureData && (
                        <p className="text-sm text-amber-600">
                          Please draw your signature above
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting || !signatureData}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Signing Agreement...
                        </div>
                      ) : (
                        'Sign Agreement & Subscribe'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Response Messages */}
              {apiResponse && (
                <Card className={apiResponse.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      {apiResponse.success ? (
                        <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <h4 className={`font-semibold ${apiResponse.success ? 'text-green-800' : 'text-red-800'}`}>
                          {apiResponse.success ? 'Success!' : 'Error'}
                        </h4>
                        <p className={`text-sm ${apiResponse.success ? 'text-green-700' : 'text-red-700'}`}>
                          {apiResponse.message}
                        </p>
                        {apiResponse.success && apiResponse.signedPdfUrl && (
                          <div className="mt-3">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(apiResponse.signedPdfUrl, '_blank')}
                              className="text-green-700 border-green-300 hover:bg-green-100"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download Signed Agreement
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscribePage;




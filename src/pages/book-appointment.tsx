import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import CalComBookingWidget from '../components/CalComBookingWidget';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, Star, Shield, Clock, MapPin, User } from 'lucide-react';
import Link from 'next/link';

const BookAppointmentPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Book Appointment - Furniture Touch-Up Service</title>
        <meta name="description" content="Schedule your furniture touch-up appointment with our expert technicians. In-home service available." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                  </Button>
                </Link>
              </div>
              <div className="text-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  Book Your Appointment
                </h1>
              </div>
              <div className="w-20"></div> {/* Spacer for centering */}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Main Booking Widget - Full Width */}
          <div className="mb-8">
            <CalComBookingWidget 
              username={process.env.NEXT_PUBLIC_CALCOM_USERNAME}
              eventTypeSlug={process.env.NEXT_PUBLIC_CALCOM_EVENT_TYPE_SLUG}
              className="w-full"
            />
          </div>

          {/* Information Cards - Grid Layout Below Calendar */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Service Details */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Service Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Duration</p>
                    <p className="text-sm text-gray-600">30 minutes per session</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Service Type</p>
                    <p className="text-sm text-gray-600">In-home furniture touch-up</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">Technician</p>
                    <p className="text-sm text-gray-600">Certified professional</p>
                  </div>
                </div>
              </CardContent>
            </Card> */}

            {/* What's Included */}
            <Card>
              <CardHeader>
                <CardTitle>What's Included</CardTitle>
                <CardDescription>Your appointment covers:</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Scratch repair and minor dents</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Edge and corner touch-ups</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Light polish and finish restoration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Professional assessment and recommendations</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Preparation Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Before Your Appointment</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Clear the work area around furniture</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Remove personal items from surfaces</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Ensure good lighting in the area</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Have any specific concerns ready to discuss</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Trust & Safety */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Shield className="w-5 h-5" />
                  Trust & Safety
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-blue-800">
                <p className="mb-2">All our technicians are:</p>
                <ul className="space-y-1">
                  <li>• Background checked and verified</li>
                  <li>• Fully insured and bonded</li>
                  <li>• Trained in safety protocols</li>
                  <li>• Wearing proper identification</li>
                </ul>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>We're here to assist you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">Customer Support</p>
                  <p className="text-gray-600">Available 8 AM - 6 PM EST</p>
                </div>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <a href="mailto:support@yourcompany.com" className="w-full">
                      Email Support
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <a href="tel:+1-555-0123" className="w-full">
                      Call Us
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookAppointmentPage;


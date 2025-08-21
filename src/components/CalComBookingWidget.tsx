import React from 'react';
import Cal from "@calcom/embed-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Clock, MapPin, User, Calendar } from 'lucide-react';

interface CalComBookingWidgetProps {
  username?: string;
  eventTypeSlug?: string;
  className?: string;
}

const CalComBookingWidget: React.FC<CalComBookingWidgetProps> = ({
  username,
  eventTypeSlug,
  className = ''
}) => {
  // Use provided props or fall back to environment configuration
  const finalUsername = username || process.env.NEXT_PUBLIC_CALCOM_USERNAME;
  const finalEventTypeSlug = eventTypeSlug || process.env.NEXT_PUBLIC_CALCOM_EVENT_TYPE_SLUG;
  
  // Generate the Cal.com booking URL
  const calLink = `${finalUsername}/${finalEventTypeSlug}`;

  return (
    <div className={`w-full ${className}`}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">
            Book Your Furniture Touch-Up Appointment
          </CardTitle>
          <CardDescription className="text-xl text-gray-600">
            Select your preferred date and time below
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Service Information - Compact */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center bg-gray-50 p-4 rounded-lg">
            <div className="flex flex-col items-center space-y-2">
              <Clock className="w-6 h-6 text-primary-600" />
              <div>
                <p className="font-semibold text-gray-900">30 Minutes</p>
                <p className="text-sm text-gray-600">Per appointment</p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <MapPin className="w-6 h-6 text-primary-600" />
              <div>
                <p className="font-semibold text-gray-900">In-Home Service</p>
                <p className="text-sm text-gray-600">We come to you</p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <User className="w-6 h-6 text-primary-600" />
              <div>
                <p className="font-semibold text-gray-900">Expert Technicians</p>
                <p className="text-sm text-gray-600">Certified professionals</p>
              </div>
            </div>
          </div>

          {/* Cal.com Embedded Calendar - Full Width */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h3 className="font-medium text-gray-900">Select Date & Time</h3>
              <p className="text-sm text-gray-600">
                Choose your preferred appointment slot from the calendar below
              </p>
            </div>
            
            <div className="p-4">
              <Cal 
                calLink={calLink}
                style={{
                  width: '100%',
                  height: '700px',
                  border: 'none',
                  borderRadius: '8px'
                }}
                config = {{theme: "light"}}
              />
            </div>
          </div>

          {/* Alternative Booking Link */}
          <div className="text-center">
            {/* <p className="text-sm text-gray-600 mb-3">
              Having trouble with the calendar? Use the direct booking link:
            </p> */}
            {/* <a 
              href={`https://cal.com/${calLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Open Full Booking Page
            </a> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalComBookingWidget;

import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Copy, ExternalLink, Calendar, Clock, User, Mail } from 'lucide-react';

interface DirectBookingLinkProps {
  username?: string;
  eventTypeSlug?: string;
  className?: string;
}

interface BookingLinkData {
  date?: string;
  time?: string;
  customerName?: string;
  customerEmail?: string;
  notes?: string;
}

const DirectBookingLink: React.FC<DirectBookingLinkProps> = ({
  username = 'your-username', // Replace with your actual Cal.com username
  eventTypeSlug = 'furniture-touchup',
  className = ''
}) => {
  const [bookingData, setBookingData] = useState<BookingLinkData>({});
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const generateBookingLink = () => {
    const baseUrl = `https://cal.com/${username}/${eventTypeSlug}`;
    const params = new URLSearchParams();

    // Add date if provided
    if (bookingData.date) {
      params.append('date', bookingData.date);
    }

    // Add time if provided
    if (bookingData.time) {
      params.append('time', bookingData.time);
    }

    // Add customer information if provided
    if (bookingData.customerName) {
      params.append('name', bookingData.customerName);
    }

    if (bookingData.customerEmail) {
      params.append('email', bookingData.customerEmail);
    }

    // Add notes if provided
    if (bookingData.notes) {
      params.append('notes', bookingData.notes);
    }

    const finalLink = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
    setGeneratedLink(finalLink);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const openBookingLink = () => {
    if (generatedLink) {
      window.open(generatedLink, '_blank');
    }
  };

  const handleInputChange = (field: keyof BookingLinkData, value: string) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getNextAvailableDates = (): string[] => {
    const dates: string[] = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip weekends (optional - customize based on your business)
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0 = Sunday, 6 = Saturday
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    
    return dates;
  };

  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    const slotDuration = 30; // 30 minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour;
        const displayTime = `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
        slots.push(displayTime);
      }
    }
    
    return slots;
  };

  return (
    <div className={`max-w-2xl mx-auto ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-600" />
            Generate Direct Booking Link
          </CardTitle>
          <CardDescription>
            Create a personalized booking link for your customers with pre-filled information
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date">Preferred Date (Optional)</Label>
            <select
              id="date"
              value={bookingData.date || ''}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select a date</option>
              {getNextAvailableDates().map((date) => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </option>
              ))}
            </select>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label htmlFor="time">Preferred Time (Optional)</Label>
            <select
              id="time"
              value={bookingData.time || ''}
              onChange={(e) => handleInputChange('time', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select a time</option>
              {generateTimeSlots().map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name (Optional)</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="customerName"
                  type="text"
                  placeholder="Enter customer name"
                  value={bookingData.customerName || ''}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Customer Email (Optional)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="customerEmail"
                  type="email"
                  placeholder="Enter customer email"
                  value={bookingData.customerEmail || ''}
                  onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Special Notes (Optional)</Label>
            <textarea
              id="notes"
              placeholder="Add any special instructions or notes for the appointment"
              value={bookingData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            />
          </div>

          {/* Generate Button */}
          <Button 
            onClick={generateBookingLink}
            className="w-full"
            size="lg"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Generate Booking Link
          </Button>

          {/* Generated Link Display */}
          {generatedLink && (
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <Label className="text-sm font-medium text-gray-700">Generated Booking Link</Label>
                <div className="mt-2 flex items-center gap-2">
                  <Input
                    value={generatedLink}
                    readOnly
                    className="flex-1 text-sm"
                  />
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={openBookingLink}
                  className="flex-1"
                  size="lg"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Booking Page
                </Button>
              </div>

              <div className="text-xs text-gray-500 text-center">
                <p>Share this link with your customers to let them book directly</p>
                <p className="mt-1">All pre-filled information will be automatically included</p>
              </div>
            </div>
          )}

          {/* Quick Links */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Links</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setBookingData({});
                  setGeneratedLink(`https://cal.com/${username}/${eventTypeSlug}`);
                }}
                className="text-xs"
              >
                Basic Link
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  const tomorrowStr = tomorrow.toISOString().split('T')[0];
                  setBookingData({ date: tomorrowStr });
                  setGeneratedLink(`https://cal.com/${username}/${eventTypeSlug}?date=${tomorrowStr}`);
                }}
                className="text-xs"
              >
                Tomorrow Only
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DirectBookingLink;



import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  Clock, 
  Users, 
  Blocks, 
  Unlock, 
  Settings, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Trash2
} from 'lucide-react';
import DirectBookingLink from '@/components/DirectBookingLink';
import { usePostApi, useGetApi } from '@/lib/apiCallerClient';

interface Appointment {
  id: number;
  name: string;
  email: string;
  startTime: string;
  endTime: string;
}

interface DailyCapacity {
  current: number;
}

interface QuickStats {
  todayBookings: number;
  availableSlots: number;
  totalCapacity: number;
}

interface GetCapacityResponse {
  success: boolean;
  data: {
    current: number;
  };
}

interface SetCapacityResponse {
  success: boolean;
  message: string;
  data?: {
    currentCapacity: number;
  };
  error?: string;
}

interface BookingsResponse {
  bookings: Appointment[];
}
const SCHEDULE_ID = process.env.NEXT_PUBLIC_CALCOM_SCHEDULE_ID;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string
const USERNAME = process.env.NEXT_PUBLIC_CALCOM_USERNAME as string
const EVENT_TYPE_SLUG = process.env.NEXT_PUBLIC_CALCOM_EVENT_TYPE_SLUG as string

const AdminAppointmentsPage: NextPage = () => {
  const [dailyCapacity, setDailyCapacity] = useState<DailyCapacity>({ current: 0 });
  const [newCapacity, setNewCapacity] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCapacityLoading, setIsCapacityLoading] = useState(false);
  const [isRefreshLoading, setIsRefreshLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [quickStats, setQuickStats] = useState<QuickStats>({
    todayBookings: 0,
    availableSlots: 0,
    totalCapacity: 0
  });
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const postApi = usePostApi();
  const getApi = useGetApi();

  // Initial data fetch on component mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsStatsLoading(true);
        await Promise.all([
          fetchDailyCapacity(),
          loadQuickStats()
        ]);
      } catch (error) {
        console.error('Failed to initialize data:', error);
        showMessage('error', 'Failed to load initial data');
      } finally {
        setIsStatsLoading(false);
        setIsInitialLoad(false);
      }
    };

    initializeData();
  }, []);

  // Fetch daily capacity from backend
  const fetchDailyCapacity = async (): Promise<number> => {
    try {
      const response = await getApi<GetCapacityResponse>(`${BACKEND_URL}/api/admin/get-daily-capacity`);
      if (response.status === 200 && response.data.success) {
        const capacity = response.data.data.current;
        setDailyCapacity({ current: capacity });
        setNewCapacity(capacity);
        return capacity;
      } else {
        throw new Error('Failed to fetch capacity');
      }
    } catch (error: any) {
      console.error('Error fetching daily capacity:', error);
      showMessage('error', error.message || 'Failed to fetch daily capacity');
      // Return fallback value
      return dailyCapacity.current || 2;
    }
  };

  const loadQuickStats = async () => {
    if (!isInitialLoad) {
      setIsStatsLoading(true);
    }
    
    try {
      const today = new Date().toISOString().split('T')[0];

      // For initial load, use the capacity we already fetched
      // For subsequent calls, only fetch capacity if we don't have a recent update
      let capacity = dailyCapacity.current;
      if (isInitialLoad || capacity === 0) {
        capacity = await fetchDailyCapacity();
      }

      const bookings = await fetchBookingsForDate(today);
      const todayBookings = bookings.length;
      const availableSlots = Math.max(0, capacity - todayBookings);

      setQuickStats(prevStats => ({
        todayBookings,
        availableSlots,
        // Only update totalCapacity if we don't have a more recent local update
        totalCapacity: prevStats.totalCapacity !== 0 && !isInitialLoad ? prevStats.totalCapacity : capacity,
      }));

      // Also set today's appointments
      setAppointments(bookings);
      setSelectedDate(today);
    } catch (error) {
      console.error('Failed to load quick stats:', error);
      if (!isInitialLoad) {
        showMessage('error', 'Failed to refresh stats');
      }
      setQuickStats(prevStats => ({
        todayBookings: 0,
        availableSlots: Math.max(0, prevStats.totalCapacity),
        totalCapacity: prevStats.totalCapacity || dailyCapacity.current || 2,
      }));
    } finally {
      if (!isInitialLoad) {
        setIsStatsLoading(false);
      }
    }
  };


  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSetCapacity = async (newCapacityValue: number) => {
    if (newCapacityValue < 1) {
      showMessage('error', 'Capacity must be at least 1');
      return;
    }

    setIsCapacityLoading(true);
    try {
      // Call backend to set capacity
      const response = await postApi<SetCapacityResponse>(`${BACKEND_URL}/api/admin/set-daily-capacity`, { 
        capacity: newCapacityValue 
      });

      if (response.status === 200 && response.data.success) {
        // Update local state immediately on success
        setDailyCapacity({ current: newCapacityValue });
        setNewCapacity(newCapacityValue);
        
        // Update quickStats to reflect the new capacity
        setQuickStats(prevStats => ({
          ...prevStats,
          totalCapacity: newCapacityValue,
          availableSlots: Math.max(0, newCapacityValue - prevStats.todayBookings),
        }));

        showMessage('success', response.data.message || `Daily capacity updated to ${newCapacityValue} appointments`);
      } else {
        throw new Error(response.data.error || 'Failed to update capacity');
      }
    } catch (error: any) {
      console.error('Error updating capacity:', error);
      showMessage('error', error.response?.data?.message || error.message || 'Failed to update capacity');
    } finally {
      setIsCapacityLoading(false);
    }
  };

  const fetchBookingsForDate = async (date: string): Promise<Appointment[]> => {
    try {
      const response = await getApi<BookingsResponse>(`${BACKEND_URL}/api/admin/bookings?date=${date}`);
      if (response.status === 200) {
        return response.data.bookings || [];
      } else {
        throw new Error('Failed to fetch bookings');
      }
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      if (!isInitialLoad) {
        showMessage('error', error.message || 'Failed to fetch bookings');
      }
      return [];
    }
  };





  const handleRefreshAll = async () => {
    setIsLoading(true);
    try {
      // Refresh quick stats
      await loadQuickStats();
      
      // Refresh appointments if a date is selected
      if (selectedDate) {
        await fetchBookingsForDate(selectedDate);
      }
      
      showMessage('success', 'Data refreshed successfully');
    } catch (error: any) {
      showMessage('error', 'Failed to refresh data');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-refresh quick stats every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      loadQuickStats();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  const getNextAvailableDates = (): string[] => {
    const dates: string[] = [];
    const today = new Date();
    
    for (let i = 0; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string): string => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <>
      <Head>
        <title>Appointment Management - Admin Dashboard</title>
        <meta name="description" content="Manage appointments, capacity, and availability" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <h1 className="text-xl font-semibold text-gray-900">
                Appointment Management
              </h1>
              <Button variant="outline" size="sm" onClick={handleRefreshAll} disabled={isLoading || isCapacityLoading || isRefreshLoading}>
                {isRefreshLoading ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                Refresh All
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Message Display */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg border ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-800' 
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center gap-2">
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                {message.text}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Daily Capacity Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary-600" />
                    Daily Capacity Management
                  </CardTitle>
                  <CardDescription>
                    Set the maximum number of appointments available per day
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label htmlFor="capacity">Daily Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        min="1"
                        max="20"
                        value={newCapacity}
                        onChange={(e) => setNewCapacity(parseInt(e.target.value) || 1)}
                        className="mt-1"
                        disabled={isCapacityLoading}
                      />
                    </div>
                    <Button
                      onClick={() => handleSetCapacity(newCapacity)}
                      disabled={isCapacityLoading}
                      className="mt-6"
                    >
                      {isCapacityLoading ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Settings className="w-4 h-4 mr-2" />
                      )}
                      Update Capacity
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600">
                    Current capacity: <span className="font-semibold">{dailyCapacity.current}</span> appointments per day
                  </div>
                </CardContent>
              </Card>

              {/* Day Blocking/Unblocking */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Block Day */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Blocks className="w-5 h-5 text-red-600" />
                      Block Day
                    </CardTitle>
                    <CardDescription>
                      Prevent appointments on specific dates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Block holidays, maintenance days, or any dates when you're not available.
                    </p>
                    <Button
                      onClick={() => window.open(`https://app.cal.com/availability/${SCHEDULE_ID}`)}
                      variant="destructive"
                      className="w-full"
                      disabled={isLoading}
                    >
                      <Blocks className="w-4 h-4 mr-2" />
                      Manage Blocked Days
                    </Button>
                  </CardContent>
                </Card>

                {/* Unblock Day */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Unlock className="w-5 h-5 text-green-600" />
                      Unblock Day
                    </CardTitle>
                    <CardDescription>
                      Re-enable appointments with custom capacity
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Unblock previously blocked dates and set custom availability.
                    </p>
                    <Button
                      onClick={() => window.open(`https://app.cal.com/availability/${SCHEDULE_ID}`)}
                      variant="outline"
                      className="w-full"
                      disabled={isLoading}
                    >
                      <Unlock className="w-4 h-4 mr-2" />
                      Manage Availability
                    </Button>
                  </CardContent>
                </Card>

                {/* Work Hours Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-blue-600" />
                      Work Hours
                    </CardTitle>
                    <CardDescription>
                      Set your business hours and availability
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Configure when you're available for appointments and your working schedule.
                    </p>
                    <Button
                      onClick={() => window.open(`https://app.cal.com/availability/${SCHEDULE_ID}`)}
                      variant="outline"
                      className="w-full"
                      disabled={isLoading}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Manage Work Hours
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Appointments by Date */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary-600" />
                    View Appointments
                  </CardTitle>
                  <CardDescription>
                    Check appointments for specific dates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label htmlFor="viewDate">Select Date</Label>
                      <select
                        id="viewDate"
                        value={selectedDate}
                        onChange={async (e) => {
                          setSelectedDate(e.target.value);
                          if (e.target.value) {
                            setIsRefreshLoading(true);
                            const bookings = await fetchBookingsForDate(e.target.value);
                            setAppointments(bookings);
                            setIsRefreshLoading(false);
                          }
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md mt-1"
                        disabled={isRefreshLoading}
                      >
                        <option value="">Choose a date</option>
                        {getNextAvailableDates().map((date) => (
                          <option key={date} value={date}>
                            {formatDate(date)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button
                      onClick={async () => {
                        if (selectedDate) {
                          setIsRefreshLoading(true);
                          const bookings = await fetchBookingsForDate(selectedDate);
                          setAppointments(bookings);
                          setIsRefreshLoading(false);
                        }
                      }}
                      disabled={isRefreshLoading || !selectedDate}
                      className="mt-6"
                    >
                      {isRefreshLoading ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4 mr-2" />
                      )}
                      Refresh
                    </Button>
                  </div>

                  {/* Appointments List */}
                  {selectedDate && (
                    <div className="border rounded-lg">
                      <div className="bg-gray-50 px-4 py-3 border-b">
                        <h4 className="font-medium text-gray-900">
                          Appointments for {formatDate(selectedDate)}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {isRefreshLoading ? 'Loading...' : `${appointments.length} appointment(s) found`}
                        </p>
                      </div>
                      
                      {isRefreshLoading ? (
                        <div className="p-8 text-center">
                          <RefreshCw className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
                          <p className="text-gray-600">Loading appointments...</p>
                        </div>
                      ) : appointments.length > 0 ? (
                        <div className="divide-y">
                          {appointments.map((appointment) => (
                            <div key={appointment.id} className="p-4 flex items-center justify-between">
                              <div>
                                <p className="font-medium text-gray-900">{appointment.name}</p>
                                <p className="text-sm text-gray-600">{appointment.email}</p>
                                <p className="text-sm text-gray-500">
                                  {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                                </p>
                              </div>
                              {/* <Button variant="outline" size="sm" disabled={isLoading}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Cancel
                              </Button> */}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          No appointments scheduled for this date
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Quick Stats
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={loadQuickStats}
                      disabled={isStatsLoading}
                      className="h-8 w-8 p-0"
                    >
                      {isStatsLoading ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Today's Capacity</span>
                    {isStatsLoading ? (
                      <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      <span className="font-semibold text-gray-900">{quickStats.totalCapacity}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Today's Bookings</span>
                    {isStatsLoading ? (
                      <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      <span className="font-semibold text-gray-900">{quickStats.todayBookings}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Available Slots</span>
                    {isStatsLoading ? (
                      <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      <span className={`font-semibold ${
                        quickStats.availableSlots > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {quickStats.availableSlots}
                      </span>
                    )}
                  </div>
                  
                  {/* Status indicator */}
                  {!isStatsLoading && (
                    <div className="pt-2 border-t">
                      <div className={`text-xs px-2 py-1 rounded-full text-center ${
                        quickStats.availableSlots > 0 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {quickStats.availableSlots > 0 
                          ? `${quickStats.availableSlots} slots available today`
                          : 'No slots available today'
                        }
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Direct Booking Link Generator */}
              <DirectBookingLink/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminAppointmentsPage;
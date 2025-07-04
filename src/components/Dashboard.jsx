import React, { useState, useEffect } from 'react';
import { getSession } from '../api/users';
import { 
  FiUsers, 
  FiCalendar, 
  FiMessageSquare, 
  FiBook, 
  FiTrendingUp,
  FiClock,
  FiStar,
  FiActivity,
  FiAward,
  FiTarget,
  FiBookOpen,
  FiFileText
} from 'react-icons/fi';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const sessionUser = getSession();
    setUser(sessionUser);

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Sample data based on user role
  const getDashboardData = (role) => {
    const baseData = {
      quickStats: [
        { icon: FiUsers, label: 'Active Users', value: '1,234', change: '+12%', color: 'blue' },
        { icon: FiCalendar, label: 'Events Today', value: '8', change: '+3', color: 'green' },
        { icon: FiMessageSquare, label: 'Messages', value: '45', change: '+8', color: 'purple' },
        { icon: FiBook, label: 'Resources', value: '156', change: '+15', color: 'orange' }
      ],
      recentActivities: [
        { icon: FiFileText, title: 'New assignment posted', time: '2 hours ago', type: 'assignment' },
        { icon: FiMessageSquare, title: 'Message from John Doe', time: '4 hours ago', type: 'message' },
        { icon: FiCalendar, title: 'Meeting scheduled', time: '1 day ago', type: 'event' },
        { icon: FiBook, title: 'New resource added', time: '2 days ago', type: 'resource' }
      ]
    };

    if (role === 'admin') {
      return {
        ...baseData,
        quickStats: [
          { icon: FiUsers, label: 'Total Students', value: '2,456', change: '+5%', color: 'blue' },
          { icon: FiUsers, label: 'Teachers', value: '89', change: '+2', color: 'green' },
          { icon: FiCalendar, label: 'Classes Today', value: '24', change: '0', color: 'purple' },
          { icon: FiTrendingUp, label: 'Attendance', value: '94%', change: '+2%', color: 'orange' }
        ]
      };
    } else if (role === 'teacher') {
      return {
        ...baseData,
        quickStats: [
          { icon: FiUsers, label: 'My Students', value: '156', change: '+3', color: 'blue' },
          { icon: FiCalendar, label: 'Classes Today', value: '6', change: '0', color: 'green' },
          { icon: FiFileText, label: 'Assignments', value: '12', change: '+2', color: 'purple' },
          { icon: FiStar, label: 'Avg Rating', value: '4.8', change: '+0.2', color: 'orange' }
        ]
      };
    } else if (role === 'student') {
      return {
        ...baseData,
        quickStats: [
          { icon: FiBookOpen, label: 'Courses', value: '8', change: '0', color: 'blue' },
          { icon: FiFileText, label: 'Assignments', value: '5', change: '+2', color: 'green' },
          { icon: FiAward, label: 'Grade Average', value: 'A-', change: '+0.3', color: 'purple' },
          { icon: FiTarget, label: 'Attendance', value: '96%', change: '+1%', color: 'orange' }
        ]
      };
    }

    return baseData;
  };

  const dashboardData = user ? getDashboardData(user.role) : null;

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getStatColor = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600'
    };
    return colors[color] || colors.blue;
  };

  const getActivityIcon = (type) => {
    const icons = {
      assignment: FiFileText,
      message: FiMessageSquare,
      event: FiCalendar,
      resource: FiBook
    };
    return icons[type] || FiActivity;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {getGreeting()}, {user.username}!
              </h1>
              <p className="text-gray-600">
                Welcome to your {user.role} dashboard
              </p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <div className="text-2xl font-semibold text-gray-900">
                {formatTime(currentTime)}
              </div>
              <div className="text-sm text-gray-600">
                {formatDate(currentTime)}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardData?.quickStats.map((stat, index) => (
            <div
              key={index}
              className="card p-6 hover-lift animate-slideInLeft"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    {stat.change}
                  </p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-r ${getStatColor(stat.color)} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2">
            <div className="card p-6 animate-slideInLeft">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Activities
                </h2>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {dashboardData?.recentActivities.map((activity, index) => {
                  const IconComponent = getActivityIcon(activity.type);
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Actions & Schedule */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="card p-6 animate-slideInRight">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                {user.role === 'admin' && (
                  <>
                    <button className="w-full btn-primary text-left">
                      <FiUsers className="w-4 h-4 mr-2" />
                      Manage Classes
                    </button>
                    <button className="w-full btn-secondary text-left">
                      <FiCalendar className="w-4 h-4 mr-2" />
                      View Schedule
                    </button>
                  </>
                )}
                {user.role === 'teacher' && (
                  <>
                    <button className="w-full btn-primary text-left">
                      <FiFileText className="w-4 h-4 mr-2" />
                      Create Assignment
                    </button>
                    <button className="w-full btn-secondary text-left">
                      <FiUsers className="w-4 h-4 mr-2" />
                      View Classes
                    </button>
                  </>
                )}
                {user.role === 'student' && (
                  <>
                    <button className="w-full btn-primary text-left">
                      <FiBook className="w-4 h-4 mr-2" />
                      View Assignments
                    </button>
                    <button className="w-full btn-secondary text-left">
                      <FiCalendar className="w-4 h-4 mr-2" />
                      Check Schedule
                    </button>
                  </>
                )}
                <button className="w-full btn-secondary text-left">
                  <FiMessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </button>
              </div>
            </div>

            {/* Today's Schedule */}
            <div className="card p-6 animate-slideInRight" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Today's Schedule
              </h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Mathematics
                    </p>
                    <p className="text-xs text-gray-500">
                      9:00 AM - 10:00 AM
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Science
                    </p>
                    <p className="text-xs text-gray-500">
                      10:30 AM - 11:30 AM
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      English
                    </p>
                    <p className="text-xs text-gray-500">
                      2:00 PM - 3:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


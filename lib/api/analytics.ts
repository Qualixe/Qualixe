import { supabase } from '../supabaseClient';

// Track page view
export async function trackPageView(data: {
  pagePath: string;
  pageTitle?: string;
  referrer?: string;
  userAgent?: string;
  visitorId: string;
  sessionId: string;
  deviceType?: string;
  browser?: string;
  os?: string;
}) {
  try {
    const { error } = await supabase.from('page_views').insert([
      {
        page_path: data.pagePath,
        page_title: data.pageTitle,
        referrer: data.referrer,
        user_agent: data.userAgent,
        visitor_id: data.visitorId,
        session_id: data.sessionId,
        device_type: data.deviceType,
        browser: data.browser,
        os: data.os,
      },
    ]);

    if (error) throw error;
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
}

// Track custom event
export async function trackEvent(data: {
  eventName: string;
  eventCategory?: string;
  eventLabel?: string;
  eventValue?: number;
  pagePath?: string;
  visitorId: string;
  sessionId: string;
  metadata?: any;
}) {
  try {
    const { error } = await supabase.from('analytics_events').insert([
      {
        event_name: data.eventName,
        event_category: data.eventCategory,
        event_label: data.eventLabel,
        event_value: data.eventValue,
        page_path: data.pagePath,
        visitor_id: data.visitorId,
        session_id: data.sessionId,
        metadata: data.metadata,
      },
    ]);

    if (error) throw error;
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}

// Get analytics overview
export async function getAnalyticsOverview(dateRange: string = '7days') {
  try {
    const daysAgo = dateRange === 'today' ? 0 : parseInt(dateRange.replace('days', ''));
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    const { data, error } = await supabase
      .from('page_views')
      .select('*')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    const pageViews = data?.length || 0;
    const uniqueVisitors = new Set(data?.map((v) => v.visitor_id)).size;
    const uniqueSessions = new Set(data?.map((v) => v.session_id)).size;

    return {
      pageViews,
      uniqueVisitors,
      sessions: uniqueSessions,
      avgPageViewsPerSession: uniqueSessions > 0 ? (pageViews / uniqueSessions).toFixed(1) : 0,
    };
  } catch (error) {
    console.error('Error getting analytics overview:', error);
    return null;
  }
}

// Get top pages
export async function getTopPages(dateRange: string = '7days', limit: number = 10) {
  try {
    const daysAgo = dateRange === 'today' ? 0 : parseInt(dateRange.replace('days', ''));
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    const { data, error } = await supabase
      .from('page_views')
      .select('page_path, page_title')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    // Count page views per path
    const pageCounts: { [key: string]: { count: number; title: string } } = {};
    data?.forEach((view) => {
      if (!pageCounts[view.page_path]) {
        pageCounts[view.page_path] = { count: 0, title: view.page_title || view.page_path };
      }
      pageCounts[view.page_path].count++;
    });

    // Convert to array and sort
    const topPages = Object.entries(pageCounts)
      .map(([path, data]) => ({
        page: path,
        title: data.title,
        views: data.count,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);

    return topPages;
  } catch (error) {
    console.error('Error getting top pages:', error);
    return [];
  }
}

// Get traffic sources
export async function getTrafficSources(dateRange: string = '7days') {
  try {
    const daysAgo = dateRange === 'today' ? 0 : parseInt(dateRange.replace('days', ''));
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    const { data, error } = await supabase
      .from('page_views')
      .select('referrer, visitor_id')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    // Categorize traffic sources
    const sources: { [key: string]: Set<string> } = {
      Direct: new Set(),
      'Organic Search': new Set(),
      'Social Media': new Set(),
      Referral: new Set(),
    };

    data?.forEach((view) => {
      const referrer = view.referrer || '';
      const visitorId = view.visitor_id;

      if (!referrer || referrer === '') {
        sources['Direct'].add(visitorId);
      } else if (referrer.includes('google') || referrer.includes('bing') || referrer.includes('yahoo')) {
        sources['Organic Search'].add(visitorId);
      } else if (
        referrer.includes('facebook') ||
        referrer.includes('twitter') ||
        referrer.includes('instagram') ||
        referrer.includes('linkedin')
      ) {
        sources['Social Media'].add(visitorId);
      } else {
        sources['Referral'].add(visitorId);
      }
    });

    return Object.entries(sources).map(([source, visitors]) => ({
      source,
      visitors: visitors.size,
    }));
  } catch (error) {
    console.error('Error getting traffic sources:', error);
    return [];
  }
}

// Get device breakdown
export async function getDeviceBreakdown(dateRange: string = '7days') {
  try {
    const daysAgo = dateRange === 'today' ? 0 : parseInt(dateRange.replace('days', ''));
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    const { data, error } = await supabase
      .from('page_views')
      .select('device_type, visitor_id')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    // Count unique visitors per device
    const devices: { [key: string]: Set<string> } = {};
    data?.forEach((view) => {
      const device = view.device_type || 'Unknown';
      if (!devices[device]) {
        devices[device] = new Set();
      }
      devices[device].add(view.visitor_id);
    });

    return Object.entries(devices).map(([device, visitors]) => ({
      device,
      users: visitors.size,
    }));
  } catch (error) {
    console.error('Error getting device breakdown:', error);
    return [];
  }
}

// Get country data
export async function getCountryData(dateRange: string = '7days', limit: number = 10) {
  try {
    const daysAgo = dateRange === 'today' ? 0 : parseInt(dateRange.replace('days', ''));
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    const { data, error } = await supabase
      .from('page_views')
      .select('country, visitor_id')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    // Count unique visitors per country
    const countries: { [key: string]: Set<string> } = {};
    data?.forEach((view) => {
      const country = view.country || 'Unknown';
      if (!countries[country]) {
        countries[country] = new Set();
      }
      countries[country].add(view.visitor_id);
    });

    const countryData = Object.entries(countries)
      .map(([country, visitors]) => ({
        country,
        users: visitors.size,
      }))
      .sort((a, b) => b.users - a.users)
      .slice(0, limit);

    return countryData;
  } catch (error) {
    console.error('Error getting country data:', error);
    return [];
  }
}

// Get real-time active users (last 5 minutes)
export async function getRealTimeUsers() {
  try {
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

    const { data, error } = await supabase
      .from('page_views')
      .select('visitor_id')
      .gte('created_at', fiveMinutesAgo.toISOString());

    if (error) throw error;

    const activeUsers = new Set(data?.map((v) => v.visitor_id)).size;
    return activeUsers;
  } catch (error) {
    console.error('Error getting real-time users:', error);
    return 0;
  }
}

// Get daily traffic data for charts
export async function getDailyTraffic(dateRange: string = '7days') {
  try {
    const daysAgo = dateRange === 'today' ? 1 : parseInt(dateRange.replace('days', ''));
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    const { data, error } = await supabase
      .from('page_views')
      .select('created_at, visitor_id')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    // Group by date
    const dailyData: { [key: string]: { pageViews: number; visitors: Set<string> } } = {};

    data?.forEach((view) => {
      const date = new Date(view.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!dailyData[date]) {
        dailyData[date] = { pageViews: 0, visitors: new Set() };
      }
      dailyData[date].pageViews++;
      dailyData[date].visitors.add(view.visitor_id);
    });

    const labels = Object.keys(dailyData);
    const pageViews = labels.map((date) => dailyData[date].pageViews);
    const visitors = labels.map((date) => dailyData[date].visitors.size);

    return { labels, pageViews, visitors };
  } catch (error) {
    console.error('Error getting daily traffic:', error);
    return { labels: [], pageViews: [], visitors: [] };
  }
}

// Get browser stats
export async function getBrowserStats(dateRange: string = '7days') {
  try {
    const daysAgo = dateRange === 'today' ? 0 : parseInt(dateRange.replace('days', ''));
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    const { data, error } = await supabase
      .from('page_views')
      .select('browser, visitor_id')
      .gte('created_at', startDate.toISOString());

    if (error) throw error;

    const browsers: { [key: string]: Set<string> } = {};
    data?.forEach((view) => {
      const browser = view.browser || 'Unknown';
      if (!browsers[browser]) {
        browsers[browser] = new Set();
      }
      browsers[browser].add(view.visitor_id);
    });

    return Object.entries(browsers).map(([browser, visitors]) => ({
      browser,
      users: visitors.size,
    }));
  } catch (error) {
    console.error('Error getting browser stats:', error);
    return [];
  }
}

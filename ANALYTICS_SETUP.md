# 📊 Analytics Setup Guide

## Google Analytics 4 Setup

### 1. Create Google Analytics Account
1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Start measuring"
3. Create a new property for your website
4. Get your **Measurement ID** (starts with "G-")

### 2. Add Environment Variable
Create or update your `.env.local` file:
```bash
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### 3. Deploy to Vercel
1. Add the environment variable in Vercel dashboard
2. Redeploy your site

## 📈 What's Being Tracked

### Page Views
- All page visits automatically tracked
- User sessions and demographics
- Traffic sources and referrals

### Quiz Interactions
- **Quiz Start**: When users begin any quiz
- **Quiz Complete**: When users finish with their score
- **Quiz Share**: When users share results

### Button Clicks
- **Start Journey**: Hero section button
- **View Results**: Results page access
- **Take Assessment**: Individual quiz buttons
- **Sign Up/Login**: Authentication actions

### User Actions
- **Sign Up**: New account creation
- **Login**: User authentication
- **Dashboard Access**: User dashboard visits

## 📊 Analytics Dashboard

### Key Metrics to Monitor
1. **Page Views**: Total website visits
2. **Quiz Completion Rate**: % of users who finish quizzes
3. **Conversion Rate**: % of visitors who create accounts
4. **Popular Quizzes**: Which assessments are most used
5. **User Journey**: How users navigate your site

### Custom Reports
- **Quiz Performance**: Compare completion rates across quizzes
- **User Engagement**: Track time on site and interactions
- **Conversion Funnel**: See where users drop off
- **Mobile vs Desktop**: Device usage patterns

## 🔧 Adding More Tracking

### Track New Buttons
```tsx
import { trackButtonClick } from "@/lib/analytics"

<Button onClick={() => trackButtonClick('button_name', 'page_location')}>
  Click Me
</Button>
```

### Track Custom Events
```tsx
import { event } from "@/lib/analytics"

event({
  action: 'custom_action',
  category: 'engagement',
  label: 'specific_detail',
  value: 100
})
```

## 📱 Vercel Analytics (Alternative)

If you prefer Vercel's built-in analytics:
1. Go to your Vercel dashboard
2. Navigate to Analytics tab
3. Enable analytics for your project
4. View real-time data and performance metrics

## 🎯 Conversion Tracking

### Set Up Goals in GA4
1. **Quiz Completion**: Track when users finish assessments
2. **Account Creation**: Monitor sign-up conversions
3. **Result Sharing**: Track social engagement
4. **Return Visits**: Measure user retention

### Custom Dimensions
- Quiz Type (Epworth, STOP-BANG, PSQI, Sleep Personality)
- User Type (Anonymous, Authenticated)
- Result Category (Night Owl, Morning Lark, etc.)
- Device Type (Mobile, Desktop, Tablet)

## 📊 Sample Reports

### Weekly Dashboard
- Total visitors: 1,000
- Quiz completions: 150 (15% conversion)
- New accounts: 25 (2.5% conversion)
- Most popular quiz: Sleep Personality (60 completions)
- Average session duration: 4 minutes

### Monthly Trends
- Traffic growth: +20% month-over-month
- Quiz completion rate: 12-18% range
- User retention: 35% return within 30 days
- Mobile usage: 65% of traffic

## 🚀 Next Steps

1. **Set up Google Analytics** with your Measurement ID
2. **Deploy the changes** to see tracking in action
3. **Wait 24-48 hours** for initial data collection
4. **Review your analytics dashboard** for insights
5. **Set up custom goals** for conversion tracking
6. **Create regular reports** to monitor performance

## 💡 Pro Tips

- **A/B Testing**: Test different button colors/text
- **Heatmaps**: Use tools like Hotjar for user behavior
- **User Feedback**: Combine analytics with user surveys
- **Performance**: Monitor page load times and Core Web Vitals
- **SEO**: Track organic search performance

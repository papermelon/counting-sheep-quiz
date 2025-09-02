# 📊 Analytics Setup Guide

## Google Analytics 4 Setup for Multiple Domains

### 1. Create Single GA4 Property
1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Start measuring"
3. Create a new property called "Counting Sheep Project"
4. Add **two data streams** for your domains:

#### Data Stream 1: Main Website
- **Platform**: Web
- **Website URL**: `https://www.countingsheepproject.com`
- **Stream name**: "Main Website"
- **Measurement ID**: `G-XXXXXXXXX1`

#### Data Stream 2: Quiz Webapp
- **Platform**: Web
- **Website URL**: `https://quiz.countingsheepproject.com`
- **Stream name**: "Quiz Webapp"
- **Measurement ID**: `G-XXXXXXXXX2`

### 2. Add Environment Variables
Create or update your `.env.local` file:
```bash
# For quiz.countingsheepproject.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXX2
```

### 3. Deploy to Vercel
1. Add the environment variable in Vercel dashboard
2. Redeploy your site

## 📈 Cross-Domain Tracking Benefits

### Unified User Journey
- **Track users** moving from main site to quiz
- **Understand traffic flow** between domains
- **Measure conversion** from main site to quiz completion
- **Unified reporting** for both properties

### Key Metrics to Monitor
1. **Cross-domain sessions**: Users visiting both sites
2. **Traffic sources**: Which domain drives more engagement
3. **Conversion funnel**: Main site → Quiz → Completion
4. **User retention**: Return visits across both domains

## 📊 What's Being Tracked

### Page Views
- All page visits automatically tracked
- User sessions and demographics
- Traffic sources and referrals
- **Cross-domain attribution**

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
1. **Page Views**: Total website visits across both domains
2. **Cross-domain sessions**: Users visiting both sites
3. **Quiz Completion Rate**: % of users who finish quizzes
4. **Conversion Rate**: % of visitors who create accounts
5. **Popular Quizzes**: Which assessments are most used
6. **User Journey**: How users navigate between sites

### Custom Reports
- **Cross-domain Performance**: Compare both sites
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

### Track Cross-Domain Events
```tsx
// Track when users come from main site
event({
  action: 'cross_domain_visit',
  category: 'traffic',
  label: 'from_main_site',
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
1. **Cross-domain sessions**: Users visiting both sites
2. **Quiz Completion**: Track when users finish assessments
3. **Account Creation**: Monitor sign-up conversions
4. **Result Sharing**: Track social engagement
5. **Return Visits**: Measure user retention

### Custom Dimensions
- **Domain**: Main site vs Quiz webapp
- **Quiz Type**: (Epworth, STOP-BANG, PSQI, Sleep Personality)
- **User Type**: (Anonymous, Authenticated)
- **Result Category**: (Night Owl, Morning Lark, etc.)
- **Device Type**: (Mobile, Desktop, Tablet)
- **Traffic Source**: (Direct, Organic, Social, Referral)

## 📊 Sample Reports

### Weekly Dashboard
- **Total visitors**: 2,000 (1,200 main + 800 quiz)
- **Cross-domain sessions**: 150 (7.5% of total)
- **Quiz completions**: 200 (25% of quiz visitors)
- **New accounts**: 40 (2% conversion)
- **Most popular quiz**: Sleep Personality (80 completions)
- **Average session duration**: 4 minutes

### Monthly Trends
- **Traffic growth**: +20% month-over-month
- **Cross-domain conversion**: 8-12% range
- **Quiz completion rate**: 20-30% range
- **User retention**: 40% return within 30 days
- **Mobile usage**: 65% of traffic

## 🚀 Next Steps

1. **Set up Google Analytics** with both data streams
2. **Deploy the changes** to see tracking in action
3. **Wait 24-48 hours** for initial data collection
4. **Review your analytics dashboard** for insights
5. **Set up custom goals** for conversion tracking
6. **Create regular reports** to monitor performance
7. **Analyze cross-domain user journeys**

## 💡 Pro Tips

- **Cross-domain attribution**: Understand which site drives more engagement
- **A/B Testing**: Test different approaches on each domain
- **Heatmaps**: Use tools like Hotjar for user behavior
- **User Feedback**: Combine analytics with user surveys
- **Performance**: Monitor page load times and Core Web Vitals
- **SEO**: Track organic search performance across both domains
- **Content strategy**: Use insights to optimize content on main site

# Foundation Repair Directory - Deployment Checklist

## Pre-Deployment Checklist

### Database Setup
- [x] Supabase project created and configured
- [x] Database schema applied from `supabase/schema.sql`
- [x] Seed data populated with realistic foundation repair businesses
- [x] Environment variables configured in `.env.local`
- [ ] Database indexes optimized for production queries
- [ ] Row Level Security (RLS) policies configured (if needed)

### Domain Configuration
- [x] Domain references updated to `foundationscout.com`
- [x] Meta tags use correct domain
- [x] Canonical URLs point to correct domain
- [x] Sitemap references correct domain
- [x] Structured data uses correct domain URLs
- [ ] Domain DNS configured to point to Vercel
- [ ] SSL certificate verified

### SEO Optimization
- [x] JSON-LD structured data implemented
  - [x] LocalBusiness schema for business pages
  - [x] BreadcrumbList schema for navigation
  - [x] Organization schema for homepage
  - [x] WebSite schema with search action
- [x] Dynamic sitemap pulling from Supabase
- [x] Robots.txt configured
- [x] Meta descriptions and titles optimized
- [ ] Google Search Console property created
- [ ] Google Analytics configured
- [ ] XML sitemaps submitted to search engines

### Performance & Technical
- [x] Next.js app optimized for static generation
- [x] Vercel.json configured with proper headers
- [x] Images optimized and compressed
- [x] Fonts loaded efficiently (Google Fonts)
- [ ] Core Web Vitals tested and optimized
- [ ] Lighthouse audit passed (>90 scores)
- [ ] Mobile responsiveness verified

### Content Quality
- [x] State-specific content added (soil types, common issues, costs)
- [x] City landing pages dynamically generated
- [x] Business listings with realistic data
- [x] FAQ sections implemented
- [ ] Legal pages created (Privacy Policy, Terms of Service)
- [ ] About page created
- [ ] Contact page created

### Lead Generation
- [x] Lead forms implemented on business pages
- [x] Contact buttons with phone links
- [x] Quote request functionality
- [ ] Lead submission to Supabase tested
- [ ] Email notifications configured
- [ ] Lead routing to businesses set up
- [ ] Analytics tracking for conversions

## Deployment Steps

### 1. Environment Setup
```bash
# Verify all environment variables are set
cat .env.local

# Required variables:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# SUPABASE_SERVICE_ROLE_KEY
# NEXT_PUBLIC_GA_ID
```

### 2. Build Test
```bash
# Run a production build locally
npm run build

# Test the built application
npm start

# Verify key pages load:
# - Homepage: http://localhost:3000
# - State page: http://localhost:3000/texas
# - City page: http://localhost:3000/texas/houston
# - Business page: http://localhost:3000/texas/houston/[business-slug]
```

### 3. Database Verification
```bash
# Check business count
curl -H "apikey: [ANON_KEY]" \
     -H "Authorization: Bearer [ANON_KEY]" \
     "https://[PROJECT_ID].supabase.co/rest/v1/businesses?select=count"

# Verify states are populated
curl -H "apikey: [ANON_KEY]" \
     -H "Authorization: Bearer [ANON_KEY]" \
     "https://[PROJECT_ID].supabase.co/rest/v1/states?limit=5"
```

### 4. Vercel Deployment
```bash
# Deploy to Vercel
npx vercel --prod

# Configure environment variables in Vercel dashboard:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY  
# - SUPABASE_SERVICE_ROLE_KEY
# - NEXT_PUBLIC_GA_ID
```

### 5. Domain Configuration
- [ ] Configure custom domain in Vercel dashboard
- [ ] Set up DNS records with domain registrar
- [ ] Verify SSL certificate is active
- [ ] Test domain redirects (www → apex)

### 6. Post-Deployment Testing
- [ ] Verify homepage loads correctly
- [ ] Test state landing pages
- [ ] Test city pages with business listings
- [ ] Test individual business pages
- [ ] Verify sitemap.xml generates correctly
- [ ] Test lead form submissions
- [ ] Verify structured data with Schema.org validator
- [ ] Test mobile responsiveness

### 7. SEO Setup
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Verify Google Analytics tracking
- [ ] Set up Google My Business (if applicable)
- [ ] Configure Google Tag Manager (if needed)

## Post-Launch Monitoring

### Analytics & Tracking
- [ ] Set up conversion tracking for lead forms
- [ ] Configure Google Analytics goals
- [ ] Monitor Core Web Vitals in Search Console
- [ ] Set up uptime monitoring (UptimeRobot, etc.)

### Content Updates
- [ ] Plan content update schedule
- [ ] Set up process for adding new businesses
- [ ] Create process for updating business information
- [ ] Plan seasonal content updates

### SEO Monitoring
- [ ] Track keyword rankings
- [ ] Monitor organic traffic growth
- [ ] Watch for crawl errors in Search Console
- [ ] Monitor page load speeds

## Rollback Plan

If issues arise after deployment:

1. **Immediate Issues**: Use Vercel's instant rollback feature
   ```bash
   # Rollback to previous deployment
   npx vercel rollback [DEPLOYMENT_URL]
   ```

2. **Database Issues**: 
   - Restore from Supabase backup
   - Re-run seed scripts if needed

3. **DNS Issues**:
   - Revert DNS changes
   - Use Vercel preview URL temporarily

## Success Metrics

### Week 1 Targets
- [ ] All pages loading < 3 seconds
- [ ] 0 critical errors in Search Console
- [ ] Sitemap indexed by Google
- [ ] At least 10 organic search impressions

### Month 1 Targets
- [ ] 100+ organic search impressions
- [ ] 10+ organic clicks
- [ ] 5+ lead form submissions
- [ ] Core Web Vitals in "Good" range

### Month 3 Targets
- [ ] 1,000+ organic search impressions
- [ ] 100+ organic clicks
- [ ] 50+ lead form submissions
- [ ] Ranking for target local keywords

## Emergency Contacts
- Vercel Support: vercel.com/support
- Supabase Support: supabase.com/support
- Domain Registrar Support: [Provider specific]

---

**Last Updated**: February 17, 2026
**Next Review**: Post-deployment + 7 days
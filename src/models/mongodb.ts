
import { PageType } from './pageTypes';

/**
 * MongoDB Collection Names Enum
 * Single source of truth for all collection names
 */
export enum MongoCollection {
  BLOG_TYPES = 'blogtypes',
  BLOGS = 'blogs',
  PAGE_CONTENT = 'page_content',
}

/**
 * Collection initialization interface
 */
export interface CollectionInit {
  name: MongoCollection;
  createIndexes?: () => Promise<void>;
  initializeDefaultData?: () => Promise<void>;
}

/**
 * Collection initialization configuration
 */
export const COLLECTION_CONFIG: CollectionInit[] = [
  {
    name: MongoCollection.BLOG_TYPES,
    createIndexes: async () => {
      // Indexes are created in the model schema
    },
    initializeDefaultData: async () => {
      const { blogTypeDAO } = await import('../mongodb/index');
      
      // Check if blog types already exist
      const existingTypes = await blogTypeDAO.findAll();
      
      if (existingTypes.length === 0) {
        // Create default blog types
        const defaultTypes = [
          {
            name: 'Technology',
            slug: 'technology',
            description: 'Latest technology trends and innovations',
            isActive: true,
          },
          {
            name: 'Lifestyle',
            slug: 'lifestyle',
            description: 'Lifestyle tips and personal stories',
            isActive: true,
          },
          {
            name: 'Business',
            slug: 'business',
            description: 'Business insights and strategies',
            isActive: true,
          },
        ];
        
        for (const typeData of defaultTypes) {
          await blogTypeDAO.createWithTypeId(typeData);
        }
        console.log('✅ Default blog types created successfully');
      } else {
        console.log('ℹ️  Blog types already exist, skipping default data creation');
      }
    },
  },
  {
    name: MongoCollection.BLOGS,
    createIndexes: async () => {
      // Indexes are created in the model schema
    },
    initializeDefaultData: async () => {
      const { blogDAO } = await import('../mongodb/index');
      
      // Check if blogs already exist
      const existingBlogs = await blogDAO.findAll();
      
      if (existingBlogs.length === 0) {
        // Get the first blog type to create sample blogs
        const { blogTypeDAO } = await import('../mongodb/index');
        const blogTypes = await blogTypeDAO.findAll();
        
        if (blogTypes.length > 0 && blogTypes[0]) {
          const sampleBlogs = [
            {
              title: 'Getting Started with Node.js',
              slug: 'getting-started-with-nodejs',
              content: 'Node.js is a powerful JavaScript runtime...',
              excerpt: 'Learn the basics of Node.js development',
              author: 'John Doe',
              typeId: blogTypes[0].typeId,
              tags: ['nodejs', 'javascript', 'backend'],
              isPublished: true,
              publishedAt: new Date(Date.now()),
            },
            {
              title: 'Healthy Living Tips',
              slug: 'healthy-living-tips',
              content: 'Maintaining a healthy lifestyle is important...',
              excerpt: 'Simple tips for a healthier life',
              author: 'Jane Smith',
              typeId: blogTypes[1]?.typeId || blogTypes[0].typeId,
              tags: ['health', 'lifestyle', 'wellness'],
              isPublished: true,
              publishedAt: new Date(Date.now()),
            },
          ];
          
          for (const blogData of sampleBlogs) {
            await blogDAO.createWithBlogId(blogData);
          }
          console.log('✅ Default blog posts created successfully');
        }
      } else {
        console.log('ℹ️  Blog posts already exist, skipping default data creation');
      }
    },
  },
  {
    name: MongoCollection.PAGE_CONTENT,
    createIndexes: async () => {
      // Indexes are created in the model schema
    },
    initializeDefaultData: async () => {
      const { pageContentDAO } = await import('../mongodb/index');
      
      // Check if page content already exists
      const existingStoryPage = await pageContentDAO.getPageContent(PageType.STORY);
      const existingLeadershipTeam = await pageContentDAO.getPageContent(PageType.LEADERSHIP_TEAM);
      const existingLandingPage = await pageContentDAO.getPageContent(PageType.LANDING);
      
      // Create default story page if it doesn't exist
      if (!existingStoryPage) {
        const storyData = {
          pageType: PageType.STORY,
          title: "Our Story",
          slug: "our-story",
          content: "Discover the journey that brought us here and the vision that drives us forward.",
          items: [
            {
              title: "Our Foundation",
              description: "Founded in 2020 with a vision to revolutionize digital solutions and transform how businesses operate in the digital age."
            },
            {
              title: "Growth & Expansion",
              description: "Expanded to serve 100+ clients across multiple industries, delivering innovative solutions that drive real business value."
            },
            {
              title: "Our Commitment",
              description: "Committed to innovation, quality, and customer satisfaction in everything we do, ensuring exceptional results for our partners."
            },
            {
              title: "Future Vision",
              description: "Looking forward to an exciting future of growth and impact, continuing to push the boundaries of what's possible."
            }
          ],
          btnTxt: [
            { buttonText: "Learn More" },
            { buttonText: "Get Started" }
          ]
        };
        
        await pageContentDAO.createOrUpdatePageContent(storyData);
        console.log('✅ Default story page content created successfully');
      } else {
        console.log('ℹ️  Story page content already exists, skipping default data creation');
      }
      
      // Create default leadership team if it doesn't exist
      if (!existingLeadershipTeam) {
        const leadershipData = {
          pageType: PageType.LEADERSHIP_TEAM,
          title: "Leadership Team",
          slug: "leadership-team",
          subtitle: "Meet the experienced professionals leading our firm",
          items: [
            {
              title: "Sarah Mitchell",
              description: "Chief Executive Officer"
            },
            {
              title: "David Chen",
              description: "Chief Investment Officer"
            },
            {
              title: "Emily Rodriguez",
              description: "Head of Capital Markets"
            },
            {
              title: "Michael Thompson",
              description: "Managing Director, M&A"
            }
          ],
          btnTxt: [
            { buttonText: "Contact Team" },
            { buttonText: "View Profiles" }
          ]
        };
        
        await pageContentDAO.createOrUpdatePageContent(leadershipData);
        console.log('✅ Default leadership team content created successfully');
      } else {
        console.log('ℹ️  Leadership team content already exists, skipping default data creation');
      }
      
      // Create default landing page if it doesn't exist
      if (!existingLandingPage) {
        const landingData = {
          pageType: PageType.LANDING,
          title: "Welcome to Our Platform",
          slug: "home",
          subtitle: "Your trusted partner for digital solutions and innovation",
          numbers: [
            {
              value: "100+",
              label: "Happy Clients"
            },
            {
              value: "50+",
              label: "Projects Completed"
            },
            {
              value: "5+",
              label: "Years Experience"
            },
            {
              value: "24/7",
              label: "Support Available"
            }
          ],
          btnTxt: [
            { buttonText: "Get Started" },
            { buttonText: "Learn More" },
            { buttonText: "Contact Us" }
          ]
        };
        
        await pageContentDAO.createOrUpdatePageContent(landingData);
        console.log('✅ Default landing page content created successfully');
      } else {
        console.log('ℹ️  Landing page content already exists, skipping default data creation');
      }
      
      // Create default vision page if it doesn't exist
      const existingVisionPage = await pageContentDAO.getPageContent(PageType.VISION);
      if (!existingVisionPage) {
        const visionData = {
          pageType: PageType.VISION,
          title: "Our Vision",
          slug: "our-vision",
          content: "We envision a future where technology seamlessly integrates with human potential, creating opportunities for growth, innovation, and positive impact.",
          items: [
            {
              title: "Innovation First",
              description: "Pioneering cutting-edge solutions that transform industries and create lasting value."
            },
            {
              title: "Human-Centered Design",
              description: "Building technology that enhances human capabilities and improves quality of life."
            },
            {
              title: "Sustainable Growth",
              description: "Creating long-term value through responsible innovation and ethical business practices."
            }
          ],
          btnTxt: [
            { buttonText: "Learn More" },
            { buttonText: "Join Our Mission" }
          ]
        };
        
        await pageContentDAO.createOrUpdatePageContent(visionData);
        console.log('✅ Default vision page content created successfully');
      } else {
        console.log('ℹ️  Vision page content already exists, skipping default data creation');
      }
      
      // Create default investment strategy page if it doesn't exist
      const existingInvestmentStrategyPage = await pageContentDAO.getPageContent(PageType.INVESTMENT_STRATEGY);
      if (!existingInvestmentStrategyPage) {
        const investmentStrategyData = {
          pageType: PageType.INVESTMENT_STRATEGY,
          title: "Investment Strategy",
          slug: "investment-strategy",
          content: "Our comprehensive investment approach combines rigorous analysis, market expertise, and innovative strategies to deliver superior returns for our clients.",
          items: [
            {
              title: "Value Investing",
              description: "Identifying undervalued assets with strong fundamentals and long-term growth potential."
            },
            {
              title: "Growth Opportunities",
              description: "Capitalizing on emerging markets and innovative companies with disruptive potential."
            },
            {
              title: "Risk Management",
              description: "Implementing sophisticated risk controls to protect capital while maximizing returns."
            },
            {
              title: "Portfolio Diversification",
              description: "Building balanced portfolios across asset classes, sectors, and geographic regions."
            }
          ],
          btnTxt: [
            { buttonText: "Learn More" },
            { buttonText: "Schedule Consultation" },
            { buttonText: "View Performance" }
          ]
        };
        
        await pageContentDAO.createOrUpdatePageContent(investmentStrategyData);
        console.log('✅ Default investment strategy page content created successfully');
      } else {
        console.log('ℹ️  Investment strategy page content already exists, skipping default data creation');
      }
      
      // Create default partners page if it doesn't exist
      const existingPartnersPage = await pageContentDAO.getPageContent(PageType.PARTNERS);
      if (!existingPartnersPage) {
        const partnersData = {
          pageType: PageType.PARTNERS,
          title: "Our Partners",
          slug: "our-partners",
          subtitle: "Strategic alliances that drive our success",
          items: [
            {
              title: "Technology Partners",
              description: "Leading technology companies that provide cutting-edge solutions and infrastructure."
            },
            {
              title: "Financial Institutions",
              description: "Established banks and financial services firms that enhance our market reach."
            },
            {
              title: "Industry Leaders",
              description: "Top-tier companies across various sectors that share our commitment to excellence."
            },
            {
              title: "Research Organizations",
              description: "Academic and research institutions that contribute to our knowledge base and innovation."
            }
          ],
          btnTxt: [
            { buttonText: "Become a Partner" },
            { buttonText: "View All Partners" },
            { buttonText: "Partnership Benefits" }
          ]
        };
        
        await pageContentDAO.createOrUpdatePageContent(partnersData);
        console.log('✅ Default partners page content created successfully');
      } else {
        console.log('ℹ️  Partners page content already exists, skipping default data creation');
      }
      
      // Create default insights page if it doesn't exist
      const existingInsightsPage = await pageContentDAO.getPageContent(PageType.INSIGHTS);
      if (!existingInsightsPage) {
        const insightsData = {
          pageType: PageType.INSIGHTS,
          title: "Market Insights",
          slug: "market-insights",
          subtitle: "Stay informed with our latest research, market analysis, and investment insights from our team of financial experts.",
          btnTxt: [
            { buttonText: "Read All Insights" },
            { buttonText: "Subscribe to Updates" },
            { buttonText: "Download Reports" }
          ]
        };
        
        await pageContentDAO.createOrUpdatePageContent(insightsData);
        console.log('✅ Default insights page content created successfully');
      } else {
        console.log('ℹ️  Insights page content already exists, skipping default data creation');
      }
      
      // Create default success stories page if it doesn't exist
      const existingSuccessStoriesPage = await pageContentDAO.getPageContent(PageType.SUCCESS_STORIES);
      if (!existingSuccessStoriesPage) {
        const successStoriesData = {
          pageType: PageType.SUCCESS_STORIES,
          title: "Our Success Stories",
          slug: "our-success-stories",
          subtitle: "Discover our proven track record of delivering exceptional results for clients across diverse industries. Our success is measured by the success of our clients.",
          btnTxt: [
            { buttonText: "Proven track record" }
          ]
        };
        
        await pageContentDAO.createOrUpdatePageContent(successStoriesData);
        console.log('✅ Default success stories page content created successfully');
      } else {
        console.log('ℹ️  Success stories page content already exists, skipping default data creation');
      }
      
      // Create default performance metrics page if it doesn't exist
      const existingPerformanceMetricsPage = await pageContentDAO.getPageContent(PageType.PERFORMANCE_METRICS);
      if (!existingPerformanceMetricsPage) {
        const performanceMetricsData = {
          pageType: PageType.PERFORMANCE_METRICS,
          title: "Performance Metrics",
          slug: "performance-metrics",
          numbers: [
            {
              value: "127",
              label: "Total Deals"
            },
            {
              value: "$8.2B+",
              label: "Deal Value"
            },
            {
              value: "98.5%",
              label: "Success Rate"
            },
            {
              value: "4.9/5",
              label: "Client Rating"
            },
            {
              value: "+15%",
              label: "YoY Growth"
            }
          ],
          btnTxt: [
            { buttonText: "2024" },
            { buttonText: "2023" },
            { buttonText: "2022" }
          ]
        };
        
        await pageContentDAO.createOrUpdatePageContent(performanceMetricsData);
        console.log('✅ Default performance metrics page content created successfully');
      } else {
        console.log('ℹ️  Performance metrics page content already exists, skipping default data creation');
      }
      
      // Create default join success page if it doesn't exist
      const existingJoinSuccessPage = await pageContentDAO.getPageContent(PageType.JOIN_SUCCESS);
      if (!existingJoinSuccessPage) {
        const joinSuccessData = {
          pageType: PageType.JOIN_SUCCESS,
          title: "Ready to Join Our Success Story?",
          slug: "join-success",
          subtitle: "Let our proven track record work for you. Contact us today to discuss how we can help achieve your investment goals.",
          btnTxt: [
            { buttonText: "Start Your Journey" },
            { buttonText: "View insights" }
          ]
        };
        
        await pageContentDAO.createOrUpdatePageContent(joinSuccessData);
        console.log('✅ Default join success page content created successfully');
      } else {
        console.log('ℹ️  Join success page content already exists, skipping default data creation');
      }
    },
  },  
];

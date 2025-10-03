
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
    },
  },
];

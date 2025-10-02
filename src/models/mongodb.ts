
/**
 * MongoDB Collection Names Enum
 * Single source of truth for all collection names
 */
export enum MongoCollection {
  LANDING_PAGE = 'landing_page',
  BLOG_TYPES = 'blogtypes',
  BLOGS = 'blogs',
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
    name: MongoCollection.LANDING_PAGE,
    createIndexes: async () => {
      // Add indexes for landing page if needed
    },
    initializeDefaultData: async () => {
      // Import the DAO here to avoid circular dependency
      const { landingPageDAO } = await import('../mongodb/index');
      
      // Check if landing page already exists
      const existingPage = await landingPageDAO.getLandingPage();
      
      if (!existingPage) {
        // Create default landing page data
        const defaultData = {
          header: "Welcome to Our Platform",
          subtitle: "Your trusted partner for digital solutions and innovation",
          numbers: [
            { value: "100+", label: "Happy Clients" },
            { value: "50+", label: "Projects Completed" },
            { value: "5+", label: "Years Experience" },
            { value: "24/7", label: "Support Available" }
          ]
        };
        
        await landingPageDAO.createOrUpdateLandingPage(defaultData);
        console.log('✅ Default landing page data created successfully');
      } else {
        console.log('ℹ️  Landing page already exists, skipping default data creation');
      }
    },
  },
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
];

/**
 * Page Types Enum
 * Defines all available page types in the system
 */
export enum PageType {
  STORY = 'story',
  LEADERSHIP_TEAM = 'leadershipTeam',
  LANDING = 'landing',
  VISION = 'vision',
  INVESTMENT_STRATEGY = 'investmentStrategy',
  PARTNERS = 'partners',
  INSIGHTS = 'insights',
  SUCCESS_STORIES = 'successStories',
  PERFORMANCE_METRICS = 'performanceMetrics',
  JOIN_SUCCESS = 'joinSuccess',
  // Future page types can be added here
  // ABOUT = 'about',
  // CONTACT = 'contact',
  // SERVICES = 'services',
}

/**
 * Page Item interface for dynamic content
 * Used for carousel items, team members, etc.
 */
export interface IPageItem {
  title: string;
  description: string;
}

/**
 * Page Content interface for unified page management
 */
export interface IPageContent {
  pageType: PageType;
  title?: string;
  content?: string; // Used for story pages
  subtitle?: string; // Used for leadership team, landing pages
  items?: IPageItem[]; // Dynamic content items
  // Additional fields can be added based on page type
  numbers?: Array<{ value: string; label: string }>; // For landing pages
}

# Interactive Methodology Explorer - Project TODO

## Core Features

### Phase 1: Frontend UI Implementation
- [x] Migrate HTML layout to React components
- [x] Create Header component with title and subtitle
- [x] Create Hero section with introduction
- [x] Implement 8 Guiding Principles section with card grid
- [ ] Implement 6-Stage Lifecycle Mermaid diagram
- [x] Create Interactive Lifecycle Explorer with stage navigation
- [x] Implement dynamic stage content display (goals, activities, tasks)
- [x] Create Task Generation UI with input and output display
- [ ] Implement Data Insights section with Chart.js visualizations
  - [ ] Task Taxonomy Breakdown chart
  - [ ] Risk vs. Priority bubble chart
  - [ ] Test Pyramid chart
- [x] Create Adaptive Rules section with rule cards
- [ ] Implement Dogfeeding section (continuous improvement)
- [ ] Create Roles & Responsibilities section
- [x] Add responsive design and mobile optimization

### Phase 2: Backend API Implementation
- [x] Create tRPC procedure for LLM Task Generation
  - [x] Implement system prompt with methodology context
  - [x] Validate task estimates (1-5 days, enforce split rule)
  - [x] Return structured JSON response with title, description, estimate, risk, priority
- [x] Create tRPC procedure for LLM Rule Explanation
  - [x] Implement system prompt for rule explanation
  - [x] Support dynamic rule input
  - [x] Return formatted explanation with markdown
- [ ] Implement error handling and retry logic for LLM calls
- [ ] Add rate limiting and request validation

### Phase 3: Database Schema & Persistence
- [ ] Design and implement database schema for:
  - [ ] Generated tasks (title, description, stage, estimate, risk, priority, createdAt)
  - [ ] Rule explanations (ruleTitle, ruleText, explanation, createdAt)
  - [ ] User methodology preferences (optional)
- [ ] Create database migration scripts
- [ ] Implement query helpers in server/db.ts
- [ ] Add procedures to save and retrieve generated tasks
- [ ] Add procedures to cache rule explanations

### Phase 4: LLM Integration
- [ ] Configure Gemini API integration using invokeLLM helper
- [ ] Implement structured JSON response schema for task generation
- [ ] Test task generation with various user inputs
- [ ] Test rule explanation with all three rules
- [ ] Implement error handling for LLM timeouts and failures
- [ ] Add logging for LLM requests and responses

### Phase 5: UI Polish & Interactivity
- [ ] Add loading states for LLM operations
- [ ] Implement modal for rule explanations
- [ ] Add smooth transitions and animations
- [ ] Implement copy-to-clipboard for generated tasks
- [ ] Add export functionality for generated tasks
- [ ] Implement dark/light theme support
- [ ] Add accessibility features (ARIA labels, keyboard navigation)

### Phase 6: Testing & Verification
- [ ] Test all interactive features in browser
- [ ] Verify LLM task generation produces valid JSON
- [ ] Verify rule explanations are meaningful and accurate
- [ ] Test responsive design on mobile/tablet/desktop
- [ ] Test error states and edge cases
- [ ] Verify database persistence works correctly
- [ ] Performance testing for LLM API calls

### Phase 7: Documentation & Deployment
- [ ] Create user guide for the application
- [ ] Document the methodology principles
- [ ] Create API documentation for tRPC procedures
- [ ] Set up environment variables for LLM API
- [ ] Create deployment checklist
- [ ] Test production build

## Completed Features
(None yet)

## Known Issues
(None yet)

## Notes
- The HTML file provides a complete design template with Tailwind CSS styling
- Methodology data is embedded in the HTML and needs to be extracted to React components
- LLM integration requires Gemini API key (available via BUILT_IN_FORGE_API_KEY)
- The application follows a single-page application (SPA) pattern
- All interactive features should work without page reloads

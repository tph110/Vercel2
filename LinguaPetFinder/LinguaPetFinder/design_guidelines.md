# Design Guidelines: Skin Cancer Detection Medical Imaging Platform

## Design Approach

**Selected Framework:** Apple Human Interface Guidelines (HIG) with medical application adaptations
**Rationale:** Clean, minimalist aesthetic appropriate for healthcare; emphasizes clarity, trust, and content-focused design; familiar patterns reduce cognitive load in medical contexts

**Core Principles:**
- Clinical precision with human warmth
- Immediate clarity in all UI states
- Trust through professional restraint
- Generous whitespace for focus

## Typography System

**Primary Font:** Inter (via Google Fonts CDN)
**Secondary Font:** SF Mono (for technical data/results)

**Hierarchy:**
- Hero/Page Title: 3xl (font-size: 1.875rem), font-weight: 700
- Section Headers: 2xl (1.5rem), font-weight: 600
- Card Titles: xl (1.25rem), font-weight: 600
- Body Text: base (1rem), font-weight: 400
- Small/Meta Text: sm (0.875rem), font-weight: 400
- Technical Data: sm monospace, font-weight: 500

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 20
- Micro spacing (between related elements): p-2, gap-2
- Standard spacing (component padding): p-4, p-6
- Section spacing: p-8, py-12
- Large gaps (between major sections): gap-16, py-20

**Grid Structure:**
- Desktop: Two-column split (grid-cols-2) - Upload left 45%, Results right 55%
- Tablet: Maintain two-column with adjusted ratios
- Mobile: Stack vertically (grid-cols-1), upload first

**Container Strategy:**
- Full viewport height application (min-h-screen)
- Fixed header with navigation/branding (h-16)
- Main content area uses remaining height (flex-1)
- Max-width constraints: max-w-7xl centered for outer container

## Component Library

### Header/Navigation
- Fixed top bar with branding, tagline, and utility navigation
- Height: h-16
- Contains: Logo/brand (left), product name, optional info/help links (right)
- Subtle shadow for depth separation (shadow-sm)

### Upload Panel (Left Column)
**Structure:**
- Centered upload zone within column
- Drag-and-drop area with dashed border treatment
- File input button as secondary action
- Clear visual states: default, hover, dragging, uploaded, processing

**Upload Zone Elements:**
- Icon placeholder (large, 120x120px area)
- Primary instruction text
- Secondary instruction text (supported formats, size limits)
- Browse button (primary CTA style)
- After upload: Image preview with replace/remove actions

**Supporting Elements:**
- Accepted formats badge (small, subtle)
- File size limit indicator
- Progress bar during upload (thin, full-width)
- Success/error messaging inline

### Results Panel (Right Column)
**Default State (No Results):**
- Centered informational content
- Icon representation
- Instructional text
- Sample image reference (optional)

**Active Results State:**
- Result header with timestamp
- Risk assessment display (prominent)
- Confidence score visualization
- Detailed breakdown section
- Action buttons (Download report, Analyze another)

**Risk Assessment Card:**
- Large, clear risk level indicator
- Percentage/confidence metric
- Visual indicator (icon or graphic element)
- Contextual explanation text
- Disclaimer text (small, clear)

**Detailed Results Section:**
- Tabbed or accordion interface for findings
- Technical metrics in monospace font
- Visual comparison if applicable
- Segmented findings list

### Loading States
**During Processing:**
- Overlay on results panel with blur backdrop
- Centered spinner with animation
- Processing text with status updates
- Estimated time indicator if available

### Buttons & Controls
**Primary CTA:** Rounded corners (rounded-lg), substantial padding (px-6 py-3), medium font-weight
**Secondary Actions:** Outlined style with transparency
**Icon Buttons:** Square (h-10 w-10), rounded corners, subtle hover states
**File Input Trigger:** Prominent, accessible, matches primary button style

### Cards & Containers
- Rounded corners: rounded-xl for major cards, rounded-lg for nested elements
- Borders: Single pixel, subtle
- Shadows: Minimal elevation (shadow-sm default, shadow-md for interactive elements)
- Padding: p-6 for cards, p-4 for nested sections

### Medical Disclaimer Section
- Footer or prominent placement within results
- Small text (text-sm)
- Clear border or background distinction
- Contains: Medical disclaimer, data privacy note, professional consultation recommendation

## Responsive Behavior

**Desktop (lg: 1024px+):**
- Full two-column layout
- Generous padding (p-8)
- Fixed aspect ratios for image previews

**Tablet (md: 768px - 1023px):**
- Maintain two columns with tighter spacing
- Reduced padding (p-6)
- Adjusted typography scale

**Mobile (< 768px):**
- Single column stack
- Upload panel full-width, followed by results
- Padding reduction to p-4
- Sticky CTA buttons if needed

## Interaction Patterns

**Upload Flow:**
1. Click or drag file to upload zone
2. Immediate preview with file details
3. Automatic submission or manual trigger
4. Loading state with progress indication
5. Results display with transition

**Error Handling:**
- Inline error messages near relevant fields
- Toast notifications for system-level errors
- Clear recovery actions
- Non-disruptive error states

**Accessibility:**
- ARIA labels for all interactive elements
- Keyboard navigation support
- Focus indicators clearly visible
- Screen reader announcements for state changes
- Color-independent status indicators (icons + text)

## Images

**Hero Section:** No traditional hero image required for this application
**Icon Usage:** Heroicons via CDN for all interface icons
**Medical Imagery:** User-uploaded dermatoscope photos only
**Placeholder Graphics:** Simple SVG illustrations for empty states (upload icon, results waiting state)
**Logo/Branding:** Client-provided logo in header

## Animation Guidelines

**Minimal Animation Strategy:**
- Smooth transitions between upload states (0.2s ease)
- Subtle fade-in for results (0.3s ease)
- Loading spinner animation only
- No decorative animations
- Focus on immediate responsiveness over visual flair

## Special Considerations

**Medical Context Requirements:**
- Professional tone throughout all copy
- Clear data privacy indicators
- Medical disclaimer always visible with results
- No gamification or casual design patterns
- Conservative interaction design
- HIPAA compliance visual indicators if applicable

**Trust Signals:**
- Secure connection indicator
- Data privacy badge
- Professional certification mentions
- Clear about section/methodology link
- Version/model information in footer
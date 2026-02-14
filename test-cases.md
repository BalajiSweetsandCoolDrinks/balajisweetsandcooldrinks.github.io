# Balaji Sweets Website - Comprehensive Test Cases

## Overview
This document contains comprehensive test cases for verifying all functionality of the Balaji Sweets and Cool Drinks website, including the latest mobile header changes where the home button and title have the same size.

---

## Test Categories

### 1. Page Loading Tests
**Priority:** High  
**Scope:** All 20 pages

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| TC-001 | Home page loads | Page loads with title containing "Balaji" |
| TC-002 | Menu page loads | Page loads successfully |
| TC-003 | Our Story page loads | Page loads successfully |
| TC-004 | Specials page loads | Page loads successfully |
| TC-005 | Festive Gifting page loads | Page loads successfully |
| TC-006 | Feedback page loads | Page loads successfully |
| TC-007 | Contact page loads | Page loads successfully |
| TC-008 | Cart page loads | Page loads successfully |
| TC-009 | Bengali Sweets page loads | Page loads successfully |
| TC-010 | Baklava page loads | Page loads successfully |
| TC-011 | Assorted Sweets page loads | Page loads successfully |
| TC-012 | Kalakand page loads | Page loads successfully |
| TC-013 | Palakova page loads | Page loads successfully |
| TC-014 | Dry Fruits page loads | Page loads successfully |
| TC-015 | Namkeen page loads | Page loads successfully |
| TC-016 | Snacks page loads | Page loads successfully |
| TC-017 | Soft Drinks page loads | Page loads successfully |
| TC-018 | Sugar Free page loads | Page loads successfully |
| TC-019 | Kaju Variety page loads | Page loads successfully |
| TC-020 | Ladoo page loads | Page loads successfully |

---

### 2. Header Visibility Tests
**Priority:** High  
**Scope:** All pages

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| TC-021 | Header visible on all pages | `<header>` element is visible on every page |

---

### 3. Mobile Header Sizing Tests (NEW)
**Priority:** Critical  
**Scope:** Pages with home button

#### Background
The mobile header now ensures the home button and title have the same font size, scaled to the maximum possible size while staying on the same line.

#### Test Cases

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| TC-022 | Home button same size as title on mobile (375px) | Font sizes match within 1px tolerance |
| TC-023 | Home button same size as title on small mobile (360px) | Font sizes match within 1px tolerance |
| TC-024 | Home button same size as title on tablet (768px) | Font sizes match within 1px tolerance |
| TC-025 | Home button and title on same line | Both elements in header without wrapping |
| TC-026 | Home button padding reduced on mobile | Padding values: 8px 16px at 768px, 6px 12px at 480px, 4px 8px at 420px, 3px 6px at 360px |

#### Verification Steps for TC-022 to TC-026:
1. Open product page on mobile viewport (375x667)
2. Inspect the `.logo` and `.home-btn` elements
3. Compare computed `font-size` values
4. Verify both elements are on the same horizontal line
5. Check bounding boxes to ensure no wrapping

---

### 4. Home Button Styling Tests
**Priority:** High  
**Scope:** Pages with home button

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| TC-027 | Home button has white text | `color: rgb(255, 255, 255)` |
| TC-028 | Home button has rounded corners | `border-radius: 25px` |
| TC-029 | Home button has red gradient background | Background contains gradient with primary colors |
| TC-030 | Home button has proper font weight | Font is bold/medium weight |

---

### 5. Home Button Hover Effects
**Priority:** Medium  
**Scope:** Sample of 5 product pages

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| TC-031 | Hover effect on Bengali Sweets | Button remains visible, cursor changes to pointer |
| TC-032 | Hover effect on Baklava | Button remains visible, cursor changes to pointer |
| TC-033 | Hover effect on Kalakand | Button remains visible, cursor changes to pointer |
| TC-034 | Hover effect on Menu | Button remains visible, cursor changes to pointer |
| TC-035 | Hover effect on Our Story | Button remains visible, cursor changes to pointer |

---

### 6. Home Button Navigation Tests
**Priority:** High  
**Scope:** All pages with home button

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| TC-036 | Home button navigates from Menu | Redirects to index.html |
| TC-037 | Home button navigates from Our Story | Redirects to index.html |
| TC-038 | Home button navigates from Specials | Redirects to index.html |
| TC-039 | Home button navigates from Festive Gifting | Redirects to index.html |
| TC-040 | Home button navigates from Feedback | Redirects to index.html |
| TC-041 | Home button navigates from Contact | Redirects to index.html |
| TC-042 | Home button navigates from Cart | Redirects to index.html |
| TC-043 | Home button navigates from Bengali Sweets | Redirects to index.html |
| TC-044 | Home button navigates from all product pages | Redirects to index.html |

---

### 7. Hamburger Menu Tests (Homepage)
**Priority:** High  
**Scope:** index.html

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| TC-045 | Hamburger menu is visible | Hamburger icon visible in header |
| TC-046 | Hamburger opens sidebar on click | Sidebar gains 'active' class |
| TC-047 | Close button closes sidebar | Sidebar removes 'active' class |
| TC-048 | Clicking outside closes sidebar | Sidebar removes 'active' class |

---

### 8. Navigation Links Tests
**Priority:** High  
**Scope:** Homepage

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| TC-049 | All nav links present in hamburger menu | 6 navigation links visible |
| TC-050 | OUR STORY link works | Navigates to our-story.html |
| TC-051 | MENU link works | Navigates to menu.html |
| TC-052 | SPECIALS link works | Navigates to specials.html |
| TC-053 | FESTIVE GIFTING link works | Navigates to festive-gifting.html |
| TC-054 | FEEDBACK link works | Navigates to feedback.html |
| TC-055 | CONTACT link works | Navigates to contact.html |

---

### 9. Product Cards Tests
**Priority:** High  
**Scope:** Homepage

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| TC-056 | All 12 product cards visible | Cards for all products shown |
| TC-057 | Kaju Variety card clickable | Navigates to product page |
| TC-058 | Kalakand card clickable | Navigates to product page |
| TC-059 | Sugar Free card clickable | Navigates to product page |
| TC-060 | Baklava card clickable | Navigates to product page |
| TC-061 | Ladoo card clickable | Navigates to product page |
| TC-062 | Palakova card clickable | Navigates to product page |
| TC-063 | Bengali Sweets card clickable | Navigates to product page |
| TC-064 | Assorted Sweets card clickable | Navigates to product page |
| TC-065 | Namkeen card clickable | Navigates to product page |
| TC-066 | Snacks card clickable | Navigates to product page |
| TC-067 | Dry Fruits card clickable | Navigates to product page |
| TC-068 | Cool Drinks card clickable | Navigates to product page |

---

### 10. Branches Section Tests
**Priority:** Medium  
**Scope:** Homepage

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| TC-069 | Piduguralla Main Branch visible | Branch info displayed |
| TC-070 | Piduguralla branch visible | Branch info displayed |
| TC-071 | Miryalaguda branch visible | Branch info displayed |
| TC-072 | Narasaraopeta branch visible | Branch info displayed |

---

### 11. Footer Links Tests
**Priority:** Medium  
**Scope:** Homepage

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| TC-073 | Footer links visible | At least 2 footer links present |
| TC-074 | Contact Us link works | Navigates to contact.html |
| TC-075 | Feedback link works | Navigates to feedback.html |

---

### 12. Floating Buttons Tests
**Priority:** High  
**Scope:** Homepage

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| TC-076 | WhatsApp button visible | Floating button visible |
| TC-077 | Cart button visible | Floating button visible |
| TC-078 | Cart button navigates to cart | Navigates to cart.html |

---

### 13. Mobile Responsiveness Tests
**Priority:** High  
**Scope:** All key pages

| Test Case | Description | Viewport | Expected Result |
|-----------|-------------|----------|-----------------|
| TC-079 | Homepage on mobile | 375x667 | Header and content visible |
| TC-080 | Homepage on small mobile | 320x568 | Header and content visible |
| TC-081 | Homepage on large mobile | 414x896 | Header and content visible |
| TC-082 | Homepage on tablet | 768x1024 | Header and content visible |
| TC-083 | Product page on mobile | 375x667 | Header and home button visible |
| TC-084 | Product page on tablet | 768x1024 | Header and home button visible |

---

### 14. Accessibility Tests
**Priority:** Medium  
**Scope:** All pages

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| TC-085 | All pages have proper title | Title tag is not empty |
| TC-086 | Product images have alt text | All `.info-card img` have alt attribute |
| TC-087 | Cart button has aria-label | Cart button has accessible label |

---

### 15. Top Bar Tests
**Priority:** Low  
**Scope:** Homepage

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| TC-088 | Top bar visible | Top bar displays on homepage |
| TC-089 | Top bar has scrolling text | Text animates/scrolls |

---

### 16. Cart Functionality Tests
**Priority:** Medium  
**Scope:** Cart page

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| TC-090 | Cart page loads correctly | Header and content visible |
| TC-091 | Home button on cart page works | Navigates to index.html |

---

### 17. Cross-Page Navigation Flow Tests
**Priority:** High  
**Scope:** Entire website

| Test Case | Description | Expected Result |
|-----------|-------------|-----------------|
| TC-092 | Homepage → Product → Homepage | Complete flow works |
| TC-093 | Homepage → Menu → Homepage | Complete flow works |
| TC-094 | Homepage → Contact → Homepage | Complete flow works |
| TC-095 | Homepage → Feedback → Homepage | Complete flow works |

---

## Test Execution Summary

| Category | Test Count | Priority |
|----------|------------|----------|
| Page Loading | 20 | High |
| Header Visibility | 1 | High |
| Mobile Header Sizing | 5 | **Critical** |
| Home Button Styling | 4 | High |
| Home Button Hover | 5 | Medium |
| Home Button Navigation | 9 | High |
| Hamburger Menu | 4 | High |
| Navigation Links | 7 | High |
| Product Cards | 13 | High |
| Branches Section | 4 | Medium |
| Footer Links | 3 | Medium |
| Floating Buttons | 3 | High |
| Mobile Responsiveness | 6 | High |
| Accessibility | 3 | Medium |
| Top Bar | 2 | Low |
| Cart Functionality | 2 | Medium |
| Cross-Page Navigation | 4 | High |

**Total Test Cases: 95**

---

## Quick Verification Checklist

### Mobile Header (Critical):
- [ ] Home button font-size matches title font-size on mobile
- [ ] Both elements are on the same line
- [ ] Maximum size possible while staying on same line

### Home Button:
- [ ] Red gradient background
- [ ] White text color
- [ ] Rounded corners (25px)
- [ ] Hover effect works
- [ ] Click navigates to index.html

### Navigation:
- [ ] Hamburger menu opens/closes
- [ ] All nav links work
- [ ] Product cards are clickable

### Mobile:
- [ ] Layout works on 320px, 375px, 414px, 768px viewports
- [ ] Home button visible on all mobile sizes

---

## Browser Compatibility Matrix

| Browser | Version | Test Status |
|---------|---------|-------------|
| Chrome | Latest | ⬜ |
| Firefox | Latest | ⬜ |
| Safari | Latest | ⬜ |
| Edge | Latest | ⬜ |

---

## Defect Reporting

If any issues are found, report using:

```
Page: [filename.html]
Test Case: TC-[number]
Issue: [Description of problem]
Expected: [What should happen]
Actual: [What actually happens]
Severity: [Critical/High/Medium/Low]
Viewport: [if mobile issue]
Screenshot: [If applicable]
```

---

*Test Cases Version: 2.0*  
*Last Updated: 2024*  
*Coverage: Complete website functionality including mobile header changes*


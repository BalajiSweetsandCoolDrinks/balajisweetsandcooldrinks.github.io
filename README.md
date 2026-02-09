# Balaji Sweets and Cool Drinks - Website Documentation

A responsive e-commerce website for Balaji Sweets and Cool Drinks, featuring product catalogs, shopping cart functionality, and WhatsApp integration for orders.

## 📁 Project Structure

```
BalajiSweetsandCoolDrinks.github.io/
├── index.html               # Main homepage with product categories
├── menu.html               # Product menu with item selection
├── our-story.html          # Company story page
├── contact.html            # Contact information page
├── kalakand.html           # Kalakand product page
├── bengali-sweets.html     # Bengali sweets collection
├── kaju.variety.html       # Kaju varieties collection
├── sugarfree.html          # Sugar-free sweets
├── namkeen.html            # Namkeen snacks
├── snacks.html             # Assorted snacks
├── dry-fruits.html         # Dry fruits section
├── soft-drinks.html        # Cool drinks section
├── festive-gifting.html    # Gift boxes section
├── specials.html           # Special offers page
├── README.md               # This file
└── assets/
    ├── cart.css            # Shopping cart styles
    ├── cart.js             # Cart functionality & WhatsApp integration
    └── responsive.css      # Responsive design rules
└── images/                 # Product and background images
```

## 🎨 Design Features

### Color Scheme
- **Primary**: `#8b2d1f` (Deep red/brown)
- **Secondary**: `#f8f3e8` (Cream/beige)
- **Text**: `#7a2d1d` (Dark brown)
- **Accent**: `#FFD700` (Gold)

### Typography
- **Headings**: 'Great Vibes' cursive font
- **Body**: Georgia serif font
- **Subtitles**: 'Playfair Display' italic

### Watermark Effect
The website uses a subtle watermark background effect on pages:
```css
body::before {
    content: "";
    position: fixed;
    inset: 0;
    background-image: url('images/[category-image].jpg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    opacity: 0.2;
    z-index: -1;
}
```

## 🛒 Shopping Cart Features

### Cart Functionality (cart.js)
- **Add to Cart**: Click any product to add it with size/quantity selection
- **Size Options**: 250g, 500g, 1kg
- **Quantity Control**: Increment/decrement buttons
- **Price Calculation**: Automatically calculates based on weight
- **Persistent Storage**: Uses localStorage to save cart data

### WhatsApp Integration
- Direct checkout via WhatsApp message
- Pre-formatted cart contents in message
- Phone number: +919962899084

### Cart UI Components
- Floating cart button with item count
- Slide-out cart modal
- Clear cart functionality
- Toast notifications for actions

## 📱 Responsive Design

### Breakpoints
- **Desktop**: 1024px+ (4-column grid)
- **Tablet**: 768px - 1023px (2-column grid)
- **Mobile**: < 480px (single column)

### Mobile Features
- Hamburger menu navigation
- Touch-friendly buttons
- Reduced watermark opacity on small screens
- Stacked grid layouts

## 📄 Page Descriptions

### Homepage (index.html)
- Branch locations display (Piduguralla, Miryalaguda, Narasaraopeta)
- Product category cards with images
- Grid layout showing all categories
- Floating WhatsApp button

### Menu Page (menu.html)
- Product grid with images
- Click-to-open product modal
- Size and quantity selection
- Add to cart functionality

### Our Story (our-story.html)
- Company history and values
- Clean layout with watermark background

### Product Pages (kalakand.html, etc.)
- "Coming Soon" placeholder pages
- Category-specific background watermark
- Centered content box
- Back to Home navigation

## 🚀 Deployment

### GitHub Pages
The site is deployed via GitHub Pages:
- Repository: `BalajiSweetsandCoolDrinks/balajisweetsandcoolDrinks.github.io`
- URL: https://balajisweetsandcooldrinks.github.io/

### Deployment Commands
```bash
# Push changes to GitHub
git add .
git commit -m "Description of changes"
git push origin [branch-name]

# For large files, increase buffer
git config http.postBuffer 524288000
```

## 🔧 Customization

### Adding New Products
1. Add product image to `images/` folder
2. Create/update product HTML file
3. Update menu.html with new product entry

### Changing Colors
Modify CSS variables in HTML files:
```css
:root {
    --primary-color: #8b2d1f;
    --secondary-color: #f8f3e8;
    --text-color: #7a2d1d;
}
```

### Updating WhatsApp Number
Edit in `cart.js`:
```javascript
const WHATSAPP_NUMBER = "+919962899084";
```

## 📞 Contact Information

- **Phone**: +91 9000044256
- **Address**: Beside Gangamma Temple, Main Road, Piduguralla, Palnadu-522413, Andhra Pradesh
- **WhatsApp**: +919962899084

## 📝 License

This project is owned by Balaji Sweets and Cool Drinks.

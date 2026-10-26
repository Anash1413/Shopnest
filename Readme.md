# ShopNest

ShopNest is a full-stack e-commerce application built with the MERN stack. It provides a complete shopping experience with user authentication, product browsing, cart management, favorites, order tracking, admin controls, and payment integration.

## Features

- User signup, login, and logout
- JWT-based authentication
- OTP verification flow for user validation
- Product listing and product detail pages
- Add-to-cart and favorites functionality
- Order placement and order history
- Payment integration with Razorpay
- Admin dashboard for user and order analytics
- Product management for admin users
- Image upload support via Cloudinary
- Responsive storefront built with React and Vite

## Tech Stack

### Frontend
- React
- Vite
- Redux Toolkit
- React Router DOM
- Tailwind CSS
- Lucide React
- SweetAlert2
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT
- Nodemailer
- Cloudinary
- Razorpay
- Multer

## Project Structure

```bash
Shopnest/
├── Backend/
│   ├── config/
│   ├── controller/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── .env
│   ├── app.js
│   ├── package.json
│   └── seed.js
├── Shopnest_Frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
├── package.json
├── package-lock.json
├── custom_instructions.md
└── README.md
```

## Prerequisites

Before running the project, make sure you have:

- Node.js (v18 or later recommended)
- npm
- MongoDB running locally or a MongoDB connection string
- A Cloudinary account
- A Razorpay account
- Gmail SMTP credentials for OTP/email functionality (or your preferred email provider)

## Installation

Clone the repository:

```bash
git clone https://github.com/Anash1413/Shopnest.git
cd Shopnest
```

Install dependencies for the root project:

```bash
npm install
```

Install backend dependencies:

```bash
npm install --prefix Backend
```

Install frontend dependencies:

```bash
npm install --prefix Shopnest_Frontend
```

## Environment Variables

Create a `.env` file in the `Backend` directory with the following variables:

```env
MONGO_URL=mongodb://localhost:27017/SHOPNEST
PORT=1413

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password

JWT_SECRET_KEY=your_jwt_secret

CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_key
CLOUDINARY_SECRET=your_cloudinary_secret

RAZORPAY_API_KEY=your_razorpay_api_key
RAZORPAY_SECRET_KEY=your_razorpay_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

FRONTEND_URL=http://localhost:5173/
```

Note: Replace the placeholder values with your actual configuration.

## Running the Application

From the root folder, start both the backend and frontend together:

```bash
npm run dev
```

This runs the project using the root script defined in `package.json` and starts the backend and frontend concurrently.

You can also run them separately:

```bash
npm run backend
```

```bash
npm run frontend
```

### Default local URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:1413

## API Overview

The backend exposes REST endpoints under `/api` and includes modules for:

- Authentication: `/api/auth`
- Admin operations: `/api/admin`
- Products: `/api/product`
- Orders: `/api/order`
- Cart: `/api`
- Favorites: `/api`
- Payments: `/api/payment`

## Admin Features

The app includes an admin flow for:

- Viewing all users
- Admin analytics
- Product creation
- Order management
- Product updates and deletion

## Notes

- The frontend uses a custom instruction file (`custom_instructions.md`) that enforces viewport-based sizing conventions and discourages fixed pixel-based spacing in the UI.
- The project is structured as a monorepo-style setup with separate backend and frontend workspaces.

## License

This project does not currently include an explicit license file in the repository root.

## Contributing

Contributions are welcome. If you want to improve the app, feel free to fork the repository and submit a pull request.

## Contact

For questions or collaboration, visit the repository owner profile:
- https://github.com/Anash1413

# Saddle & Crest — Production E-commerce Base

This package contains the cleaned backend, customer frontend base, and a separate admin dashboard.

## Run backend
cd backend
npm install
copy .env.example .env
# fill MONGO_URI and JWT_SECRET
npm run dev

Create/update the admin account with:
npm run seed:admin

## Run customer frontend
cd frontend
npm install
copy .env.example .env
npm run dev

## Run admin
cd admin
npm install
copy .env.example .env
npm run dev

## Main API groups
/auth /products /categories /cart /wishlist /orders /admin

Admin routes require a JWT belonging to a user with role=admin.

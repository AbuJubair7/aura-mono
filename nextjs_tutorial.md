# Quick Next.js & Frontend Architecture Tutorial

Since you are preparing for a review, this guide will act as your cheat sheet to confidently explain how the frontend of your e-commerce application works! 

We built this app using **Next.js (App Router)** and **Zustand** for state management. Here are the core concepts you need to know.

---

## 1. Next.js "App Router" Architecture

Next.js is a React framework. Traditionally, React renders everything in the browser (Client-Side Rendering). Next.js allows us to render components on the Server (Server-Side Rendering), which is faster and better for SEO.

### File-Based Routing
In the `src/app` directory, folders define your routes (URLs).
- `src/app/page.tsx` → The Homepage (`/`)
- `src/app/login/page.tsx` → The Login Page (`/login`)
- `src/app/products/[id]/page.tsx` → Dynamic Route for a specific product (e.g., `/products/123`). The `[id]` means it's a dynamic variable.

### Server Components vs. Client Components

This is the most important concept in modern Next.js!

> [!IMPORTANT]
> **Server Components** (The Default)
> By default, all components in `src/app` are Server Components. They run on the server, fetch data quickly, and send pure HTML to the browser. 
> * **Example**: `ProductsPage` in `src/app/products/page.tsx`. It securely fetches product data directly from the backend before sending the HTML to the user.
> * **Limitations**: They cannot use React hooks like `useState` or `onClick` because there is no browser interactivity on the server.

> [!NOTE]
> **Client Components**
> If a component needs user interactivity (like clicking a button, or tracking state), it must be a Client Component. We declare this by putting `"use client";` at the very top of the file.
> * **Example**: `AddToCartButton.tsx` and `ProductGallery.tsx`. Because these components handle button clicks and track which image is currently selected using `useState`, they must be client components.

**How we combined them:**
If you look at the Product Details Page (`src/app/products/[id]/page.tsx`), the page itself is a Server Component (it securely fetches the data from the API). However, it imports and renders `<ProductGallery />` and `<AddToCartButton />` which are Client Components. This is the optimal industry pattern!

---

## 2. State Management (Zustand)

State management is how we store data (like the User's login token, or their Cart items) so that the entire application can access it without having to pass the data down through hundreds of components.

Instead of using Redux (which is very complex and boilerplate-heavy), we used a modern, lightweight library called **Zustand**.

### How we use it
We have two "stores" in the `src/store` folder:
1. `authStore.ts`: Remembers if the user is logged in.
2. `cartStore.ts`: Remembers what items are in the cart.

**Example: authStore.ts**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// We create a global store
export const useAuthStore = create()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (token, user) => set({ token, user }), // Action to log in
      logout: () => set({ token: null, user: null }), // Action to log out
    }),
    { name: 'auth-storage' } // 'persist' automatically saves this to localStorage!
  )
);
```

### Why Zustand is great to mention in an interview:
- **"Why didn't you use React Context?"**: React Context triggers a re-render of the entire component tree whenever the context updates. Zustand only re-renders the specific components that are listening to the exact piece of state that changed. It's much better for performance!
- **"How does the cart stay synced across tabs?"**: Because we use the `persist` middleware in Zustand, the Auth token is saved to the browser's `localStorage`. When the app boots up, Zustand instantly restores the token.

---

## 3. Connecting Frontend to the NestJS Backend

We centralized all of our API calls into one file: `src/lib/api.ts`.

Instead of writing `fetch('http://localhost.../.../...')` randomly inside components, we created helper functions.

> [!TIP]
> **The JWT Flow**
> When a user logs in, the NestJS backend returns a JSON Web Token (JWT). The frontend catches this token and saves it in the `authStore`.
> When the user wants to add an item to the cart, the frontend uses the token in the API request header:
> `headers: { 'Authorization': 'Bearer ' + token }`

**Example from `api.ts`:**
```typescript
export async function addToCart(token: string, productId: string, quantity: number) {
  const response = await fetch('http://localhost:3001/api/cart/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Injecting the Auth Token
    },
    body: JSON.stringify({ productId, quantity })
  });
  
  if (!response.ok) throw new Error('Failed to add item');
  return response.json();
}
```

---

## 4. Styling (CSS Modules)

If the reviewer asks how the CSS works:
We are using **CSS Modules**. Files are named `[name].module.css` (e.g., `page.module.css`).

**Why CSS Modules?**
CSS Modules automatically generate unique class names for every file. This means if you create a class `.title` in `Header.module.css`, and a class `.title` in `Footer.module.css`, they will never conflict with each other! 

It allows us to write plain, traditional CSS while ensuring perfect component-level scoping.

---

## Summary Script for your Reviewer

If asked to summarize the frontend architecture, you can say:

> *"The frontend is a modern Next.js 15 application utilizing the App Router. I leveraged Server Components for efficient data fetching and SEO, and kept interactivity contained within isolated Client Components using the 'use client' directive. For state management, I chose Zustand over Redux or Context API because it provides a highly performant, un-opinionated global store without unnecessary boilerplate. The Zustand stores interact directly with the NestJS backend via a centralized API service, which injects JWT bearer tokens to securely manage authenticated user sessions and database-persisted carts."*

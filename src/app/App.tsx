import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from '@/routeTree.gen';

// Create router instance
const router = createRouter({
  routeTree,
  defaultPreload: 'intent', // Preload on hover!
});

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

---
name: frontend-skill
description: Build frontend pages, reusable components, layouts, and styling for modern web applications. Use for UI development and visual structure.
---

# Frontend Skill

## Instructions

1. **Page Structure**
   - Semantic HTML structure
   - Clear separation of sections (header, main, footer)
   - Responsive grid or flex-based layouts

2. **Component Design**
   - Reusable and modular components
   - Props-driven and state-aware components
   - Consistent naming and folder structure

3. **Layout & Styling**
   - Use modern CSS (Flexbox, Grid)
   - Mobile-first responsive design
   - Consistent spacing, typography, and color system
   - Support dark/light themes when applicable

4. **Interactivity**
   - Handle user interactions cleanly (hover, focus, click)
   - Smooth transitions and micro-interactions
   - Accessible forms and controls

5. **Performance & Maintainability**
   - Avoid unnecessary re-renders
   - Reuse styles and components
   - Keep styles scalable and readable

## Best Practices
- Follow component-based architecture
- Keep UI logic separate from business logic
- Ensure accessibility (ARIA roles, keyboard navigation)
- Maintain visual consistency across pages
- Test layouts across screen sizes

## Example Structure
```html
<main class="page-container">
  <header class="page-header">
    <h1>Page Title</h1>
  </header>

  <section class="content-grid">
    <article class="card">
      <h2>Component Title</h2>
      <p>Description text</p>
      <button class="primary-button">Action</button>
    </article>
  </section>
</main>

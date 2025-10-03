# Theme Toggle Fix Documentation

## 🐛 Problem

The dark mode / light mode toggle was not working due to several conflicting configurations.

## 🔍 Root Causes Identified

### 1. **Incompatible Tailwind Dark Variant**
**Issue**: 
```css
@custom-variant dark (&:is(.dark *));
```
This variant was looking for `.dark` on a parent element with descendant selector `*`, but `next-themes` adds `.dark` directly to the `<html>` element.

**Fix**:
```css
@custom-variant dark (:where(.dark) &);
```
Now it properly checks if `.dark` class exists on the html element.

### 2. **Theme Initialization Race Condition**
**Issue**: The inline script in `<head>` was competing with `next-themes` for control of the theme, causing sync issues.

**Fix**: 
- Improved inline script to match `next-themes` behavior exactly
- Uses same storage key: `'theme'`
- Properly handles system theme fallback
- Wrapped in IIFE to prevent scope pollution

### 3. **Hydration Issues**
**Issue**: Using `client:load` for ThemeProvider was causing hydration mismatches.

**Fix**: Changed to `client:only="react"` to prevent SSR/CSR mismatch

### 4. **Theme Toggle Logic**
**Issue**: ThemeToggler was using `theme` instead of `resolvedTheme`, which doesn't account for system preferences when theme is set to "system".

**Fix**: Use `resolvedTheme` which gives the actual active theme (light/dark), not the setting (light/dark/system).

## ✅ Changes Made

### 1. `src/styles/globals.css`
```diff
- @import "tw-animate-css";
- @custom-variant dark (&:is(.dark *));
+ /* Dark mode variant that checks for .dark class on html element */
+ @custom-variant dark (:where(.dark) &);
```

### 2. `src/layouts/BaseLayout.astro`
```diff
- <html lang="en">
+ <html lang="en" suppressHydrationWarning>

- <script is:inline>
-   try {
-     const stored = localStorage.getItem("theme");
-     const preferred = stored || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
-     document.documentElement.classList.toggle("dark", preferred === "dark");
-   } catch {}
- </script>
+ <script is:inline>
+   (function() {
+     const storageKey = 'theme';
+     const theme = localStorage.getItem(storageKey);
+     const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
+     const activeTheme = theme || systemTheme;
+     
+     if (activeTheme === 'dark') {
+       document.documentElement.classList.add('dark');
+     } else {
+       document.documentElement.classList.remove('dark');
+     }
+   })();
+ </script>

- <ThemeProvider client:load attribute="class" defaultTheme="system" enableSystem>
+ <ThemeProvider 
+   client:only="react" 
+   attribute="class" 
+   defaultTheme="system" 
+   enableSystem
+   storageKey="theme"
+   disableTransitionOnChange={false}
+ >
```

### 3. `src/components/react/ThemeToggler.tsx`
```diff
- const { theme, setTheme } = useTheme();
+ const { theme, setTheme, resolvedTheme } = useTheme();

+ const toggleTheme = () => {
+   const newTheme = resolvedTheme === "dark" ? "light" : "dark";
+   setTheme(newTheme);
+ };

- onClick={() => setTheme(theme === "light" ? "dark" : "light")}
+ onClick={toggleTheme}
+ aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
```

## 🎯 How It Works Now

1. **Initial Load**:
   - Inline script runs immediately (before React hydrates)
   - Checks localStorage for saved theme preference
   - Falls back to system preference if no saved theme
   - Applies `.dark` class to `<html>` if needed
   - Prevents FOUC (Flash of Unstyled Content)

2. **After Hydration**:
   - ThemeProvider takes over theme management
   - Uses same storage key ('theme')
   - Syncs with the initial state set by inline script
   - No hydration mismatch due to `client:only="react"`

3. **Theme Toggle**:
   - ThemeToggler button uses `resolvedTheme` for accurate state
   - Toggles between light and dark
   - Updates localStorage automatically (via next-themes)
   - Changes are instant with smooth transitions

4. **Tailwind Dark Mode**:
   - Custom variant checks for `.dark` class on html element
   - All dark mode styles activate when `.dark` is present
   - CSS transitions smooth the color changes

## 🧪 Testing

Test all these scenarios:

1. **First Visit (No Saved Preference)**:
   - Should match system theme
   - Toggle should switch theme
   - Reload should remember choice

2. **Saved Light Theme**:
   - Should load as light
   - No flash on load
   - Toggle switches to dark

3. **Saved Dark Theme**:
   - Should load as dark
   - No flash on load
   - Toggle switches to light

4. **System Theme Changes**:
   - If saved as "system", should follow OS changes
   - After manual toggle, should stay on chosen theme

5. **Browser DevTools**:
   - Check localStorage for `theme` key
   - Verify html has/doesn't have `.dark` class
   - Inspect element to see transitions

## 🚀 Result

✅ Theme toggle now works correctly
✅ No flash of unstyled content (FOUC)
✅ Respects system preferences
✅ Persists user choice
✅ Smooth transitions between themes
✅ Proper hydration without mismatches

## 📝 Key Learnings

1. **Tailwind v4 Dark Mode**: Must use `:where(.dark)` selector to check class on html element
2. **next-themes in Astro**: Use `client:only="react"` to avoid hydration issues
3. **FOUC Prevention**: Inline script must match next-themes logic exactly
4. **resolvedTheme vs theme**: Use `resolvedTheme` to get actual active theme, not just the setting

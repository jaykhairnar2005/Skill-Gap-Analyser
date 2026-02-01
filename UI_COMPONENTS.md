# UI/UX Component Library

## Design System Overview

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Blue | #1976D2 | Buttons, Links, Headers |
| Primary Dark | #1565C0 | Hover States |
| Primary Light | #42A5F5 | Backgrounds, Secondary |
| Secondary Red | #DC004E | Accents, Alerts |
| Success Green | #4CAF50 | Positive Actions, Checkmarks |
| Warning Orange | #FF9800 | Warnings, Progress Indicators |
| Info Cyan | #2196F3 | Information, Tips |
| Background | #F5F7FA | Page Backgrounds |
| Surface White | #FFFFFF | Cards, Surfaces |
| Text Primary | #2C3E50 | Main Text |
| Text Secondary | #7F8C8D | Secondary Text |

### Typography

```
Font Family: Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell
Font Size Scale:
  - H1: 2.5rem (40px) - Page Titles
  - H2: 2rem (32px) - Section Headers
  - H3: 1.5rem (24px) - Subsection Headers
  - H4: 1.25rem (20px) - Component Headers
  - Body1: 1rem (16px) - Main Text
  - Body2: 0.875rem (14px) - Secondary Text
  - Caption: 0.75rem (12px) - Helper Text

Font Weights:
  - 400: Regular
  - 500: Medium
  - 600: Semibold
  - 700: Bold
```

### Spacing Scale

```
Spacing Unit: 8px base
  - xs: 4px
  - sm: 8px
  - md: 16px
  - lg: 24px
  - xl: 32px
  - xxl: 48px
```

## Components

### 1. Buttons

```jsx
// Primary Button
<Button variant="contained" color="primary">
  Click Me
</Button>

// Secondary Button
<Button variant="outlined" color="primary">
  Click Me
</Button>

// Text Button
<Button variant="text" color="primary">
  Click Me
</Button>

// Disabled Button
<Button variant="contained" disabled>
  Disabled
</Button>

// Loading Button
<Button variant="contained">
  <CircularProgress size={24} />
</Button>

// Button Sizes
<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>
```

### 2. Cards

```jsx
<Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
  <CardContent>
    <Typography variant="h5">Card Title</Typography>
    <Typography variant="body2">Card content goes here</Typography>
  </CardContent>
  <CardActions>
    <Button>Action</Button>
  </CardActions>
</Card>
```

### 3. Input Fields

```jsx
// Text Input
<TextField
  label="Name"
  variant="outlined"
  size="small"
  fullWidth
/>

// Email Input
<TextField
  label="Email"
  type="email"
  variant="outlined"
  size="small"
/>

// Select
<Select value={value} onChange={handleChange}>
  <MenuItem value="option1">Option 1</MenuItem>
  <MenuItem value="option2">Option 2</MenuItem>
</Select>

// Multiline
<TextField
  label="Message"
  multiline
  rows={4}
  variant="outlined"
  fullWidth
/>
```

### 4. Chips

```jsx
// Basic Chip
<Chip label="Technology" />

// Skill Tag (Blue)
<Chip
  label="JavaScript"
  sx={{
    backgroundColor: '#FF6B6B',
    color: 'white',
    fontWeight: 500
  }}
/>

// Category Chip
<Chip
  label="Programming: 3/5"
  variant="outlined"
  size="small"
/>

// With Icon
<Chip
  label="Completed"
  icon={<CheckCircle />}
  color="success"
/>

// Deletable
<Chip
  label="Removable"
  onDelete={handleDelete}
/>
```

### 5. Progress Indicators

```jsx
// Linear Progress (Match Percentage)
<LinearProgress
  variant="determinate"
  value={75}
  sx={{
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
    '& .MuiLinearProgress-bar': {
      borderRadius: 6,
      backgroundColor: '#4CAF50'
    }
  }}
/>

// Circular Progress
<CircularProgress value={75} variant="determinate" />

// Loading Spinner
<CircularProgress />
```

### 6. Alerts

```jsx
// Success Alert
<Alert severity="success">
  Success message
</Alert>

// Error Alert
<Alert severity="error">
  Error message
</Alert>

// Warning Alert
<Alert severity="warning">
  Warning message
</Alert>

// Info Alert
<Alert severity="info">
  Info message
</Alert>

// With Icon
<Alert severity="success" icon={<CheckCircle />}>
  Custom icon alert
</Alert>
```

### 7. Tabs

```jsx
<Box sx={{ borderBottom: '1px solid #e0e0e0' }}>
  <Tabs value={value} onChange={handleChange}>
    <Tab label="Tab 1" />
    <Tab label="Tab 2" />
    <Tab label="Tab 3" />
  </Tabs>
</Box>
<TabPanel value={value} index={0}>
  Panel 1 Content
</TabPanel>
```

### 8. Stepper (Timeline)

```jsx
<Stepper orientation="vertical">
  <Step active={true} completed={false}>
    <StepLabel>Step 1</StepLabel>
    <StepContent>
      Step 1 content
    </StepContent>
  </Step>
  <Step active={false} completed={true}>
    <StepLabel>Step 2</StepLabel>
    <StepContent>
      Step 2 content
    </StepContent>
  </Step>
</Stepper>
```

### 9. AppBar/Navbar

```jsx
<AppBar position="sticky">
  <Toolbar sx={{ justifyContent: 'space-between' }}>
    <Typography variant="h6">App Title</Typography>
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button color="inherit">Menu 1</Button>
      <Button color="inherit">Menu 2</Button>
    </Box>
  </Toolbar>
</AppBar>
```

### 10. Dialog/Modal

```jsx
<Dialog open={open} onClose={handleClose}>
  <DialogTitle>Dialog Title</DialogTitle>
  <DialogContent>
    Dialog content goes here
  </DialogContent>
  <DialogActions>
    <Button onClick={handleClose}>Cancel</Button>
    <Button onClick={handleClose} variant="contained">Confirm</Button>
  </DialogActions>
</Dialog>
```

## Layout Patterns

### Grid Layout (Responsive)

```jsx
<Grid container spacing={3}>
  <Grid item xs={12} sm={6} md={4}>
    <Card>Content</Card>
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <Card>Content</Card>
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <Card>Content</Card>
  </Grid>
</Grid>
```

### Flex Layout

```jsx
<Box sx={{
  display: 'flex',
  flexDirection: 'column', // or 'row'
  gap: 2,
  justifyContent: 'center',
  alignItems: 'center'
}}>
  {/* Items */}
</Box>
```

### Container

```jsx
<Container maxWidth="lg" sx={{ py: 4 }}>
  <Typography variant="h2">Page Title</Typography>
  {/* Content */}
</Container>
```

## Responsive Breakpoints

```
xs: 0px       - Mobile phones
sm: 600px     - Tablets
md: 960px     - Small desktops
lg: 1280px    - Desktops
xl: 1920px    - Large desktops
```

### Usage

```jsx
sx={{
  display: { xs: 'block', sm: 'flex', md: 'grid' },
  fontSize: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },
  p: { xs: 1, sm: 2, md: 3 }
}}
```

## Animation & Transitions

```css
Transition: all 0.3s ease
  - Hover effects: 0.2s
  - Page transitions: 0.3s
  - Modal open/close: 0.3s
```

## Accessibility Features

- ✅ Color contrast ratios (WCAG AA)
- ✅ Keyboard navigation
- ✅ ARIA labels
- ✅ Focus indicators
- ✅ Screen reader support

## Dark Mode Support (Future)

```jsx
const theme = createTheme({
  palette: {
    mode: userPreferences.theme, // 'light' or 'dark'
  }
});
```

---

**Last Updated**: January 2025

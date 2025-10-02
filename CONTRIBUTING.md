# Contributing to Spectergram

Thank you for your interest in contributing to Spectergram! This document provides guidelines and information for contributors.

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please be respectful and constructive in all interactions.

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Browser and OS** information
- **Console errors** if any

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Use case** - why is this enhancement needed?
- **Proposed solution** if you have one
- **Alternative solutions** you've considered
- **Additional context** like mockups or examples

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following the coding standards below
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Commit with clear messages** describing what and why
6. **Push to your fork** and submit a pull request

## Development Setup

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Text editor or IDE
- Local web server (Python, Node.js, or similar)

### Local Development

```bash
# Clone the repository
git clone https://github.com/redbeardmeric/Spectergram.git
cd Spectergram

# Start a local web server
python3 -m http.server 8000
# or
npx http-server

# Open http://localhost:8000 in your browser
```

### Testing

Open the application in multiple browser windows/tabs to simulate multiple users:

1. Open two browser windows
2. In each window, enter different usernames but the same room name
3. Send messages between windows
4. Verify encryption and decryption work correctly

## Coding Standards

### JavaScript

- Use **ES6+ syntax** (const/let, arrow functions, etc.)
- Follow **camelCase** for variables and functions
- Follow **PascalCase** for classes
- Use **meaningful variable names**
- Add **comments** for complex logic
- Keep functions **small and focused**
- Avoid **global variables**

### HTML

- Use **semantic HTML5** elements
- Include **ARIA labels** for accessibility
- Keep **markup clean and indented**
- Use **lowercase** for tags and attributes

### CSS

- Use **CSS variables** for theming
- Follow **BEM-like** naming conventions
- Keep **specificity low**
- Use **mobile-first** responsive design
- Add **comments** for section headers

## File Structure

```
Spectergram/
├── index.html           # Main HTML file
├── styles.css           # Styles
├── app.js              # Main application logic
├── crypto.js           # Encryption utilities
├── signalr.js          # Real-time messaging
├── service-worker.js   # PWA service worker
├── manifest.json       # PWA manifest
├── icons/              # App icons
├── screenshots/        # App screenshots
└── .github/
    └── workflows/      # CI/CD workflows
```

## Security Considerations

When contributing, keep security in mind:

- **Never log sensitive data** (keys, unencrypted messages)
- **Validate all user input**
- **Escape HTML** to prevent XSS
- **Use secure crypto practices** (don't roll your own crypto)
- **Test encryption/decryption** thoroughly
- **Review crypto code** carefully

## Documentation

- Update **README.md** for user-facing changes
- Update **FEATURES.md** for new features
- Update **AZURE_DEPLOYMENT.md** for deployment changes
- Add **inline comments** for complex code
- Include **JSDoc comments** for public APIs

## Commit Messages

Good commit messages help maintain project history:

```
Add feature X to improve Y

- Implemented Z functionality
- Updated W component
- Fixed issue with V

Fixes #123
```

**Guidelines:**
- Use **present tense** ("Add feature" not "Added feature")
- Use **imperative mood** ("Move cursor to..." not "Moves cursor to...")
- Limit first line to **50 characters**
- Add **detailed description** if needed
- Reference **issue numbers** when applicable

## Testing Guidelines

Before submitting a PR:

- [ ] Test in multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices or emulators
- [ ] Test encryption/decryption functionality
- [ ] Test edge cases (empty messages, long messages, special characters)
- [ ] Check browser console for errors
- [ ] Verify no sensitive data is logged
- [ ] Test PWA installation
- [ ] Test service worker functionality

## Performance Considerations

- **Minimize DOM manipulations**
- **Debounce frequent operations**
- **Optimize crypto operations**
- **Lazy load when possible**
- **Monitor memory usage**
- **Test with many messages**

## Accessibility

Ensure the application is accessible:

- Use **semantic HTML**
- Include **ARIA labels**
- Test with **keyboard navigation**
- Test with **screen readers**
- Ensure **sufficient color contrast**
- Provide **focus indicators**

## Browser Support

Target modern browsers:

- Chrome 60+
- Firefox 57+
- Safari 11.1+
- Edge 79+

**Note:** Web Crypto API is required and not available in older browsers.

## Review Process

All contributions go through review:

1. **Automated checks** (if configured)
2. **Code review** by maintainers
3. **Testing** by reviewers
4. **Discussion** if changes needed
5. **Merge** when approved

## Questions?

If you have questions:

- Check existing **documentation**
- Search **closed issues**
- Open a **new issue** with the question label
- Be **patient and respectful**

## Recognition

Contributors will be recognized in:

- GitHub contributors list
- Project documentation
- Release notes (for significant contributions)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Spectergram! 🔐

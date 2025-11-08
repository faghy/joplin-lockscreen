# Joplin Lock Screen Plugin

🔒 Plugin to lock Joplin at startup with a password, protecting your sensitive data.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Joplin](https://img.shields.io/badge/joplin-3.4%2B-blue)

## ✨ Features

- **Automatic lock on startup**: Joplin starts already locked
- **Manual lock**: Lock Joplin anytime from the Tools menu
- **Secure password**: Password is stored as SHA-256 hash
- **Modern interface**: Full-screen lock window with attractive design
- **Linux option**: Ability to activate lock only on Linux systems

## 📦 Installation

### Method 1: Install from .jpl file (Recommended)

1. Download the latest `.jpl` file from the [Releases](https://github.com/faghy/joplin-lockscreen/releases) page
2. Open Joplin
3. Go to **Tools → Options → Plugins**
4. Click **Install from file** and select the downloaded `.jpl` file
5. Restart Joplin

### Method 2: Build from source

```bash
# Clone the repository
git clone https://github.com/faghy/joplin-lockscreen.git
cd joplin-lockscreen

# Install dependencies
npm install

# Build the plugin
npm run dist

# The .jpl file will be in dist/
```

Then install the generated `.jpl` file following the steps from Method 1.

## 🚀 Usage

### Initial Setup

1. After installation, go to **Tools → Options → Lock Screen**
2. In the **"Set password"** field, enter your password
3. Click **OK** to save (the password will be automatically converted to hash)
4. Check **"Enable lock on startup"** if you want Joplin to start locked

### Lock Joplin manually

- Go to **Tools → Lock Joplin Now**
- Or use a keyboard shortcut (if configured)

### Additional Options

- **Activate only on Linux**: If enabled, the lock will only work on Linux systems

## ⚠️ Important Notes

- **Don't lose your password**: There's no way to recover it! If you forget it, you'll need to uninstall and reinstall the plugin
- The password is securely stored as a SHA-256 hash
- The lock covers the entire Joplin window to hide your data

## 🔧 Requirements

- Joplin Desktop 3.4.12 or higher
- Operating System: Windows, macOS, Linux

## 📝 Changelog

### v1.0.2
- Improved full-screen lock window
- Modern design with colorful gradient
- Optimized dimensions to cover all content

### v1.0.0
- First release
- Lock on startup
- Manual lock
- SHA-256 hashed password

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

1. Fork the project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is released under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**faghy**

- GitHub: [@faghy](https://github.com/faghy)

## ⭐ Support

If you find this plugin useful, leave a star ⭐ on GitHub!

---

**Disclaimer**: This plugin is provided "as is" without warranties. Use at your own risk. Make sure to do regular backups of your data.